import React, { useState } from "react";
import axios from "axios";
import { Button } from "@material-ui/core";

const RegisterUser = (props) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [confirmReg, setConfirmReg] = useState("");
  const [errs, setErrs] = useState({});



  const registerHandler = (event) => {
    event.preventDefault();

    const newUser = {
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
    };

    axios
      .post("http://localhost:8000/api/user/register", newUser, {
        withCredentials: true,
      })
      .then((response) => {
        console.log(response.data);
        setFirstName("");
        setLastName("");
        setEmail("");
        setPassword("");
        setConfirmPassword("");
        setErrs({}); 
        setConfirmReg("Thank you for registering, you can now log in!");
      })
      .catch((err) => {
        console.log(err);
        setErrs(err.response.data.errors);
      });
  };

  return (
    <div>
      <h2>Register</h2>
      {confirmReg ? <h4 style={{ color: "green" }}>{confirmReg}</h4> : null}
      <form onSubmit={registerHandler}>
        <div>
          <label>First Name</label>
          {errs.firstName ? (
            <span className='error-text'>{errs.firstName.message}</span>
          ) : null}
          <input
            type='text'
            name='firstName'
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
        </div>
        <div>
          <label>Last Name</label>
          {errs.lastName ? (
            <span className='error-text'>{errs.lastName.message}</span>
          ) : null}
          <input
            type='text'
            name='lastName'
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
        </div>
        <div>
          <label>Email</label>
          {errs.email ? (
            <span className='error-text'>{errs.email.message}</span>
          ) : null}
          <input
            type='text'
            name='email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <label>Password</label>
          {errs.password ? (
            <span className='error-text'>{errs.password.message}</span>
          ) : null}
          <input
            type='password'
            name='password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div>
          <label>Confirm Password</label>
          {errs.confirmPassword ? (
            <span className='error-text'>{errs.confirmPassword.message}</span>
          ) : null}
          <input
            type='password'
            name='confirmPassword'
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>
        <div className='center'>
          <Button variant='contained' color='primary' type='submit'>
            Register Me
          </Button>
        </div>
      </form>
    </div>
  );
};

export default RegisterUser;
