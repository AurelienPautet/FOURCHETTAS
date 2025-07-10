import { useState } from "react";
import { useEffect } from "react";
import SecondsBetweenNowAndDates from "../utils/SecondsBetweenNowAndDates";

interface CountdownProps {
  date: string;
  time: string;
  loading: boolean;
}

function Countdown({ date, time, loading }: CountdownProps) {
  const [daysLeft, setDaysLeft] = useState(11);
  const [hoursLeft, setHoursLeft] = useState(10);
  const [minutesLeft, setMinutesLeft] = useState(24);
  const [secondsLeft, setSecondsLeft] = useState(59);

  const [tooLate, setTooLate] = useState(false);

  useEffect(() => {
    function updateCountdown() {
      const eventDate = new Date(`${date}T${time}`);
      const totalSeconds = SecondsBetweenNowAndDates(eventDate);
      const days = Math.floor(totalSeconds / (3600 * 24));
      const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = totalSeconds % 60;
      setDaysLeft(days);
      setHoursLeft(hours);
      setMinutesLeft(minutes);
      setSecondsLeft(seconds);

      if (totalSeconds <= 0) {
        clearInterval(interval);
        setTooLate(true);
        setDaysLeft(0);
        setHoursLeft(0);
        setMinutesLeft(0);
        setSecondsLeft(0);
      }
    }

    const interval = setInterval(updateCountdown, 1000);
    updateCountdown();

    return () => clearInterval(interval);
  }, [date, time]);

  if (loading) {
    return (
      <div className="mt-1 grid grid-flow-col gap-5 text-center auto-cols-max text-lg">
        <div className="flex flex-col">
          <span className="skeleton countdown font-mono text-5xl">
            <span
              className="invisible"
              style={{ "--value": 0 } as React.CSSProperties}
            />
          </span>
          <div className="mt-1 skeleton h-5 w-18" />
        </div>
        <div className="flex flex-col">
          <span className="skeleton countdown font-mono text-5xl">
            <span
              className="invisible"
              style={{ "--value": 0 } as React.CSSProperties}
            />
          </span>
          <div className="mt-1 skeleton h-5 w-18" />
        </div>
        <div className="flex flex-col">
          <span className="skeleton countdown font-mono text-5xl">
            <span
              className="invisible"
              style={{ "--value": 0 } as React.CSSProperties}
            />
          </span>
          <div className="mt-1 skeleton h-5 w-18" />
        </div>
        <div className="flex flex-col">
          <span className="skeleton countdown font-mono text-5xl">
            <span
              className="invisible"
              style={{ "--value": 0 } as React.CSSProperties}
            />
          </span>
          <div className="mt-1 skeleton h-5 w-18" />
        </div>
      </div>
    );
  }

  return (
    <div className="indicator relative">
      {tooLate ? (
        <>
          <div className=" absolute top-1/3 left-0 w-full h-2 bg-error z-10 rotate-12 rounded-2xl "></div>
          <div className=" absolute top-1/3 left-0 w-full h-2 bg-error z-10 -rotate-12 rounded-2xl"></div>
          <div className=" hidden absolute top-1/4 left-0 w-full h-2 bg-error z-10  rounded-2xl"></div>
        </>
      ) : null}
      <div
        className={`grid grid-flow-col gap-5 text-center auto-cols-max text-lg ${
          tooLate ? "blur-[2px] " : ""
        }`}
      >
        <div className="flex flex-col">
          <span className="countdown font-mono text-5xl">
            <span
              style={{ "--value": daysLeft } as React.CSSProperties}
              aria-live="polite"
            >
              {daysLeft}
            </span>
          </span>
          jours
        </div>
        <div className="flex flex-col">
          <span className="countdown font-mono text-5xl">
            <span
              style={{ "--value": hoursLeft } as React.CSSProperties}
              aria-live="polite"
            >
              {hoursLeft}
            </span>
          </span>
          heures
        </div>
        <div className="flex flex-col">
          <span className="countdown font-mono text-5xl">
            <span
              style={{ "--value": minutesLeft } as React.CSSProperties}
              aria-live="polite"
            >
              {minutesLeft}
            </span>
          </span>
          min
        </div>
        <div className="flex flex-col">
          <span className="countdown font-mono text-5xl">
            <span
              style={{ "--value": secondsLeft } as React.CSSProperties}
              aria-live="polite"
            >
              {secondsLeft}
            </span>
          </span>
          sec
        </div>
      </div>
    </div>
  );
}

export default Countdown;
