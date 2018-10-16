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

/**
 * Create a transfer with beautiful pictures of Japan.
 */
(async function createTransfer() {
  try {
    // Initialize the client
    const wtClient = await createWTClient(process.env.WT_API_KEY, {
      logger: {
        level: 'silly',
      },
    });

    const filePaths = [
      path.join(__dirname, 'files/Japan-01🇯🇵.jpg'),
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

    const transfer = await wtClient.transfer.create({
      message: 'Japan 🇯🇵',
      files: files,
    });

    const remoteTransfer = await wtClient.transfer.find(transfer.id);

    console.log(transfer.url);
    console.log(remoteTransfer.url);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
})();

/**
 * Create a transfer with beautiful pictures of Japan,
 * but upload the files manually.
 */
(async function createTransfer() {
  try {
    const wtClient = await createWTClient(process.env.WT_API_KEY, {
      logger: {
        level: 'silly',
      },
    });

    const transfer = await wtClient.transfer.create({
      message: 'Japan 🇯🇵',
      files: [
        {
          name: 'Japan-02.jpg',
          size: 275639,
        },
        {
          name: 'Japan-03.jpg',
          size: 432557,
        },
      ],
    });

    const fileUploads = transfer.files.map(async (file) => {
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
        const uploadURL = await wtClient.transfer.getFileUploadURL(
          transfer.id,
          file.id,
          partNumber + 1
        );

        // Upload the chunk
        await axios({
          url: uploadURL.url,
          method: 'put',
          data: fileContent.slice(chunkStart, chunkEnd),
        });
      }

      // Complete file upload
      return await wtClient.transfer.completeFileUpload(transfer, file);
    });

    await Promise.all(fileUploads);

    // Finalize transfer
    const finalTransfer = await wtClient.transfer.finalize(transfer);

    console.log(finalTransfer.url);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
})();
