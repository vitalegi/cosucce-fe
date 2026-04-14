import { addHours, endOfMonth, format, startOfMonth } from 'date-fns';
import SpanInterval from 'src/budget/time-interval/models/span-interval';
import TimeIntervalState from 'src/budget/time-interval/models/time-interval-state';
import timeOptions from 'src/budget/time-interval/models/time-option';
import TimeRange from 'src/budget/time-interval/models/time-range';
import { TimeIntervalService } from 'src/budget/time-interval/services/time-interval-service';

export class MonthlyTimeIntervalService implements TimeIntervalService {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getLabel(from: Date, to: Date): string {
    return format(from, "LLL ''yy", timeOptions);
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
      interval: 'monthly',
      from: range.from,
      to: range.to,
      amount: 0,
      span: 'daily',
    };
  }
  getAvailableSpans(): SpanInterval[] {
    return ['daily', 'weekly'];
  }

  private interval(date: Date): TimeRange {
    return { from: startOfMonth(date), to: endOfMonth(date) };
  }
}
