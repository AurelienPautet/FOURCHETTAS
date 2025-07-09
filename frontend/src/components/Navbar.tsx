import ThemeController from "./ThemeController.tsx";
import Logo from "./Logo.tsx";

function Navbar() {
  return (
    <div className="sticky top-0">
      <div className="shadow-md shadow-accent p-3 h-20 bg-base-100 flex items-center justify-between  ">
        <Logo />
        <div className="font-shrikhand text-3xl md:text-4xl text-base-content">
          Fourchettas
        </div>
        <ThemeController />
      </div>
    </div>
  );
}

export default Navbar;
