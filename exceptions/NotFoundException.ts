import BaseHttpException from "./BaseHttpException";

export default class NotfFoundException extends BaseHttpException {
  public readonly _status = 404;

  constructor(resourceName: string, gender: "F" | "M" = "M") {
    super(`${resourceName} não encontrad${gender === "M" ? "o" : "a"}`);
  }
}
