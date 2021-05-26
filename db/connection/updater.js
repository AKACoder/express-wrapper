let execSQL = require('./sqlExecutor').execSQL

async function simpleUpdate(table, updateCol, newVal, conditionCol, param) {
  let signal = null
  let retWaiter = new Promise(r=>{signal = r})

  let sql = `UPDATE ${table} set ${updateCol}=? where ${conditionCol}=?`

  execSQL(sql, [newVal, param], e=>{
    signal(e)
  })

  return retWaiter
}

module.exports = {
  simpleUpdate,
}
