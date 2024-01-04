/**
 * CustomError class extends the built-in Error class to create custom error instances
 * with an associated status code.
 *
 * @class CustomError
 * @extends Error
 * @param {string} message - The error message (default: 'Something went wrong').
 * @param {number} code - The HTTP status code associated with the error (default: 500).
 * @property {number} statusCode - The HTTP status code associated with the error.
 * @example
 * const error = new CustomError('Custom error message', 404);
 * console.log(error.statusCode); // Output: 404
 */
class CustomError extends Error {
  statusCode: number;

  /**
   * Creates a new instance of the CustomError class.
   *
   * @constructor
   * @param {string} [message='Something went wrong'] - The error message.
   * @param {number} [code=500] - The HTTP status code associated with the error.
   * @property {number} statusCode - The HTTP status code associated with the error.
   * @example
   * const error = new CustomError('Custom error message', 404);
   * console.log(error.statusCode); // Output: 404
   */
  constructor(message?: string, code?: number) {
    super(message || 'Something went wrong');
    this.statusCode = code || 500;
  }
}

export default CustomError;
