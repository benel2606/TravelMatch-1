import "./styles/CategoryApp.css";
import React from "react";
import { Switch } from "react-router-dom";
import ShowCategories from "../CategoriesManagment/MainCategories/ShowCategories";
import ShowSubCategories from "../CategoriesManagment/SubCategories/ShowSubCategories";
import ShowPlaces from "../CategoriesManagment/PlacesList/ShowPlaces";
import ShowEvents from "../CategoriesManagment/ShowEvents";
import { ProtectedRoute } from "../Generals/ProtectedRoute";

const CategoryApp = () => {
  return (
    <Switch>
      <ProtectedRoute path="/Category" exact component={ShowCategories} />
      <ProtectedRoute path="/ShowPlaces/Events" exact component={ShowEvents} />
      <ProtectedRoute
        path="/ShowPlaces/:category"
        exact
        component={ShowSubCategories}
      />
      <ProtectedRoute
        path="/ShowPlaces/:category/:subCategory"
        exact
        component={ShowPlaces}
      />
    </Switch>
  );
};

export default CategoryApp;
