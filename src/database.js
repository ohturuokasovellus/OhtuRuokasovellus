import postgres from 'postgres'

const sql = postgres('postgres://username:password@host:port/database', {
  host                 : process.env.EXPO_PUBLIC_API_POSTGRES_IP,      // Postgres ip address[s] or domain name[s]
  port                 : 5432,                                         // Postgres server port[s]
  database             : process.env.EXPO_PUBLIC_API_POSTGRES_DB_NAME,             // Name of database to connect to
  username             : process.env.EXPO_PUBLIC_API_POSTGRES_USERNAME,            // Username of database user
  password             : process.env.EXPO_PUBLIC_API_POSTGRES_PASSWORD,            // Password of database user
})

export default sql