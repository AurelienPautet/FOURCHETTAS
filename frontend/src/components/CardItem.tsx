import MinusSvg from "./MinusSvg";
import AddSvg from "./AddSvg";

interface InputFieldProps {
  title: string;
  description: string;
  price: number;
  quantity: number;
  img_url: string;
  selected: boolean;
  ordered_quantity: number;
  onclick?: () => void;
  onChangeOrderedQuantity: (toAdd: number) => void;
}

function CardItem({
  title,
  description,
  price,
  quantity,
  img_url,
  selected = false,
  onclick,
  ordered_quantity,
  onChangeOrderedQuantity,
}: InputFieldProps) {
  return (
    <div
      className={`card bg-base-200 ${
        selected ? "border-accent border-2" : ""
      } w-80 h-fit shadow-sm`}
      onClick={onclick}
    >
      <figure className="px-10 pt-10 h-40 w-full flex justify-center items-center">
        <div className="indicator ">
          {quantity > 0 && (
            <span className="indicator-item badge badge-secondary indicator-bottom ">
              x{quantity}
            </span>
          )}
          <img
            src={img_url}
            alt={title}
            className="rounded-xl object-contain h-24 w-24 animate-wiggle animate-infinite animate-duration-[5000ms] animate-ease-in-out animate-alternate"
          />
        </div>
      </figure>
      <div className="card-body items-center text-center">
        <h1 className="card-title font-bold">{title}</h1>
        <h2 className="text-lg font-bold">{price}€</h2>

        <p className="whitespace-pre-line">{description}</p>
        <div
          className={`flex flex-row justify-center items-center gap-3 ${
            ordered_quantity === 0 ? "invisible" : ""
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <MinusSvg
            className=" w-7 hover:w-8 mb-1 hover:mb-0 "
            fill="fill-base-content hover:fill-accent"
            onClick={() => onChangeOrderedQuantity(-1)}
          />
          <h3 className="text-xl font-bold select-none"> {ordered_quantity}</h3>
          <AddSvg
            className=" w-7 hover:w-8 mb-1 hover:mb-0 "
            fill="fill-base-content hover:fill-accent"
            onClick={() => onChangeOrderedQuantity(1)}
          />
        </div>
      </div>
    </div>
  );
}

export default CardItem;
