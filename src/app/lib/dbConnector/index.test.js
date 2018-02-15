import test from 'ava';
import {
  fromMongo,
  toMongo,
} from './';

// fromMongo
test('fromMongo', (t) => {
  t.plan(4);
  const inputA = [{
    _id: 'inputA',
  }];
  const inputB = {
    _id: 'inputB',
  };
  const inputC = [undefined];
  const inputD = undefined;
  const outputA = fromMongo(inputA);
  const outputB = fromMongo(inputB);
  const outputC = fromMongo(inputC);
  const outputD = fromMongo(inputD);
  outputA.forEach((o) => {
    if (!o._id && o.id === 'inputA') {
      t.pass();
    }
  });
  if (!outputB._id && outputB.id === 'inputB') {
    t.pass();
  }
  t.is(outputC, inputC);
  t.is(outputD, inputD);
});

// toMongo
test('toMongo', (t) => {
  t.plan(2);
  const inputA = [{
    id: 'inputA',
    _id: 'inputA',
  }];
  const inputB = {
    id: 'inputB',
    _id: 'inputB',
  };
  const outputA = toMongo(inputA);
  const outputB = toMongo(inputB);
  outputA.forEach((o) => {
    if (!o.id && !o._id) {
      t.pass();
    }
  });
  if (!outputB.id && !outputB._id) {
    t.pass();
  }
});
