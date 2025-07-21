import { useNavigate } from "react-router-dom";

import type EventCardChildren from "../types/EventCardChildren";

function UserEventCardChildren({ event, secondsLeft }: EventCardChildren) {
  const navigate = useNavigate();
  if (secondsLeft === undefined) {
    console.error(
      "UserEventCardChildren was passed with an undefined secondsLeft"
    );
    return <></>;
  }
  return (
    <>
      <div className="indicator">
        {secondsLeft < 60 * 60 * 12 && (
          <span className="indicator-item badge badge-warning">
            {secondsLeft <= 0 ? "Trop tard :(" : "Vite !"}
          </span>
        )}

        <button
          className={`btn btn-accent md:ml-auto ${
            secondsLeft <= 0 ? "btn-disabled" : ""
          }`}
          onClick={() => navigate("/event/" + event.id + "/order")}
        >
          Commander {event.title} !!!
        </button>
      </div>
    </>
  );
}

export default UserEventCardChildren;
