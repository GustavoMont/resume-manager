import BaseHttpException from "./BaseHttpException";

export default class BadRequestException extends BaseHttpException {
  public readonly _status = 400;
}
