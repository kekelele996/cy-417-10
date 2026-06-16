import { defineStore } from 'pinia';
import { TripStatus } from '../constants/trip';
import type { Trip } from '../models/trip';
import type { TripTemplate } from '../models/tripTemplate';
import { tripApi } from '../api/tripApi';
import { messages } from '../constants/messages';
import { toast } from '../utils/message';

export const useTripStore = defineStore('trip', {
  state: () => ({ trips: tripApi.list() as Trip[], statusFilter: 'all' as TripStatus | 'all' }),
  getters: {
    filteredTrips: (state) => state.statusFilter === 'all' ? state.trips : state.trips.filter((trip) => trip.status === state.statusFilter),
  },
  actions: {
    createTrip(title = '杭州周末慢旅行', template?: TripTemplate) {
      const now = new Date();
      const days = template ? template.days : 2;
      const trip: Trip = {
        id: crypto.randomUUID(),
        title: template ? template.name : title,
        destination: template ? template.destination : '杭州',
        start_date: now.toISOString().slice(0, 10),
        end_date: new Date(now.getTime() + 86400000 * days).toISOString().slice(0, 10),
        budget: template ? template.budget : 3200,
        currency: template ? template.currency : 'CNY',
        members: ['我', '朋友'],
        status: TripStatus.PLANNING,
        created_at: new Date().toISOString(),
      };
      this.trips.unshift(trip);
      tripApi.save(this.trips);
      if (template) {
        toast.ok(messages.templateApplied);
      } else {
        toast.ok(messages.tripCreated);
      }
      return trip.id;
    },
    removeTrip(id: string) {
      this.trips = this.trips.filter((trip) => trip.id !== id);
      tripApi.save(this.trips);
      toast.ok(messages.tripDeleted);
    },
  },
});

