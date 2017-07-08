export class EmptyQueue extends Error {
  constructor(message) {
    super(message);
    this.name = 'EmptyQueue';
    this.message = 'There is no job to process.';
    this.statusCode = 200;
  }
}
