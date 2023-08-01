export const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
};

export const API_ENDPOINT = "https://xmarkets-api.onrender.com/api/";
export const RECEIVER_ADDRESS =
  "XMPAEQVSMBALMROXBTFCQ6EKFRX5CAV24ENPGLTSP3527M5JZ6ZTGYX66Y";

export const initialState = {
  amount: "", // The amount to purchase or sell
  selectedOption: "yes", // The selected option ('yes' or 'no')
  slippage: 0.05, // The maximum slippage
  loading: false, // Whether the form is currently loading
  openModal: false, // Whether the confirmation modal is open
  algoCost: null, // The cost of the transaction in ALGO
  modalType: null, // The type of the current modal ('purchase', 'sale', or null)
  expectedAlgos: null, // The expected Algos returned from a sale
};
