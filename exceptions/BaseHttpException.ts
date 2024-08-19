export default class BaseHttpException extends Error {
  protected readonly _status: number;

  constructor(message: string) {
    super(message);
  }

  get status() {
    return this._status;
  }
}
