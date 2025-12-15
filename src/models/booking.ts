/**
 * Booking status values.
 */
export type BookingStatus =
  | 'pending'
  | 'confirmed'
  | 'paid'
  | 'cancelled'
  | 'refunded'
  | 'no_show';

/**
 * A booking record.
 */
export interface Booking {
  id: number;
  reference_code: string;
  resource: number;
  resource_name: string;
  venue_name: string;
  venue_address: string | null;
  start_datetime: string;
  end_datetime: string;
  duration_minutes: number;
  participant_count: number;
  price_per_unit: number | null;
  pricing_unit: string | null;
  total_price: number;
  currency: string;
  status: BookingStatus;
  can_cancel: boolean;
  is_upcoming: boolean;
  notes: string;
  created_at: string | null;
  paid_at: string | null;
  cancelled_at: string | null;
}

/**
 * Request to create a booking.
 */
export interface CreateBookingRequest {
  resource_external_id: string;
  start_datetime: string;
  end_datetime: string;
  participant_count?: number;
  notes?: string;
}

/**
 * Options for creating a booking.
 */
export interface CreateBookingOptions {
  resourceExternalId: string;
  userExternalId: string;
  startDatetime: Date;
  endDatetime: Date;
  timezone: string;
  participantCount?: number;
  notes?: string;
}

/**
 * Request to cancel a booking.
 */
export interface CancelBookingRequest {
  reason?: string;
  notes?: string;
}

/**
 * Helper functions for Booking
 */
export const BookingHelpers = {
  /** Whether this booking is in a paid state. */
  isPaid: (booking: Booking): boolean => booking.status === 'paid',

  /** Whether this booking is pending payment. */
  isPending: (booking: Booking): boolean => booking.status === 'pending',

  /** Whether this booking has been cancelled. */
  isCancelled: (booking: Booking): boolean =>
    booking.status === 'cancelled' || booking.status === 'refunded',

  /** Parse start datetime to Date. */
  getStartDateTime: (booking: Booking): Date => new Date(booking.start_datetime),

  /** Parse end datetime to Date. */
  getEndDateTime: (booking: Booking): Date => new Date(booking.end_datetime),
};
