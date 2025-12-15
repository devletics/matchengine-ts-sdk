import { MatchEngineConfig, createConfig } from './config';
import {
  MatchEngineError,
  AuthenticationError,
  NotFoundError,
  ValidationError,
  SlotNotAvailableError,
  UserNotFoundError,
} from './errors';
import {
  AvailabilityResponse,
  Booking,
  UserMapping,
  ResourceMapping,
  VenueMapping,
  VenueWithResources,
  VenueResource,
  PaymentIntent,
  RegisterUserOptions,
  RegisterResourceOptions,
  RegisterVenueOptions,
  CreateBookingOptions,
  Venue,
  VenueDetail,
  ListVenuesOptions,
  ListResourcesOptions,
} from './models';

interface RequestOptions {
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  path: string;
  data?: Record<string, unknown>;
  queryParams?: Record<string, string>;
  headers?: Record<string, string>;
}

interface PaginatedResponse<T> {
  results: T[];
  count: number;
  next: string | null;
  previous: string | null;
}

/**
 * MatchEngine API client for TypeScript/JavaScript applications.
 *
 * @example
 * ```typescript
 * const client = new MatchEngineClient({
 *   baseUrl: 'https://api.matchengine.de',
 *   apiToken: 'your-api-token',
 *   stripePublishableKey: 'pk_test_xxx',
 * });
 *
 * // Register user
 * const user = await client.registerUser({
 *   externalId: 'user-123',
 *   email: 'user@example.com',
 * });
 *
 * // Get availability
 * const availability = await client.getAvailability({
 *   resourceExternalId: 'pitch-123',
 *   startDate: new Date(),
 *   endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
 * });
 *
 * // Create booking
 * const booking = await client.createBooking({
 *   resourceExternalId: 'pitch-123',
 *   userExternalId: 'user-123',
 *   startDatetime: new Date('2025-01-15T10:00:00'),
 *   endDatetime: new Date('2025-01-15T11:30:00'),
 *   timezone: 'Europe/Berlin',
 * });
 * ```
 */
export class MatchEngineClient {
  private readonly config: Required<MatchEngineConfig>;
  private readonly baseApiUrl: string;

  constructor(config: MatchEngineConfig) {
    this.config = createConfig(config);
    this.baseApiUrl = `${this.config.baseUrl}/api/v1`;
  }

  // ============ User API ============

  /**
   * Register or get existing user mapping.
   */
  async registerUser(options: RegisterUserOptions): Promise<UserMapping> {
    return this.request<UserMapping>({
      method: 'POST',
      path: '/client/users/register/',
      data: {
        external_id: options.externalId,
        email: options.email,
        first_name: options.firstName ?? '',
        last_name: options.lastName ?? '',
      },
    });
  }

  /**
   * Look up user by external ID.
   */
  async lookupUser(externalId: string): Promise<UserMapping | null> {
    try {
      return await this.request<UserMapping>({
        method: 'GET',
        path: '/client/users/lookup/',
        queryParams: { external_id: externalId },
      });
    } catch (error) {
      if (error instanceof NotFoundError) {
        return null;
      }
      throw error;
    }
  }

  // ============ Resource API ============

  /**
   * Register or get existing resource mapping.
   */
  async registerResource(options: RegisterResourceOptions): Promise<ResourceMapping> {
    return this.request<ResourceMapping>({
      method: 'POST',
      path: '/client/resources/register/',
      data: {
        external_id: options.externalId,
        resource_id: options.matchengineResourceId,
        external_data: options.externalData ?? {},
      },
    });
  }

  /**
   * Look up resource by external ID.
   */
  async lookupResource(externalId: string): Promise<ResourceMapping | null> {
    try {
      return await this.request<ResourceMapping>({
        method: 'GET',
        path: '/client/resources/lookup/',
        queryParams: { external_id: externalId },
      });
    } catch (error) {
      if (error instanceof NotFoundError) {
        return null;
      }
      throw error;
    }
  }

