import type CreateItem from "../types/CreateItemType";

interface ContentCreateItemProps extends CreateItem {
  setName: (name: string) => void;
  setDescription: (description: string) => void;
  setQuantity: (quantity: number) => void;
  setPrice: (price: number) => void;
}

function ContentCreateItem(props: ContentCreateItemProps) {
  return (
    <>
      <div className="divider divider-horizontal"></div>
      <div className="divider "></div>

      <div className="flex flex-col w-full items-center justify-center ">
        <legend className="fieldset-legend">Nom de l'article</legend>
        <input
          type="text"
          className="input"
          placeholder="Tenders"
          value={props.name}
          onChange={(e) => props.setName(e.target.value)}
        />
        <legend className="fieldset-legend">Description de l'article</legend>

        <textarea
          className="textarea "
          placeholder="Description de l'article"
          value={props.description}
          onChange={(e) => props.setDescription(e.target.value)}
        ></textarea>

        <div className="flex w-full items-center justify-center flex-row">
          <div className="flex flex-col w-full items-center justify-center">
            <legend className="fieldset-legend">Quantité</legend>
            <input
              type="number"
              className="input w-2/3"
              placeholder="Quantité"
              value={props.quantity}
              onChange={(e) => props.setQuantity(Number(e.target.value))}
              min={1}
              max={100}
            />
          </div>
          <div className="flex flex-col w-full items-center justify-center">
            <legend className="fieldset-legend">Prix </legend>
            <input
              type="number"
              step="0.1"
              className="input w-2/3"
              placeholder="Prix de l'article"
              value={props.price}
              onChange={(e) => props.setPrice(Number(e.target.value))}
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default ContentCreateItem;
