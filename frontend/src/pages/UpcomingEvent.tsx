import CardEvent from "../components/CardEvent";
import api_url from "../api_url";
import { useEffect, useState } from "react";
import correctDate from "../utils/DateCorrector";
import { useNavigate } from "react-router-dom";
import SecondsBetweenNowAndDates from "../utils/SecondsBetweenNowAndDates";

function UpcomingEvents() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState([
    {
      id: 0,
      title: "",
      description: "",
      date: "2025-02-09T22:00:00.000Z",
      time: "",
      form_closing_date: "",
      form_closing_time: "",
      img_url: "",
    },
  ]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${api_url}/api/events/upcoming`);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setEvents(data);
        setLoading(false);
        //console.log(" ca va marcher maintenant a la inshalah", data);
      } catch (error) {
        console.error("Error fetching upcoming events:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="h-full text-3xl font-bold p-4 flex flex-col items-center gap-5">
      <h1> Prochains Evenements </h1>

      {events.length > 0 ? (
        events.map((event) => {
          let secondsLeft = SecondsBetweenNowAndDates(
            new Date(
              correctDate(event.form_closing_date) +
                "T" +
                event.form_closing_time
            )
          );
          return (
            <CardEvent
              key={event.id}
              title={event.title}
              description={event.description}
              date={correctDate(event.date)}
              time={event.time}
              form_closing_date={correctDate(event.form_closing_date)}
              form_closing_time={event.form_closing_time}
              loading={loading}
              img_url={event.img_url}
            >
              <div className="indicator">
                {secondsLeft < 60 * 60 * 12 && (
                  <span className="indicator-item badge badge-warning">
                    {secondsLeft <= 0 ? "Trop tard :(" : "Vite !"}
                  </span>
                )}

                <button
                  className={`btn btn-primary md:ml-auto ${
                    secondsLeft <= 0 ? "btn-disabled" : ""
                  }`}
                  onClick={() => navigate("/event/" + event.id + "/order")}
                >
                  Commander {event.title} !!!
                </button>
              </div>
            </CardEvent>
          );
        })
      ) : (
        <p>Aucun événement à venir</p>
      )}
    </div>
  );
}

export default UpcomingEvents;
