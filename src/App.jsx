import { BrowserRouter, Routes, Route } from "react-router-dom";

import { useEffect } from "react";

import { useDispatch } from "react-redux";
import { startAuthListener } from "./store/authSlice";

import Navbar from "./components/Navbar";

import Home from "./pages/HomePage";
import Login from "./pages/LoginPage";
import Characters from "./pages/CharactersPage";
import Spells from "./pages/SpellsPage";
import Profile from "./pages/ProfilePage";

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(startAuthListener());
  }, [dispatch]);

  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/characters" element={<Characters />} />
        <Route path="/spells" element={<Spells />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
