import CardImageGen from "./CardImageGen";
import ContentCreateItem from "./ContentCreateItem";
import BinWithModal from "./BinWithModal";
import DeleteModal from "./DeleteModal";
import type CreateItem from "../types/CreateItemType";
import type { Dispatch, SetStateAction } from "react";
import PlusCard from "./PlusCard";
interface CreateItemProps {
  title: string;
  type: string;
  createEmptyItem: (type: string) => void;
  itemsList: CreateItem[];
  setItemValue: (index: any, field: any, value: any) => void;
  rmbg: boolean;
  setActiveBgRemovals: Dispatch<SetStateAction<number>>;
  deleteItem: (index: number) => void;
  deleteType: (type: string) => void;
  moveType: (type: string, direction: "up" | "down") => void;
  required: boolean;
}

function CreateItems({
  title,
  type,
  createEmptyItem,
  itemsList,
  setItemValue,
  rmbg,
  setActiveBgRemovals,
  deleteItem,
  deleteType,
  moveType,
  required,
}: CreateItemProps) {
  return (
    <>
      <div className="divider w-full"></div>
      <div className="flex items-center gap-4 ">
        <h1 className=" text-2xl">{title}</h1>
        {required && <span className="badge badge-primary">Obligatoire</span>}
        <div className="flex flex-col items-center justify-center">
          <button className="btn" onClick={() => moveType(type, "up")}>
            UP
          </button>
          <button className="btn" onClick={() => moveType(type, "down")}>
            DOWN
          </button>
        </div>
        <BinWithModal
          id={"delete_type_" + type}
          className="w-5 h-5 md:w-20 md:h-20 mt-2 md:ml-2"
        />
        <DeleteModal
          id={"delete_type_" + type}
          title="Supprimer le type ?"
          description={`Vous êtes sur le point de supprimer 
                le type ${type} ainsi que tous ses éléments. Cette action est irréversible.`}
          onDelete={() => deleteType(type)}
        />{" "}
      </div>
      <div className="flex flex-col w-full md:w-3/4 h-full items-center justify-center gap-4">
        <PlusCard
          onClick={() => createEmptyItem(type)}
          legend={`Ajouter un ${type}`}
        />
        {itemsList.map(
          (item, index) =>
            item.type === type && (
              <CardImageGen
                ImgUrl={item.img_url}
                setImgUrl={(url) => setItemValue(index, "img_url", url)}
                rmBg={rmbg}
                onBgRemovalStart={() => {}}
                onBgRemovalEnd={() => {
                  setActiveBgRemovals((prev) => prev - 1);
                }}
              >
                <ContentCreateItem
                  key={type + "-" + index}
                  name={item.name}
                  description={item.description}
                  quantity={item.quantity}
                  price={item.price}
                  img_url={item.img_url}
                  type={item.type}
                  setName={(name) => setItemValue(index, "name", name)}
                  setDescription={(description) =>
                    setItemValue(index, "description", description)
                  }
                  setQuantity={(quantity) =>
                    setItemValue(index, "quantity", quantity)
                  }
                  setPrice={(price) => setItemValue(index, "price", price)}
                />
                <BinWithModal
                  id={"delete_item_" + index}
                  className="w-10 h-10 md:w-20 md:h-20 mt-2 md:ml-2"
                />
                <DeleteModal
                  id={"delete_item_" + index}
                  title="Supprimer l'élément ?"
                  description={`Vous êtes sur le point de supprimer 
                l'élément ${item.quantity}x${item.name}. Cette action est irréversible.`}
                  onDelete={() => deleteItem(index)}
                />
              </CardImageGen>
            )
        )}
      </div>
    </>
  );
}

export default CreateItems;
