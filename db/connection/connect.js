let mysql = require('mysql')

let pool = mysql.createPool({
    host: process.env.PROJECT_MYSQL_ADDR || '127.0.0.1',
    user: process.env.PROJECT_MYSQL_USER || 'root',
    password: process.env.PROJECT_MYSQL_PWD || 'password',
    database: process.env.PROJECT_MYSQL_DATABASE || 'database',
    charset: process.env.PROJECT_MYSQL_CHARSET || "utf8mb4",
    port: process.env.PROJECT_MYSQL_PORT || 3306
  }
)

function query(sql, data, cb) {
  pool.getConnection((e, c)=>{
    if(e) {
      cb(e, null, null)
    } else {
      c.query(sql,data,function(err,results,fields){
        c.release();
        cb(err,results,fields);
      });
    }
  })
}

module.exports = {
  query
}
