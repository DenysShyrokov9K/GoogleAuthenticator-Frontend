import React, { useEffect, useState } from "react";
import speakeasy from "speakeasy";
import QRCode from "qrcode";
import { ethers } from "ethers";
import { useWallet } from "use-wallet";
import CryptoJS from "crypto-js";
import axios from "axios";

const GoogleAuthenticator = () => {
  const [image, setImage] = useState();
  const [secret, setSecret] = useState();
  const [validCode, setValidCode] = useState();
  const [isCodeValid, setIsCodeValid] = useState(0);
  const [inputValue, setInputValue] = useState();

  const wallet = useWallet();

  useEffect(() => {
    checkConnection();
  }, [wallet.status]);


  const checkConnection = async () => {
    let { ethereum } = window;  
    if (ethereum !== undefined) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const accounts = await provider.listAccounts();

      if (accounts.length !== 0) {
        onConnect();
      } else if (accounts.length === 0) {
        console.log("Please connect wallet");
      }
    }
  };

  const onConnect = async () => {
    if (wallet.status !== "connected") {
      wallet.connect().catch((err) => {
        console.error("please check metamask!");
      });
    }
  };

  useEffect(() => {
    if (wallet.status == "connected") {
      createQrCode();
    }
  }, [wallet.status]);

  const createQrCode = async () => {
    const secret = speakeasy.generateSecret({ name: "Arcadian", length: 16 });
    console.log(secret);
    let createCheck;
    await axios
      .post("/api/users/", {
        userAddress: wallet.account,
        userhex: secret.hex,
      })
      .then((res) => {
        createCheck = res.data;
      })
      .catch((err) => {
        console.log(err);
      });
    if (createCheck === 1) {
      QRCode.toDataURL(secret.otpauth_url, (err, image_data) => {
        setImage(image_data);
        setSecret(secret);
      });
    }
  }

  const verifyCode = () => {
    axios
      .post("/api/users/verifyCode", {
        userAddress: wallet.account,
        checkCode: inputValue,
      })
      .then((res) => {
        setIsCodeValid(res.data);
      })
      .catch((err) => {
        console.log(err);
        setIsCodeValid(false);
      });
  };

  return (
    <div>
      {wallet.status === "connected" ? (
        <p>{wallet.account}</p>
      ) : (
        <button onClick={onConnect}>ConnectWallet</button>
      )}
      {wallet.status === "connected" && image != null ? (
        <div>
        <img src={`${image}`} />
        <p>secretkey: {secret.base32}</p>
        <p>Plz save secretKey on secure place</p>
        <button>got it</button>
        </div>
      ) : (
        ""
      )}

      {/* {
        <div>
          <h2>{validCode}</h2>
          <button onClick={getCode}>Get valid code</button>
        </div>
      } */}
      <div style={{ marginTop: 20 }}>Verify code</div>
      <input
        type="number"
        onChange={(e) => {
          setInputValue(e.target.value);
        }}
      />
      <button onClick={verifyCode}>Verify</button>
      {isCodeValid !== 0 && <div>{isCodeValid == true ? "Yes" : "No"}</div>}
    </div>
  );
};

export default GoogleAuthenticator;
