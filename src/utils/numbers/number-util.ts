import bigDecimal from 'js-big-decimal';
import { SafeBigDecimal } from 'src/utils/numbers/safe-big-decimal';
import ObjectUtil from 'src/utils/object-util';

export default class NumberUtil {
  public static formatInt(n: number): string {
    return n.toLocaleString(undefined, {
      maximumFractionDigits: 0,
    });
  }
  public static isNumber(s: string): boolean {
    return !isNaN(NumberUtil.parseAsInt(s));
  }
  public static parseAsInt(s: string): number {
    return parseInt(s, 10);
  }
  public static parseAsDecimal(s: string): number {
    return parseFloat(s);
  }
  public static min(numbers: number[], defaultValue = Number.MAX_SAFE_INTEGER): number {
    if (numbers.length === 0) {
      return defaultValue;
    }
    return numbers.reduce((prev, curr) => Math.min(prev, curr));
  }
  public static max(numbers: number[], defaultValue = 0): number {
    if (numbers.length === 0) {
      return defaultValue;
    }
    return numbers.reduce((prev, curr) => Math.max(prev, curr));
  }
  public static sum(numbers: number[]): number {
    return numbers.reduce((prev, curr) => prev + curr, 0);
  }
  public static formatCurrency(value: number | string): string {
    let v;
    if (typeof value === 'number') {
      v = value;
    } else {
      v = ObjectUtil.asDecimal(value);
    }
    return new Intl.NumberFormat('it-IT', {
      style: 'currency',
      currency: 'EUR',
    }).format(v);
  }

  public static formatPercentage(value: number): string {
    return (
      new Intl.NumberFormat('it-IT', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
      }).format(value * 100) + '%'
    );
  }
  public static formatBigDecimal(value: string | SafeBigDecimal): string {
    let v: SafeBigDecimal;
    if (typeof value === 'string') {
      v = NumberUtil.toSafeBigDecimal(value);
    } else {
      v = value;
    }
    return v.getPrettyValue(undefined, '');
  }

  public static toSafeBigDecimal(value: string): SafeBigDecimal {
    return NumberUtil.toBigDecimal(value);
  }
  public static toBigDecimal(value: string): bigDecimal {
    return new bigDecimal(value.replace(',', '.')).stripTrailingZero();
  }
}
