import SpanInterval from 'src/budget/time-interval/models/span-interval';
import TimeIntervalState from 'src/budget/time-interval/models/time-interval-state';
import TimeRange from 'src/budget/time-interval/models/time-range';

export interface TimeIntervalService {
  getLabel(from: Date, to: Date): string;
  select(): TimeRange;
  next(current: TimeRange): TimeRange;
  previous(current: TimeRange): TimeRange;
  getDefaultTimeIntervalState(): TimeIntervalState;
  getAvailableSpans(): SpanInterval[];
}