  /**
   * List resources with optional filters.
   */
  async listResources(options?: ListResourcesOptions): Promise<{
    results: VenueResource[];
    count: number;
    next: string | null;
    previous: string | null;
  }> {
    const queryParams: Record<string, string> = {};
    if (options?.venueId) queryParams.venue = String(options.venueId);
    if (options?.venueSlug) queryParams.venue_slug = options.venueSlug;
    if (options?.isActive !== undefined) queryParams.is_active = String(options.isActive);
    if (options?.isBookable !== undefined) queryParams.is_bookable = String(options.isBookable);

    return this.request<PaginatedResponse<VenueResource>>({
      method: 'GET',
      path: '/resources/',
      queryParams,
    });
  }

  // ============ Venue API ============

  /**
   * Register or get existing venue mapping.
   */
  async registerVenue(options: RegisterVenueOptions): Promise<VenueMapping> {
    return this.request<VenueMapping>({
      method: 'POST',
      path: '/client/venues/register/',
      data: {
        external_id: options.externalId,
        venue_id: options.matchengineVenueId,
        external_data: options.externalData ?? {},
      },
    });
  }

  /**
   * Look up venue by external ID.
   */
  async lookupVenue(externalId: string): Promise<VenueMapping | null> {
    try {
      return await this.request<VenueMapping>({
        method: 'GET',
        path: '/client/venues/lookup/',
        queryParams: { external_id: externalId },
      });
    } catch (error) {
      if (error instanceof NotFoundError) {
        return null;
      }
      throw error;
    }
  }

  /**
   * Get venue with its resources by external ID.
   */
  async getVenueWithResources(venueExternalId: string): Promise<VenueWithResources> {
    return this.request<VenueWithResources>({
      method: 'GET',
      path: '/venues/resources/',
      queryParams: { venue_external_id: venueExternalId },
    });
  }

  // ============ Public Venue API ============

  /**
   * List all public venues.
   */
  async listVenues(options?: ListVenuesOptions): Promise<{
    results: Venue[];
    count: number;
    next: string | null;
    previous: string | null;
  }> {
    const queryParams: Record<string, string> = {};
    if (options?.city) queryParams.city = options.city;
    if (options?.venueType) queryParams.venue_type = options.venueType;
    if (options?.search) queryParams.search = options.search;
    if (options?.isActive !== undefined) queryParams.is_active = String(options.isActive);
    if (options?.isFeatured !== undefined) queryParams.is_featured = String(options.isFeatured);
    if (options?.page) queryParams.page = String(options.page);
    if (options?.pageSize) queryParams.page_size = String(options.pageSize);

    return this.request<PaginatedResponse<Venue>>({
      method: 'GET',
      path: '/venues/',
      queryParams,
    });
  }

  /**
   * Get venue details by ID.
   */
  async getVenue(venueId: number): Promise<VenueDetail> {
    return this.request<VenueDetail>({
      method: 'GET',
      path: `/venues/${venueId}/`,
    });
  }

  /**
   * Get venue details by slug.
   */
  async getVenueBySlug(slug: string): Promise<VenueDetail> {
    // First list venues filtered by search to find the slug
    const response = await this.request<PaginatedResponse<Venue>>({
      method: 'GET',
      path: '/venues/',
      queryParams: { search: slug },
    });

    const venue = response.results.find(v => v.slug === slug);
    if (!venue) {
      throw new NotFoundError(`Venue with slug '${slug}' not found`);
    }

    return this.getVenue(venue.id);
  }

  // ============ Availability API ============

  /**
   * Get availability for a resource by MatchEngine resource ID.
   * Use this when you have the resource ID from getVenueWithResources.
   */
  async getAvailabilityById(options: {
    resourceId: number;
    startDate: Date;
    endDate: Date;
  }): Promise<AvailabilityResponse> {
    return this.request<AvailabilityResponse>({
      method: 'GET',
      path: `/resources/${options.resourceId}/availability/`,
      queryParams: {
        start_date: this.formatDate(options.startDate),
        end_date: this.formatDate(options.endDate),
      },
    });
  }

