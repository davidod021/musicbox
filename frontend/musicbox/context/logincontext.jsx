import { createContext, useState } from "react";

const LoginContext = createContext("");

const LoginProvider = ({children}) => {
  const [token, setToken] = useState("");
  return(
    <LoginContext.Provider value={{token, setToken}}>
      {children}
    </LoginContext.Provider>
  );
};

export default LoginContext;
export {LoginProvider};