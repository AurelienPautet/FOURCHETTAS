import type Item from "../types/ItemType";
import type Event from "../types/EventType";

interface ReciepeEventProps {
  event: Event;
  name: string;
  firstName: string;
  phone: string;
  dish: Item | null;
  side: Item | null;
  drink: Item | null;
  onClick: () => void;
  ordering: boolean;
}

function ReciepeEvent({
  event,
  name,
  firstName,
  phone,
  dish,
  side,
  drink,
  onClick,
  ordering,
}: ReciepeEventProps) {
  let drinkPrice = parseFloat(drink ? drink.price.toString() : "0");
  let sidePrice = parseFloat(side ? side.price.toString() : "0");
  let dishPrice = parseFloat(dish ? dish.price.toString() : "0");
  const floatTotalPrice = (drinkPrice + sidePrice + dishPrice).toFixed(2);
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
              {dish && (
                <tr>
                  <td>{dish?.name}</td>
                  <td>{dish?.quantity}</td>
                  <td>{dish?.price} €</td>
                </tr>
              )}
              {side && (
                <tr>
                  <td>{side?.name}</td>
                  <td>{side?.quantity}</td>
                  <td>{side?.price} €</td>
                </tr>
              )}
              {drink && (
                <tr>
                  <td>{drink?.name}</td>
                  <td>{drink?.quantity}</td>
                  <td>{drink?.price} €</td>
                </tr>
              )}

              <tr className="font-bold h-full">
                <td>TOTAL</td>
                <td></td>
                <td>{floatTotalPrice} €</td>
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
