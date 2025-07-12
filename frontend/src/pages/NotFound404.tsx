import Logo from "../components/Logo";

function NotFound404() {
  return (
    <div className="flex flex-col items-center w-full justify-center h-full">
      <Logo className="h-56 w-56" alive={false} />
      <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
    </div>
  );
}

export default NotFound404;
