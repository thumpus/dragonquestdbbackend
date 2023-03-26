"use strict";

const db = require("../db");
const { BadRequestError, NotFoundError } = require("../expressError");

class Weapon { 

    /** Find all Weapons w/ optional name filter
     *  if name is passed in it will find case-insensitive, partial matches)
     *
     * 
     *  returns [{ id, name, modifier, buyprice, sellprice, imgurl }]
     */

    static async findAll(searchFilters = {}) {
        let query = `SELECT id,
                            name,
                            modifier,
                            buyprice,
                            sellprice,
                            imgurl
                    FROM weapons`;
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

        //Finalize query and return results

        query += " ORDER BY id"
        const weaponsRes = await db.query(query, queryValues);
        return weaponsRes.rows;
    }

    /**
     * Given a weapon id, return data about that weapon
     * 
     * Returns { id, name, modifier, buyprice, sellprice, imgurl }
     * 
     * Throwns NotFoundError if not found.
     */
    static async get(id) {
        const weaponRes = await db.query(
            `SELECT id,
                    name,
                    modifier,
                    buyprice,
                    sellprice,
                    imgurl
            FROM weapons
            WHERE id = $1`,
            [id]);
        
        const weapon = weaponRes.rows[0];

        if (!weapon) throw new NotFoundError(`no weapon with ID ${id}`);

        return weapon;
    }
}

module.exports = Weapon;