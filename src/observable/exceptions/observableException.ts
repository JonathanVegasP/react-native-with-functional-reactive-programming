class ObservableException extends Error {
  constructor(close = false, cannotUpdate = false) {
    if (cannotUpdate) {
      super(
        'Was not detected any Observables inside this React component/Reactive function',
      );
    } else {
      super(
        `You cannot ${close ? 'close' : 'add events to'} a closed Observable`,
      );
    }
    this.name = 'ObservableException';
  }
}

export { ObservableException };
