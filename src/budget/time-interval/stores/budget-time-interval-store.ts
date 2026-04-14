import { addDays, startOfDay, endOfDay } from 'date-fns';
import { defineStore, acceptHMRUpdate } from 'pinia';
import TimeInterval from 'src/budget/time-interval/models/time-interval';
import TimeIntervalState from 'src/budget/time-interval/models/time-interval-state';
import { AllTimeIntervalService } from 'src/budget/time-interval/services/all-time-interval-service';
import { MonthlyTimeIntervalService } from 'src/budget/time-interval/services/monthly-time-interval-service';
import { RollingDaysTimeIntervalService } from 'src/budget/time-interval/services/rolling-days-time-interval-service';
import { TimeIntervalService } from 'src/budget/time-interval/services/time-interval-service';
import { WeeklyTimeIntervalService } from 'src/budget/time-interval/services/weekly-time-interval-service';
import { YearlyTimeIntervalService } from 'src/budget/time-interval/services/yearly-time-interval-service';

function timeIntervalService(interval: TimeInterval, amount: number): TimeIntervalService {
  if (interval === 'all') {
    return new AllTimeIntervalService();
  }
  if (interval === 'yearly') {
    return new YearlyTimeIntervalService();
  }
  if (interval === 'monthly') {
    return new MonthlyTimeIntervalService();
  }
  if (interval === 'weekly') {
    return new WeeklyTimeIntervalService();
  }
  if (interval === 'rolling-days') {
    return new RollingDaysTimeIntervalService(amount);
  }
  return new AllTimeIntervalService();
}

export const useBudgetTimeIntervalStore = defineStore('budgetTimeInterval', {
  state: (): TimeIntervalState => {
    return {
      interval: 'rolling-days',
      amount: RollingDaysTimeIntervalService.DEFAULT_DAYS_ROLLING,
      span: 'daily',
      from: addDays(startOfDay(new Date()), -RollingDaysTimeIntervalService.DEFAULT_DAYS_ROLLING),
      to: endOfDay(new Date()),
    };
  },
  getters: {
    label: (state) => {
      return timeIntervalService(state.interval, state.amount).getLabel(state.from, state.to);
    },
    todayIsInRange: (state) => {
      const today = new Date();
      return state.from <= today && today <= state.to;
    },
  },
  actions: {
    change(interval: TimeInterval) {
      const timeService = timeIntervalService(interval, 0);
      this.$state = timeService.getDefaultTimeIntervalState();
    },
    now() {
      const range = timeIntervalService(this.interval, this.amount).select();
      this.from = range.from;
      this.to = range.to;
    },
    next() {
      const range = timeIntervalService(this.interval, this.amount).next({
        from: this.from,
        to: this.to,
      });
      this.from = range.from;
      this.to = range.to;
    },
    previous() {
      const range = timeIntervalService(this.interval, this.amount).previous({
        from: this.from,
        to: this.to,
      });
      this.from = range.from;
      this.to = range.to;
    },
  },
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useBudgetTimeIntervalStore, import.meta.hot));
}
