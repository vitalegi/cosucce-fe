import { bigDecimal } from 'js-big-decimal';

// Estraiamo il tipo del secondo argomento del metodo 'round' originale
type RoundingModeType = Parameters<bigDecimal['round']>[1];

export type SafeBigDecimal = {
  getValue(): string;
  getPrettyValue(digits?: number, separator?: string): string;
  setValue(num: number | string | bigint): void;
  round(precision?: number, mode?: RoundingModeType): SafeBigDecimal;
  abs(): SafeBigDecimal;
  floor(): SafeBigDecimal;
  ceil(): SafeBigDecimal;
  add(number: SafeBigDecimal | bigDecimal): SafeBigDecimal;
  subtract(number: SafeBigDecimal | bigDecimal): SafeBigDecimal;
  multiply(number: SafeBigDecimal | bigDecimal): SafeBigDecimal;
  divide(
    number: SafeBigDecimal | bigDecimal,
    precision?: number,
    mode?: RoundingModeType,
  ): SafeBigDecimal;
  modulus(number: SafeBigDecimal | bigDecimal): SafeBigDecimal;
  compareTo(number: SafeBigDecimal | bigDecimal): 0 | 1 | -1;
  negate(): SafeBigDecimal;
  stripTrailingZero(): SafeBigDecimal;
};
