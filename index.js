var features = {
  'generators': {
    since: '1.0.0',
    eval: '(function* () {})'
  },
  'let': {
    since: '1.0.0',
    fn: '"use strict"; let a; return true'
  },
  'fat arrow': {
    since: '4.0.0',
    eval: '(() => {})'
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
  },
  'template string': {
    since: '1.0.0',
    eval: '`...`'
  },
  'object.assign': {
    since: '4.0.0',
    eval: 'Object.assign'
  }
}

/**
 * detect : detect(features...)
 * Checks for feature support. Returns an object or null.
 *
 *     unsupported = detect('class', 'weakmap')
 *     unsupported.features    //=> ['class']
 *     unsupported.minVersion  //=> '1.0.0'
 */

function check () {
  var args = [].slice.call(arguments)
  var failures = []
  var maxver

  if (args.length === 1 && args[0] === '*') {
    args = featureNames
  }

  args.forEach(function (name) {
    var feature = features[name.toLowerCase()]
    if (!feature) throw new Error('Unknown feature: ' + feature)

    if (!run(feature)) {
      failures.push(name)
      if (feature.since &&
        (!maxver ||
        (versionToInt(maxver) < versionToInt(feature.since)))) {
        maxver = feature.since
      }
    }
  })

  if (failures.length) {
    return { features: failures, minVersion: maxver }
  }
}

/**
 * detect.fail : detect.fail(features...)
 * Checks for feature support. Throws an exception if some are unavailable.
 *
 *     detect.fail('class', 'weakmap')
 *     // "Error: Your platform doesn't support these features: class.
 *     // Please upgrade to Node.js v1.0.0 or above."
 */

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

/**
 * Private: runs a feature check.
 */

/* eslint-disable no-new-func, no-eval */
function run (feature) {
  if (feature.fn) {
    try { new Function(feature.fn)(); return true } catch (e) { }
  } else {
    try { return eval(feature.eval) } catch (e) { }
  }
}

/**
 * Private: Converts a semver to an integer you can use integer
 * comparisons with.
 */

function versionToInt (version) {
  return version.split('.').reduce(function (result, v, idx) {
    return result + (+v) * Math.pow(2, 8 * (2-idx))
  }, 0)
}

/**
 * detect.features:
 * List of features.
 *
 *     detect.features
 *     //=> [ 'class', 'generators', ... ]
 */

var featureNames = Object.keys(features)

module.exports = check
module.exports.check = check
module.exports.fail = fail
module.exports.features = featureNames
