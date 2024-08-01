export default class BadRequestException extends Error {
  public readonly status = 400;
}
