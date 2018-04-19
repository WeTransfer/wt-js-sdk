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

(async function createTransfer() {
  const data = {
    transfer: {
      name: 'WeTransfer SDK'
    },
    items: [
      {
        local_identifier: 'WeTransfer-01.jpg',
        content_identifier: 'file',
        filename: 'WeTransfer-01.jpg',
        path: path.join(__dirname, './files/WeTransfer-01.jpg')
      },
      {
        local_identifier: 'WeTransfer-02.jpg',
        content_identifier: 'file',
        filename: 'WeTransfer-02.jpg',
        path: path.join(__dirname, './files/WeTransfer-02.jpg')
      },
      {
        local_identifier: 'WeTransfer-03.jpg',
        content_identifier: 'file',
        filename: 'WeTransfer-03.jpg',
        path: path.join(__dirname, './files/WeTransfer-03.jpg')
      },
      {
        local_identifier: 'WeTransfer-04.jpg',
        content_identifier: 'file',
        filename: 'WeTransfer-04.jpg',
        path: path.join(__dirname, './files/WeTransfer-04.jpg')
      },
      {
        local_identifier: 'WeTransfer-05.jpg',
        content_identifier: 'file',
        filename: 'WeTransfer-05.jpg',
        path: path.join(__dirname, './files/WeTransfer-05.jpg')
      }
    ]
  };

  const files = await Promise.all(
    data.items.map((item) => {
      return readFile(item.path);
    })
  );

  try {
    const apiClient = await createWTClient(
      '/* Your private API KEY goes here */'
    );

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
  }
})();
