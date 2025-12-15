# MatchEngine TypeScript SDK

TypeScript/JavaScript SDK for the MatchEngine booking API.

## Installation

```bash
npm install @devletics/matchengine-sdk

# Optional: for accurate timezone handling
npm install luxon
```

## Quick Start

```typescript
import { MatchEngineClient } from '@devletics/matchengine-sdk';

const client = new MatchEngineClient({
  baseUrl: 'https://api.matchengine.de',
  apiToken: 'your-api-token',
  stripePublishableKey: 'pk_test_xxx',
});

// Register a user
const user = await client.registerUser({
  externalId: 'user-123',
  email: 'user@example.com',
  firstName: 'John',
  lastName: 'Doe',
});

// Get venue with resources
const venue = await client.getVenueWithResources('venue-external-id');

// Get availability for a resource
const availability = await client.getAvailabilityById({
  resourceId: venue.resources[0].id,
  startDate: new Date(),
  endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
});

// Create a booking
const booking = await client.createBooking({
  resourceExternalId: 'resource-123',
  userExternalId: 'user-123',
  startDatetime: new Date('2025-01-15T10:00:00'),
  endDatetime: new Date('2025-01-15T11:30:00'),
  timezone: availability.timezone,
});

// Create payment intent
const paymentIntent = await client.createPaymentIntent({
  bookingId: booking.id,
  userExternalId: 'user-123',
});

// Cancel a booking
const cancelled = await client.cancelBooking({
  bookingId: booking.id,
  userExternalId: 'user-123',
  reason: 'user_request',
});
```

## API Reference

### MatchEngineClient

#### User API
- `registerUser(options)` - Register or get existing user mapping
- `lookupUser(externalId)` - Look up user by external ID

#### Resource API
- `registerResource(options)` - Register or get existing resource mapping
- `lookupResource(externalId)` - Look up resource by external ID

#### Venue API
- `registerVenue(options)` - Register or get existing venue mapping
- `lookupVenue(externalId)` - Look up venue by external ID
- `getVenueWithResources(venueExternalId)` - Get venue with all its resources

#### Availability API
- `getAvailability(options)` - Get availability by resource external ID
- `getAvailabilityById(options)` - Get availability by MatchEngine resource ID

#### Booking API
- `createBooking(options)` - Create a new booking (pending status)
- `getBooking(bookingId, userExternalId?)` - Get booking details
- `listBookings(options?)` - List bookings
- `createPaymentIntent(options)` - Create Stripe PaymentIntent for booking
- `cancelBooking(options)` - Cancel a booking

## Error Handling

```typescript
import {
  MatchEngineError,
  AuthenticationError,
  NotFoundError,
  ValidationError,
  SlotNotAvailableError,
} from '@devletics/matchengine-sdk';

try {
  const booking = await client.createBooking(/* ... */);
} catch (error) {
  if (error instanceof SlotNotAvailableError) {
    console.log('Time slot is no longer available');
  } else if (error instanceof ValidationError) {
    console.log('Validation error:', error.message);
  } else if (error instanceof AuthenticationError) {
    console.log('Invalid API token');
  } else if (error instanceof MatchEngineError) {
    console.log('API error:', error.message, error.statusCode);
  }
}
```

## Timezone Handling

The SDK handles timezones for booking creation. For accurate timezone handling across all edge cases (DST transitions, etc.), install the optional `luxon` peer dependency:

```bash
npm install luxon
```

Without `luxon`, the SDK uses the browser's `Intl` API which works for most common cases.

## License

MIT
