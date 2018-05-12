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
      local_identifier: 'japan-wikipedia',
      content_identifier: 'web_content',
      url: 'https://en.wikipedia.org/wiki/Japan',
      meta: {
        title: 'Japan'
      }
    },
    {
      local_identifier: 'Japan-01.jpg',
      content_identifier: 'file',
      filename: 'Japan-01.jpg',
      path: path.join(__dirname, './files/Japan-01.jpg'),
      filesize: 13370099
    },
    {
      local_identifier: 'Japan-02.jpg',
      content_identifier: 'file',
      filename: 'Japan-02.jpg',
      path: path.join(__dirname, './files/Japan-02.jpg'),
      filesize: 275639
    },
    {
      local_identifier: 'Japan-03.jpg',
      content_identifier: 'file',
      filename: 'Japan-03.jpg',
      path: path.join(__dirname, './files/Japan-03.jpg'),
      filesize: 432557
    },
    {
      local_identifier: 'Japan-04.jpg',
      content_identifier: 'file',
      filename: 'Japan-04.jpg',
      path: path.join(__dirname, './files/Japan-04.jpg'),
      filesize: 368493
    },
    {
      local_identifier: 'Japan-05.jpg',
      content_identifier: 'file',
      filename: 'Japan-05.jpg',
      path: path.join(__dirname, './files/Japan-05.jpg'),
      filesize: 200668
    }
  ]
};

(async function createTransfer() {
  const files = await Promise.all(
    data.items
      .filter((item) => item.content_identifier === 'file')
      .map((item) => readFile(item.path))
  );

  try {
    const apiClient = await createWTClient(process.env.WT_API_KEY);

    const transfer = await apiClient.transfer.create(data.transfer);
    const transferItems = await apiClient.transfer.addItems(
      transfer.id,
      data.items
    );

    await Promise.all(
      transferItems
        .filter((item) => item.content_identifier === 'file')
        .map((item, index) => apiClient.transfer.uploadFile(item, files[index]))
    );
    console.log(transfer.shortened_url);
  } catch (error) {
    console.error(error.raw);
    process.exit(1);
  }
})();
