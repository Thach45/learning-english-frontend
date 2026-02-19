import React from "react";
import { Outlet, NavLink } from "react-router-dom";

const AdminLayout: React.FC = () => {
  const navClass = ({ isActive }: { isActive: boolean }) =>
    `block px-4 py-2 rounded-md ${isActive ? "bg-indigo-100 text-indigo-800 font-medium" : "text-gray-700 hover:bg-gray-100"}`;

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <aside className="w-56 bg-white border-r border-gray-200 shrink-0">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">Admin</h2>
        </div>
        <nav className="p-2 space-y-1">
          <NavLink to="/admin" end className={navClass}>
            Tổng quan
          </NavLink>
          <NavLink to="/admin/users" className={navClass}>
            User
          </NavLink>
          <NavLink to="/admin/posts" className={navClass}>
            Bài viết
          </NavLink>
          <NavLink to="/admin/comments" className={navClass}>
            Comment
          </NavLink>
          <NavLink to="/admin/roles" className={navClass}>
            Role & Permission
          </NavLink>
          <NavLink to="/admin/achievements" className={navClass}>
            Thành tựu
          </NavLink>
        </nav>
      </aside>
      <main className="flex-1 p-6 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
