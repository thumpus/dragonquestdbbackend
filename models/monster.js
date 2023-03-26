"use strict";

const db = require("../db");
const { BadRequestError, NotFoundError } = require("../expressError");

// Related functions for monsters

class Monster {

    /** Find all Monsters w/ optional filters on searchFilters
     * 
     * // searchFilters (all optional):
     * -minExp
     * -maxExp
     * -name (will find case-insensitive, partial matches)
     * 
     * returns [{ id, name, hp, mp, atk, def, agility, exp, gold, imgurl, abilities, spells }, ...]
     * */ 

    static async findAll(searchFilters = {}) {
        let query = `SELECT id,
                            name,
                            hp,
                            mp,
                            atk,
                            def,
                            agility,
                            exp,
                            gold,
                            imgurl,
                            abilities,
                            spells
                    FROM monsters`;
        let whereExpressions = [];
        let queryValues = [];

        const { minExp, maxExp, name } = searchFilters;

        if (minExp > maxExp) {
            throw new BadRequestError("Min exp can't be greater than max");
        }

        // For each possible search term, add to whereExpressions and 
        // queryValues so we can generate the right SQL

        if (minExp !== undefined) {
            queryValues.push(minExp);
            whereExpressions.push(`exp >= $${queryValues.length}`);
        }

        if (maxExp !== undefined) {
            queryValues.push(maxExp);
            whereExpressions.push(`exp <= $${queryValues.length}`);
        }

        if (name) {
            queryValues.push(`%${name}%`);
            whereExpressions.push(`name ILIKE $${queryValues.length}`);
        }

        if (whereExpressions.length > 0) {
            query += " WHERE " + whereExpressions.join(" AND ");
        }

        //Finalize query and return results

        query += " ORDER BY id"
        const monstersRes = await db.query(query, queryValues);
        return monstersRes.rows;
    }

    /** Given a monster id, return data about that monster
     * 
     * Returns { id, name, hp, mp, atk, def, agility, exp, gold, imgurl, abilities, spells }
     * 
     * Throws NotFoundError if not found.
     **/

    static async get(id) {
        const monsterRes = await db.query(
            `SELECT id,
                    name,
                    hp,
                    mp,
                    atk,
                    def,
                    agility,
                    exp,
                    gold,
                    imgurl,
                    abilities,
                    spells
            FROM monsters
            WHERE id = $1`,
            [id]);

        const monster = monsterRes.rows[0];

        if (!monster) throw new NotFoundError(`no monster with ID ${id}`);

        return monster;
    }
    
}

module.exports = Monster;