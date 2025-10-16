export const loggingMiddleware = (req, res, next) => {
  console.log("🌐 Hostname:", req.hostname);
  console.log("📁 Path:", req.path);
  console.log("📝 Method:", req.method);
  next();
};

export const nextMiddleware = (req, res, next) => {
  console.log("➡️ In the next middleware");
  next();
};