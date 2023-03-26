CREATE TABLE monsters (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    hp INTEGER,
    mp INTEGER,
    atk INTEGER,
    def INTEGER,
    agility INTEGER,
    exp INTEGER,
    gold INTEGER,
    imgurl TEXT,
    abilities TEXT,
    spells TEXT 
);

CREATE TABLE weapons (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    modifier INTEGER,
    buyprice INTEGER,
    sellprice INTEGER,
    imgurl TEXT
);

CREATE TABLE armor (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    modifier INTEGER,
    buyprice INTEGER,
    sellprice INTEGER,
    imgurl TEXT
);

CREATE TABLE shields (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    modifier INTEGER,
    buyprice INTEGER,
    sellprice INTEGER,
    imgurl TEXT
);

CREATE TABLE spells (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    levellearned INTEGER,
    mpcost INTEGER,
    effect TEXT,
    imgurl TEXT
);

CREATE TABLE users (
    username VARCHAR(25) PRIMARY KEY,
    password TEXT NOT NULL,
    isAdmin BOOLEAN NOT NULL DEFAULT FALSE,
    email TEXT NOT NULL 
        CHECK (position('@' IN email) > 1),
    lvl INTEGER,
    exp INTEGER,
    gold INTEGER,
    kills INTEGER,
    weaponid INTEGER
        REFERENCES weapons ON DELETE CASCADE
);

CREATE TABLE levels (
    lvl INTEGER PRIMARY KEY,
    exp INTEGER,
    atk INTEGER
)