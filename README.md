# WeTransfer JavaScript SDK

[![npm version](https://badge.fury.io/js/%40wetransfer%2Fjs-sdk.svg)](https://badge.fury.io/js/%40wetransfer%2Fjs-sdk)
[![Maintainability](https://api.codeclimate.com/v1/badges/2560a764d67ef16af5fe/maintainability)](https://codeclimate.com/github/WeTransfer/wt-js-sdk/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/2560a764d67ef16af5fe/test_coverage)](https://codeclimate.com/github/WeTransfer/wt-js-sdk/test_coverage)
[![CircleCI](https://circleci.com/gh/WeTransfer/wt-js-sdk/tree/master.svg?style=svg)](https://circleci.com/gh/WeTransfer/wt-js-sdk/tree/master)

The JavaScript SDK provides convenient access to WeTransfer's Public API.

## User guide

Our user guide includes information on different topics, such as:

  - [Installation](#installation)
  - [Getting started](#getting-started)
  - [Transfers](#transfers)
    - [Create a transfer](#create-a-transfer)
    - [Find a transfer](#find-a-transfer)
  - [Boards](#boards)
    - [Create an empty board](#create-an-empty-board)
    - [Add links to a board](#add-links-to-a-board)
    - [Add files to a board](#add-files-to-a-board)
    - [Upload files to a board](#upload-files-to-a-board)
    - [Find a board](#find-a-board)

## Installation

Install the SDK with:

```bash
npm i @wetransfer/js-sdk --save
```

## Getting started

In order to be able to use the SDK and access our public APIs, you must provide an API key, which is available in our [Developers Portal](https://developers.wetransfer.com/).

This is the bare minimum code needed to create a transfer. Copy and paste into a file, place your API Key there, and run with `node path/to/file.js`. Voilà, you just created your very first transfer!

```javascript
const createWTClient = require('@wetransfer/js-sdk');

(async function() {
  // An authorization call is made when you create the client.
  // Keep that in mind to perform this operation
  // in the most suitable part of your code
  const wtClient = await createWTClient('/* YOUR PRIVATE API KEY GOES HERE*/');

  const content = Buffer.from('Look ma, a transfer!');
  const transfer = await wtClient.transfer.create({
    message: 'My very first transfer!',
    files: [
      {
        name: 'hello.txt',
        size: content.length,
        content: content
      }
    ]
  });

  console.log(transfer.url)
})();
```

## Transfers

Built to get files from one place to the other, this is the classic WeTransfer experience. Send it up to 2GB of files per transfer and this thing will handle it with ease, with a built-in 7 day expiry.

### Create a transfer

Transfers must be created with files. Once the transfer has been created and finalized, new files cannot be added to it. When creating a transfer you must provide a list of files you want to transfer. Files must include `name` (unique) and `size` (in bytes) properties.

```js
const transfer = await wtClient.transfer.create({
  // Message is optional
  message: 'My very first transfer!',
  // Files are mandatory. Must include file names (unique!) and file sizes, in bytes.
  files: [
    {
      name: 'hello.txt',
      size: 1024
    },
    {
      name: 'big-bobis.jpg',
      size: 13370099
    }
  ]
});
```

As you can see, the content of the files has not been included as a part of the payload. The contend is not a required property because depending on your use case, you will have access to the file content when the transfer is created, but in other cases, this can be separate process.

These are some possible options:

1. You are writing a CLI tool, where you know where the files are located, our you just expect paths to files that you need to read before you create the transfer. If that's the case, the content will be a [Buffer](https://nodejs.org/api/buffer.html#buffer_class_buffer), returned by `fs.readFile` method. The SDK will take care of the file upload process, we got you covered. Your code will be something like this, provided you know the path of the file:

```js
// Create a promise-based function to read files.
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

// This is variable, and will depend on your application.
const filePaths = ['path/to/file.txt', 'path/to/image.png'];

// Read the content of the files, in parallel
const fileContents = await Promise.all(filePaths.map(readFile));

// Create the files array with names, sizes and content.
const files = filePaths.map((file, index) => {
  const content = fileContents[index];
  return {
    name: file.split('/').pop(),
    size: content.length,
    content: content
  };
});

const transfer = await wtClient.transfer.create({
  message: 'My very first transfer!',
  files: files
});

console.log(transfer.url); // https://we.tl/t-Sa7dYYlOdF
```

2. If you are trying to create a transfer from the browser, please make use of the [File Web API](https://developer.mozilla.org/en-US/docs/Web/API/File), which gives you access to file information and content. Be aware that using the SDK directly in the browser, will expose your API Key to the wild, and this is not desired. Considering that you have an input to upload multiple files:

```html
<input type="file" id="files-input" multiple />
```

```js
const filesElement = document.getElementById('files-input');

// Create a transfer everytime files are selected.
filesElement.addEventListener('change', async (event) => {
  const fileList = event.target.files;

  const files = fileList.map((file) => {
    return {
      name: file.name,
      size: file.size,
      content: file
    };
  });

  const transfer = await wtClient.transfer.create({
    message: 'My very first transfer!',
    files: files
  });

  console.log(transfer.url); // https://we.tl/t-Sa7dYYlOdF
});
```

3. A proper solution for the previous example would be to have a client/server application where your API Key is not exposed in the browser. This is so you can control which clients can create transfers based to CORS settings, for example. That requires a more complicated setup, but it's the best solution both in terms of security and performance. The process is as follows:

    1. Create a transfer, specifing only file names and size.
    2. Request upload URLs for each part of the file.
    3. Complete the file upload.
    4. Repeat 2 and 3 for each file.
    5. Complete the transfer. The final WeTransfer URL will be returned here.

    Please check this [example](https://github.com/WeTransfer/wt-js-sdk/blob/master/example/create-transfer.js) using vanilla JS which shows how to upload chunks.

### Find a transfer

If you have a transfer id saved from previous steps, you can retrieve the transfer object and files information:

```js
const transfer = await wtClient.transfer.find('/* your transfer_id */');
console.log(transfer.url); // https://we.tl/t-Sa7dYYlOdF
```

## Boards

Our Board API is in line with our new mobile app. It can store traditional files as well as links, and is flexible in how it displays it all.

### Create an empty board

Boards are the latest addition to our Public API. It was built with our iOS and Android apps in mind, but it's also suitable for web/desktop users. It is designed for collecting content rather than transmitting content from A to B (though it can do that, too) and it supports both files and links. Boards are created emtpy, without files or links. Imagine a board like an empty canvas where you can add items at any time.

```js
const board = await wtClient.board.create({
  name: 'My very first board!',
  // Description is optional.
  description: 'Something about cats, most probably.'
});

console.log(board.url) // https://we.tl/b-oR7ufV43ZS
```

As you can see, boards are created without items, but you can already access the public URL. It's time to add some items!

### Add links to a board

Once a board has been created you can then add links to it. Please provide a complete URL and the title od the page.

```javascript
const links = await apiClient.board.addLinks(board, [{
  url: 'https://en.wikipedia.org/wiki/Japan',
  title: 'Japan - Wikipedia'
}, {
  url: 'https://en.wikipedia.org/wiki/Netherlands',
  title: 'Netherlands - Wikipedia'
}]);

console.log(links);
console.log(board.links);
// [{
//   id: 'sj63ugt996w8b4c1v20180913113842',
//   url: 'https://en.wikipedia.org/wiki/Japan',
//   meta: {
//     title: 'Japan - Wikipedia'
//   },
//   type: 'link'
// }, {
//   id: 'sj63ugt996w8b4c1v20180913113843',
//   url: 'https://en.wikipedia.org/wiki/Netherlands',
//   meta: {
//     title: 'Netherlands - Wikipedia'
//   },
//   type: 'link'
// }]
```

`links` contains the list of links added to the board, with some extra information like an unique `id` or extra meta information, if available.

### Add files to a board

Once a board has been created you can then add files to it. Unlike transfers, files can be added at any time, one by one, in batches, it will depend on your use case.

```js
const files = await apiClient.board.addFiles(board, [{
  filename: 'kittie.gif',
  filesize: 1024
}]);
```

From here, the process to upload files is the same as for [transfer](#create-a-transfer). If you already have the content of the file, you can pass it as an extra property named `content`, we will take care of it.

Please check this [example](https://github.com/WeTransfer/wt-js-sdk/blob/v2-integration/example/create-board.js) using vanilla JS which shows how to add items to a board.

### Retrieve a board

If you have a board id saved from previous steps, you can retrieve the board object and files information:

```js
const transfer = await wtClient.board.find('/* your board_id */');
console.log(transfer.url); // https://we.tl/b-Sa7dYYlOdF
```

Note that unlike transfers, boards are can always be modified and only expire if not interacted with in 90 days, so you can use this method to retrieve and update a board.

## Retry network requests

We intercept failed requests and retry them whenever possible. But default, we retry each request 15 times using [exponential backoff](https://developers.google.com/analytics/devguides/reporting/core/v3/errors#backoff). Both parameters can be configured when creating the client:

```js
const apiClient = await createWTClient('/* YOUR PRIVATE API KEY GOES HERE*/', {
  retries: 5,
  retryDelay: (retryCount) => retryCount * 1000,
});
```

## Logging levels

Logging levels in this SDK conform to the severity ordering specified by [RFC5424]: _severity of all levels is assumed to be numerically **ascending** from most important to least important._

Each `level` is given a specific integer priority. The higher the priority the more important the message is considered to be, and the lower the corresponding integer priority.

``` js
{
  error: 0,
  warn: 1,
  info: 2,
  verbose: 3,
  debug: 4,
  silly: 5
}
```

We make use of the `npm` levels showed above.

Setting the level for your logging message can be done providing the value when creating WeTransfer. For example, using the `warn` level you could log `warn` messages and below to the console, which in this case will only be `warn` and `error`.

```js
const apiClient = await createWTClient('/* YOUR PRIVATE API KEY GOES HERE*/', {
  logger: {
    level: 'debug'
  }
});
```

If no value is provided, by default we will use `info`.

## Documentation

Visit [https://developers.wetransfer.com/documentation](https://developers.wetransfer.com/documentation) to access the latest API related documentation.

## Development

After checking out the repo, run `yarn` to install all dependencies. To run all tests:

```bash
$ npm test
$ npm run test:watch
```

## Release process

First, make sure that you have a NPM account at [https://www.npmjs.com/](https://www.npmjs.com/), and you are part of the WeTransfer developer's team. Use `npm login` to store the credentials on the client aka, your computer. Check that your authentication token for `registry.npmjs.org` is part of your `~/.npmrc` file.

We use `semantic-release` to manage release process. Please run `npm run release:dry` to check relevant changes and possible new versions. If you are happy with it, run `npm run release`, it should do the following:

* Verify authentication for registry
* Verify GitHub authentication
* Find latest release and associated git tag
* Find last commits since last release
* Generate release notes
* Create Git tag
* Prepare the package and release it 📦

## Contributing

Bug reports and pull requests are welcome on GitHub at https://github.com/wetransfer/wt-js-sdk. This project is intended to be a safe, welcoming space for collaboration, and contributors are expected to adhere to the [Contributor Covenant](http://contributor-covenant.org) code of conduct.

## License

The package is available as open source under the terms of the [MIT License](https://opensource.org/licenses/MIT).

## Code of Conduct

Everyone interacting in the WetransferJSSdk project’s codebases, issue trackers, chat rooms and mailing lists is expected to follow the [code of conduct](https://github.com/wetransfer/wt-js-sdk/blob/master/.github/CODE_OF_CONDUCT.md).
