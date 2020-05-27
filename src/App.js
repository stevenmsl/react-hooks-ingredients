import React, { useContext } from "react";
import "./App.css";
//import Ingredients from "./components/Ingredients/Ingredients";
import Ingredients2 from "./components/Ingredients/Ingredients2";
import Auth from "./components/Auth";
import { AuthContext } from "./context/auth-context";

function App() {
  const authContext = useContext(AuthContext);
  let content = <Auth />;
  if (authContext.isAuth) {
    content = <Ingredients2 />;
  }
  return content;
}

export default App;
