import React, { useContext, useMemo, useState, useCallback } from "react";
import { ethers } from "ethers";
import Web3Modal from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";

const getWeb3Modal = () => {
  const web3Modal = new Web3Modal({
    cacheProvider: false,
    providerOptions: {
      walletconnect: {
        package: WalletConnectProvider,
      },
    },
  });
  return web3Modal;
};

const AccountContext = React.createContext(null);

export const AccountProvider = ({ children }) => {
  const [account, setAccount] = useState(null);

  const connect = useCallback(async () => {
    try {
      const web3Modal = await getWeb3Modal();
      const connection = await web3Modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);
      const accounts = await provider.listAccounts();
      setAccount(accounts[0]);
    } catch (err) {
      console.log("error:", err);
    }
  }, []);

  const value = useMemo(
    () => ({
      account,
      connect,
    }),
    [account, connect]
  );

  return (
    <AccountContext.Provider value={value}>{children}</AccountContext.Provider>
  );
};

export const useAccountContext = () => useContext(AccountContext);
