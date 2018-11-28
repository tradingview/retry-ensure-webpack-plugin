Webpack plugin for retrying async chunk loading.

Retries internal `__webpack__require__.e /* nsure */` function call on promise rejections.

## Usage

```js
const RetryEnsureWebpackPlugin = require('retry-ensure-webpack-plugin').RetryEnsureWebpackPlugin;
/* ... */
plugins.push(new RetryEnsureWebpackPlugin(options));
```

## Options

An optional parameter, object with properties.

### `max` (`number`)

The max amount of retries. After that, Promise rejection is not handled by this plugin.

Default: `3`.

### `delay` (`number | string`)

- `number`: Amount of milliseconds between retries, constant value.

- `string`: Expression that returns a numeric value. A variable `retriedTimes` can be used for exponential (or whatever you like) backoff. `retriedTimes` equals `0` at the first retry attempt.

*Note that this expression is not validated in any way. It's just plugged into your generated code.*

Default: `'retriedTimes * retriedTimes * 1000'`
