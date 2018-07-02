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

const data = {
  transfer: {
    name: 'Japan 🇯🇵'
  },
  files: [
    {
      filename: 'Japan-01.jpg',
      path: path.join(__dirname, './files/Japan-01.jpg'),
      filesize: 13370099
    },
    {
      filename: 'Japan-02.jpg',
      path: path.join(__dirname, './files/Japan-02.jpg'),
      filesize: 275639
    },
    {
      filename: 'Japan-03.jpg',
      path: path.join(__dirname, './files/Japan-03.jpg'),
      filesize: 432557
    },
    {
      filename: 'Japan-04.jpg',
      path: path.join(__dirname, './files/Japan-04.jpg'),
      filesize: 368493
    },
    {
      filename: 'Japan-05.jpg',
      path: path.join(__dirname, './files/Japan-05.jpg'),
      filesize: 200668
    }
  ],
  links: [
    {
      url: 'https://en.wikipedia.org/wiki/Japan',
      meta: {
        title: 'Japan'
      }
    }
  ]
};

(async function createTransfer() {
  const files = await Promise.all(
    data.files.map((item) => readFile(item.path))
  );

  try {
    const apiClient = await createWTClient(process.env.WT_API_KEY, {
      logger: {
        level: 'silly'
      }
    });

    const transfer = await apiClient.transfer.create(data.transfer);
    const transferFiles = await apiClient.transfer.addFiles(
      transfer,
      data.files
    );
    await apiClient.transfer.addLinks(transfer, data.links);

    await Promise.all(
      transferFiles
        .filter((item) => item.content_identifier === 'file')
        .map((item, index) => apiClient.transfer.uploadFile(item, files[index]))
    );
    console.log(transfer.shortened_url);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
})();
