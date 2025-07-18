import CardImageGen from "./CardImageGen";
import SvgPlus from "./SvgPlus";
import ContentCreateItem from "./ContentCreateItem";
import BinWithModal from "./BinWithModal";
import DeleteModal from "./DeleteModal";
import type CreateItem from "../types/CreateItemType";
import type { Dispatch, SetStateAction } from "react";
interface CreateItemProps {
  title: string;
  type: string;
  createEmptyItem: (type: string) => void;
  itemsList: CreateItem[];
  setItemValue: (index: any, field: any, value: any) => void;
  rmbg: boolean;
  setActiveBgRemovals: Dispatch<SetStateAction<number>>;
  deleteItem: (index: number) => void;
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
}: CreateItemProps) {
  return (
    <>
      <h1 className=" text-2xl">{title}</h1>
      <div className="flex flex-col w-full md:w-3/4 h-full items-center justify-center gap-4">
        <div
          onClick={() => createEmptyItem(type)}
          className="card bg-base-200 h-30 shadow-sm flex justify-start flex-row md:w-3/4 items-center p-6 gap-6 hover:bg-base-300/80  hover:cursor-pointer"
        >
          <div className="bg-base-300 rounded-box flex items-center justify-center w-20 h-20">
            <SvgPlus className="w-40 h-40" />
          </div>
          <h1 className="text-center font-bold text-2xl">Ajouter un plat</h1>
        </div>
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
