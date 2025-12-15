/**
 * MatchEngine SDK for TypeScript/JavaScript
 *
 * Provides API client and models for integrating MatchEngine
 * booking functionality into web applications.
 *
 * @example
 * ```typescript
 * import { MatchEngineClient } from '@devletics/matchengine-sdk';
 *
 * const client = new MatchEngineClient({
 *   baseUrl: 'https://api.matchengine.de',
 *   apiToken: 'your-api-token',
 *   stripePublishableKey: 'pk_test_xxx',
 * });
 *
 * // Get venue with resources
 * const venue = await client.getVenueWithResources('venue-123');
 *
 * // Get availability for a resource
 * const availability = await client.getAvailabilityById({
 *   resourceId: venue.resources[0].id,
 *   startDate: new Date(),
 *   endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
 * });
 *
 * // Create a booking
 * const booking = await client.createBooking({
 *   resourceExternalId: 'resource-123',
 *   userExternalId: 'user-123',
 *   startDatetime: new Date('2025-01-15T10:00:00'),
 *   endDatetime: new Date('2025-01-15T11:30:00'),
 *   timezone: availability.timezone,
 * });
 * ```
 */

// Client
export { MatchEngineClient } from './client';

// Config
export type { MatchEngineConfig } from './config';
export { createConfig } from './config';

// Models - Types
export type {
  // Availability
  AvailabilityWindow,
  BookedSlot,
  UnavailablePeriod,
  AvailabilityResponse,
  // Booking
  BookingStatus,
  Booking,
  CreateBookingRequest,
  CreateBookingOptions,
  CancelBookingRequest,
  // User
  UserMapping,
  RegisterUserRequest,
  RegisterUserOptions,
  // Resource
  ResourceMapping,
  RegisterResourceRequest,
  RegisterResourceOptions,
  // Venue
  Venue,
  VenueDetail,
  VenueImage,
  VenueAmenity,
  VenueResource,
  VenueMapping,
  RegisterVenueRequest,
  RegisterVenueOptions,
  VenueWithResources,
  ListVenuesOptions,
  ListResourcesOptions,
  // Payment
  PaymentIntent,
} from './models';

// Models - Values
export { BookingHelpers, VenueHelpers } from './models';

// Errors
export {
  MatchEngineError,
  AuthenticationError,
  NotFoundError,
  ValidationError,
  SlotNotAvailableError,
  UserNotFoundError,
  BookingError,
  PaymentError,
} from './errors';
