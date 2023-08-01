import React, { useReducer } from "react";
import {
  Button,
  Select,
  MenuItem,
  TextField,
  FormControl,
  InputLabel,
  Modal,
  Box,
} from "@mui/material";
import { useMyAlgoConnect } from "../App";
import algosdk from "algosdk";
import {
  style,
  initialState,
  API_ENDPOINT,
  RECEIVER_ADDRESS,
} from "../constants/formComponent";

function reducer(state, action) {
  switch (action.type) {
    case "SET_AMOUNT":
      return { ...state, amount: action.payload };
    case "SET_OPTION":
      return { ...state, selectedOption: action.payload };
    case "SET_SLIPPAGE":
      return { ...state, slippage: action.payload };
    case "SET_LOADING":
      return { ...state, loading: action.payload };
    case "SET_OPEN_MODAL":
      return { ...state, openModal: action.payload };
    case "SET_ALGO_COST":
      return { ...state, algoCost: action.payload };
    case "SET_MODAL_TYPE":
      return { ...state, modalType: action.payload };
    case "CLEAR_MODAL_TYPE":
      return { ...state, modalType: null };
    case "SET_EXPECTED_ALGOS":
      return { ...state, expectedAlgos: action.payload };
    default:
      return state;
  }
}

const FormComponent = ({ buttonLabel, market }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { myAlgoConnect, address } = useMyAlgoConnect();

  const fetchRequest = async (url, options = {}) => {
    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error(`An error has occured: ${response.status}`);
    }
    return await response.json();
  };

  const handlePurchaseClick = async () => {
    dispatch({ type: "SET_LOADING", payload: true });

    if (!address || !state.amount || !state.selectedOption || !state.slippage) {
      alert("Please fill out all fields and connect your wallet first.");
      dispatch({ type: "SET_LOADING", payload: false });
      return;
    }

    const selectedAssetId =
      state.selectedOption === "yes" ? market.yesAssetId : market.noAssetId;
    const url = `${API_ENDPOINT}isAccountOptedIn?assetId=${selectedAssetId}&address=${address}`;

    try {
      const data = await fetchRequest(url);

      if (!data.isOptedIn) {
        const optInResponse = await fetchRequest(`${API_ENDPOINT}getParams`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({}),
        });

        const txData = await optInResponse;
        const txn = algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
          suggestedParams: txData.txnParams,
          from: address,
          to: address,
          assetIndex: selectedAssetId,
          amount: 0,
        });

        const txns = [
          {
            txn: Buffer.from(txn.toByte()).toString("base64"),
          },
        ];
        const signedTxn = await myAlgoConnect.signTxns(txns);

        await fetchRequest(`${API_ENDPOINT}submitSignedTransaction`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ signedTxn: signedTxn[0] }),
        });
      }

      let calculateSharePurchaseReq = await fetchRequest(
        `${API_ENDPOINT}calculateSharePurchase`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            marketId: market.marketId,
            shareType: state.selectedOption,
            amount: state.amount,
          }),
        },
      );

      const AlgoCost = calculateSharePurchaseReq.result;
      dispatch({ type: "SET_ALGO_COST", payload: AlgoCost });
      dispatch({ type: "SET_MODAL_TYPE", payload: "purchase" });
      dispatch({ type: "SET_OPEN_MODAL", payload: true });
    } catch (err) {
      console.error(err);
      dispatch({ type: "SET_LOADING", payload: false });
    }

    dispatch({ type: "SET_LOADING", payload: false });
  };

  const handleSaleClick = async () => {
    dispatch({ type: "SET_LOADING", payload: true });

    if (!address || !state.amount || !state.selectedOption || !state.slippage) {
      alert("Please fill out all fields and connect your wallet first.");
      dispatch({ type: "SET_LOADING", payload: false });
      return;
    }

    const selectedAssetId =
      state.selectedOption === "yes" ? market.yesAssetId : market.noAssetId;
    const url = `${API_ENDPOINT}isAccountOptedIn?assetId=${selectedAssetId}&address=${address}`;

    try {
      const data = await fetchRequest(url);

      if (!data.isOptedIn) {
        alert("You haven't opted in to this asset yet!");
        dispatch({ type: "SET_LOADING", payload: false });
        return;
      }

      let calculateShareSaleReq = await fetchRequest(
        `${API_ENDPOINT}calculateShareSale`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            marketId: market.marketId,
            shareType: state.selectedOption,
            shares: Number(state.amount),
          }),
        },
      );

      const expectedAlgos = calculateShareSaleReq.result;
      dispatch({ type: "SET_EXPECTED_ALGOS", payload: expectedAlgos });
      dispatch({ type: "SET_OPEN_MODAL", payload: true });
      dispatch({ type: "SET_MODAL_TYPE", payload: "sale" });
    } catch (err) {
      console.error(err);
      dispatch({ type: "SET_LOADING", payload: false });
    }

    dispatch({ type: "SET_LOADING", payload: false });
  };

  const handleCloseModal = () => {
    dispatch({ type: "SET_LOADING", payload: false });
    dispatch({ type: "SET_OPEN_MODAL", payload: false });
  };

  const handleConfirmPurchase = async () => {
    dispatch({ type: "SET_LOADING", payload: true });
    dispatch({ type: "SET_OPEN_MODAL", payload: false });

    try {
      const getParamsResponse = await fetchRequest(`${API_ENDPOINT}getParams`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });

      const txn = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
        suggestedParams: getParamsResponse.txnParams,
        from: address,
        to: RECEIVER_ADDRESS,
        amount: Math.ceil(state.algoCost * 1000000),
      });

      const txns = [
        {
          txn: Buffer.from(txn.toByte()).toString("base64"),
        },
      ];

      const signedTxn = await myAlgoConnect.signTxns(txns);
      const networkConfirmation = await fetchRequest(
        `${API_ENDPOINT}submitSignedTransaction`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ signedTxn: signedTxn[0] }),
        },
      );

      const TxID = networkConfirmation.txId;
      // execute trade
      const tradeExecutionReq = await fetchRequest(
        `${API_ENDPOINT}executeTrade`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            transactionId: TxID,
            sender: address,
            receiver: RECEIVER_ADDRESS,
            sharesOrAmount: Math.ceil(state.algoCost * 1000000) / 1000000,
            marketId: market.marketId,
            slippageAllowed: Number(state.slippage),
            expectedSharesOrAlgos: Number(state.amount),
            shareType: state.selectedOption,
            tradeType: "purchase",
          }),
        },
      );

      dispatch({ type: "SET_AMOUNT", payload: "" });
      dispatch({ type: "SET_SLIPPAGE", payload: 0.05 });
      alert("Transaction successful!");
    } catch (err) {
      console.error(err);
      alert("Transaction failed. Please try again.");
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  const handleActionClick = () => {
    if (buttonLabel === "Purchase") {
      handlePurchaseClick();
    } else {
      handleSaleClick();
    }
  };

  const handleConfirmSale = async () => {
    dispatch({ type: "SET_LOADING", payload: true });
    dispatch({ type: "SET_OPEN_MODAL", payload: false });

    const selectedAssetId =
      state.selectedOption === "yes" ? market.yesAssetId : market.noAssetId;

    try {
      const getParamsResponse = await fetchRequest(`${API_ENDPOINT}getParams`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });

      const txn = algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
        suggestedParams: getParamsResponse.txnParams,
        from: address,
        to: RECEIVER_ADDRESS,
        amount: Number(state.amount),
        assetIndex: selectedAssetId,
      });

      const txns = [
        {
          txn: Buffer.from(txn.toByte()).toString("base64"),
        },
      ];

      const signedTxn = await myAlgoConnect.signTxns(txns);
      const networkConfirmation = await fetchRequest(
        `${API_ENDPOINT}submitSignedTransaction`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ signedTxn: signedTxn[0] }),
        },
      );

      const TxID = networkConfirmation.txId;
      // execute trade
      console.log({
        transactionId: TxID,
        sender: address,
        receiver: RECEIVER_ADDRESS,
        sharesOrAmount: Number(state.amount),
        marketId: market.marketId,
        slippageAllowed: Number(state.slippage),
        expectedSharesOrAlgos: Math.floor(state.expectedAlgos * 1000000) / 1000000,
        shareType: state.selectedOption,
        tradeType: "sale",
      })
      const tradeExecutionReq = await fetchRequest(
        `${API_ENDPOINT}executeTrade`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            transactionId: TxID,
            sender: address,
            receiver: RECEIVER_ADDRESS,
            sharesOrAmount: Number(state.amount),
            marketId: market.marketId,
            slippageAllowed: Number(state.slippage),
            expectedSharesOrAlgos: Math.floor(state.expectedAlgos * 1000000) / 1000000,
            shareType: state.selectedOption,
            tradeType: "sale",
          }),
        },
      );

      dispatch({ type: "SET_AMOUNT", payload: "" });
      dispatch({ type: "SET_SLIPPAGE", payload: "" });
      alert("Transaction successful!");
    } catch (err) {
      console.error(err);
      alert("Transaction failed. Please try again.");
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  return (
    <>
      <Box display="flex" flexDirection="column" gap={2} mt={5} mb={5}>
        <Box display="flex" flexDirection="row" gap={2}>
          <FormControl fullWidth style={{ flexGrow: 1, flexBasis: "0" }}>
            <InputLabel id="option-select-label">Option</InputLabel>
            <Select
              labelId="option-select-label"
              id="option-select"
              value={state.selectedOption}
              label="Option"
              onChange={(event) =>
                dispatch({ type: "SET_OPTION", payload: event.target.value })
              }
            >
              <MenuItem value={"yes"}>Yes</MenuItem>
              <MenuItem value={"no"}>No</MenuItem>
            </Select>
          </FormControl>
          <TextField
            id="outlined-basic"
            label="Amount"
            variant="outlined"
            value={state.amount}
            style={{ flexGrow: 1, flexBasis: "0" }}
            onChange={(event) =>
              dispatch({ type: "SET_AMOUNT", payload: event.target.value })
            }
          />
        </Box>
        <Box display="flex" flexDirection="row" gap={2}>
          <FormControl fullWidth style={{ flexGrow: 1, flexBasis: "0" }}>
            <InputLabel id="slippage-select-label">Max Slippage</InputLabel>
            <Select
              labelId="slippage-select-label"
              id="slippage-select"
              value={state.slippage}
              label="Max Slippage"
              onChange={(event) =>
                dispatch({ type: "SET_SLIPPAGE", payload: event.target.value })
              }
            >
              <MenuItem value={0.05}>5%</MenuItem>
              <MenuItem value={0.1}>10%</MenuItem>
              <MenuItem value={0.15}>15%</MenuItem>
              <MenuItem value={0.2}>20%</MenuItem>
              <MenuItem value={0.25}>25%</MenuItem>
            </Select>
          </FormControl>
          <Button
            variant="contained"
            color="primary"
            disabled={state.loading}
            onClick={handleActionClick}
            style={{ flexGrow: 1, flexBasis: "0" }}
          >
            {buttonLabel === "Purchase" ? "Purchase" : "Sell"}
          </Button>
        </Box>
      </Box>
      <Modal open={state.openModal} onClose={handleCloseModal}>
        <Box sx={style}>
          {state.modalType === "purchase" ? (
            <>
              <h2>Confirm Purchase</h2>
              <p>
                This transaction will cost you approximately{" "}
                {Math.ceil(state.algoCost)} ALGO. Do you wish to proceed?
              </p>
              <Button
                variant="contained"
                color="primary"
                onClick={handleConfirmPurchase}
              >
                Confirm Purchase
              </Button>
            </>
          ) : state.modalType === "sale" ? (
            <>
              <h2>Confirm Sale</h2>
              <p>
                This transaction will yield approximately {Math.ceil(state.expectedAlgos * 10000)/10000}{" "}
                ALGO. Do you wish to proceed?
              </p>
              <Button
                variant="contained"
                color="primary"
                onClick={handleConfirmSale}
              >
                Confirm Sale
              </Button>
            </>
          ) : null}
        </Box>
      </Modal>
    </>
  );
};

export default FormComponent;
