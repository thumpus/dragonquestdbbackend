"use strict";

/** Express app for Dragon Quest API */

const express = require("express");
const cors = require("cors");

const { NotFoundError } = require("./expressError");

const { authenticateJWT } = require("./middleware/auth")
const authRoutes = require("./routes/auth");
const usersRoutes = require("./routes/users");
const monstersRoutes = require("./routes/monsters");
const weaponsRoutes = require("./routes/weapons");
const armorRoutes = require("./routes/armors");
const shieldsRoutes = require("./routes/shields");
const spellsRoutes = require("./routes/spells");
const statsRoutes = require("./routes/stats")

const app = express();

app.use(cors());
app.use(express.json());
app.use(authenticateJWT);
app.use("/auth", authRoutes);
app.use("/monsters", monstersRoutes);
app.use("/weapons", weaponsRoutes);
app.use("/armor", armorRoutes);
app.use("/shields", shieldsRoutes);
app.use("/spells", spellsRoutes);
app.use("/users", usersRoutes);
app.use("/stats", statsRoutes);

/** Handle 404 errors -- this matches everything */
app.use(function (req, res, next) {
    return next(new NotFoundError());
  });

/** Add Access Control Allow Origin headers */
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  console.log(res)
  next();
})
  
// generic error handler
app.use(function (err, req, res, next) {
    if (process.env.NODE_ENV !== "test") console.error(err.stack);
    const status = err.status || 500;
    const message = err.message;
  
    return res.status(status).json({
      error: { message, status },
    });
  });
  
  module.exports = app;