import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Galaxy from "../components/Galaxy";

export default function OAuthSuccess() {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (token) {
      localStorage.setItem("token", token);
      navigate("/"); 
    }
  }, [navigate]);

  return <Galaxy /> ;
}
