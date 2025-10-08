import { useEffect, useMemo, useState } from "react";
import type AdminOrdersChildProps from "../types/AdminOrdersChild";
import ListOrdersListItem from "./ListOrdersListItem";
import calculatePriceOrder from "../utils/calculatePriceOrder";

function ListOrders({ orders, itemsMap }: AdminOrdersChildProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const ordersWithPrices = useMemo(() => {
    return orders.map((order) => ({
      ...order,
      price: calculatePriceOrder(order, itemsMap),
    }));
  }, [orders, itemsMap]);

  const [filteredOrders, setFilteredOrders] = useState(ordersWithPrices);

  function handleSearch() {
    if (!searchQuery) {
      setFilteredOrders(ordersWithPrices);
      return;
    }
    const lowerCaseQuery = searchQuery
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
    let filtered = ordersWithPrices.filter(
      (order) =>
        order.name
          .toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .includes(lowerCaseQuery) ||
        order.firstname
          .toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .includes(lowerCaseQuery) ||
        order.phone.includes(lowerCaseQuery)
    );
    setFilteredOrders(filtered);
  }

  useEffect(() => {
    handleSearch();
  }, [orders, itemsMap]);

  useEffect(() => {
    handleSearch();
  }, [searchQuery, orders]);

  return (
    <fieldset className="fieldset mt-10 w-fit h-full ml-3 mr-3  bg-base-200 border-base-300 rounded-box  border p-4 flex flex-col gap-0">
      <div className="flex gap-4 bg-base-100 pl-4 pb-2 pt-2 items-center">
        <div className="text-xl font-bold text-base-400"> Nom/Prenom : </div>
        <label className="input">
          <svg
            className="h-[1em] opacity-50"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
          >
            <g
              strokeLinejoin="round"
              strokeLinecap="round"
              strokeWidth="2.5"
              fill="none"
              stroke="currentColor"
            >
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.3-4.3"></path>
            </g>
          </svg>
          <input
            type="search"
            className="grow"
            placeholder="Nom ou Prénom"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </label>
      </div>
      <div className="overflow-x-auto h-full w-[calc(100vw-8rem)] md:w-[calc(100vw-26.5rem)]">
        <table className="table bg-base-300 table-zebra table-pin-rows rounded-box">
          <thead className="bg-base-300 rounded-box">
            <tr>
              <th className="shrink-0 grow-0 pr-0">Prep?</th>
              <th className="shrink-0 grow-0 pr-0">Livré?</th>
              <th> Qui est-ce ?</th>
              <th>Commande</th>
              <th>Prix</th>
              <th>Date </th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((order) => (
              <ListOrdersListItem
                key={order.id}
                order={order}
                itemsMap={itemsMap}
              />
            ))}
          </tbody>
        </table>
      </div>
    </fieldset>
  );
}

export default ListOrders;
