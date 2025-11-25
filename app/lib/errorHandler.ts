import { NextResponse } from "next/server";
import { logger } from "./logger";
import {
  AppError,
  // ValidationError,
  // NotFoundError,
  // AuthenticationError,
  // AuthorizationError,
  // DatabaseError,
} from "./customErrors";

export function handleError(error: any, context: string) {
  const isProd = process.env.NODE_ENV === "production";

  // Determine if it's a known AppError or unexpected error
  let statusCode = 500;
  let message = "Something went wrong";
  let code = "INTERNAL_ERROR";
  let details = undefined;

  if (error instanceof AppError) {
    statusCode = error.statusCode;
    message = error.message;
    code = error.code;
    details = error.details;
  } else if (error instanceof Error) {
    message = error.message;
  }

  // Prepare error response for client
  const errorResponse: any = {
    success: false,
    message:
      isProd && statusCode >= 500
        ? "Something went wrong. Please try again later."
        : message,
    error: {
      code,
      ...(details && { details }),
    },
    timestamp: new Date().toISOString(),
  };

  // Add stack trace only in development
  if (!isProd && error.stack) {
    errorResponse.stack = error.stack;
  }

  // Structured logging
  logger.error(`Error in ${context}`, {
    errorName: error.name,
    message: error.message,
    statusCode,
    code,
    stack: isProd ? "REDACTED" : error.stack,
    details,
    userAgent: context.includes("api") ? "API" : "Page",
    timestamp: new Date().toISOString(),
  });

  return NextResponse.json(errorResponse, { status: statusCode });
}

// Utility function to wrap API handlers with error handling
export function withErrorHandler(handler: Function, context: string) {
  return async (...args: any[]) => {
    try {
      return await handler(...args);
    } catch (error) {
      return handleError(error, context);
    }
  };
}
