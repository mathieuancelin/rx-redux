var Rx = require('rx-lite');

exports.subreducer = function subreducer(key, reducer) {
  return function(state, action) {
    return Object.assign({}, state, { [key]: reducer(state[key], action) });
  }
}

exports.combine = function combine() {
  var reducers = arguments;
  return function(state, action) {
    var current = state;
    for (var i in reducers) {
      current = reducers[i](current, action);
    }
    return current;
  };
}

exports.action = function action(type, callback) {
  if (!callback) {
    callback = function() { return {}};
  }
  var action = new Rx.Subject();
  var func = function(payload) {
    action.onNext({ type: type, payload: payload ? payload : callback()});
  };
  func.subscribe = action.subscribe.bind(action);
  return func;
}
