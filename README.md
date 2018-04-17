# WeTransfer JavaScript SDK

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
// An authorization call is made when you create the client.
// Keep that in mind to perform this operation
// in the most suitable part of your code
const apiClient = await createWTClient('/* YOUR PRIVATE API KEY GOES HERE*/');

const transfer = await apiClient.transfer.create({
  name: 'My very first transfer!'
});
```

### Transfer

How to create a transfer, with no items yet:

```javascript
const transfer = await apiClient.transfer.create({
  name: 'My very first transfer!',
  description: ''
});
```

### Add some items

Items can be added to a transfer at any time:

```javascript
const items = await apiClient.transfer.addItems(transfer.id, [{
  content_identifier: 'file',
  local_identifier: '',
  filename: '',
  filesize: '',
  path: path.join(__dirname, './path/to/my-file.jpg'),
}]);
```

## Documentation

Visit [https://wetransfer.github.io/wt-api-docs/index.html](https://wetransfer.github.io/wt-api-docs/index.html) to access the latest API related documentation.

## Development

After checking out the repo, run `yarn` to install all dependencies. To run all tests:

```bash
$ npm tests
$ npm run test:watch
```

## Contributing

Bug reports and pull requests are welcome on GitHub at https://github.com/wetransfer/wt-js-sdk. This project is intended to be a safe, welcoming space for collaboration, and contributors are expected to adhere to the [Contributor Covenant](http://contributor-covenant.org) code of conduct.

## License

The package is available as open source under the terms of the [MIT License](https://opensource.org/licenses/MIT).

## Code of Conduct

Everyone interacting in the WetransferJSSdk project’s codebases, issue trackers, chat rooms and mailing lists is expected to follow the [code of conduct](https://github.com/wetransfer/wt-js-sdk/blob/master/.github/CODE_OF_CONDUCT.md).
