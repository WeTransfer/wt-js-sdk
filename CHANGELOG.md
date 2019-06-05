# [1.2.0](https://github.com/WeTransfer/wt-js-sdk/compare/v1.1.0...v1.2.0) (2019-06-05)


### Bug Fixes

* **deps:** update dependency async to v3 ([#207](https://github.com/WeTransfer/wt-js-sdk/issues/207)) ([0f21466](https://github.com/WeTransfer/wt-js-sdk/commit/0f21466))
* **deps:** update dependency async to v3.0.1 ([#208](https://github.com/WeTransfer/wt-js-sdk/issues/208)) ([b8ac392](https://github.com/WeTransfer/wt-js-sdk/commit/b8ac392))
* **deps:** update dependency axios to v0.19.0 [security] ([#212](https://github.com/WeTransfer/wt-js-sdk/issues/212)) ([7e688cd](https://github.com/WeTransfer/wt-js-sdk/commit/7e688cd))
* **deps:** update dependency axios-retry to v3.1.2 ([#185](https://github.com/WeTransfer/wt-js-sdk/issues/185)) ([0a449e3](https://github.com/WeTransfer/wt-js-sdk/commit/0a449e3))
* **deps:** update dependency winston to v3.2.1 ([#187](https://github.com/WeTransfer/wt-js-sdk/issues/187)) ([4198cea](https://github.com/WeTransfer/wt-js-sdk/commit/4198cea))


### Features

* add TypeScript typings ([#206](https://github.com/WeTransfer/wt-js-sdk/issues/206)) ([64ce9da](https://github.com/WeTransfer/wt-js-sdk/commit/64ce9da))
* concurrent file chunk uploads ([#202](https://github.com/WeTransfer/wt-js-sdk/issues/202)) ([187b08e](https://github.com/WeTransfer/wt-js-sdk/commit/187b08e))
* concurrent file uploads ([#205](https://github.com/WeTransfer/wt-js-sdk/issues/205)) ([43bc224](https://github.com/WeTransfer/wt-js-sdk/commit/43bc224))

# [1.1.0](https://github.com/WeTransfer/wt-js-sdk.git/compare/v1.0.1...v1.1.0) (2018-12-06)


### Features

* add expires_at property to remote transfer ([#164](https://github.com/WeTransfer/wt-js-sdk.git/issues/164)) ([8b797fa](https://github.com/WeTransfer/wt-js-sdk.git/commit/8b797fa))
* add retriable request functionality ([#166](https://github.com/WeTransfer/wt-js-sdk.git/issues/166)) ([19b8134](https://github.com/WeTransfer/wt-js-sdk.git/commit/19b8134))

## [1.0.1](https://github.com/WeTransfer/wt-js-sdk/compare/v1.0.0...v1.0.1) (2018-10-17)


### Bug Fixes

* sanitize filenames and upload based on filename ([#138](https://github.com/WeTransfer/wt-js-sdk/issues/138)) ([7f68e48](https://github.com/WeTransfer/wt-js-sdk/commit/7f68e48))

## [0.6.1](https://github.com/WeTransfer/wt-js-sdk/compare/v0.6.0...v0.6.1) (2018-10-17)


### Bug Fixes

* **deps:** update dependency lodash to v4.17.11 ([#122](https://github.com/WeTransfer/wt-js-sdk/issues/122)) ([5cea200](https://github.com/WeTransfer/wt-js-sdk/commit/5cea200))
* **deps:** update dependency winston to v3.1.0 ([#117](https://github.com/WeTransfer/wt-js-sdk/issues/117)) ([a9f37cc](https://github.com/WeTransfer/wt-js-sdk/commit/a9f37cc))
* sanitize filenames and upload based on filename ([#138](https://github.com/WeTransfer/wt-js-sdk/issues/138)) ([7f68e48](https://github.com/WeTransfer/wt-js-sdk/commit/7f68e48))

<a name="0.6.0"></a>
# [0.6.0](https://github.com/WeTransfer/wt-js-sdk/compare/v0.5.0...v0.6.0) (2018-07-24)


### Features

* add get upload URL method ([#89](https://github.com/WeTransfer/wt-js-sdk/issues/89)) ([dcd7362](https://github.com/WeTransfer/wt-js-sdk/commit/dcd7362))

# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

<a name="0.5.0"></a>

# [0.5.0](https://github.com/WeTransfer/wetransfer-js-sdk/compare/v0.4.2...v0.5.0) (2018-07-03)

### Features

* add a logger mechanish [#62](https://github.com/WeTransfer/wetransfer-js-sdk/issues/62) [47bf5a9](https://github.com/WeTransfer/wetransfer-js-sdk/commit/47bf5a9)

<a name="0.4.2"></a>

# [0.4.2](https://github.com/WeTransfer/wetransfer-js-sdk/compare/v0.4.1...v0.4.2) (2018-06-28)

### Bug Fixes

* remove JSON circular dependencies [#57](https://github.com/WeTransfer/wetransfer-js-sdk/issues/57) [a9b1588](https://github.com/WeTransfer/wetransfer-js-sdk/commit/a9b1588)
* remove JSON circular dependencies [#56](https://github.com/WeTransfer/wetransfer-js-sdk/issues/56) [267592f](https://github.com/WeTransfer/wetransfer-js-sdk/commit/267592f)

<a name="0.4.1"></a>

# [0.4.1](https://github.com/WeTransfer/wetransfer-js-sdk/compare/v0.4.0...v0.4.1) (2018-06-28)

### Bug Fixes

* remove JSON circular dependencies [#55](https://github.com/WeTransfer/wetransfer-js-sdk/issues/55) [f948630](https://github.com/WeTransfer/wetransfer-js-sdk/commit/f948630)

<a name="0.4.0"></a>

# [0.4.0](https://github.com/WeTransfer/wetransfer-js-sdk/compare/v0.3.0...v0.4.0) (2018-06-26)

### Features

* new addFiles and addLinks methods [#47](https://github.com/WeTransfer/wetransfer-js-sdk/issues/47) [cde6562](https://github.com/WeTransfer/wetransfer-js-sdk/commit/cde6562)

### Deprecated

* `addItems` method will be removed on future versions. Please use `addFiles` and/or `addLinks` methods instead.

<a name="0.3.0"></a>

# [0.3.0](https://github.com/WeTransfer/wetransfer-js-sdk/compare/v0.2.0...v0.3.0) (2018-05-15)

### Features

* add error handling [00a8d21](https://github.com/WeTransfer/wetransfer-js-sdk/commit/00a8d21)
* add support for links [#28](https://github.com/WeTransfer/wetransfer-js-sdk/issues/28) [75fd9e4](https://github.com/WeTransfer/wetransfer-js-sdk/commit/75fd9e4)

<a name="0.2.0"></a>

# [0.2.0](https://github.com/WeTransfer/wetransfer-js-sdk/compare/v0.1.0...v0.2.0) (2018-04-19)

### Features

* upload files as buffer [#12](https://github.com/WeTransfer/wetransfer-js-sdk/issues/12) [b6fae26](https://github.com/WeTransfer/wetransfer-js-sdk/commit/b6fae26)

<a name="0.1.0"></a>

# 0.1.0 (2018-04-17)

### Features

* very first version of the SDK
