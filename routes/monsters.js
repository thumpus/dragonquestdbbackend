"use strict";

//Routes for Monsters

const express = require("express");

const { BadRequestError } = require("../expressError");
const Monster = require("../models/monster");

const router = new express.Router();

/** GET / =>
 *  { monsters: [ { id, name, hp, mp, atk, def, agility, exp, gold, imgurl, abilities, spells }, ...] }
 * 
 * Can filter based on parameters:
 * minExp
 * maxExp
 * nameLike (will find case insensitive, partial matches)
 * 
 */
router.get("/", async function (req, res, next) {
    const q = req.query;
    // arrive as strings from query string, this converts it into ints
    if (q.minExp !== undefined) q.minExp = +q.minExp;
    if (q.maxExp !== undefined) q.maxExp = +q.maxExp;

    try {
        const monsters = await Monster.findAll(q);
        return res.json({ monsters });
    } catch (err) {
        return next(err);
    }
});

/**
 * GET /[id] => { monster }
 * 
 * Returns { id, name, hp, mp, atk, def, agility, exp, gold, imgurl, abilities, spells }
 */

router.get("/:id", async function (req, res, next) {
    try {
        const monster = await Monster.get(req.params.id);
        return res.json({ monster });
    } catch (err) {
        return next(err); 
    }
})

module.exports = router;

