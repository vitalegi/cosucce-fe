import { addHours, endOfWeek, format, startOfWeek } from 'date-fns';
import SpanInterval from 'src/budget/time-interval/models/span-interval';
import TimeIntervalState from 'src/budget/time-interval/models/time-interval-state';
import timeOptions from 'src/budget/time-interval/models/time-option';
import TimeRange from 'src/budget/time-interval/models/time-range';
import { TimeIntervalService } from 'src/budget/time-interval/services/time-interval-service';

export class WeeklyTimeIntervalService implements TimeIntervalService {
  getLabel(from: Date, to: Date): string {
    return this.format(from) + ' - ' + this.format(to);
  }
  select(): TimeRange {
    const now = new Date();
    return this.interval(now);
  }
  next(current: TimeRange): TimeRange {
    const next = addHours(current.to, 1);
    return this.interval(next);
  }
  previous(current: TimeRange): TimeRange {
    const next = addHours(current.from, -1);
    return this.interval(next);
  }
  getDefaultTimeIntervalState(): TimeIntervalState {
    const range = this.select();
    return {
      interval: 'weekly',
      from: range.from,
      to: range.to,
      amount: 0,
      span: 'daily',
    };
  }
  getAvailableSpans(): SpanInterval[] {
    return ['daily'];
  }
  private interval(date: Date): TimeRange {
    return {
      from: startOfWeek(date, { weekStartsOn: 1 }),
      to: endOfWeek(date, { weekStartsOn: 1 }),
    };
  }
  private format(date: Date) {
    return format(date, 'd LLL', timeOptions);
  }
}
