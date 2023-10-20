import { useEffect, useRef, useState } from 'react';

const useComponentVisible = (initialIsVisible: boolean) => {
  const [isComponentVisible, setIsComponentVisible] =
    useState(initialIsVisible);

  const ref = useRef<HTMLDivElement>(null);

  const handleClickOutside = ({ target }: MouseEvent): void => {    
    if (ref.current && !ref.current.contains(target as Node)) {
      setIsComponentVisible(false);
    }
  };

  const eventListeners = ['click', 'mousedown', 'scroll'];
  const handleEvents = (events: any[]) =>
    events.forEach(e => document.addEventListener(e, handleClickOutside, true));

  useEffect(() => {
    handleEvents(eventListeners);

    return () => {
      handleEvents(eventListeners);
    };
  }, []);

  return { ref, isComponentVisible, setIsComponentVisible };
};

export default useComponentVisible;
