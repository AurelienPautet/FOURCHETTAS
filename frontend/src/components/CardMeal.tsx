interface InputFieldProps {
  title: string;
  description: string;
  price: number;
  quantity: number;
  imgSrc: string;
  selected: boolean;
  onclick?: () => void;
}

function CardMeal({
  title,
  description,
  price,
  quantity,
  imgSrc,
  selected = false,
  onclick,
}: InputFieldProps) {
  return (
    <div
      className={`card bg-base-200 ${
        selected ? "border-accent border-2" : ""
      } w-96 shadow-sm`}
      onClick={onclick}
    >
      <figure className="px-10 pt-10 h-48 w-full flex justify-center items-center">
        <div className="indicator ">
          {quantity > 0 && (
            <span className="indicator-item badge badge-secondary indicator-bottom ">
              x{quantity}
            </span>
          )}
          <img
            src={imgSrc}
            alt={title}
            className="rounded-xl object-contain h-32 w-32 animate-wiggle animate-infinite animate-duration-[5000ms] animate-ease-in-out animate-alternate"
          />
        </div>
      </figure>
      <div className="card-body items-center text-center">
        <h1 className="card-title font-bold">{title}</h1>
        <h2 className="text-lg font-bold">{price}€</h2>

        <p>{description}</p>
      </div>
    </div>
  );
}

export default CardMeal;
