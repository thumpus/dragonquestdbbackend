"use strict";

const db = require("../db");
const { BadRequestError, NotFoundError } = require("../expressError");

//Related functions for spell.

class Spell {

    /**
     * Find all spells with optional name filter (case insensitive, partial matches)
     * 
     * returns [{ id, name, levellearned, mpcost, effect }, ...]
     */

    static async findAll(searchFilters = {}) {
        let query = `SELECT id,
                            name,
                            levellearned,
                            mpcost,
                            effect,
                            imgurl
                    FROM spells`;
        let whereExpressions = [];
        let queryValues = [];

        const { name } = searchFilters;

        if (name) {
            queryValues.push(`%${name}%`);
            whereExpressions.push(`name ILIKE $${queryValues.length}`);
        }

        if (whereExpressions.length > 0) {
            query += " WHERE " + whereExpressions.join(" AND ");
        }
        
        //finalize query and return results

        query += " ORDER BY id"
        const spellRes = await db.query(query, queryValues);
        return spellRes.rows;
    }

    /**
     * Given a spell id, return data about that spell
     * 
     * Returns { id, name, levellearned, mpcost, effect } 
     * 
     * Throws NotFoundError if not found
     */

    static async get(id) {
        const spellRes = await db.query(
            `SELECT id,
                    name,
                    levellearned,
                    mpcost,
                    effect,
                    imgurl
            FROM spells
            WHERE id = $1`,
            [id]);
        
        const spell = spellRes.rows[0];

        if (!spellRes) throw new NotFoundError(`no monster with ID ${id}`);

        return spell;
    }
}

module.exports = Spell;