import { useEffect, useState } from "react";
import type Order from "../types/OrderType";
import type Item from "../types/ItemType";

import putOrderUpdateFromId from "../utils/dbFetch/putOrderUpdateFromId.ts";
import timestampToStrings from "../utils/timestampToStrings.ts";
import DeleteModal from "./DeleteModal.tsx";
import deleteOrder from "../utils/dbFetch/deleteOrder.ts";
import BinWithModal from "./BinWithModal.tsx";

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
    deleteOrder({
      id: order.id,
      onRequestStart: () => {},
      onRequestEnd: () => {},
      onError: () => {},
      onSuccess: () => {},
    });
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
    <tr className={localPrepared && localDelivered ? "opacity-70" : ""}>
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
        <BinWithModal id={"delete_order_" + order.id} className="w-5 h-5" />
        <DeleteModal
          id={"delete_order_" + order.id}
          title="Supprimer la commande ?"
          description={`Vous êtes sur le point de supprimer la commande de ${order.firstname} ${order.name}`}
          onDelete={() => handleDelete()}
        />
      </th>
    </tr>
  );
}

export default ListOrdersListItem;
