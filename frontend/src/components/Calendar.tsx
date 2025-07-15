function Calendar({
  eventDate,
  setEventDate,
  isOrderClosingDateValid,
}: {
  eventDate: string;
  setEventDate: (date: string) => void;
  isOrderClosingDateValid: (date: Date) => boolean;
}) {
  return (
    <>
      <calendar-date
        value={eventDate}
        className="cally"
        isDateDisallowed={(date: Date) => !isOrderClosingDateValid(date)}
        onchange={(event) =>
          setEventDate((event.target as HTMLInputElement).value)
        }
      >
        <svg
          aria-label="Previous"
          className="fill-current size-4"
          slot="previous"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          {...({} as any)}
        >
          <path d="M15.75 19.5 8.25 12l7.5-7.5"></path>
        </svg>
        <svg
          aria-label="Next"
          className="fill-current size-4"
          slot="next"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          {...({} as any)}
        >
          <path d="m8.25 4.5 7.5 7.5-7.5 7.5"></path>
        </svg>
        <calendar-month></calendar-month>
      </calendar-date>
    </>
  );
}

export default Calendar;
