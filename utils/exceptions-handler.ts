import { ValidationError } from "class-validator";
import BaseHttpException from "exceptions/BaseHttpException";

function handleExceptinsArray(errors: unknown[]) {
  function handleError(error: unknown) {
    if (error instanceof ValidationError) {
      return Object.values(error.constraints).map(formatMessages);
    }
    if (typeof error === "object" && "message" in error) {
      return [{ message: error.message as string }];
    }
    return { message: "Algo de errado não pode estar certo" };
  }
  function formatMessages(message: string) {
    return { message };
  }

  const formatedErrors = errors.flatMap(handleError);

  return formatedErrors;
}

function handleException(error: unknown) {
  if (Array.isArray(error)) {
    const messages = handleExceptinsArray(error);
    return messages;
  }
  if (typeof error === "object" && "message" in error) {
    return [{ message: error.message }];
  }
  return [{ message: error }];
}

function isValidationError(error: unknown) {
  return error instanceof ValidationError;
}

function isValidationErrorArray(error: unknown) {
  return Array.isArray(error) && error.every(isValidationError);
}

function isHttpException(error: unknown) {
  return error instanceof BaseHttpException;
}

function isHttpExceptionArray(error: unknown) {
  return Array.isArray(error) && error.every(isHttpException);
}

function handleStatusCode(error: unknown): number {
  const isValidationException =
    isValidationErrorArray(error) || isValidationError(error);
  const isHttpExceptionError =
    isHttpException(error) || isHttpExceptionArray(error);

  if (isValidationException) {
    return 400;
  }
  if (isHttpExceptionError) {
    return isHttpExceptionArray(error) ? error.at(0).status : error.status;
  }

  return 500;
}

const exceptionHandler = {
  handleException,
  handleStatusCode,
};

export default exceptionHandler;
