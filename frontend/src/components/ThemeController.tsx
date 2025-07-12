function ThemeController() {
  const handleThemeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const theme_change = true;
    document.documentElement.setAttribute("theme_change", theme_change);
  };
  return (
    <>
      <input
        type="checkbox"
        value="fantasy"
        className="toggle theme-controller"
        onChange={handleThemeChange}
      />
    </>
  );
}

export default ThemeController;
