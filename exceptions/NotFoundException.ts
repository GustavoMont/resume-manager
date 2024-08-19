import BaseHttpException from "./BaseHttpException";

export default class NotfFoundException extends BaseHttpException {
  public readonly _status = 404;

  constructor(resourceName: string) {
    super(`${resourceName} was not found`);
  }
}
