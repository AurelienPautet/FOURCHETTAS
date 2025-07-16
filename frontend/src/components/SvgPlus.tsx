function SvgPlus({ className = "" }: { className?: string }) {
  return (
    <svg
      className={`fill-base-content   ${className}`}
      version="1.1"
      id="Layer_1"
      viewBox="0 0 500 370"
    >
      <path
        d="M306,192h-48v-48c0-4.4-3.6-8-8-8s-8,3.6-8,8v48h-48c-4.4,0-8,3.6-8,8s3.6,8,8,8h48v48c0,4.4,3.6,8,8,8s8-3.6,8-8v-48h48
	c4.4,0,8-3.6,8-8S310.4,192,306,192z"
      />
    </svg>
  );
}

export default SvgPlus;
