# WeTransfer JavaScript SDK

[![npm version](https://badge.fury.io/js/%40wetransfer%2Fjs-sdk.svg)](https://badge.fury.io/js/%40wetransfer%2Fjs-sdk)
[![Maintainability](https://api.codeclimate.com/v1/badges/2560a764d67ef16af5fe/maintainability)](https://codeclimate.com/github/WeTransfer/wt-js-sdk/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/2560a764d67ef16af5fe/test_coverage)](https://codeclimate.com/github/WeTransfer/wt-js-sdk/test_coverage)
[![Build Status](https://travis-ci.org/WeTransfer/wt-js-sdk.svg?branch=master)](https://travis-ci.org/WeTransfer/wt-js-sdk)

The JavaScript SDK provides convenient access to WeTransfer's Public API.

## Installation

Install the SDK with:

```bash
npm i @wetransfer/js-sdk --save
```

## Usage

In order to be able to use the SDK and access our public APIs, you must provide an API key, which is available in our [Developers Portal](https://developers.wetransfer.com/).

```javascript
const createWTClient = require('@wetransfer/js-sdk');

(async function() {
  // An authorization call is made when you create the client.
  // Keep that in mind to perform this operation
  // in the most suitable part of your code
  const apiClient = await createWTClient('/* YOUR PRIVATE API KEY GOES HERE*/');

  const transfer = await apiClient.transfer.create({
    name: 'My very first transfer!'
  });
})();
```

### Transfer

Transfers can be created with or without items. Once the transfer has been created, items can be added at any time:

```javascript
const transfer = await apiClient.transfer.create({
  name: 'My very first transfer!',
  // Description is optional.
  description: 'Something about cats, most probably.'
});
// transfer.shortened_url contains the public WeTransfer URL
```

### Add items to a transfer

Once a transfer has been created you can then add items to it. If files are provided as items, they are not uploaded at this point, see next steps:

```javascript
const transferItems = await apiClient.transfer.addItems(transfer.id, [{
  content_identifier: 'file',
  local_identifier: 'delightful-cat',
  filename: 'kittie.gif',
  filesize: 1024
},
{
  local_identifier: 'japan-wikipedia',
  content_identifier: 'web_content',
  url: 'https://en.wikipedia.org/wiki/Japan',
  meta: {
    title: 'Japan'
  }
}]);
```

It will return an object for each item you want to add to the transfer. For files, each one must be split into chunks, and uploaded to a pre-signed S3 URL, provided by the following method.

### Upload a file

Once the item has been added to the transfer, next step is to upload the file or files. You must provide the content of the file to upload as a [Buffer](https://nodejs.org/api/buffer.html#buffer_class_buffer).

```javascript
// Depending on your application, you will read the file using fs.readFile
// or it will be a file uploaded to your service.
const fileContent = [/* Buffer */];
await Promise.all(
  transferItems
    .filter((item) => item.content_identifier === 'file')
    .map((item) => apiClient.transfer.uploadFile(item, fileContent))
);
```

## Documentation

Visit [https://wetransfer.github.io/wt-api-docs/index.html](https://wetransfer.github.io/wt-api-docs/index.html) to access the latest API related documentation.

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
