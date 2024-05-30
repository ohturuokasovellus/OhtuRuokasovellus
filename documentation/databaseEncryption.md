# Encrypting data in database

To be able ot encrypt data, first add

```bash
DATABASE_ENCRYPTION_KEY
```
line to .env file, and give a secret key value to it.

## Setting up database

You must have the following line in the first lines of the schema.sql file

```bash
CREATE EXTENSION IF NOT EXISTS pgcrypto;
```

There is no need to install any packages, postgresql has the extension already downloaded.

## Encrypting data

To encrypt data in the INSERT commands, use

```bash
pgp_sym_encrypt(${column_name}, ${process.env.DATABASE_ENCRYPTION_KEY})
```

For example:
```bash
    INSERT INTO users (username)
    VALUES (pgp_sym_encrypt(${username}, ${process.env.DATABASE_ENCRYPTION_KEY}))
```

## Decrypting data

To decrypt data in the SELECT commands, use

```bash
pgp_sym_decrypt(column_name::bytea, ${process.env.DATABASE_ENCRYPTION_KEY})
```

For example:
```bash
    SELECT pgp_sym_decrypt(username::bytea, ${process.env.DATABASE_ENCRYPTION_KEY}) FROM users
```