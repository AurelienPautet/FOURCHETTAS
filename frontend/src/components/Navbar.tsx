import ThemeController from "./ThemeController.tsx";
import Logo from "./Logo.tsx";
import { useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  return (
    <div className="sticky top-0 z-50">
      <div className="shadow-md shadow-accent p-3 h-20 bg-base-100/40 flex items-center justify-between backdrop-blur-lg ">
        <div
          className="flex items-center gap-5 hover:cursor-pointer"
          onClick={() => navigate("/")}
        >
          <Logo />
          <div className="font-shrikhand text-3xl md:text-4xl text-base-content">
            Fourchettas
          </div>
        </div>
        <ThemeController />
      </div>
    </div>
  );
}

export default Navbar;
