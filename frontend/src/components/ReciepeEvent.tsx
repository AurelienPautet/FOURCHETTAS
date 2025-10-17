import type Item from "../types/ItemType";
import type Event from "../types/EventType";
import type Type from "../types/TypeType";

interface ReciepeEventProps {
  event: Event;
  name: string;
  firstName: string;
  phone: string;
  types: Type[];
  orderedItems: Item[];
  onClick: () => void;
  ordering: boolean;
}

function ReciepeEvent({
  event,
  name,
  firstName,
  types,
  orderedItems,
  onClick,
  ordering,
}: ReciepeEventProps) {
  let totalPrice = 0;
  orderedItems.forEach((item) => {
    if (item.ordered_quantity) totalPrice += item.price * item.ordered_quantity;
  });

  return (
    <div className="flex w-full justify-center items-center flex-col gap-4 md:gap-1">
      <h1 className="mb-3 w-full text-center text-3xl font-bold">
        Résumé de ta commande pour{" "}
        <span className="font-extrabold animate-bounce animate-infinite animate-duration-1000 animate-ease-linear animate-normal">
          {event.title}
        </span>
      </h1>
      <fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-xs border p-4">
        <h2 className="text-xl w-full text-center">
          Commande de {firstName} {name}
        </h2>
        <div className="overflow-x-auto r">
          <table className="table">
            <thead>
              <tr>
                <th>Article</th>
                <th>Quantité</th>
                <th>Prix</th>
              </tr>
            </thead>
            <tbody>
              {orderedItems.map((dish) => (
                <tr key={dish.id}>
                  <td>{dish?.name}</td>
                  <td>
                    {dish?.ordered_quantity
                      ? dish.ordered_quantity * dish.quantity
                      : 0}
                  </td>
                  <td>
                    {dish?.ordered_quantity &&
                      dish?.price * dish.ordered_quantity}{" "}
                    €
                  </td>
                </tr>
              ))}

              <tr className="font-bold h-full">
                <td>TOTAL</td>
                <td></td>
                <td>{totalPrice} €</td>
              </tr>
            </tbody>
          </table>
        </div>
      </fieldset>

      <button
        onClick={onClick}
        className={`btn btn-accent ${
          ordering ? "btn-disabled" : ""
        } font-extrabold text-accent-content hover:bg-accent-focus`}
      >
        Confirmer la commande
      </button>

      {ordering && <span className="loading loading-spinner loading-lg"></span>}
    </div>
  );
}

export default ReciepeEvent;
