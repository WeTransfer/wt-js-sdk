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
  items: [
    {
      local_identifier: 'Japan-01.jpg',
      content_identifier: 'file',
      filename: 'Japan-01.jpg',
      path: path.join(__dirname, './files/Japan-01.jpg')
    },
    {
      local_identifier: 'Japan-02.jpg',
      content_identifier: 'file',
      filename: 'Japan-02.jpg',
      path: path.join(__dirname, './files/Japan-02.jpg')
    },
    {
      local_identifier: 'Japan-03.jpg',
      content_identifier: 'file',
      filename: 'Japan-03.jpg',
      path: path.join(__dirname, './files/Japan-03.jpg')
    },
    {
      local_identifier: 'Japan-04.jpg',
      content_identifier: 'file',
      filename: 'Japan-04.jpg',
      path: path.join(__dirname, './files/Japan-04.jpg')
    },
    {
      local_identifier: 'Japan-05.jpg',
      content_identifier: 'file',
      filename: 'Japan-05.jpg',
      path: path.join(__dirname, './files/Japan-05.jpg')
    }
  ]
};

(async function createTransfer() {
  const files = await Promise.all(
    data.items.map((item) => readFile(item.path))
  );

  try {
    const apiClient = await createWTClient(process.env.WT_API_KEY);

    const transfer = await apiClient.transfer.create(data.transfer);
    const transferItems = await apiClient.transfer.addItems(
      transfer.id,
      data.items.map((item, index) => {
        item.filesize = files[index].length;
        return item;
      })
    );
    await Promise.all(
      transferItems.map((item, index) => {
        return apiClient.transfer.uploadFile(item, files[index]);
      })
    );
    console.log(transfer.shortened_url);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
})();
