"use strict"

//Routes for Weapons 

const express = require("express");

const { BadRequestError } = require("../expressError");
const Weapon = require("../models/weapon");

const router = new express.Router();

/**
 * GET / => 
 *  { weapons: [{ id, name, modifier, buyprice, sellprice, imgurl }, ...] }
 * 
 * Can filter by name (will find case insensitive, partial matches) 
 */

router.get("/", async function (req, res, next) {
    const q = req.query;
    
    try {
        const weapons = await Weapon.findAll(q);
        return res.json({ weapons });
    } catch (err) {
        return next(err);
    }
});

/**
 * GET /[id] => { weapon }
 * 
 * Returns { id, name, modifier, buyprice, sellprice, imgurl }
 */

router.get("/:id", async function (req, res, next) {
    try {
        const weapon = await Weapon.get(req.params.id);
        return res.json({ weapon });
    } catch (err) {
        return next(err);
    }
})

module.exports = router;