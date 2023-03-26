"use strict";

const express = require("express");

const Stat = require('../models/stat');

const router = new express.Router();

router.get("/:lvl", async function (req, res, next) {
    try {
        const stats = await Stat.findStats(req.params.lvl);
        return res.json({ stats });
    } catch (err) {
        return next(err);
    }
})

module.exports = router;