  /**
   * Get availability for a resource by external ID.
   */
  async getAvailability(options: {
    resourceExternalId: string;
    startDate: Date;
    endDate: Date;
  }): Promise<AvailabilityResponse> {
    return this.request<AvailabilityResponse>({
      method: 'GET',
      path: '/resources/availability/',
      queryParams: {
        resource_external_id: options.resourceExternalId,
        start_date: this.formatDate(options.startDate),
        end_date: this.formatDate(options.endDate),
      },
    });
  }

  // ============ Booking API ============

  /**
   * Create a new booking (pending status).
   *
   * The timezone parameter should be the IANA timezone identifier
   * (e.g., "Europe/Berlin") from the venue's AvailabilityResponse.
   * The startDatetime and endDatetime are interpreted as local times
   * in that timezone and sent to the API with the appropriate offset.
   */
  async createBooking(options: CreateBookingOptions): Promise<Booking> {
    return this.request<Booking>({
      method: 'POST',
      path: '/bookings/',
      headers: { 'X-User-External-ID': options.userExternalId },
      data: {
        resource_external_id: options.resourceExternalId,
        start_datetime: this.formatDateTimeWithTimezone(options.startDatetime, options.timezone),
        end_datetime: this.formatDateTimeWithTimezone(options.endDatetime, options.timezone),
        participant_count: options.participantCount ?? 1,
        notes: options.notes ?? '',
      },
    });
  }

  /**
   * Get booking details.
   */
  async getBooking(bookingId: number | string, userExternalId?: string): Promise<Booking> {
    return this.request<Booking>({
      method: 'GET',
      path: `/bookings/${bookingId}/`,
      headers: userExternalId ? { 'X-User-External-ID': userExternalId } : undefined,
    });
  }

  /**
   * List bookings.
   */
  async listBookings(options?: {
    status?: string;
    upcomingOnly?: boolean;
  }): Promise<Booking[]> {
    const queryParams: Record<string, string> = {};
    if (options?.status) queryParams.status = options.status;
    if (options?.upcomingOnly) queryParams.upcoming = 'true';

    const response = await this.request<Booking[] | PaginatedResponse<Booking>>({
      method: 'GET',
      path: '/bookings/',
      queryParams,
    });

    if (Array.isArray(response)) {
      return response;
    }
    return response.results ?? [];
  }

  /**
   * Create Stripe PaymentIntent for booking.
   */
  async createPaymentIntent(options: {
    bookingId: number;
    userExternalId: string;
  }): Promise<PaymentIntent> {
    return this.request<PaymentIntent>({
      method: 'POST',
      path: `/bookings/${options.bookingId}/create-payment-intent/`,
      headers: { 'X-User-External-ID': options.userExternalId },
    });
  }

  /**
   * Cancel a booking.
   */
  async cancelBooking(options: {
    bookingId: number;
    userExternalId: string;
    reason?: string;
    notes?: string;
  }): Promise<Booking> {
    return this.request<Booking>({
      method: 'POST',
      path: `/bookings/${options.bookingId}/cancel/`,
      headers: { 'X-User-External-ID': options.userExternalId },
      data: {
        reason: options.reason ?? 'user_request',
        notes: options.notes ?? '',
      },
    });
  }

  // ============ Private Methods ============

  private async request<T>(options: RequestOptions): Promise<T> {
    const url = new URL(`${this.baseApiUrl}${options.path}`);

    if (options.queryParams) {
      Object.entries(options.queryParams).forEach(([key, value]) => {
        url.searchParams.append(key, value);
      });
    }

    const headers: Record<string, string> = {
      Authorization: `Token ${this.config.apiToken}`,
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...options.headers,
    };

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.config.timeoutMs);

