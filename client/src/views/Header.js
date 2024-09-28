import React, { useState, useEffect } from "react";
import { navigate } from "@reach/router";
import axios from "axios";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";

const Header = () => {
  const [userId, setUserId] = useState("");
  const [fakeBoolean, setFakeBoolean] = useState(false);

  useEffect(() => {
    setUserId(localStorage.getItem("userId"));
  }, [userId]);

  const logout = (e) => {
    e.preventDefault();
    axios
      .post(
        "http://localhost:8000/api/user/logout",
        {},
        {
          withCredentials: true,
        }
      )
      .then((res) => {
        console.log(res.data);
        localStorage.removeItem("userId");
        setUserId("");
        setFakeBoolean(!fakeBoolean);
        navigate("/");
      })
      .catch((err) => {
        console.log(err);
        navigate("/");
      });
  };

  return (
    <div>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position='static'>
          <Toolbar>
            <IconButton
              size='large'
              edge='start'
              color='inherit'
              aria-label='menu'
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant='h6' component='div' sx={{ flexGrow: 1 }}>
              LIFE GOALS
            </Typography>
            <Button
              color='inherit'
              size='small'
              variant='outlined'
              onClick={() => navigate("/goals")}
            >
              See All Goals
            </Button>
            <Button
              size='small'
              variant='outlined'
              color='inherit'
              onClick={() => navigate("/")}
            >
              Login to edit and add goals
            </Button>
            <Button
              size='small'
              variant='outlined'
              color='inherit'
              onClick={logout}
            >
              Logout
            </Button>
          </Toolbar>
        </AppBar>
      </Box>
    </div>
  );
};

export default Header;
