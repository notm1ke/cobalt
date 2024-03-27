import { useEffect } from 'react';

export const useClickBoundary = (ref: any, handler: () => void) => 
    useEffect(() => {
        const handleOutside = (event: any) => {
            if (!ref.current)
                return;
            !ref.current.contains(event.target) && handler();
        }

        document.addEventListener('mousedown', handleOutside, true);
        return () => document.removeEventListener('mousedown', handleOutside, true);
    }, [ref]);