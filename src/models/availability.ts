/**
 * A window of availability with pricing.
 */
export interface AvailabilityWindow {
  date: string;
  start_time: string;
  end_time: string;
  price_per_hour: number;
  currency: string;
  label: string;
}

/**
 * A booked time slot.
 */
export interface BookedSlot {
  start_datetime: string;
  end_datetime: string;
  booking_id: string;
}

/**
 * A period when the resource is unavailable.
 */
export interface UnavailablePeriod {
  start_datetime: string;
  end_datetime: string;
  reason: string;
}

/**
 * Complete availability response for a resource.
 */
export interface AvailabilityResponse {
  resource_id: number;
  resource_name: string;
  start_date: string;
  end_date: string;
  timezone: string;
  booking_interval_minutes: number;
  min_duration_minutes: number;
  max_duration_minutes: number | null;
  prevent_unbookable_gaps: boolean;
  min_advance_booking_minutes: number;
  max_advance_booking_days: number;
  windows: AvailabilityWindow[];
  booked_slots: BookedSlot[];
  unavailable_periods: UnavailablePeriod[];
}
