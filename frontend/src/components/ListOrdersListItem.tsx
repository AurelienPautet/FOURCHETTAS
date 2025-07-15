import { useEffect, useState } from "react";
import type Order from "../types/OrderType";
import type Item from "../types/ItemType";

import putOrderUpdateFromId from "../utils/dbFetch/putOrderUpdateFromId.ts";
import timestampToStrings from "../utils/timestampToStrings.ts";
import DeleteModal from "./DeleteModal.tsx";
import deleteOrder from "../utils/dbFetch/deleteOrder.ts";

function ListOrdersListItem({
  order,
  itemsMap,
}: {
  order: Order;
  itemsMap: Map<number, Item>;
}) {
  const dish = itemsMap.get(order.dish_id);
  const side = itemsMap.get(order.side_id);
  const drink = itemsMap.get(order.drink_id);

  const [localPrepared, setLocalPrepared] = useState(order.prepared);
  const [localDelivered, setLocalDelivered] = useState(order.delivered);
  useEffect(() => {
    setLocalPrepared(order.prepared);
    setLocalDelivered(order.delivered);
  }, [order.prepared, order.delivered]);

  const { date, time } = timestampToStrings(order.created_at);
  const [isDeleting, setIsDeleting] = useState(false);

  function handleDelete() {
    setIsDeleting(true);
    deleteOrder(order.id);
  }

  if (isDeleting) {
    return (
      <tr>
        <td colSpan={6} className="text-center">
          Suppression en cours...
        </td>
      </tr>
    );
  }

  return (
    <tr>
      <th>
        <label>
          <input
            type="checkbox"
            className="checkbox checked:bg-success/40"
            checked={localPrepared}
            onChange={() => {
              putOrderUpdateFromId({
                orderId: order.id,
                prepared: !localPrepared,
              });
              setLocalPrepared(!localPrepared);
            }}
          />
        </label>
      </th>
      <th>
        <label>
          <input
            type="checkbox"
            className="checkbox checked:bg-success/40"
            checked={localDelivered}
            onChange={() => {
              putOrderUpdateFromId({
                orderId: order.id,
                delivered: !localDelivered,
              });
              setLocalDelivered(!localDelivered);
            }}
          />
        </label>
      </th>
      <td>
        <div className="flex items-center gap-3">
          <div>
            <div className="font-bold">
              {order.firstname} {order.name}
            </div>
            <div className="text-sm opacity-50">{order.phone}</div>
          </div>
        </div>
      </td>
      <td>
        {dish && (
          <>
            {dish.quantity}*{dish.name} <br />
          </>
        )}
        {side && (
          <>
            {side.quantity}*{side.name} <br />
          </>
        )}
        {drink && (
          <>
            {drink.quantity}*{drink.name}
          </>
        )}
      </td>
      <td>{order.price}€</td>
      <td>
        <div>
          <div>le {date}</div>
          <div>à {time}</div>
        </div>
      </td>
      <th>
        <svg
          fill="#000000"
          version="1.1"
          id="Capa_1"
          xmlns="http://www.w3.org/2000/svg"
          width="800px"
          height="800px"
          viewBox="0 0 408.483 408.483"
          onClick={() => {
            const modal = document.getElementById(
              `my_modal_delete_order`
            ) as HTMLDialogElement | null;
            if (modal) {
              modal.showModal();
            }
          }}
          className="fill-base-content w-5 h-5 hover:fill-error cursor-pointer"
        >
          <g>
            <g>
              <path
                d="M87.748,388.784c0.461,11.01,9.521,19.699,20.539,19.699h191.911c11.018,0,20.078-8.689,20.539-19.699l13.705-289.316
			H74.043L87.748,388.784z M247.655,171.329c0-4.61,3.738-8.349,8.35-8.349h13.355c4.609,0,8.35,3.738,8.35,8.349v165.293
			c0,4.611-3.738,8.349-8.35,8.349h-13.355c-4.61,0-8.35-3.736-8.35-8.349V171.329z M189.216,171.329
			c0-4.61,3.738-8.349,8.349-8.349h13.355c4.609,0,8.349,3.738,8.349,8.349v165.293c0,4.611-3.737,8.349-8.349,8.349h-13.355
			c-4.61,0-8.349-3.736-8.349-8.349V171.329L189.216,171.329z M130.775,171.329c0-4.61,3.738-8.349,8.349-8.349h13.356
			c4.61,0,8.349,3.738,8.349,8.349v165.293c0,4.611-3.738,8.349-8.349,8.349h-13.356c-4.61,0-8.349-3.736-8.349-8.349V171.329z"
              />
              <path
                d="M343.567,21.043h-88.535V4.305c0-2.377-1.927-4.305-4.305-4.305h-92.971c-2.377,0-4.304,1.928-4.304,4.305v16.737H64.916
			c-7.125,0-12.9,5.776-12.9,12.901V74.47h304.451V33.944C356.467,26.819,350.692,21.043,343.567,21.043z"
              />
            </g>
          </g>
        </svg>{" "}
        <DeleteModal
          id={"delete_order"}
          title="Supprimer la commande ?"
          description={`Vous êtes sur le point de supprimer la commande de ${order.firstname} ${order.name}`}
          onDelete={() => handleDelete()}
        />
      </th>
    </tr>
  );
}

export default ListOrdersListItem;
