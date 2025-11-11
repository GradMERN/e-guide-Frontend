import { Outlet, Link } from "react-router-dom";

export default function MainLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <nav className="bg-white shadow-md px-6 py-4 flex justify-between items-center">
        <div className="space-x-4">
          <Link to="/">Home</Link>
          <Link to="/profile">Profile</Link>
          <Link to="/my-tours">My Tours</Link>
          <Link to="/cart">Cart</Link>
        </div>
      </nav>

      <main className="flex-1 p-4">
        <Outlet />
      </main>
    </div>
  );
}
