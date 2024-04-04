import { useEffect, useMemo, useState } from 'react';
import { getLatestTimeValue, getTimeUntilRecClose } from '~/util';

export const RecClosingTime: React.FC = () => {
    let untilClose = useMemo(() => Math.trunc(getTimeUntilRecClose('SRC') / 1000), []);
    
    const [timer, setTimer] = useState<number>(untilClose);

    // make a countdown timer until close
    useEffect(() => {
        let timer = setInterval(() => {
            setTimer(prev => prev ? prev - 1 : untilClose);
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    if (timer <= 0) return (
        <p suppressHydrationWarning className="max-w-[500px] text-center tracking-tight text-2xl sm:text-2xl">
            Currently closed
        </p>
    )

    return (
        <p suppressHydrationWarning className="max-w-[500px] text-center tracking-tight text-2xl sm:text-2xl">
            Closes in {getLatestTimeValue(timer * 1000, 3)}
        </p>
    );
}