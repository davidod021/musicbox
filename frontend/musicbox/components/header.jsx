import Link from "next/link"
import { useContext } from "react";
import { useRouter } from 'next/router'
import LoginContext from "../context/logincontext";

const Header = () => {
  const {token, setToken} = useContext(LoginContext);
  const router            = useRouter();
  const {rfid}            = router.query;
  let loginpath= ""; 
  if (!rfid) {
    loginpath             = `http://localhost:4000/spotify/login`;
  }
  else {
    loginpath             = `http://localhost:4000/spotify/login/${rfid}`;
  }
  return(
    <header>
      <Link href="/">
        <a>Home</a>
      </Link>
      {(token==="") ? <a href={loginpath}>Log in</a> : <a>Logout</a>}
    </header>
  );
};

export default Header;