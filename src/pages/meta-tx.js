import {
  Button,
  Box,
  TextField,
  Unstable_Grid2 as Grid,
  Typography,
} from "@mui/material";
import { Formik, useFormik } from "formik";
import * as Yup from "yup";
import { apis } from "./api/api";
import { useState, useEffect } from "react";
import Web3 from "web3";
import { contractAddress, contractId, relayer } from "@/utils/config";

const SignTokenSchema = Yup.object().shape({
  token1Address: Yup.string().required("Required"),
  token2Address: Yup.string().required("Required"),
  token3Address: Yup.string().required("Required"),
  token1Amount: Yup.number().required("Required"),
  token2Amount: Yup.number().required("Required"),
  token3Amount: Yup.number().required("Required"),
});

export default function MetaTx() {
  //const [web3, setWeb3] = useState();
  const [account, setAccount] = useState();

  // useEffect(() => {
  //   if (window.ethereum) {
  //     window.ethereum
  //       .request({ method: "eth_requestAccounts" })
  //       .then((accounts) => setAccount(accounts[0]));

  //     let web3x = new Web3(window.ethereum);
  //     setWeb3(web3);
  //   } else {
  //     alert("Please Install Metamask!");
  //   }
  // }, [web3]);

  useEffect(() => {
    function handleAccountChange(newAccounts) {
      setAccount(newAccounts[0]);
    }

    if (window.ethereum) {
      window.ethereum.on("accountsChanged", handleAccountChange);
      return () => {
        window.ethereum.on("accountsChanged", handleAccountChange);
      };
    }
  }, [account]);

  function parseSignature(signature) {
    const sigParams = signature.substr(2);
    const r = `0x${sigParams.substr(0, 64)}`;
    const s = `0x${sigParams.substr(64, 64)}`;
    const v = parseInt(sigParams.substr(128, 2), 16);

    return {
      v,
      r,
      s,
    };
  }

  const getSignature = async (values) => {
    let web3;

    if (window.ethereum) {
      window.ethereum
        .request({ method: "eth_requestAccounts" })
        .then((accounts) => setAccount(accounts[0]));

      web3 = new Web3(window.ethereum);
    } else {
      alert("Please Install Metamask!");
    }
    const contractId = contractAddress.address;
    const chainId = 80001;

    let currentAccounts = await web3.eth.getAccounts();
    let currentAccount = currentAccounts[0];
    console.log(currentAccount);

    const transfers = [
      {
        tokenAddress: values.token1Address,
        recipient: values.token1RecAddress,
        amount: values.token1Amount,
      },
      {
        tokenAddress: values.token2Address,
        recipient: values.token2RecAddress,
        amount: values.token2Amount,
      },
      {
        tokenAddress: values.token3Address,
        recipient: values.token3RecAddress,
        amount: values.token3Amount,
      },
    ];

    const ReceiverABI = require("../utils/ABI/Receiver.json");

    const Receiver = new web3.eth.Contract(ReceiverABI, contractId);

    let domainData = {
      name: "BatchedERC20Transfer",
      version: "1",
      chainId: chainId, // Matic Testnet
      verifyingContract: contractId,
    };

    const domainType = [
      {
        name: "name",
        type: "string",
      },
      {
        name: "version",
        type: "string",
      },
      {
        name: "chainId",
        type: "uint256",
      },
      {
        name: "verifyingContract",
        type: "address",
      },
    ];

    const MetaTransactionData = [
      {
        name: "from",
        type: "address",
      },
      {
        name: "nonce",
        type: "uint256",
      },
      {
        name: "relayer",
        type: "address",
      },
      {
        name: "functionSignature",
        type: "bytes",
      },
    ];

    const nonce = await Receiver.methods.nonces(currentAccount).call();

    let message = {};

    message.from = currentAccount;
    message.nonce = nonce;
    message.relayer = relayer.publicKey;
    message.functionSignature = "0x00";

    const dataToSign = JSON.stringify({
      types: {
        EIP712Domain: domainType,
        MetaTransaction: MetaTransactionData,
      },
      domain: domainData,
      primaryType: "MetaTransaction",
      message: message,
    });

    var params = [currentAccount, dataToSign];
    var method = "eth_signTypedData_v4";
    console.log(web3);
    web3.currentProvider.sendAsync(
      {
        method,
        params,
        from: currentAccount,
      },
      async function (err, result) {
        if (err) return console.dir(err);
        if (result.error) {
          alert(result.error.message);
        }
        if (result.error) return console.error("ERROR", result);
        console.log("TYPED SIGNED:" + JSON.stringify(result.result));
        console.log(parseSignature(result.result));
        const { v, r, s } = parseSignature(result.result);
        const metaTx = {
          from: currentAccount,
          nonce: nonce,
          relayer: relayer.publicKey,
          functionSignature: "0x00",
        };

        console.log(v, r, s, metaTx, transfers);

        const response = await apis.metaTx({
          transfers,
          signR: r,
          signS: s,
          signV: v,
          metaTx,
        });

        console.log(response);

        /* const recovered = web3.eth.accounts.recoverTypedSignature_v4({
              data: dataToSign,
              sig: result.result,
            }); */
      }
    );
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        marginTop: "100px",
      }}
    >
      <Formik
        initialValues={{
          token1Address: "0xA9e668d6f301Ac5e8D6D0A31a8a130D21D57689d",
          token1RecAddress: "",
          token1Amount: "",
          token2Address: "0xF60ade3278fb56AEC843c0915cCe6ceed3139e74",
          token2RecAddress: "",
          token2Amount: "",
          token3Address: "0xd0307DE6C85D4dfe782cfb9bB003A7814ace44f1",
          token3RecAddress: "",
          token3Amount: "",
        }}
        validationSchema={SignTokenSchema}
        onSubmit={async (values, actions) => {
          try {
            //console.log(values);

            await getSignature(values);

            // const response = await apis.metaTx({
            //   transfers: [
            //     { tokenAddress: "0x00", recipient: "0x00", amount: 2 },
            //     { tokenAddress: "0x00", recipient: "0x00", amount: 5 },
            //   ],
            //   signR: "0x00",
            //   signS: "0x00",
            //   signV: 28,
            //   metaTxs: {
            //     from: "0x00",
            //     nonce: 0,
            //     relayer: "0x00",
            //     functionSignature: "0x00",
            //   },
            // });
            // console.log("response in file : ", response);
          } catch (error) {
            console.log(error);
          }
        }}
      >
        {(props) => (
          <form onSubmit={props.handleSubmit}>
            <Typography variant="h6">Token 1</Typography>
            &nbsp;
            <TextField
              fullWidth
              onBlur={props.handleBlur}
              onChange={props.handleChange}
              label={"Receiver"}
              name="token1RecAddress"
              type="text"
              value={props.values.token1RecAddress}
            />
            &nbsp;
            <TextField
              fullWidth
              onBlur={props.handleBlur}
              onChange={props.handleChange}
              label={"Amount"}
              name="token1Amount"
              type="number"
              value={props.values.token1Amount}
            />
            &nbsp;
            <Typography variant="h6">Token 2</Typography>
            &nbsp;
            <TextField
              // error={
              //   !!(props.touched.token1Address && props.errors.token1Address)
              // }
              // helperText={
              //   props.touched.token1Address && props.errors.token1Address
              // }
              fullWidth
              onBlur={props.handleBlur}
              onChange={props.handleChange}
              label={"Receiver"}
              name="token2RecAddress"
              type="text"
              value={props.values.token2RecAddress}
            />
            &nbsp;
            <TextField
              fullWidth
              onBlur={props.handleBlur}
              onChange={props.handleChange}
              label={"Amount"}
              name="token2Amount"
              type="number"
              value={props.values.token2Amount}
            />
            &nbsp;
            <Typography variant="h6">Token 3</Typography>
            &nbsp;
            <TextField
              // error={
              //   !!(props.touched.token1Address && props.errors.token1Address)
              // }
              // helperText={
              //   props.touched.token1Address && props.errors.token1Address
              // }
              fullWidth
              onBlur={props.handleBlur}
              onChange={props.handleChange}
              label={"Receiver"}
              name="token3RecAddress"
              type="text"
              value={props.values.token3RecAddress}
            />
            &nbsp;
            <TextField
              fullWidth
              onBlur={props.handleBlur}
              onChange={props.handleChange}
              label={"Amount"}
              name="token3Amount"
              type="number"
              value={props.values.token3Amount}
            />
            <Button
              variant="contained"
              color="primary"
              style={{
                marginTop: "1pc",
              }}
              type="submit"
            >
              Transfer Tokens
            </Button>
            {account}
          </form>
        )}
      </Formik>
    </div>
  );
}
