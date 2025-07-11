interface TransitionDivProps {
  state: string;
  classes?: string;
  children: React.ReactNode;
  show: boolean;
}

function TransitionDiv({ state, children, classes, show }: TransitionDivProps) {
  return (
    <div
      className={`${classes} transition duration-100 ease-in-out ${
        state == "exiting" ? "-translate-x-5 opacity-0" : ""
      }${state == "entering" ? "translate-x-5 opacity-0" : ""} ${
        state != "idle" || show ? "" : "hidden"
      } `}
    >
      {children}
    </div>
  );
}

export default TransitionDiv;