    try {
      const response = await fetch(url.toString(), {
        method: options.method,
        headers,
        body: options.data ? JSON.stringify(options.data) : undefined,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw this.handleError(response.status, data);
      }

      return (await response.json()) as T;
    } catch (error) {
      clearTimeout(timeoutId);

      if (error instanceof MatchEngineError) {
        throw error;
      }

      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new MatchEngineError('Request timeout', { statusCode: 408 });
        }
        throw new MatchEngineError(error.message);
      }

      throw new MatchEngineError('Unknown error');
    }
  }

  private handleError(
    statusCode: number,
    data: Record<string, unknown>
  ): MatchEngineError {
    let message = 'Unknown error';

    if (typeof data.error === 'string') {
      message = data.error;
    } else if (typeof data.detail === 'string') {
      message = data.detail;
    } else if (Array.isArray(data.non_field_errors) && data.non_field_errors.length > 0) {
      message = String(data.non_field_errors[0]);
    } else if (typeof data === 'object') {
      message = JSON.stringify(data);
    }

    switch (statusCode) {
      case 401:
        return new AuthenticationError(message);
      case 404:
        return new NotFoundError(message);
      case 400:
        if (message.toLowerCase().includes('not available')) {
          return new SlotNotAvailableError(message);
        }
        if (
          message.toLowerCase().includes('user') &&
          message.toLowerCase().includes('not found')
        ) {
          return new UserNotFoundError(message);
        }
        return new ValidationError(message, { responseData: data });
      default:
        return new MatchEngineError(message, { statusCode, responseData: data });
    }
  }

  private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  /**
   * Formats a DateTime with timezone offset in ISO 8601 format.
   * Example: "2025-01-15T10:00:00+01:00"
   *
   * This implementation uses the Intl API to get the timezone offset.
   * For more accurate timezone handling, install the optional `luxon` peer dependency.
   */
  private formatDateTimeWithTimezone(date: Date, timezone: string): string {
    // Try to use luxon if available for accurate timezone handling
    try {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const { DateTime } = require('luxon') as typeof import('luxon');
      const dt = DateTime.fromJSDate(date, { zone: timezone });
      return dt.toISO({ suppressMilliseconds: true }) ?? this.fallbackFormatDateTime(date, timezone);
    } catch {
      // Fall back to Intl API
      return this.fallbackFormatDateTime(date, timezone);
    }
  }

  private fallbackFormatDateTime(date: Date, timezone: string): string {
    // Use Intl to format in the target timezone
    const formatter = new Intl.DateTimeFormat('en-CA', {
      timeZone: timezone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    });

    const parts = formatter.formatToParts(date);
    const getPart = (type: string) => parts.find((p) => p.type === type)?.value ?? '00';

    const year = getPart('year');
    const month = getPart('month');
    const day = getPart('day');
    const hour = getPart('hour');
    const minute = getPart('minute');
    const second = getPart('second');

    // Get timezone offset
    const offsetFormatter = new Intl.DateTimeFormat('en', {
      timeZone: timezone,
      timeZoneName: 'shortOffset',
    });
    const offsetParts = offsetFormatter.formatToParts(date);
    const offsetStr = offsetParts.find((p) => p.type === 'timeZoneName')?.value ?? '+00:00';

    // Convert offset like "GMT+1" to "+01:00"
    const offsetMatch = offsetStr.match(/GMT([+-]?)(\d+)?(?::(\d+))?/);
    let formattedOffset = '+00:00';
    if (offsetMatch) {
      const sign = offsetMatch[1] || '+';
      const hours = (offsetMatch[2] || '0').padStart(2, '0');
      const minutes = (offsetMatch[3] || '0').padStart(2, '0');
      formattedOffset = `${sign}${hours}:${minutes}`;
    }

    return `${year}-${month}-${day}T${hour}:${minute}:${second}${formattedOffset}`;
  }
}
