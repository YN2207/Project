const User = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const secret = process.env.JWT_SECRET;

const register = (req, res) => {
  const user = new User(req.body);

  user
    .save()
    .then(() => {
      res.json({ msg: "success!", user: user });
    })
    .catch((err) => res.status(400).json(err));
};

const login = (req, res) => {
  User.findOne({ email: req.body.email })
    .then((user) => {
      if (user === null) {
        res.status(400).json({ msg: "Invalid login attempt - err 1" });
      } else {
        bcrypt
          .compare(req.body.password, user.password)
          .then((passwordIsValid) => {
            if (passwordIsValid) {
              res
                .cookie(
                  "usertoken",
                  jwt.sign(
                    {
                      _id: user._id,
                      email: user.email,
                      firstName: user.firstName,
                    },
                    process.env.JWT_SECRET
                  ),
                  {
                    httpOnly: true,
                    expires: new Date(Date.now() + 900000000),
                  }
                )
                .json({
                  msg: "success!",
                  userLogged: {
                    username: `${user.firstName} ${user.lastName}`,
                    userId: `${user._id}`,
                    userLoggedIn: `${user.firstName}`,
                  },
                });
            } else {
              res.status(400).json({ msg: "Invalid login attempt - err 2" });
            }
          })
          .catch((err) =>
            res.status(400).json({ msg: "Invalid login attempt - err 3" })
          );
      }
    })
    .catch((err) => res.json(err));
};

const logout = (req, res) => {
  console.log("logging out");
  res.clearCookie("usertoken");
  res.json({ msg: "usertoken cookie cleared" });
};

const getLoggedInUser = (req, res) => {
  const decodedJWT = jwt.decode(req.cookies.usertoken, { complete: true });

  User.findById(decodedJWT.payload._id)
    .then((user) => res.json(user))
    .catch((err) => res.json(err));
};

const deleteOneUser = (req, res) => {
  User.deleteOne({ _id: req.params.id })
    .then((deleteConfirmation) => res.json(deleteConfirmation))
    .catch((err) =>
      res
        .status(400)
        .json({ message: "Something went wrong in delete user", error: err })
    );
};

module.exports = {
  register,
  login,
  logout,
  deleteOneUser,
  getLoggedInUser,
};
