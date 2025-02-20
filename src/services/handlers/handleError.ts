export class HandleError {
  constructor(
    public error: string
  ) {}

  public execute(): string {
    return this.error;
  }
}