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

    const transfer = await wtClient.board.create({
      name: 'My very first transfer!'
    });
    console.log(transfer.url);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
})();
