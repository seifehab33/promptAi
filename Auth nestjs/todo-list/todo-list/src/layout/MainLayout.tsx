import { Outlet, useLocation } from "react-router-dom";

function MainLayout() {
  const location = useLocation();
  const token = localStorage.getItem("token");
  const isSignPage =
    location.pathname === "/" || location.pathname === "/signup";
  const isAuthenticated = !!token;

  return (
    <div>
      {isAuthenticated && !isSignPage && (
        <header>
          <h1>Todo List</h1>
        </header>
      )}
      <main>
        <Outlet />
      </main>
    </div>
  );
}

export default MainLayout;
