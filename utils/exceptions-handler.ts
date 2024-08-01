import { ValidationError } from "class-validator";
import BadRequestException from "exceptions/BadRequestException";

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

function isBadRequestError(error: unknown) {
  return error instanceof BadRequestException;
}

function isBadRequestExceptionArray(error: unknown) {
  return Array.isArray(error) && error.every(isBadRequestError);
}

function handleStatusCode(error: unknown): number {
  const isValidationException =
    isValidationErrorArray(error) || isValidationError(error);
  const isBadRequest =
    isBadRequestError(error) || isBadRequestExceptionArray(error);

  if (isValidationException || isBadRequest) {
    return 400;
  }
  return 500;
}

const exceptionHandler = {
  handleException,
  handleStatusCode,
};

export default exceptionHandler;
