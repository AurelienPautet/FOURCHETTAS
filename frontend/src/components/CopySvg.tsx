function CopySvg({
  className = "",
  onClick = () => {},
}: {
  className?: string;
  onClick?: () => void;
}) {
  return (
    <svg
      className={`stroke-base-content hover:cursor-pointer hover:stroke-accent ${className}`}
      width="800px"
      height="800px"
      onClick={onClick}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>Copy</title>
      <g id="Copy">
        <path
          d="M15 2H9C7.89543 2 7 2.89543 7 4V16C7 17.1046 7.89543 18 9 18H15C16.1046 18 17 17.1046 17 16V4C17 2.89543 16.1046 2 15 2Z"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        <path
          d="M5 6H4C2.89543 6 2 6.89543 2 8V20C2 21.1046 2.89543 22 4 22H10C11.1046 22 12 21.1046 12 20V19"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </g>
    </svg>
  );
}

export default CopySvg;
