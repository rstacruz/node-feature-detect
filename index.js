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

  if (args.length === 1 && args[0] === '*') args = module.exports.features

  args.forEach(function (name) {
    var feature = toFeature(name)
    if (!feature) throw new Error('Unknown feature: ' + feature)

    try {
      if (!feature.run()) fail(name, feature)
    } catch (e) {
      fail(name, feature)
    }
  })

  function fail (name, feature) {
    failures.push(name)
    if (feature.since &&
      (!maxver ||
      require('semver').satisfies(maxver, '< ' + feature.since))) {
      maxver = feature.since
    }
  }

  if (failures.length) {
    return { features: failures, minVersion: maxver }
  }
}

function toFeature (obj) {
  if (features[obj]) {
    obj = features[obj]
  }

  // Handle checks
  if (obj) {
    obj.run = function () {
      return eval(obj.check) // eslint-disable-line
    }
  }

  return obj
}

var features = {
  'generators': {
    since: '1.0.0',
    check: '(function* () {}); true'
  },
  'let': {
    since: '1.0.0',
    check: '"use strict"; let a; true'
  },
  'fat arrow': {
    since: '4.0.0',
    check: '(() => {}); true'
  },
  'promise': {
    since: '1.0.0',
    check: 'Promise'
  },
  'symbol': {
    since: '1.0.0',
    check: 'Symbol',
  },
  'weakmap': {
    since: '1.0.0',
    check: 'WeakMap'
  },
  'class': {
    since: '1.0.0',
    check: '"use strict"; class A { }'
  }
}

var featureNames = Object.keys(features)

module.exports = check
module.exports.check = check
module.exports.fail = fail
module.exports.features = featureNames
