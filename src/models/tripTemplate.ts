import type { DayPlanItem } from './dayPlan';

export interface TripTemplate {
  id: string;
  name: string;
  source_trip_id: string;
  destination: string;
  days: number;
  budget: number;
  currency: string;
  day_plans: { day_index: number; items: DayPlanItem[] }[];
  created_at: string;
}
