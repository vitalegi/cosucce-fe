import { addDays, addHours, endOfDay, format, startOfDay } from 'date-fns';
import SpanInterval from 'src/budget/time-interval/models/span-interval';
import TimeIntervalState from 'src/budget/time-interval/models/time-interval-state';
import timeOptions from 'src/budget/time-interval/models/time-option';
import TimeRange from 'src/budget/time-interval/models/time-range';
import { TimeIntervalService } from 'src/budget/time-interval/services/time-interval-service';

export class RollingDaysTimeIntervalService implements TimeIntervalService {
  public static readonly DEFAULT_DAYS_ROLLING = 30;

  days;

  public constructor(days: number) {
    this.days = days;
  }
  getLabel(from: Date, to: Date): string {
    return this.format(from) + ' - ' + this.format(to);
  }
  select(): TimeRange {
    const today = endOfDay(new Date());
    return {
      from: addDays(startOfDay(today), -this.days),
      to: today,
    };
  }
  next(current: TimeRange): TimeRange {
    const base = addHours(current.to, 1);
    return {
      from: startOfDay(base),
      to: addDays(endOfDay(base), this.days),
    };
  }
  previous(current: TimeRange): TimeRange {
    const base = addHours(current.from, -1);
    return {
      from: addDays(startOfDay(base), -this.days),
      to: endOfDay(base),
    };
  }
  getDefaultTimeIntervalState(): TimeIntervalState {
    const range = this.select();
    return {
      interval: 'rolling-days',
      from: range.from,
      to: range.to,
      amount: RollingDaysTimeIntervalService.DEFAULT_DAYS_ROLLING,
      span: 'daily',
    };
  }
  getAvailableSpans(): SpanInterval[] {
    return ['daily', 'weekly'];
  }
  private format(date: Date) {
    return format(date, "d LLL ''yy", timeOptions);
  }
}
