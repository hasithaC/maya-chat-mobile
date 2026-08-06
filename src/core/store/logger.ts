import type {StateCreator, StoreMutatorIdentifier} from 'zustand';

type Logger = <
  T,
  Mps extends [StoreMutatorIdentifier, unknown][] = [],
  Mcs extends [StoreMutatorIdentifier, unknown][] = [],
>(
  f: StateCreator<T, Mps, Mcs>,
  name?: string,
) => StateCreator<T, Mps, Mcs>;

type LoggerImpl = <T>(
  f: StateCreator<T, [], []>,
  name?: string,
) => StateCreator<T, [], []>;

const loggerImpl: LoggerImpl = (f, name) => (set, get, store) => {
  const loggedSet = ((...args: unknown[]) => {
    const prevState = get();
    (set as (...args: unknown[]) => void)(...args);

    if (__DEV__) {
      console.group(`[zustand] ${name ?? 'store'}`);
      console.log('prev state', prevState);
      console.log('next state', get());
      console.groupEnd();
    }
  }) as typeof set;

  return f(loggedSet, get, store);
};

export const logger = loggerImpl as unknown as Logger;
