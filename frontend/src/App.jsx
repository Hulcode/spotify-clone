import { AudioPlayerProvider } from "./context/AudioPlayerContext";
import { GetUserProvider } from "./context/GetUserContext";

import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Home from "./pages/Home";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();
import Sidebar from "./components/Sidebar";
import MiniPlayer from "./components/MiniPlayer";
import AlbumDisplay from "./pages/AlbumDisplay";
import Register from "./pages/Register";
import Login from "./pages/Login";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <GetUserProvider>
        <AudioPlayerProvider>
          <BrowserRouter>
            <div className="flex h-auto bg-[#f0faf2]">
              <Sidebar />
              <div className="flex-1 flex  h-screen flex-col overflow-hidden">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/album/:id" element={<AlbumDisplay />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/login" element={<Login />} />
                </Routes>
              </div>
            </div>
          </BrowserRouter>
          <ToastContainer position="top-right" autoClose={2000} theme="dark" />
          <MiniPlayer />
        </AudioPlayerProvider>
      </GetUserProvider>
    </QueryClientProvider>
  );
}

export default App;
