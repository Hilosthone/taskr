import { NextResponse } from "next/server"; // Or Express res.status().json()
import { ZodError } from "zod";
import { ApiError } from "./api-error";

export function handleApiError(error: unknown) {
  // 1. Known operational ApiError
  if (error instanceof ApiError) {
    return NextResponse.json(error.toResponse(), { status: error.statusCode });
  }

  // 2. Schema Validation Errors (Zod integration)
  if (error instanceof ZodError) {
    const fieldErrors = error.issues.map((issue) => ({
      field: issue.path.join("."),
      message: issue.message,
    }));

    const apiError = ApiError.unprocessableEntity("Validation failed", fieldErrors);
    return NextResponse.json(apiError.toResponse(), { status: apiError.statusCode });
  }

  // 3. Fallback for unhandled/unexpected system errors (DB failure, null pointers, etc.)
  console.error("[Unhandled API Error]:", error);
  
  const fallbackError = ApiError.internal();
  return NextResponse.json(fallbackError.toResponse(), { status: 500 });
}