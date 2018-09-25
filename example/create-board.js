const axios = require('axios');
const fs = require('fs');
const path = require('path');

const createWTClient = require('../src');

function readFile(path) {
  return new Promise((resolve, reject) => {
    fs.readFile(path, (error, data) => {
      if (error) {
        return reject(error);
      }

      resolve(data);
    });
  });
}

(async function createBoard() {
  try {
    const wtClient = await createWTClient(process.env.WT_API_KEY, {
      logger: {
        level: 'silly',
      },
    });

    const board = await wtClient.board.create({
      name: 'Japan 🇯🇵',
    });

    const links = await wtClient.board.addLinks(board, [
      {
        url: 'https://en.wikipedia.org/wiki/Japan',
        title: 'Japan - Wikipedia',
      },
    ]);

    console.log(links);

    const filePaths = [
      path.join(__dirname, 'files/Japan-01.jpg'),
      path.join(__dirname, 'files/Japan-02.jpg'),
      path.join(__dirname, 'files/Japan-03.jpg'),
      path.join(__dirname, 'files/Japan-04.jpg'),
      path.join(__dirname, 'files/Japan-05.jpg'),
    ];

    // Read the content of the files in parallel
    const fileContents = await Promise.all(filePaths.map(readFile));

    // Create the files array with names, sizes and content.
    const files = filePaths.map((file, index) => {
      const content = fileContents[index];
      return {
        name: file.split('/').pop(),
        size: content.length,
        content: content,
      };
    });

    await wtClient.board.addFiles(board, files);

    const remoteBoard = await wtClient.board.find(board.id);

    console.log(board.url);
    console.log(remoteBoard.url);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
})();

/**
 * Create a board with beautiful pictures of Japan,
 * but upload the files manually.
 */
(async function createBoard() {
  try {
    const wtClient = await createWTClient(process.env.WT_API_KEY, {
      logger: {
        level: 'silly',
      },
    });

    const board = await wtClient.board.create({
      name: 'Japan 🇯🇵',
    });

    await wtClient.board.addLinks(board, [
      {
        url: 'https://en.wikipedia.org/wiki/Japan',
      },
    ]);

    const remoteFiles = await wtClient.board.addFiles(board, [
      {
        name: 'Japan-02.jpg',
        size: 275639,
      },
      {
        name: 'Japan-03.jpg',
        size: 432557,
      },
    ]);

    const fileUploads = remoteFiles.map(async (file) => {
      // Read the content of the file
      const fileContent = await readFile(
        path.join(__dirname, 'files/' + file.name)
      );
      for (
        let partNumber = 0;
        partNumber < file.multipart.part_numbers;
        partNumber++
      ) {
        const chunkStart = partNumber * file.multipart.chunk_size;
        const chunkEnd = (partNumber + 1) * file.multipart.chunk_size;

        // Get the upload url for the chunk we want to upload
        const uploadURL = await wtClient.board.getFileUploadURL(
          board.id,
          file.id,
          partNumber + 1,
          file.multipart.id
        );

        // Upload the chunk
        await axios({
          url: uploadURL.url,
          method: 'put',
          data: fileContent.slice(chunkStart, chunkEnd),
        });
      }

      // Complete file upload
      return await wtClient.board.completeFileUpload(board, file);
    });

    await Promise.all(fileUploads);

    console.log(board.url);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
})();
