# How to setup a local postgres database

1. Install postgresql
2. Configure PATH variable for postgres
3. Log in to postgres through console with 'psql -U username' where username is your postgres username (default username is postgres). Pass your postgres password (by default postgres).
4. Now you should be in postgres mode in your console. In the console, run 'CREATE DATABASE databaseName WITH ENCODING 'UTF8' LC_COLLATE='English_Finland.1252' LC_CTYPE='English_Finland.1252';' where databaseName is a name of your choosing.
5. Check that the database was created with \list. You can quit the postgres mode with \q.
6. Create a .env file. Add values for EXPO_PUBLIC_API_POSTGRES_IP, EXPO_PUBLIC_API_POSTGRES_DB_NAME, EXPO_PUBLIC_API_POSTGRES_USERNAME, and EXPO_PUBLIC_API_POSTGRES_PASSWORD. The values should be the values that you used in the steps above, except for EXPO_PUBLIC_API_POSTGRES_IP. The value of EXPO_PUBLIC_API_POSTGRES_IP should be whatever IP address the postgres database is running in (for example localhost).
7. In normal console mode, run 'psql -U username -d databaseName -a -f schema.sql' to initialize the database according to the schema.sql file