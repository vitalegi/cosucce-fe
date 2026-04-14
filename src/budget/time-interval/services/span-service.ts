import SpanInterval from 'src/budget/time-interval/models/span-interval';

export default class SpanService {
  public getShortLabel(span: SpanInterval): string {
    switch (span) {
      case 'yearly':
        return 'Y';
      case 'monthly':
        return 'M';
      case 'weekly':
        return 'W';
      case 'daily':
        return 'D';
    }
  }
}

export const spanService = new SpanService();
