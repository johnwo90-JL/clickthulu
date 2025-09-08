// Ensure predictable env for tests before importing app/auth modules
process.env.NODE_ENV = "test";
process.env.JWT_SECRET = "dev_secret_change_me";
process.env.USE_API_PREFIX = "false";
process.env.USE_VERSIONING = "false";
process.env.VERSION_NUMBER = "1";

// Reduce noisy logs during tests
const originalConsoleError = console.error;
const originalConsoleWarn = console.warn;
console.error = (...args) => {
  if (String(args[0] || "").includes("JWT_SECRET")) return;
  originalConsoleError(...args);
};
console.warn = (...args) => {
  if (String(args[0] || "").includes("JWT_SECRET")) return;
  originalConsoleWarn(...args);
};
