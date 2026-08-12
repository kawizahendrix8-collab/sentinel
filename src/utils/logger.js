function log(level, message, meta) {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] [${level.toUpperCase()}] ${message}`, meta || "");
}

module.exports = {
  info: (message, meta) => log("info", message, meta),
  error: (message, meta) => log("error", message, meta),
  warn: (message, meta) => log("warn", message, meta)
};