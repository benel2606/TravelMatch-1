import React from "react";
import { Switch } from "react-router-dom";
import ProtectedRoute from "../Generals/ProtectedRoute";
import DisplayMatches from "./DisplayMatches/DisplayMatches";

const MatchManagementApp = () => {
  return (
    <Switch>
      <ProtectedRoute
        path="/Matches/:userID&:placeID&:latitude&:longitude"
        exact
        component={DisplayMatches}
      />
    </Switch>
  );
};

export default MatchManagementApp;