import React from "react";
import CreateInfoForm from "../../Generals/CreateInfoForm";
import { server } from "../../api";
import { useHistory } from "react-router-dom";
import { createDictionaryForm } from "../../utilities";

const Register = () => {
  let history = useHistory();

  const submitForm = async (event) => {
    event.preventDefault();
    let formData = createDictionaryForm(event);
    server
      .post("/register_request", formData)
      .then(function (response) {
        console.log(response);
        history.push("/");
      })
      .catch(function (error) {
        alert(error.request.responseText);
      });
  };
  const passwordField = () => (
    <div className="field">
      <label>Password</label>
      <input type="password" name="password" placeholder="Password" />
    </div>
  );
  return (
    <CreateInfoForm submitForm={submitForm} passwordField={passwordField} />
  );
};

export default Register;
