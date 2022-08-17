import Link from "next/link";
import { css } from "@emotion/css";

import { useAccountContext } from "../context/account";
import { OWNER_ADDRESS } from "../../config";

export const Header = () => {
  const { account, connect } = useAccountContext();

  return (
    <nav className={nav}>
      <div className={header}>
        <Link href="/">
          <a>
            <div className={titleContainer}>
              <h2 className={title}>Blog</h2>
              <p className={description}>Web3</p>
            </div>
          </a>
        </Link>
        {!account && (
          <div className={buttonContainer}>
            <button className={buttonStyle} onClick={connect}>
              Connect
            </button>
          </div>
        )}
        {account && <p className={accountInfo}>{account}</p>}
      </div>
      <div className={linkContainer}>
        <Link href="/">
          <a className={link}>Home</a>
        </Link>
        {account === OWNER_ADDRESS && (
          <Link href="/create-post">
            <a className={link}>Create Post</a>
          </Link>
        )}
      </div>
    </nav>
  );
};

const accountInfo = css`
  width: 100%;
  display: flex;
  flex: 1;
  justify-content: flex-end;
  font-size: 12px;
`;

const linkContainer = css`
  padding: 30px 60px;
  background-color: #fafafa;
`;

const nav = css`
  background-color: white;
`;

const header = css`
  display: flex;
  border-bottom: 1px solid rgba(0, 0, 0, 0.075);
  padding: 20px 30px;
`;

const description = css`
  margin: 0;
  color: #999999;
`;

const titleContainer = css`
  display: flex;
  flex-direction: column;
  padding-left: 15px;
`;

const title = css`
  margin-left: 30px;
  font-weight: 500;
  margin: 0;
`;

const buttonContainer = css`
  width: 100%;
  display: flex;
  flex: 1;
  justify-content: flex-end;
`;

const buttonStyle = css`
  background-color: #fafafa;
  outline: none;
  border: none;
  font-size: 18px;
  padding: 16px 70px;
  border-radius: 15px;
  cursor: pointer;
  box-shadow: 7px 7px rgba(0, 0, 0, 0.1);
`;

const link = css`
  margin: 0px 40px 0px 0px;
  font-size: 16px;
  font-weight: 400;
`;
