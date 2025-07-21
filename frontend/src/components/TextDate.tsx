import correctDate from "../utils/DateCorrector";
function TextDate(date: string | undefined, time: string | undefined) {
  if (!date || !time) {
    return <span className="font-bold">Date indisponible</span>;
  }
  //console.log("TextDate called with date:", date, "and time:", time);
  let correctedDate = correctDate(date || "2025-02-09");
  let splitDate = correctedDate.split("-") || ["", "", ""];
  return (
    <>
      {" "}
      <span className="font-bold">
        {splitDate[2]}/{splitDate[1]}/{splitDate[0]}
      </span>{" "}
      à <span className="font-bold">{time}</span>
    </>
  );
}

export default TextDate;
