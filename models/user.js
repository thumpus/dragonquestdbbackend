"use strict"

const db = require("../db");
const bcrypt = require("bcrypt");
const {
    NotFoundError,
    BadRequestError,
    UnauthorizedError,
  } = require("../expressError");
const { sqlForPartialUpdate } = require("../helpers/sql");

  const { BCRYPT_WORK_FACTOR } = require("../config.js");

  /** User functions */

  class User {

    /** authenticate user with username, password.
     * 
     * Returns { username, email, isAdmin, lvl, exp, gold, kills, weaponid }
     * 
     * throws UnauthorizedError if user is not found or wrong password.
     */

    static async authenticate(username, password) {
        //try to find the user first
        const result = await db.query(
            `SELECT username,
                    password,
                    isAdmin,
                    email,
                    lvl,
                    exp,
                    gold,
                    kills,
                    weaponid
            FROM users
            WHERE username = $1`,
        [username],
        ); 

        const user = result.rows[0];

        if (user) {
            //compare hashed pwd to a new hash from pwd
            const isValid = await bcrypt.compare(password, user.password);
            if (isValid === true) {
                delete user.password;
                return user;
            }
        }

        throw new UnauthorizedError("Invalid username/password")
    }

    /** Register user with data
     * 
     * Returns { username, isAdmin, email, lvl, exp, gold, kills, weaponid }
     * 
     * throws BadRequestError on duplicates.
     */

    static async register({ username, password, email, isAdmin}) {
        const duplicateCheck = await db.query(
            `SELECT username
            FROM users
            WHERE username = $1`,
            [username]
        );

        if (duplicateCheck.rows[0]) {
            throw new BadRequestError(`Duplicate username: ${username}`);
        }

        const hashedPassword = await bcrypt.hash(password, BCRYPT_WORK_FACTOR);

        const result = await db.query(
            `INSERT INTO users 
            (username,
             password,
             email,
             isAdmin,
             lvl,
             exp,
             gold,
             kills,
             weaponid)
            VALUES ($1, $2, $3, false, 1, 0, 0, 0, 1)
            RETURNING username, isAdmin, email, lvl, gold, kills, weaponid`,
            [username, hashedPassword, email] );
        
            const user = result.rows[0];

            return user;
    }

    /** Find all users.
     * 
     * Returns [{username, email, isAdmin, lvl, exp, gold, kills, weaponid}, ...]
     * 
     * Orders by number of kills for use in leaderboard 
     * (which should be the only thing this method is used for)
     */

    static async findAll() {
        const result = await db.query(
            `SELECT username,
                    email,
                    isAdmin,
                    lvl,
                    exp,
                    gold,
                    kills,
                    weaponid
            FROM users
            ORDER BY kills DESC
            LIMIT 10`
        );

        return result.rows;
    }

    /** Given a username, return data about user.
   *
   * Returns { username, email, isAdmin, lvl, exp, gold, kills, weaponid }
   *  
   *
   * Throws NotFoundError if user not found.
   **/

  static async get(username) {
    const userRes = await db.query(
          `SELECT username,
                  email,
                  isAdmin,
                  lvl,
                  exp,
                  gold,
                  kills,
                  weaponid
           FROM users
           WHERE username = $1`,
        [username],
    );

    const user = userRes.rows[0];

    if (!user) throw new NotFoundError(`No user: ${username}`);

    return user;
  }

  /** Update user data with `data`.
   *
   * This is a "partial update" --- it's fine if data doesn't contain
   * all the fields; this only changes provided ones.
   *
   * Data can include:
   *   { username, password, isAdmin, email, lvl, exp, gold, kills, weaponid }
   *
   * Returns { username, isAdmin, email, lvl, exp, gold, kills, weaponid }
   *
   * Throws NotFoundError if not found.
   *
   * WARNING: this function can set a new password or make a user an admin.
   * Callers of this function must be certain they have validated inputs to this
   * or a serious security risks are opened.
   */

  static async update(username, data) {
    if (data.password) {
      data.password = await bcrypt.hash(data.password, BCRYPT_WORK_FACTOR);
    }

    const { setCols, values } = sqlForPartialUpdate(
        data);
    const usernameVarIdx = "$" + (values.length + 1);

    const querySql = `UPDATE users 
                      SET ${setCols} 
                      WHERE username = ${usernameVarIdx} 
                      RETURNING username,
                                isAdmin,
                                email,
                                lvl,
                                exp,
                                gold,
                                kills,
                                weaponid`;
    const result = await db.query(querySql, [...values, username]);
    const user = result.rows[0];

    if (!user) throw new NotFoundError(`No user: ${username}`);

    delete user.password;
    return user;
  }
  
    /** Delete given user from database; returns undefined. */

  static async remove(username) {
    let result = await db.query(
          `DELETE
           FROM users
           WHERE username = $1
           RETURNING username`,
        [username],
    );
    const user = result.rows[0];

    if (!user) throw new NotFoundError(`No user: ${username}`);
  } 
  }

module.exports = User;