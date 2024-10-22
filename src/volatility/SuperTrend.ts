import { Indicator, IndicatorInput } from '../indicator/indicator';
import { ATR } from '../directionalmovement/ATR';

export class SuperTrendInput extends IndicatorInput {
  period: number;
  multiplier: number;
  high: number[];
  low: number[];
  close: number[];
}

export class SuperTrendOutput extends IndicatorInput {
  superTrend: number;
  direction: number;
}

export class SuperTrend extends Indicator {
  generator: IterableIterator<SuperTrendOutput | undefined>;

  constructor(input: SuperTrendInput) {
    super(input);
    const { period, multiplier, high, low, close } = input;

    this.result = [];
    const atrProducer = new ATR({ period, high: [], low: [], close: [], format: (v) => v });

    this.generator = (function* () {
      let result;
      let tick = yield;
      let atr;
      let basicUpperBand;
      let basicLowerBand;
      let finalUpperBand;
      let finalLowerBand;
      let superTrend;
      let direction = 1;

      while (true) {
        const { high, low, close } = tick;
        atr = atrProducer.nextValue(tick);

        if (atr !== undefined) {
          basicUpperBand = (high + low) / 2 + multiplier * atr;
          basicLowerBand = (high + low) / 2 - multiplier * atr;

          if (finalUpperBand === undefined) {
            finalUpperBand = basicUpperBand;
            finalLowerBand = basicLowerBand;
          } else {
            finalUpperBand = basicUpperBand < finalUpperBand || close > finalUpperBand ? basicUpperBand : finalUpperBand;
            finalLowerBand = basicLowerBand > finalLowerBand || close < finalLowerBand ? basicLowerBand : finalLowerBand;
          }

          if (superTrend === undefined) {
            superTrend = basicUpperBand;
          } else {
            superTrend = direction === 1 ? finalUpperBand : finalLowerBand;
          }

          direction = close > superTrend ? 1 : -1;

          result = {
            superTrend,
            direction,
          };
        }

        tick = yield result;
      }
    })();

    this.generator.next();

    high.forEach((tickHigh, index) => {
      const tickInput = {
        high: tickHigh,
        low: low[index],
        close: close[index],
      };
      const result = this.generator.next(tickInput);
      if (result.value !== undefined) {
        this.result.push(result.value);
      }
    });
  }

  static calculate = supertrend;

  nextValue(price: SuperTrendInput): SuperTrendOutput | undefined {
    return this.generator.next(price).value;
  }
}

export function supertrend(input: SuperTrendInput): SuperTrendOutput[] {
  Indicator.reverseInputs(input);
  const result = new SuperTrend(input).result;
  if (input.reversedInput) {
    result.reverse();
  }
  Indicator.reverseInputs(input);
  return result;
}
