export class HttpError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.name = "HttpError";
    this.status = status;
  }
}

export class UnauthorizedError extends HttpError {
  constructor(message = "Unauthorized") {
    super(401, message);
    this.name = "UnauthorizedError";
  }
}

export class UploadConfigError extends HttpError {
  constructor(message: string) {
    super(400, message);
    this.name = "UploadConfigError";
  }
}

export class RateLimitError extends HttpError {
  retryAfterSeconds: number;
  constructor(retryAfterSeconds: number) {
    super(429, "Terlalu banyak percobaan. Tunggu sebentar lalu coba lagi.");
    this.name = "RateLimitError";
    this.retryAfterSeconds = retryAfterSeconds;
  }
}