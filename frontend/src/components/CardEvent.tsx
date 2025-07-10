import Countdown from "./Countdown";
import type { ReactNode } from "react";

interface CardEventProps {
  title: string;
  description: string;
  date: string;
  time: string;
  form_closing_date: string;
  form_closing_time: string;
  imgSrc: string;
  loading: boolean;
  children?: ReactNode;
}

function CardEvent({
  title,
  description,
  date,
  time,
  form_closing_date,
  form_closing_time,
  imgSrc,
  loading,
  children,
}: CardEventProps) {
  const splitDate = date.split("-");

  return (
    <div className="rounded-2xl flex flex-col md:flex-row h-[30rem] w-full md:w-2/3  bg-base-200 shadow-sm p-6 justify-center items-center">
      <div className="md:w-1/3 md:h-full w-full h-1/2 flex justify-center items-center overflow-hidden">
        {loading ? (
          <div className="skeleton  h-48 w-24 md:h-1/2 md:w-2/3"></div>
        ) : (
          <img className="object-contain h-full w-full" src={imgSrc} />
        )}
      </div>
      <div className="h-full w-full flex flex-col justify-between items-start p-4 gap-2 text-lg font-normal">
        <>
          {loading ? (
            <>
              <div className="skeleton h-12 w-full"></div>
              <div className="w-full flex flex-col gap-2">
                <div className="skeleton h-6 w-full"> </div>
                <div className="skeleton h-6 w-full"></div>
                <div className="skeleton h-6 w-1/2"></div>
              </div>

              <div className="skeleton h-8 w-1/2"></div>
            </>
          ) : (
            <>
              <h1 className=" text-4xl font-bold">{title}</h1>

              <p>{description}</p>
              <p>
                Le {splitDate[2]}/{splitDate[1]}/{splitDate[0]} à {time}
              </p>
            </>
          )}
          <div className="mt-5 md:mt-0 flex flex-col md:flex-row items-center justify-between w-full gap-4">
            <div className="">
              {loading ? (
                <div className="skeleton h-6 w-2/3"></div>
              ) : (
                <p>Fin des commandes dans :</p>
              )}
              <Countdown
                date={form_closing_date}
                time={form_closing_time}
                loading={loading}
              />
            </div>
            {loading ? (
              <div className="skeleton h-12 w-1/4"></div>
            ) : children ? (
              children
            ) : (
              <></>
            )}
          </div>
        </>
      </div>
    </div>
  );
}

export default CardEvent;
