import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";

function Home() {
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await axiosInstance.get("/api/auth/check");

        navigate("/add-song");
      } catch {
        navigate("/register");
      }
    };

    checkAuth();
  }, []);

  return <div>Loading...</div>;
}

export default Home;
