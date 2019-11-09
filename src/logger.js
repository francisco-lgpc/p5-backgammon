class Logger {
  static log(...args) {
    if (DEBUG) {
      console.log(...args)
    }
  }
}
