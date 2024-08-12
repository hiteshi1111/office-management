import React, { useState, useEffect } from 'react';
import { MdNotStarted, MdStopCircle  } from "react-icons/md";
import { TbRefresh } from "react-icons/tb";

const Timer = () => {
    const [time, setTime] = useState({ hours: 0, minutes: 0, seconds: 0 });
    const [isActive, setIsActive] = useState(false);

    useEffect(() => {
        let interval;
        if (isActive) {
        interval = setInterval(() => {
            setTime((prevTime) => {
                const newSeconds = prevTime.seconds + 1;
                if (newSeconds === 60) {
                    const newMinutes = prevTime.minutes + 1;
                    if (newMinutes === 60) {
                        const newHours = prevTime.hours + 1;
                        return { hours: newHours, minutes: 0, seconds: 0 };
                    }
                    return { ...prevTime, minutes: newMinutes, seconds: 0 };
                }
                return { ...prevTime, seconds: newSeconds };
            });
        }, 1000);
        } else {
            clearInterval(interval);
        }

        return () => clearInterval(interval);
    }, [isActive]);

    const handleStartStop = () => {
        setIsActive((prevIsActive) => !prevIsActive);
    };

    const handleReset = () => {
        setTime({ hours: 0, minutes: 0, seconds: 0 });
        setIsActive(false);
    };

    return (
        <div className='flex items-center gap-[5px]'>
            <button onClick={handleStartStop}>{isActive ? <MdStopCircle size={20} color='#ff0000' /> : <MdNotStarted size={20} color='#008000' />}</button>
            <div>{`${time.hours.toString().padStart(2, '0')}:${time.minutes.toString().padStart(2, '0')}:${time.seconds.toString().padStart(2, '0')}`}</div>
            <button onClick={handleReset}>
                <TbRefresh size={15} />
            </button>
        </div>
    );
};

export default Timer;