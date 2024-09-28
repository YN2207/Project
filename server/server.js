require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    credentials: true,
    origin: "http://localhost:3000",
  })
);
app.use(cookieParser());

const port = 8000;

require("./config/mongoose.config")

require("./routes/goal.routes")(app);
require("./routes/user.routes")(app);
require("./routes/comment.routes")(app);

app.listen(process.env.DB_PORT, () =>
  console.log(`Listening for Life Goals on port: ${process.env.DB_PORT}`)
);



