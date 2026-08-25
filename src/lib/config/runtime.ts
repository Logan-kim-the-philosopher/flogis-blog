export function getRuntimeSiteUrl(fallback: URL | string) {
  const configuredUrl = process.env.PUBLIC_SITE_URL?.trim();

  try {
    return new URL(configuredUrl || fallback);
  } catch {
    console.warn('PUBLIC_SITE_URL is invalid. Falling back to the request origin.');
    return new URL(fallback);
  }
}
