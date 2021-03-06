const getPool = require('./connect').getPool

function execSQL(conn, sql, data, cb) {
  getPool().getConnection((e, c)=>{
    if(e) {
      cb(e, null, null)
    } else {
      c.query(sql, data, function(err, results, fields){
        c.release();
        cb(err, results, fields);
      });
    }
  })
}

module.exports = {
  execSQL
}
