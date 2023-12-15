import  {  useEffect, useRef } from 'react';



interface IUseInterval {
    (callback: () => void, interval: number | null): void;
  }
  
  const useInterval: IUseInterval = (callback, interval) => {
    const savedCallback = useRef<(() => void) | null>(null);
    useEffect(() => {
      savedCallback.current = callback;
    });
  
    useEffect(() => {
      function tick() {
        if (savedCallback.current) {
          savedCallback.current();
        }
      }
  
      if (interval !== null) {
        let id = setInterval(tick, interval);
        return () => clearInterval(id);
      }
    }, [interval]);
  };

  export default useInterval

  