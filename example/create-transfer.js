const fs = require('fs');
const path = require('path');

const createWTClient = require('../src');

(async function createTransfer() {
  // const files = await Promise.all(
  //   data.transfer.files.map((item) => readFile(item.path))
  // );

  try {
    const wtClient = await createWTClient(process.env.WT_API_KEY, {
      logger: {
        level: 'silly',
      },
    });

    const content = Buffer.from('Look ma, a file!');
    const transfer = await wtClient.transfer.create({
      message: 'My very first transfer!',
      files: [
        {
          name: 'hello.txt',
          size: content.length,
          content: content,
        },
      ],
    });
    console.log(transfer.url);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
})();
