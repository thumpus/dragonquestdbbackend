\echo 'Delete and recreate Dragon Quest db?'
\prompt 'Return for yes or control-C to cancel' foo

DROP DATABASE dragonquest;
CREATE DATABASE dragonquest;
\connect dragonquest

\i dragonquest-schema.sql
\i dragonquest-seed.sql

\echo 'Delete and recreate Dragon Test db?'
\prompt 'Return for yes or control-c to cancel' foo

DROP DATABASE dragontest;
CREATE DATABASE dragontest;
\connect dragontest

\i dragonquest-schema.sql