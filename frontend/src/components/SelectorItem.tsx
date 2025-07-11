import CardItem from "./CardItem";

function SelectorItem() {
  return (
    <>
      <h1 className="mb-3 w-full text-center text-3xl font-bold">
        Un accompagnement ?
      </h1>
      <div className="flex flex-col md:flex-row gap-4">
        <CardItem
          title="Non merci"
          description="J'ai un petit appétit aujourd'hui, pas de frites pour moi."
          price={0}
          quantity={0}
          img_url="https://cdn.pixabay.com/photo/2013/07/13/12/32/cross-159808_960_720.png"
          onclick={() => setSideID(0)}
          selected={sideID === 0}
        />
        {sides.map((side: Item) => (
          <CardItem
            key={side.id}
            title={side.name}
            description={side.description}
            price={side.price}
            quantity={side.quantity}
            img_url={side.img_url}
            onclick={() => setSideID(side.id)}
            selected={sideID === side.id}
          />
        ))}
      </div>
    </>
  );
}

export default SelectorItem;
