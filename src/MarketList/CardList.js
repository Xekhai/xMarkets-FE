import React, { useEffect, useState } from "react";
import Grid from "@mui/material/Grid";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../firebaseConfig";
import MarketCard from "./MarketCard"; // import MarketCard component

// Card List component
const CardList = () => {
  const [markets, setMarkets] = useState([]);

  useEffect(() => {
    const marketCollection = collection(db, "xmp-markets");
    const unsubscribe = onSnapshot(marketCollection, (snapshot) => {
      const marketList = snapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));

      const now = new Date();

      const activeMarketList = marketList.filter((market) => {
        // Make sure your expiryDate is in a format that can be parsed to a Date object
        const expiryDate = new Date(market.expiryDate);
        return expiryDate >= now;
      });

      setMarkets(activeMarketList);
    });

    return () => unsubscribe();
  }, []);

  return (
    <Grid
      container
      style={{ marginTop: "20px", maxWidth: "80%", margin: "20px auto" }}
    >
      {markets.map((market) => (
        <MarketCard key={market.id} market={market} />
      ))}
    </Grid>
  );
};

export default CardList;
