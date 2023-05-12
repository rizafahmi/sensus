// Update with your config settings.
export default {
  development: {
    client: 'pg',
    connection: process.env.DATABASE_URL || 'postgres://riza:@localhost:5432/sensus_dev',
    migrations: {
      tableName: 'knex_migrations',
      directory: './db/migrations'
    }
  },
  production: {
    client: 'pg',
    connection: process.env.DATABASE_URL || 'postgres://riza:@localhost:5432/sensus_dev',
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations',
      directory: './db/migrations'
    }
  }
}


/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
/* module.exports = {

  development: {
    client: 'sqlite3',
    connection: {
      filename: './dev.sqlite3'
    }
  },

  staging: {
    client: 'postgresql',
    connection: {
      database: 'my_db',
      user:     'username',
      password: 'password'
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  },

  production: {
    client: 'postgresql',
    connection: {
      database: 'my_db',
      user:     'username',
      password: 'password'
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  }

};
*/
