import {apiResponse} from "@cuple/server";

export const unauthorizedError = <T>(data: T) =>
  apiResponse("unauthorized-error", 403, {
    message: "Unauthorized.",
    ...data,
  });
