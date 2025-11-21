import { Request, Response, NextFunction } from 'express';

export enum ErrorCode {
  Unknown = 1,
  BadRequest = 2,
  RecordNotFound = 3
};

type ErrorDetails = any; // eslint-disable-line @typescript-eslint/no-explicit-any -- error details are NOT normalized!

export class AppError extends Error {
  constructor(public readonly code: ErrorCode, public readonly message: string, public readonly details: ErrorDetails) {
    super();
  }

  toString(): string {
    return `[${this.code.toString()}], Message ${this.message}, Details: ${JSON.stringify(this.details)}`;
  }

}

export function errorHandler(err: Error, req: Request, res: Response, next: NextFunction): void {
  if (res.headersSent) {
    next(err)
    return
  }

  console.error("Handled error:", err.toString());

  if (err instanceof AppError) {
    res.status(toHTTPStatus(err.code));
    res.json({
      error: {
        code: err.code,
        message: err.message,
        details: err.details,  
      }
    });

    return
  }

  res.status(500);
  res.json({
    error: {
      code: ErrorCode.Unknown,
      message: "Something went wrong"
    }
  });
}

function toHTTPStatus(errCode: ErrorCode): number {
  switch (errCode) {
    case ErrorCode.RecordNotFound:
      return 404;
    case ErrorCode.BadRequest:
      return 400;
    default:
      return 500;
  }
}
