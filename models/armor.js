"use strict";

const db = require("../db");
const { BadRequestError, NotFoundError } = require("../expressError");

//Related functions for armor.

class Armor {
    
    /**
     * Find all armor with optional name filter (finds case insensitive, partial matches)
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
                    FROM armor`;
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
        const armorRes = await db.query(query, queryValues);
        return armorRes.rows;
    }

    /** 
     * Given a weapon id, return data about that monster
     * 
     * Returns { id, name, modifier, buyprice, sellprice, imgurl}
     * 
     * Throws NotFoundError if not found.
     */

    static async get(id) {
        const armorRes = await db.query(
            `SELECT id,
                    name,
                    modifier,
                    buyprice,
                    sellprice,
                    imgurl
            FROM armor
            WHERE id = $1`,
            [id]);
            
        const armor = armorRes.rows[0];

        if (!armor) throw new NotFoundError(`no monster with ID ${id}`);

        return armor;
        
    }
}

module.exports = Armor;