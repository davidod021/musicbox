import Header from '../components/header';
import {LoginProvider} from '../context/logincontext';
import '../styles/globals.css';

function MyApp({ Component, pageProps }) {
  return(
    <LoginProvider>
      <Header/>
      <Component {...pageProps} />
    </LoginProvider>
  );
};

export default MyApp;
