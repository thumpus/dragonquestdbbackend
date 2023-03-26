"use strict";

const { compareSync } = require("bcrypt");
//Routes for Armor

const express = require("express");

const { BadRequestError } = require("../expressError");
const Armor = require("../models/armor");

const router = new express.Router(); 

/**
 *  GET / = >
 *  {armor: [ {id, name, modifier, buyprice, sellprice, imgurl}, ...]}
 * 
 * Can filter by name (will find case insensitive, partial matches)
 */

router.get("/", async function(req, res, next) {
    const q = req.query;
    
    try {
        const armor = await Armor.findAll(q);
        return res.json({ armor });
    } catch (err) {
        return next(err);
    }
});

/**
 * GET /[id] => { armor }
 * 
 *  Returns { id, name, modifier, buyprice, sellprice, imgurl }
 * 
 */
router.get("/:id", async function (req, res, next) {
    try {
        const armor = await Armor.get(req.params.id);
        return res.json({ armor });
    } catch (err) {
        return next(err);
    }
})

module.exports = router;