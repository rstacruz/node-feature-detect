function fail () {
  var res = check.apply(this, arguments)

  if (res) {
    var failures = res.features
    var msg =
      'Your platform doesn\'t support these features: ' +
      failures.join(', ') + '.'

    if (res.minVersion) {
      msg += '\nPlease upgrade to Node.js v' + res.minVersion + ' or above.'
    }

    var err = new Error(msg)
    err.code = 'NOFEATURE'
    err.features = res.failures
    err.minVersion = res.minVersion
    throw err
  }
}

function check () {
  var args = [].slice.call(arguments)
  var failures = []
  var maxver

  if (args.length === 1 && args[0] === '*') {
    args = featureNames
  }

  args.forEach(function (name) {
    var feature = features[name]
    if (!feature) throw new Error('Unknown feature: ' + feature)

    if (!run(feature)) {
      failures.push(name)
      if (feature.since &&
        (!maxver ||
        require('semver').satisfies(maxver, '< ' + feature.since))) {
        maxver = feature.since
      }
    }
  })

  if (failures.length) {
    return { features: failures, minVersion: maxver }
  }
}

/* eslint-disable no-new-func, no-eval */
function run (feature) {
  if (feature.fn) {
    try { new Function(feature.fn)(); return true } catch (e) { }
  } else {
    try { return eval(feature.eval) } catch (e) { }
  }
}

var features = {
  'generators': {
    since: '1.0.0',
    fn: '(function* () {}); return true'
  },
  'let': {
    since: '1.0.0',
    fn: '"use strict"; let a; return true'
  },
  'fat arrow': {
    since: '4.0.0',
    fn: '(() => {}); return true'
  },
  'promise': {
    since: '1.0.0',
    eval: 'Promise'
  },
  'symbol': {
    since: '1.0.0',
    eval: 'Symbol'
  },
  'weakmap': {
    since: '1.0.0',
    eval: 'WeakMap'
  },
  'class': {
    since: '1.0.0',
    eval: '"use strict"; class A { }'
  }
}

var featureNames = Object.keys(features)

module.exports = check
module.exports.check = check
module.exports.fail = fail
module.exports.features = featureNames
