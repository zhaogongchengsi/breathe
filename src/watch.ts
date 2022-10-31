export function resolveWatchOptions(options?: any) {
  const { ignored = [], ...otherOptions } = options ?? {};

  const resolvedWatchOptions = {
    ignored: [
      "**/.git/**",
      "**/node_modules/**",
      "**/test-results/**", // Playwright
      ...(Array.isArray(ignored) ? ignored : [ignored]),
    ],
    ignoreInitial: true,
    ignorePermissionErrors: true,
    ...otherOptions,
  };

  return resolvedWatchOptions;
}
