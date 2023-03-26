"use strict";

const db = require("../db");
const { BadRequestError, NotFoundError } = require("../expressError");

class Stat {

    static async findStats(lvl) {
        const statsRes = await db.query(
            `SELECT lvl,
                    exp,
                    atk
            FROM levels
            WHERE lvl = $1`,
            [lvl]);
            
        const stats = statsRes.rows[0];

        if (!stats) throw new NotFoundError(`invalid level: ${id}`);

        return stats;
    }
}

module.exports = Stat;