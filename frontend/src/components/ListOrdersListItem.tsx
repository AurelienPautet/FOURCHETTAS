import { useEffect, useState } from "react";
import type Order from "../types/OrderType";
import type Item from "../types/ItemType";

import putOrderUpdateFromId from "../utils/dbFetch/putOrderUpdateFromId";
import timestampToStrings from "../utils/timestampToStrings";
import DeleteModal from "./DeleteModal";
import deleteOrder from "../utils/dbFetch/deleteOrder";
import BinWithModal from "./BinWithModal.tsx";

function ListOrdersListItem({
  order,
  itemsMap,
}: {
  order: Order;
  itemsMap: Map<number, Item>;
}) {
  const orderedItems = order.items
    .map((it) => {
      const item = itemsMap.get(it.item_id);
      if (item) {
        return { ...item, ordered_quantity: it.ordered_quantity };
      }
    })
    .filter((item) => item !== undefined && item.ordered_quantity > 0);

  console.log(order);
  console.log("Ordered Items:", orderedItems);
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
        {orderedItems.map((item) => (
          <>
            {item &&
              item.quantity *
                (item.ordered_quantity ? item.ordered_quantity : 1)}
            *{item?.name} <br />
          </>
        ))}
      </td>
      <td>
        {order.delivery_info ? (
          <div>
            <div className="font-semibold text-xs">Livraison</div>
            <div className="text-xs">
              {order.delivery_info.delivery_address}
            </div>
            <div className="text-xs opacity-50">
              à {order.delivery_info.delivery_time}
            </div>
          </div>
        ) : (
          <div className="text-xs opacity-50">Sur place</div>
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
