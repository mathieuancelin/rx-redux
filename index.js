'use strict';

var Rx = require('rx-lite');
var RxRedux = require('./utils');

var increment = RxRedux.action('INCREMENT_COUNTER', function() {
  return {
    value: 1,
  };
});
var decrement = RxRedux.action('DECREMENT_COUNTER');

function counter(state, action) {
  if (!state) state = 0; // ES6
  switch (action.type) {
    case 'INCREMENT_COUNTER':
      return state + action.payload.value;
    case 'DECREMENT_COUNTER':
      return state - 1;
    default:
      return state;
  }
}

var flux = Rx.Observable.merge(
  increment,
  decrement
).startWith({
  reducer1: 0,
  reducer2: 0,
}).scan(RxRedux.combine(
  RxRedux.subreducer('reducer1', counter),
  RxRedux.subreducer('reducer2', counter)
));

flux.subscribe(function(state) {
  console.log('current state 1', state);
});

flux.subscribe(function(state) {
  console.log('current state 2', state);
});

flux.subscribe(function(state) {
  console.log('current state 3', state);
});

increment();
increment();
increment();
decrement();
