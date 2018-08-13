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
    name: 'Japan 🇯🇵',
    files: [
      {
        name: 'Japan-01.jpg',
        path: path.join(__dirname, './files/Japan-01.jpg'),
        size: 13370099,
      },
      // {
      //   name: 'Japan-02.jpg',
      //   path: path.join(__dirname, './files/Japan-02.jpg'),
      //   size: 275639,
      // },
      // {
      //   name: 'Japan-03.jpg',
      //   path: path.join(__dirname, './files/Japan-03.jpg'),
      //   size: 432557,
      // },
      // {
      //   name: 'Japan-04.jpg',
      //   path: path.join(__dirname, './files/Japan-04.jpg'),
      //   size: 368493,
      // },
      // {
      //   name: 'Japan-05.jpg',
      //   path: path.join(__dirname, './files/Japan-05.jpg'),
      //   size: 200668,
      // },
    ],
  },
};

(async function createTransfer() {
  const files = await Promise.all(
    data.transfer.files.map((item) => readFile(item.path))
  );

  try {
    const apiClient = await createWTClient(process.env.WT_API_KEY, {
      logger: {
        level: 'silly',
      },
    });

    let transfer = await apiClient.transfer.create(data.transfer);
    await Promise.all(
      transfer.files.map((item, index) =>
        apiClient.transfer.uploadFile(transfer, item, files[index])
      )
    );
    transfer = await apiClient.transfer.finalize(transfer);
    transfer = await apiClient.transfer.find(transfer.id);
    console.log(transfer.url);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
})();
