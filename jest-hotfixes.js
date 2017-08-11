// needed until https://github.com/facebook/jest/issues/2059 is resolved.
// taken from https://github.com/facebook/jest/issues/2059#issuecomment-263611085

/**
 * In async tests, JEST will die (in watch mode) if an exception is thrown from a callback. This utility will catch
 * the errors instead and report the test as failed in these case *
 *
 * @param {jest.DoneCallback} done
 * @param {T} callback
 * @returns {T}
 */
export function catchErrors(done, callback) {
  return function() {
    try {
      callback.apply(this, arguments)
    } catch (e) {
      done.fail(e)
    }
  }
}
