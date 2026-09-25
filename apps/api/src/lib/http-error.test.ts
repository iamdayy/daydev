import { describe, expect, test } from "bun:test";
import { HttpError, RateLimitError, UnauthorizedError } from "./http-error";

describe("HttpError", () => {
  test("carries an explicit status code", () => {
    const error = new HttpError(404, "Tidak ditemukan.");
    expect(error.status).toBe(404);
    expect(error.name).toBe("HttpError");
    expect(error.message).toBe("Tidak ditemukan.");
  });

  test("UnauthorizedError defaults to 401", () => {
    const error = new UnauthorizedError();
    expect(error.status).toBe(401);
    expect(error).toBeInstanceOf(HttpError);
  });

  test("RateLimitError exposes retry window and 429", () => {
    const error = new RateLimitError(15);
    expect(error.status).toBe(429);
    expect(error.retryAfterSeconds).toBe(15);
  });
});