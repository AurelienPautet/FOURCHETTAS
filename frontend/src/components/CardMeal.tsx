function CardMeal() {
  return (
    <div className="card bg-base-200 border-accent border-2  w-96 shadow-sm">
      <figure className="px-10 pt-10 h-48 w-full flex justify-center items-center">
        <div className="indicator ">
          <span className="indicator-item badge badge-secondary indicator-bottom ">
            x3
          </span>
          <img
            src="https://www.seekpng.com/png/full/75-757824_emoji-chicken-leg-png-fried-chicken-emoji-png.png"
            alt="Shoes"
            className="rounded-xl object-contain h-32 w-32 animate-wiggle animate-infinite animate-duration-[5000ms] animate-ease-in-out animate-alternate"
          />
        </div>
      </figure>
      <div className="card-body items-center text-center">
        <h1 className="card-title font-bold">Poulet Crispy</h1>
        <h2 className="text-lg font-bold">5,5€</h2>

        <p>
          Du bon poulet croustillant, servi avec des sauces maisons au choix.
        </p>
      </div>
    </div>
  );
}

export default CardMeal;
