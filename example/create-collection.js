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
  collection: {
    name: 'Japan 🇯🇵',
  },
  files: [
    {
      name: 'Japan-01.jpg',
      path: path.join(__dirname, './files/Japan-01.jpg'),
      size: 13370099,
    },
    {
      name: 'Japan-02.jpg',
      path: path.join(__dirname, './files/Japan-02.jpg'),
      size: 275639,
    },
    {
      name: 'Japan-03.jpg',
      path: path.join(__dirname, './files/Japan-03.jpg'),
      size: 432557,
    },
    {
      name: 'Japan-04.jpg',
      path: path.join(__dirname, './files/Japan-04.jpg'),
      size: 368493,
    },
    {
      name: 'Japan-05.jpg',
      path: path.join(__dirname, './files/Japan-05.jpg'),
      size: 200668,
    },
  ],
  links: [
    {
      url: 'https://en.wikipedia.org/wiki/Japan',
      meta: {
        title: 'Japan',
      },
    },
  ],
};

(async function createTransfer() {
  const files = await Promise.all(
    data.files.map((item) => readFile(item.path))
  );

  try {
    const apiClient = await createWTClient(process.env.WT_API_KEY, {
      logger: {
        level: 'silly',
      },
    });

    let collection = await apiClient.collection.create(data.collection);
    collection = await apiClient.collection.find(collection.id);
    const collectionFiles = await apiClient.collection.addFiles(
      collection,
      data.files
    );
    await apiClient.collection.addLinks(collection, data.links);
    await Promise.all(
      collectionFiles.map((item, index) =>
        apiClient.collection.uploadFile(collection, item, files[index])
      )
    );
    console.log(collection.url);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
})();
