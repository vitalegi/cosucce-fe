import { addHours, endOfYear, format, startOfYear } from 'date-fns';
import SpanInterval from 'src/budget/time-interval/models/span-interval';
import TimeIntervalState from 'src/budget/time-interval/models/time-interval-state';
import TimeRange from 'src/budget/time-interval/models/time-range';
import { TimeIntervalService } from 'src/budget/time-interval/services/time-interval-service';

export class YearlyTimeIntervalService implements TimeIntervalService {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getLabel(from: Date, to: Date): string {
    return format(from, 'yyyy');
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
      interval: 'yearly',
      from: range.from,
      to: range.to,
      amount: 0,
      span: 'monthly',
    };
  }
  getAvailableSpans(): SpanInterval[] {
    return ['daily', 'weekly', 'monthly'];
  }
  private interval(date: Date): TimeRange {
    return { from: startOfYear(date), to: endOfYear(date) };
  }
}
