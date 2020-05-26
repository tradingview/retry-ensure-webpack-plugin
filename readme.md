Webpack plugin for retrying async chunk loading.

Retries internal `__webpack__require__.e /* nsure */` function call on promise rejections.

Compatible with Webpack 4 and 5.

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

_Note:_ This option is "max retries", not "max requests". In the worst case there would be `1 + max` requests total.

If `max` equals `0`, this plugin is turned off entirely.

`Infinity` is a valid value, if you want to retry until the end of time.

Default: `3`.

### `delay` (`number | string`)

- `number`: Amount of milliseconds between retries, constant value.

- `string`: Expression that returns a numeric value. A variable `retriedTimes` can be used for exponential (or whatever you like) backoff. `retriedTimes` equals `0` at the first retry attempt.

*Note that this expression is not validated in any way. It's just plugged into your generated code.*

Default: `'retriedTimes * retriedTimes * 1000'`
