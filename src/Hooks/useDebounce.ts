import React from 'react';

const debounceImpl = (cb:Function, delay:number) => {
    let timeout: NodeJS.Timeout;
    return (...args:any) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => cb(...args), delay);
    };
  };

export function useDebounce(cb:Function, delay:number) {
    const inputsRef = React.useRef({cb, delay});
    React.useEffect(() => { inputsRef.current = { cb, delay }; });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    return React.useCallback(
      debounceImpl((...args:any) => {
          if (inputsRef.current.delay === delay)
            inputsRef.current.cb(...args);
        }, delay
      ),
      [delay]
    );
  }