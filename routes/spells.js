"use strict";

//Routes for Spells

const express = require("express");

const { BadRequestError } = require("../expressError");
const Spell = require("../models/spell");

const router = new express.Router();

/**
 * GET / => 
 * { spells [{id, name, levellearned, mpcost, effect}, ...]}
 * 
 * can filter by name (will find case insensitive, partial matches)
 */

router.get("/", async function (req, res, next) {
    const q = req.query;

    try {
        const spells = await Spell.findAll(q);
        return res.json({ spells });
    } catch (err) {
        return next(err);
    }
});

/**
 * GET /[id] => { spell }
 * 
 * returns {id, name, levellearned, mpcost, effect}
 */

router.get("/:id", async function (req, res, next) {
    try {
        const spell = await Spell.get(req.params.id);
        return res.json({ spell });
    } catch (err) {
        return next(err);
    }
})

module.exports = router;