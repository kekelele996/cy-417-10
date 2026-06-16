import { defineStore } from 'pinia';
import type { TripTemplate } from '../models/tripTemplate';
import type { Trip } from '../models/trip';
import type { DayPlan } from '../models/dayPlan';
import { templateApi } from '../api/templateApi';
import { messages } from '../constants/messages';
import { toast } from '../utils/message';

export const useTemplateStore = defineStore('template', {
  state: () => ({ templates: templateApi.list() as TripTemplate[] }),
  actions: {
    saveFromTrip(trip: Trip, dayPlans: DayPlan[], name: string) {
      const days = dayPlans.filter((d) => d.trip_id === trip.id);
      const tpl: TripTemplate = {
        id: crypto.randomUUID(),
        name,
        source_trip_id: trip.id,
        destination: trip.destination,
        days: Math.max(1, days.length),
        budget: trip.budget,
        currency: trip.currency,
        day_plans: days.map((d) => ({ day_index: d.day_index, items: d.items.map((it) => ({ ...it })) })),
        created_at: new Date().toISOString(),
      };
      this.templates.unshift(tpl);
      templateApi.save(this.templates);
      toast.ok(messages.templateSaved);
      return tpl.id;
    },
    removeTemplate(id: string) {
      this.templates = this.templates.filter((t) => t.id !== id);
      templateApi.save(this.templates);
      toast.ok(messages.templateDeleted);
    },
  },
});
