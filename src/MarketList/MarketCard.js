import React, { useState } from "react";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";
import { CardHeader, Avatar, IconButton, Collapse } from "@mui/material";
import { ExpandMore as ExpandMoreIcon } from "@mui/icons-material";
import LockClockIcon from "@mui/icons-material/LockClock";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import ScheduleIcon from "@mui/icons-material/Schedule";
import yesIcon from "../assets/iconYes.png";
import noIcon from "../assets/iconNo.png";
import Divider from "@mui/material/Divider";
import { calculateDaysLeft, formatNumber } from "../helpers";
import { BLUE_COLOR } from "../constants/colors";
import FormComponent from "./FormComponent"; // import FormComponent

const MarketCard = ({ market }) => {
  const [expanded, setExpanded] = useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const differenceInDays = calculateDaysLeft(market.expiryDate);

  return (
    <Grid item xs={12} sm={6} md={4} key={market.id}>
      <Card sx={{ marginY: "20px", marginX: "10px" }}>
        <CardHeader
          avatar={
            <Avatar aria-label="market" sx={{ backgroundColor: BLUE_COLOR }}>
              {market.marketName.charAt(0)}
            </Avatar>
          }
          action={
            <IconButton
              onClick={handleExpandClick}
              aria-expanded={expanded}
              aria-label="show more"
            >
              <ExpandMoreIcon />
            </IconButton>
          }
          title={market.marketName}
          subheader={market.marketDescription}
        />
        <CardContent>
          <Typography
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              fontSize: 10,
            }}
          >
            <LockClockIcon fontSize="15" style={{ marginRight: "5px" }} />
            {differenceInDays} days left
          </Typography>
        </CardContent>
        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <CardContent>
            <Grid container style={{ marginBottom: 10 }}>
              <Grid
                item
                xs={4}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                }}
              >
                <img
                  src={yesIcon}
                  alt="Yes Icon"
                  style={{ width: "15px", marginRight: "10px" }}
                />
                <Typography variant="body2" color="text.secondary">
                  {formatNumber(market.yesShares)}
                </Typography>
              </Grid>
              <Grid
                item
                xs={4}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <img src={noIcon} alt="No Icon" style={{ width: "15px" }} />
                <Typography variant="body2" color="text.secondary">
                  {formatNumber(market.noShares)}
                </Typography>
              </Grid>
              <Grid
                item
                xs={4}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-end",
                }}
              >
                <AccountBalanceWalletIcon fontSize="15" />
                <Typography variant="body2" color="text.secondary">
                  {formatNumber(market.AlgoBalance)}
                </Typography>
              </Grid>
            </Grid>
            <Divider />
            <Typography
              variant="body2"
              style={{
                display: "flex",
                alignItems: "center",
                marginTop: 10,
                fontSize: 10,
                justifyContent: "flex-end",
              }}
              color="text.secondary"
            >
              <ScheduleIcon fontSize="15" /> Resolution in{" "}
              {calculateDaysLeft(market.resolutionDate)} days
            </Typography>
            {/* Purchase form */}
            <FormComponent buttonLabel="Purchase" market={market} />
            {/* Sale form */}
            <FormComponent buttonLabel="Sell" market={market} />
          </CardContent>
        </Collapse>
      </Card>
    </Grid>
  );
};

export default MarketCard;
