## Admin status management

To assign admin status to existing user use this command in your encrypted PostgreSQL database:

```sql
UPDATE users set is_admin = TRUE
WHERE pgp_sym_decrypt(username::bytea, DATABASE_ENCRYPTION_KEY) = USERNAME;
```

And to change user to non admin user:
```sql
UPDATE users set is_admin = FALSE
WHERE pgp_sym_decrypt(username::bytea, DATABASE_ENCRYPTION_KEY) = USERNAME;
```

Where `DATABASE_ENCRYPTION_KEY` is defined in the .env file
And `USERNAME` is username of the admin

[See instructions for database encryption](databaseEncryption.md)
