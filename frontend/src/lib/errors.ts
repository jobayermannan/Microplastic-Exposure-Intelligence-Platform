import { AxiosError } from "axios";

/**
 * FastAPI returns errors in two shapes:
 * 1. { detail: "some string" } - simple errors (401, 400, 404, etc.)
 * 2. { detail: [{ loc, msg, type }, ...] } - 422 validation errors
 * This normalizes both into a single readable string, so the UI never
 * tries to render an object/array directly (which crashes React).
 */
export function getErrorMessage(err: unknown, fallback = "Something went wrong. Please try again."): string {
  const axiosErr = err as AxiosError<any>;
  const detail = axiosErr?.response?.data?.detail;

  if (!detail) return fallback;
  if (typeof detail === "string") return detail;

  if (Array.isArray(detail)) {
    const messages = detail.map((item) => {
      const field = Array.isArray(item?.loc) ? item.loc[item.loc.length - 1] : "field";
      return `${field}: ${item?.msg || "invalid value"}`;
    });
    return messages.join(" · ");
  }

  return fallback;
}
