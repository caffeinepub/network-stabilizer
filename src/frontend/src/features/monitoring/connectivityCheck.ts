export interface ConnectivityCheckResult {
  latency: number | null;
  success: boolean;
  errorCategory?: string;
  errorMessage?: string;
}

export async function performConnectivityCheck(
  timeoutMs: number = 5000
): Promise<ConnectivityCheckResult> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const startTime = performance.now();
    
    // Use a lightweight endpoint that's likely to respond quickly
    const response = await fetch('https://www.google.com/favicon.ico', {
      method: 'HEAD',
      mode: 'no-cors',
      signal: controller.signal,
      cache: 'no-store',
    });

    const endTime = performance.now();
    const latency = Math.round(endTime - startTime);

    clearTimeout(timeoutId);

    return {
      latency,
      success: true,
    };
  } catch (error) {
    clearTimeout(timeoutId);

    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        return {
          latency: null,
          success: false,
          errorCategory: 'Timeout',
          errorMessage: `Request timed out after ${timeoutMs}ms`,
        };
      }

      return {
        latency: null,
        success: false,
        errorCategory: 'Network Error',
        errorMessage: error.message,
      };
    }

    return {
      latency: null,
      success: false,
      errorCategory: 'Unknown Error',
      errorMessage: 'An unknown error occurred',
    };
  }
}
