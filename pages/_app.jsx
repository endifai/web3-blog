import "../src/styles/globals.css";
import { css } from "@emotion/css";

import { AccountProvider } from "../src/context/account";
import { Header } from "../src/components/header";

import "easymde/dist/easymde.min.css";

const MyApp = ({ Component, pageProps }) => {
  return (
    <AccountProvider>
      <div>
        <Header />
        <div className={container}>
          <Component {...pageProps} />
        </div>
      </div>
    </AccountProvider>
  );
}

const container = css`
  padding: 40px;
`;

export default MyApp;
