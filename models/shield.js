"use strict";

const db = require("../db");
const { BadRequestError, NotFoundError } = require("../expressError");

//Related functions for shields

class Shield {
    
    /**
     * Find all Shields w/ optional name filter on searchFilters
     * name filter will find case-insensitive, partial matches
     * 
     * returns [{ id, name, modifier, buyprice, sellprice, imgurl }, ...]
     */

    static async findAll(searchFilters = {}) {
        let query = `SELECT id,
                            name,
                            modifier,
                            buyprice,
                            sellprice,
                            imgurl
                    FROM shields`;
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

        query += " ORDER BY id";
        const shieldsRes = await db.query(query, queryValues);
        return shieldsRes.rows;
    }

    /**
     * Given a shield id, return data about that shield
     * 
     * Returns { id, name, modifier, buyprice, sellprice, imgurl }
     * 
     * Throwns NotFoundError if not found.
     */

    static async get(id) {
        const shieldRes = await db.query(
            `SELECT id,
                    name,
                    modifier,
                    buyprice,
                    sellprice,
                    imgurl
            FROM shields
            WHERE id = $1`,
            [id]);

        const shield = shieldRes.rows[0];

        if (!shield) throw new NotFoundError(`no shield with ID ${id}`);

        return shield;
    }
}

module.exports = Shield;
