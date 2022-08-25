var { Pool, Client } = require('pg');
var { isEmpty, length } = require('class-validator');


exports.PG_Insert_Offer = async (schemas, table, data) => {
    var pool = new Pool({
    user: process.env.pg_user,
    host: process.env.pg_host,
    database: process.env.pg_database,
    password: process.env.pg_password,
    port: parseInt(process.env.pg_port),
  });
        let fileds = ``;
        let values = ``;
          for (const [key, value] of Object.entries(data)) {
            fileds = isEmpty(fileds) ? `${key}` : `${fileds},${key}`;
            values =
              value == parseInt(value +'') || value === null
                ? isEmpty(values)
                  ? `${value}`
                  : `${values},${value}`
                : isEmpty(values)
                ? `'${value}'`
                : `${values},'${value}'`;
          }
    
          const query = `INSERT INTO ${schemas}.${table}(${fileds}) VALUES(${values}) RETURNING id`;
        //   console.log(query)
          const resultat = await pool.query(query);
          if (resultat && resultat.rows && resultat.rows[0] && resultat.rows[0].id) {
            const found_id = resultat.rows[0].id;
            return found_id;
          } else return null;
      };