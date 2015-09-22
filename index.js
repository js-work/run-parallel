module.exports = function (tasks, cb) {
  var results, pending, keys
  var isSync = true
  if (Array.isArray(tasks)) {
    results = []
    pending = tasks.length
  } else {
    keys = Object.keys(tasks)
    results = {}
    pending = keys.length
  }

  function done (err, results) {
    function end () {
      cb && cb(err, results)
      cb = null
    }
    isSync ? process.nextTick(end) : end()
  }

  function each (i, err, result) {
    results[i] = result
    if (--pending === 0 || err) {
      done(err, results)
    }
  }

  if (!pending) {
    // empty
    done(null, results)
  } else if (keys) {
    // object
    keys.forEach(function (key) {
      tasks[key](each.bind(undefined, key))
    })
  } else {
    // array
    tasks.forEach(function (task, i) {
      task(each.bind(undefined, i))
    })
  }

  isSync = false
}
