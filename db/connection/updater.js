let execSQL = require('./sqlExecutor').execSQL

async function simpleUpdate(conn, table, newVal, conditionCol, param) {
  let signal = null
  let retWaiter = new Promise(r=>{signal = r})

  let sql = `UPDATE ${table} set c_block=? where ${conditionCol}=?`

  execSQL(conn, sql, [newVal, param], e=>{
    signal(e)
  })

  return retWaiter
}

module.exports = {
  simpleUpdate,
}
