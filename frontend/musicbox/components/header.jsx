import Link from "next/link"
import { useContext } from "react";
import LoginContext from "../context/logincontext";

const Header = () => {
  const {token, setToken} = useContext(LoginContext);
  return(
    <header>
      <Link href="/">
        <a>Home</a>
      </Link>
      {(token==="") ? <a>Login</a> : <a>Logout</a>}
    </header>
  );
};

export default Header;