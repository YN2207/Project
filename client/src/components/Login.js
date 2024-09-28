import React, { useState } from "react";
import { navigate } from "@reach/router";
import axios from "axios";
import { Button } from "@material-ui/core";

const Login = (props) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState([]);


  const loginHandler = (e) => {
    e.preventDefault();
    axios
      .post(
        "http://localhost:8000/api/user/login",
        {
          email: email,
          password: password,
        },
        {
          withCredentials: true,
        }
      )
      .then((response) => {
        console.log(response.data);
        localStorage.setItem("userId", response.data.userLogged.userId);
        navigate("/goals");
      })
      .catch((err) => {
        console.log(err);
        setErrorMessage(err.response.data.msg);
      });
  };

  return (
    <div>
      <h2>Login</h2>
      <p className='error-text'>{errorMessage ? errorMessage : ""}</p>
      <form onSubmit={loginHandler}>
        <div>
          <label>Email</label>
          <input
            type='text'
            name='email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <label>Password</label>
          <input
            type='password'
            name='password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className='center'>
          <Button variant='contained' color='primary' type='subit'>
            Login
          </Button>
        </div>
      </form>
    </div>
  );
};

export default Login;
