import SpanInterval from 'src/budget/time-interval/models/span-interval';
import TimeIntervalState from 'src/budget/time-interval/models/time-interval-state';
import TimeRange from 'src/budget/time-interval/models/time-range';
import { TimeIntervalService } from 'src/budget/time-interval/services/time-interval-service';

export class AllTimeIntervalService implements TimeIntervalService {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getLabel(from: Date, to: Date): string {
    return 'All';
  }
  select(): TimeRange {
    return { from: new Date(0, 0, 0), to: new Date(9999, 0, 0) };
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next(current: TimeRange): TimeRange {
    return this.select();
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  previous(current: TimeRange): TimeRange {
    return this.select();
  }
  getDefaultTimeIntervalState(): TimeIntervalState {
    const range = this.select();
    return {
      interval: 'all',
      from: range.from,
      to: range.to,
      amount: 0,
      span: 'yearly',
    };
  }
  getAvailableSpans(): SpanInterval[] {
    return ['daily', 'weekly', 'monthly', 'yearly'];
  }
}
