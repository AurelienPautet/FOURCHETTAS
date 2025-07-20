import SvgPlus from "./SvgPlus";

function PlusCard({
  onClick = () => {},
  legend,
}: {
  onClick?: () => void;
  legend: string;
}) {
  return (
    <div
      onClick={onClick}
      className="card bg-base-200 h-30 shadow-sm flex justify-start flex-row md:w-3/4 items-center p-6 gap-6 hover:bg-base-300/80  hover:cursor-pointer"
    >
      <div className="bg-base-300 rounded-box flex items-center justify-center w-20 h-20">
        <SvgPlus className="w-40 h-40" />
      </div>
      <h1 className="text-center font-bold text-2xl">{legend}</h1>
    </div>
  );
}

export default PlusCard;
