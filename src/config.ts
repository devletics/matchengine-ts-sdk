/**
 * Configuration for the MatchEngine API client.
 */
export interface MatchEngineConfig {
  /** Base URL of the MatchEngine API. */
  baseUrl: string;

  /** Client API token for authentication. */
  apiToken: string;

  /** Stripe publishable key for payment processing. */
  stripePublishableKey: string;

  /** Request timeout in milliseconds. */
  timeoutMs?: number;
}

/**
 * Create config with defaults applied.
 */
export function createConfig(config: MatchEngineConfig): Required<MatchEngineConfig> {
  const baseUrl = config.baseUrl.endsWith('/')
    ? config.baseUrl.slice(0, -1)
    : config.baseUrl;

  return {
    baseUrl,
    apiToken: config.apiToken,
    stripePublishableKey: config.stripePublishableKey,
    timeoutMs: config.timeoutMs ?? 30000,
  };
}
