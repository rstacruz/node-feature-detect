# node-feature-detect

Checks for features.

```js
var detect = require('node-feature-detect')

detect.features
// [ 'generators', 'let', 'fat arrow', 'promise', 'symbol', 'weakmap',
//   'class', 'template string' ]

detect('class', 'generators')
// { unsupported: 'class', minVersion: '4.0.0' }
```

Or you can automatically fail:

```js
detect.fail('class', 'generators')

// Error: Your platform doesn't support these features: generators, class.
// Please upgrade to Node.js v4.0.0 or above.
```

## Thanks

**node-feature-detect** © 2015+, Rico Sta. Cruz. Released under the [MIT] License.<br>
Authored and maintained by Rico Sta. Cruz with help from contributors ([list][contributors]).

> [ricostacruz.com](http://ricostacruz.com) &nbsp;&middot;&nbsp;
> GitHub [@rstacruz](https://github.com/rstacruz) &nbsp;&middot;&nbsp;
> Twitter [@rstacruz](https://twitter.com/rstacruz)

[MIT]: http://mit-license.org/
[contributors]: http://github.com/rstacruz/node-feature-detect/contributors
