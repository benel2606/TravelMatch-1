import "./FilterModal.css";
import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import { useHistory } from "react-router-dom";
import { server, socket } from "../../api";
import { connect } from "react-redux";
import { createDictionaryForm } from "../../utilities";
const countries = require("../../Generals/countries.json");

const FilterModal = ({ userCredentials, location, placeID, ...props }) => {
  let history = useHistory();

  const [matchUserDetails, setmatchUserDetails] = useState({
    userID: null,
    placeID: null,
    latitude: null,
    longitude: null,
  });

  const modalStyles = {
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
    },
  };

  Modal.setAppElement("#root");

  useEffect(() => {
    setmatchUserDetails({
      userID: userCredentials._id,
      placeID: placeID,
      ...location,
    });
  }, [userCredentials, placeID, location]);

  const findMatches = async (event) => {
    event.preventDefault();
    let formData = createDictionaryForm(event);
    delete formData[""];
    matchUserDetails.attributes = { ...formData };
    server
      .post("/match_request", matchUserDetails)
      .then(function (response) {
        socket.emit("newMatchInserted");
        console.log(response);
        history.push(
          `/Matches/${createURLParameters(matchUserDetails, formData)}`
        );
      })
      .catch(function (error) {
        console.log(error.request.responseText);
      });
  };

  const createURLParameters = (matchUserDetails, formData) => {
    let urlParameters = "";
    const keys = Object.keys(matchUserDetails);
    const formKeys = Object.keys(formData);
    keys.forEach((key, ind) => {
      if (ind < keys.length - 1) {
        urlParameters += matchUserDetails[key] + "&";
      }
    });
    formKeys.forEach((key, ind) => {
      if (ind < keys.length - 1) {
        urlParameters += formData[key] + "&";
      } else {
        urlParameters += formData[key];
      }
    });
    return urlParameters;
  };

  const generateCountries = () => {
    return countries.map((country) => {
      return (
        <option key={country.code} value={country.name}>
          {country.name}
        </option>
      );
    });
  };

  const getNextSiblings = (elem, classNameFilter) => {
    var sibs = [];

    while ((elem = elem.nextSibling)) {
      if (elem.className === classNameFilter) {
        sibs.push(elem);
      }
    }
    return sibs;
  };

  const inputHandler = (event) => {
    const siblings = getNextSiblings(event.target, "inputs");
    siblings.forEach((el) => {
      el.disabled = !event.target.checked;
    });
  };

  return (
    <Modal style={modalStyles} {...props}>
      <form className="ui form" onSubmit={findMatches}>
        <div className="field">
          <label>Number of participants:</label>
          <input type="checkbox" onChange={inputHandler} />
          <input
            className="inputs"
            type="number"
            name="participants"
            placeholder="Amount of participants you wish"
            defaultValue={0}
            disabled
          />
        </div>
        <div className="field">
          <label>Age range:</label>
          <input type="checkbox" onChange={inputHandler} />
          <div>from</div>
          <input
            className="inputs"
            type="number"
            name="fromAge"
            placeholder="From Age"
            defaultValue={0}
            disabled
          />
          <div>to</div>
          <input
            className="inputs"
            type="number"
            name="toAge"
            placeholder="To Age"
            defaultValue={0}
            disabled
          />
        </div>
        <div className="field">
          <label>Gender</label>
          <input type="checkbox" onChange={inputHandler} />
          <select className="inputs" name="gender" disabled>
            <option key="None" value="None">
              None
            </option>
            <option key="Male" value="Male">
              Male
            </option>
            <option key="Female" value="Female">
              Female
            </option>
          </select>
        </div>
        <div className="field">
          <label>Country</label>
          <input type="checkbox" onChange={inputHandler} />
          <select className="inputs" name="country" disabled>
            <option key="None" value="None">
              None
            </option>
            {generateCountries()}
          </select>
        </div>
        <button className="ui button green" type="submit">
          Find Match
        </button>
      </form>
    </Modal>
  );
};

const mapStateToProps = (state) => {
  return {
    userCredentials: state.profileReducer,
    location: state.locationReducer,
  };
};

export default connect(mapStateToProps)(FilterModal);
