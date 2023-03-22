module.exports = {
  /**
   * Retries function 'transaction' n-1 times in case of failure.
   * Returns success immediately, or failure after n failures.
   */
  async retryTransaction(n, transact) {
    while(n > 0) {
      try {
        let returnVal = transact
        return {success: true, result: returnVal}
      } catch (error) {
        --n
      }
    }
    return {success: false, result: null}
  }
}