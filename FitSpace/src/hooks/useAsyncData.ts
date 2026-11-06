import { useCallback, useEffect, useState } from 'react';

export type AsyncState<T> =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'success'; data: T };

export function useAsyncData<T>(fetcher: () => Promise<T>) {
  const [state, setState] = useState<AsyncState<T>>({ status: 'loading' });
  const [requestCount, setRequestCount] = useState(0);

  useEffect(() => {
    let ignoreResult = false;

    fetcher()
      .then((data) => {
        if (!ignoreResult) setState({ status: 'success', data });
      })
      .catch((error: unknown) => {
        if (!ignoreResult) {
          setState({
            status: 'error',
            message: error instanceof Error ? error.message : 'Something went wrong. Please try again.',
          });
        }
      });

    // If the page changes before the answer arrives, the old answer is ignored
    return () => {
      ignoreResult = true;
    };
  }, [fetcher, requestCount]);

  // Shows the spinner again and fetches (used by the "Try again" button)
  const reload = useCallback(() => {
    setState({ status: 'loading' });
    setRequestCount((count) => count + 1);
  }, []);

  // Fetches again quietly, keeping the old data on screen (used after a booking)
  const refresh = useCallback(() => setRequestCount((count) => count + 1), []);

  return { state, reload, refresh };
}