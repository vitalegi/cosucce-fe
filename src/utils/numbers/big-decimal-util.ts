import bigDecimal from 'js-big-decimal';
import NumberUtil from './number-util';
import { SafeBigDecimal } from 'src/utils/numbers/safe-big-decimal';

export default class BigDecimalUtil {
  public static readonly ZERO = new bigDecimal('0');
  public static readonly PLUS_ONE = new bigDecimal('1');
  public static readonly MINUS_ONE = new bigDecimal('-1');

  public static format(n: SafeBigDecimal): {
    integerPart: string;
    decimalPart: string;
  } {
    return {
      integerPart: BigDecimalUtil.getIntegerPart(n).getPrettyValue(3, '.'),
      decimalPart: BigDecimalUtil.getDecimalPart(n, 2).getValue().substring(2),
    };
  }

  public static getIntegerPart(val: SafeBigDecimal): SafeBigDecimal {
    return val.round(0, bigDecimal.RoundingModes.DOWN);
  }

  public static getDecimalPart(val: SafeBigDecimal, precision: number): SafeBigDecimal {
    const abs = val.abs();
    const integerPart = BigDecimalUtil.getIntegerPart(abs).abs();
    return abs.subtract(integerPart).round(precision, bigDecimal.RoundingModes.DOWN);
  }

  public static sum(values: SafeBigDecimal[]): SafeBigDecimal {
    if (values.length === 0) {
      return BigDecimalUtil.ZERO;
    }
    return values.reduce((prev, curr) => prev.add(curr));
  }
  public static getNumberValue(value: SafeBigDecimal): number {
    return NumberUtil.parseAsDecimal(value.getValue());
  }
}
