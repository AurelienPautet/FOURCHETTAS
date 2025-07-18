import type Event from "../types/EventType";
import { useNavigate } from "react-router-dom";
import BinWithModal from "./BinWithModal";
import DeleteModal from "./DeleteModal";
import correctDate from "../utils/DateCorrector";

import type EventCardChildren from "../types/EventCardChildren";

function AdminEventCardChildren({ event, onDelete }: EventCardChildren) {
  const navigate = useNavigate();
  if (onDelete === undefined) {
    console.error(
      "AdminEventCardChildren was passed with and undefined onDelete"
    );
    return <></>;
  }
  return (
    <>
      <div>
        <button
          className={`btn btn-accent md:ml-auto `}
          onClick={() => navigate("/admin/event/" + event.id + "/orders")}
        >
          Statistique
        </button>
        <button
          className={`btn btn-accent md:ml-auto `}
          onClick={() => navigate("/admin/event/" + event.id + "/modify")}
        >
          Modifier
        </button>

        <BinWithModal
          id={"delete_item_" + event.id}
          className={`w-10 h-10 ${event.deleting ? "opacity-15" : ""}`}
        />
        <DeleteModal
          id={"delete_item_" + event.id}
          title="Supprimer l'élément ?"
          description={`Vous êtes sur le point de supprimer 
                l'evenement ${event.title} du ${correctDate(event.date)} à ${
            event.time
          }. Cette action est irréversible.`}
          onDelete={() => {
            onDelete(event);
          }}
        />
      </div>
    </>
  );
}

export default AdminEventCardChildren;
