import React, { createContext, useContext, useState } from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Container from "@mui/material/Container";
import MarketList from "./MarketList";
import MyAlgoConnect from "@randlabs/myalgo-connect";
import { Buffer } from "buffer";

const MyAlgoConnectContext = createContext();

window.Buffer = Buffer;

export const useMyAlgoConnect = () => useContext(MyAlgoConnectContext);

export const MyAlgoConnectProvider = ({ children }) => {
  const myAlgoConnect = new MyAlgoConnect();
  const [address, setAddress] = useState(null);

  return (
    <MyAlgoConnectContext.Provider
      value={{ myAlgoConnect, address, setAddress }}
    >
      {children}
    </MyAlgoConnectContext.Provider>
  );
};

// App Bar component (Top Navbar)
const MyAppBar = () => {
  const { myAlgoConnect, address, setAddress } = useMyAlgoConnect();

  const handleWalletConnect = async () => {
    try {
      const accounts = await myAlgoConnect.connect();
      //console.log(accounts[0].address)
      setAddress(accounts[0].address); // assuming it's the first account
    } catch (err) {
      console.error(err);
    }
  };

  const handleWalletDisconnect = () => {
    // TODO Replace this with the actual disconnect logic from myAlgoConnect
    // I'm just setting the address back to null here for simplicity
    setAddress(null);
  };

  const getShortAddress = (address) => {
    return address && typeof address === "string"
      ? address.substr(0, 3) + "..." + address.substr(-3)
      : "";
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" style={{ flexGrow: 1 }}>
          xMarkets
        </Typography>
        {!address ? (
          <Button color="inherit" onClick={handleWalletConnect}>
            Wallet Connect
          </Button>
        ) : (
          <Button color="inherit" onClick={handleWalletDisconnect}>
            {getShortAddress(address)} (Disconnect)
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
};

// FAQ Section
export const Faq = () => (
  <Container style={{ marginTop: "40px", marginBottom: "40px" }}>
    <Typography variant="h4" style={{ marginBottom: "20px" }}>
      FAQs
    </Typography>
    <Accordion>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography>FAQ Question 1</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Typography>Answer for FAQ Question 1</Typography>
      </AccordionDetails>
    </Accordion>
    {/* Add more panels as needed */}
  </Container>
);
// Footer Section
export const Footer = () => (
  <footer
    style={{
      backgroundColor: "#3f51b5",
      color: "white",
      padding: "20px 0",
      position: "relative",
      bottom: "0",
      width: "100%",
    }}
  >
    <Container>
      <Typography variant="body1" align="center">
        © 2023 My App. All rights reserved.
      </Typography>
    </Container>
  </footer>
);

const App = () => (
  <MyAlgoConnectProvider>
    <div>
      <MyAppBar />
      <MarketList />
      <Faq />
      <Footer />
    </div>
  </MyAlgoConnectProvider>
);

export default App;
