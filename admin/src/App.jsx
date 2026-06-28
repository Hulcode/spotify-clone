import { Routes, Route } from "react-router-dom";

import SideBar from "./layout/SideBar";
import Header from "./layout/Header";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AddSong from "./pages/AddSong";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ListSongs from "./pages/ListSongs";
import AddAlbum from "./pages/AddAlbum";
import ListAlbums from "./pages/ListAlbums";
import Home from "./pages/Home";

function App() {
  return (
    <div className="flex">
      <SideBar />
      <main className="flex-1  flex-col">
        {" "}
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/add-song" element={<AddSong />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/list-songs" element={<ListSongs />} />
          <Route path="/add-album" element={<AddAlbum />} />
          <Route path="/list-albums" element={<ListAlbums />} />
        </Routes>
      </main>
      <ToastContainer position="top-right" autoClose={2000} theme="dark" />
    </div>
  );
}

export default App;
