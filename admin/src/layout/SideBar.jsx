import { assets } from "../assets/assets";
import { Link } from "react-router-dom";
import { useState } from "react";
import { Button } from "../components/ui/button";
import { XIcon, HamburgerIcon } from "lucide-react";

const SideBar = () => {
  const [showNav, setShowNav] = useState(false);
  const navItems = [
    {
      title: "Add Song",
      path: "/add-song",
      icon: assets.add_song,
    },
    {
      title: "List Songs",
      path: "/list-songs",
      icon: assets.song_icon,
    },
    {
      title: "Add Album",
      path: "/add-album",
      icon: assets.add_album,
    },
    {
      title: "List Albums",
      path: "/list-albums",
      icon: assets.album_icon,
    },
  ];

  return (
    <>
      <Button
        onClick={() => setShowNav(!showNav)}
        className="md:hidden fixed top-8 left-4 z-50  p-2 rounded"
      >
        {showNav ? <XIcon /> : <HamburgerIcon />}
      </Button>

      <div
        className={`${showNav ? "flex" : "hidden"}  md:sticky  absolute z-40 top-0  md:flex flex-col w-70 h-screen border-r bg-emerald-900`}
      >
        <div className="flex justify-center py-6">
          <img src={assets.logo} alt="Logo" className="h-11 w-40" />
        </div>

        <div className="flex flex-col gap-3 items-end  ">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className="flex items-center gap-2 navItem  w-56 relative   px-3 py-2 bg-gray-100 transition"
            >
              <img src={item.icon} alt={item.title} className="w-5 h-5" />
              <span className="font-medium">{item.title}</span>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
};

export default SideBar;
