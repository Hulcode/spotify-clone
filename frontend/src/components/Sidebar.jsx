import { NavLink } from "react-router-dom";
import { useState, useEffect } from "react";
import { Button } from "../components/ui/button";
import { X, Menu, Home, Search, PlusCircle, Radio } from "lucide-react";
import { cn } from "../lib/utils";
import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/paths";
import { useNavigate } from "react-router-dom";
import { useGetUser } from "../context/GetUserContext";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useGetUser();
  const navigate = useNavigate();

  useEffect(() => {
    const handleRouteChange = () => {
      setIsOpen(false);
    };
    // Listen for route changes
    window.addEventListener("popstate", handleRouteChange);
    return () => window.removeEventListener("popstate", handleRouteChange);
  }, []);
  // Close sidebar when clicking outside (mobile)
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        isOpen &&
        !e.target.closest("aside") &&
        !e.target.closest(".menu-button")
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [isOpen]);

  return (
    <>
      {/* Mobile Menu Button */}
      <Button
        className="menu-button fixed top-4 left-4 z-50 md:hidden bg-black/80 hover:bg-black text-white border border-gray-800 p-2 rounded-lg"
        onClick={() => setIsOpen(!isOpen)}
        size="icon"
      >
        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "flex flex-col h-screen bg-black text-white border-r border-gray-800 transition-all duration-300",
          // Mobile
          "fixed top-0 left-0 z-40 w-72",
          isOpen ? "translate-x-0" : "-translate-x-full",
          // Desktop
          "md:sticky md:top-0 md:translate-x-0 md:w-64",
        )}
      >
        <nav className="px-3 flex-1 overflow-y-auto py-4">
          {/* Main Navigation */}
          <div className="space-y-1">
            <NavLink
              to="/"
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors",
                  isActive
                    ? "bg-[#1a1a1a] text-white"
                    : "text-gray-400 hover:text-white hover:bg-[#1a1a1a]",
                )
              }
            >
              <Home className="h-5 w-5" />
              Home
            </NavLink>
          </div>

          <div className="h-px bg-gray-800 my-4" />

          {/* Admin Section */}

          <div className="h-px bg-gray-800 my-4" />

          {/* Playlists Section */}
          <div className="space-y-0.5">
            <div className="px-3 py-2">
              <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                Your Playlists
              </h3>
            </div>

            <div className="px-3 py-2">
              <p className="text-sm text-gray-400">
                Create your first playlist
                <br />
                <span className="text-xs text-gray-500">
                  it's easy, we'll help you
                </span>
              </p>
            </div>

            <NavLink
              to={import.meta.env.VITE_ADMIN}
              target="_blank"
              className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-gray-400 hover:text-white hover:bg-[#1a1a1a] transition-colors"
            >
              <PlusCircle className="h-5 w-5" />
              Create Playlist
            </NavLink>
          </div>

          <div className="h-px bg-gray-800 my-4" />

          {/* Podcasts Section */}
          <div className="space-y-0.5">
            <div className="px-3 py-2">
              <p className="text-xs text-gray-400">
                Let's find some podcasts to follow
                <br />
                <span className="text-[10px] text-gray-500">
                  we'll keep you updated on new episodes
                </span>
              </p>
            </div>
          </div>
        </nav>

        {/* Bottom Section - User */}
        <div className="border-t border-gray-800 p-3 flex-shrink-0 flex items-center gap-3 px-3 py-2 rounded-md hover:bg-[#1a1a1a] transition-colors ">
          <div className="w-8 h-8 rounded-full bg-[#1DB954] flex items-center justify-center text-black font-bold text-sm">
            A
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">
              {user?.userName}
            </p>
            <p className="text-xs text-gray-400 truncate">{user?.email}</p>
          </div>
          <span
            onClick={async () => {
              await axiosInstance.post(API_PATHS.AUTH.LOGOUT);
              navigate("/login");
            }}
            className="bg-red-500 px-1.5 cursor-pointer py-0.5 rounded-2xl"
          >
            Logout
          </span>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
