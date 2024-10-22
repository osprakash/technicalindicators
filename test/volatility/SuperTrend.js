const assert = require('assert');
const { SuperTrend } = require('../../lib/volatility/SuperTrend');

const input = {
  period: 7,
  multiplier: 3,
  high: [127.75, 129.02, 132.75, 145.40, 148.98, 137.52, 147.38, 139.05, 137.23, 149.30, 162.45, 178.95, 200.35, 221.90, 243.23, 243.52, 286.42, 280.27],
  low: [118.875, 130, 128.050005, 132.899995, 144.949995, 150.399995, 141, 147.5, 138, 137.225005, 149.5, 163.024995, 179.850005, 199.125, 220.5, 243.475005, 245.050005, 290],
  close: [44.3389, 44.0902, 44.1497, 43.6124, 44.3278, 44.8264, 45.0955, 45.4245, 45.8433, 46.0826, 45.8931, 46.0328, 45.6140, 46.2820, 46.2820, 46.0028, 46.0328, 46.4116]
};

const expectedResults = [
  { superTrend: 0, direction: 1 },
  { superTrend: 0, direction: 1 },
  { superTrend: 0, direction: 1 },
  { superTrend: 0, direction: 1 },
  { superTrend: 0, direction: 1 },
  { superTrend: 0, direction: 1 },
  { superTrend: 0, direction: 1 },
  { superTrend: 0, direction: 1 },
  { superTrend: 0, direction: 1 },
  { superTrend: 0, direction: 1 },
  { superTrend: 0, direction: 1 },
  { superTrend: 0, direction: 1 },
  { superTrend: 0, direction: 1 },
  { superTrend: 0, direction: 1 },
  { superTrend: 0, direction: 1 },
  { superTrend: 0, direction: 1 },
  { superTrend: 0, direction: 1 },
  { superTrend: 0, direction: 1 }
];

describe('SuperTrend', function() {
  it('should calculate SuperTrend using the calculate method', function() {
    assert.deepEqual(SuperTrend.calculate(input), expectedResults, 'Wrong Results');
  });

  it('should be able to calculate SuperTrend by using getResult', function() {
    const superTrend = new SuperTrend(input);
    assert.deepEqual(superTrend.getResult(), expectedResults, 'Wrong Results while calculating next bar');
  });

  it('should be able to get SuperTrend for the next bar using nextValue', function() {
    const superTrend = new SuperTrend({ period: 7, multiplier: 3, high: [], low: [], close: [] });
    const results = [];
    input.close.forEach((close, index) => {
      const result = superTrend.nextValue({
        high: input.high[index],
        low: input.low[index],
        close
      });
      if (result !== undefined) {
        results.push(result);
      }
    });
    assert.deepEqual(results, expectedResults, 'Wrong Results while getting results');
  });

  it('should be able to calculate SuperTrend for reversed input by using calculate method', function() {
    const myInput = Object.assign({}, input);
    myInput.reversedInput = true;
    myInput.high.reverse();
    myInput.low.reverse();
    myInput.close.reverse();
    assert.deepEqual(SuperTrend.calculate(myInput), expectedResults.slice().reverse(), 'Wrong Results while calculating next bar');
  });
});
