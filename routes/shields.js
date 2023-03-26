"use strict";

//Routes for Shields

const express = require("express");

const { BadRequestError } = require("../expressError");
const Shield = require("../models/shield");

const router = new express.Router();

/**
 * GET / => 
 * { shields [{id, name, modifier, buyprice, sellprice, imgurl}]}
 * 
 * can filter by name (will find case insensitive, partial matches)
 */

router.get("/", async function (req, res, next) {
    const q = req.query;
    
    try {
        const shields = await Shield.findAll(q);
        return res.json({ shields });
    } catch (err) {
        return next(err);
    }
});

/**
 * GET /[id] => { shield }
 * 
 * Returns {id, name, modifier, buyprice, sellprice, imgurl}
 */

router.get("/:id", async function (req, res, next) {
    try {
        const shield = await Shield.get(req.params.id);
        return res.json({ shield });
    } catch (err) {
        return next(err);
    }
})

module.exports = router;