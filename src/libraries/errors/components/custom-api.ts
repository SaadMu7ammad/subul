class CustomAPIError extends Error {
  statusCode: number;
  constructor(message: string) {
    console.log('CustomAPIError');
    super(message);
    this.statusCode = 500;
  }
}

export { CustomAPIError };
