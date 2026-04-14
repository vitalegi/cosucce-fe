import SpanInterval from 'src/budget/time-interval/models/span-interval';
import TimeInterval from 'src/budget/time-interval/models/time-interval';

export default interface TimeIntervalState {
  interval: TimeInterval;
  span: SpanInterval;
  amount: number;
  from: Date;
  to: Date;
}
