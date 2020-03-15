import React, { useState } from "react";
import server from "../../api";
import { useHistory } from "react-router-dom";
const countries = require("../../countries.json");

const Register = props => {
  let history = useHistory();
  const [country, setCountry] = useState(countries[106].name);

  const generateCountries = () => {
    return countries.map(country => {
      return (
        <option key={country.code} value={country.name}>
          {country.name}
        </option>
      );
    });
  };

  const createDictionaryForm = ({ target }) => {
    let details = {};

    for (let i = 0; i < target.length - 1; i++) {
      let name = target[i].name;
      let value = target[i].value;
      details[name] = value;
    }
    return details;
  };

  const submitForm = async event => {
    event.preventDefault();
    let formData = createDictionaryForm(event);
    server
      .post("/registerrequest", formData)
      .then(function(response) {
        console.log(response);
        history.push("/Login");
      })
      .catch(function(error) {
        console.log(error);
      });
  };

  const createForm = () => {
    return (
      <div>
        <form className="ui form" onSubmit={submitForm} action="/Login">
          <div className="field">
            <label>First name</label>
            <input type="text" name="firstname" placeholder="First Name" />
          </div>
          <div className="field">
            <label>Last name</label>
            <input type="text" name="lastname" placeholder="Last Name" />
          </div>
          <div className="field">
            <label>Age</label>
            <input type="number" name="age" placeholder="Age" />
          </div>

          <div className="field">
            <label>Country</label>
            <select name="country" value={country} onChange={setCountry}>
              {generateCountries()}
            </select>
          </div>
          <div className="field">
            <label>Username</label>
            <input type="text" name="username" placeholder="Uservame" />
          </div>
          <div className="field">
            <label>Password</label>
            <input type="password" name="password" placeholder="Password" />
          </div>
          <button className="ui button" type="submit">
            Register
          </button>
        </form>
      </div>
    );
  };

  return <div>{createForm()}</div>;
};

export default Register;
