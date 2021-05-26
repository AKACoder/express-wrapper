let execSQL = require('./sqlExecutor').execSQL

function singleRowToPlainObject(err, result) {
  if(err) {
    return null
  }

  if(!result) {
    return null
  }

  if(result.length === 0) {
    return null
  }

  return result[0]
}

function multiRows(err, result) {
  if(err) {
    return []
  }

  if(!result) {
    return []
  }

  return result
}

async function simpleSelectSingleRow(conn, table, conditionCol, param, order = '') {
  let signal = null
  let getter = new Promise(r=>{signal = r})

  let sql = `SELECT * FROM ${table} where ${conditionCol}=? ${order}`;
  execSQL(conn, sql, [param], (e, r)=>{
    signal(singleRowToPlainObject(e, r))
  })

  return await getter
}

async function simpleSelectMultiRow(conn, table, conditionCol, param, orderCol, isDESC, page = null, rowCount = null) {
  let listSignal = null
  let listGetter = new Promise(r=>{listSignal = r})

  let countSignal = null
  let countGetter = new Promise(r=>{countSignal = r})

  page = parseInt(page)
  rowCount = parseInt(rowCount)
  let limitSQL = ''
  if(!isNaN(page) && !isNaN(rowCount)) {
    let offset = page * rowCount
    limitSQL = `LIMIT ${offset}, ${rowCount}`
  }

  let sql = `SELECT * FROM ${table} where ${conditionCol}=? ORDER BY ${orderCol} ${isDESC ? `DESC`:`ASC`} ${limitSQL}`;
  execSQL(conn, sql, [param], (e, r)=>{
    listSignal(multiRows(e, r))
  })

  let list = await listGetter


  sql = `SELECT count(*) AS RowCount FROM ${table} where ${conditionCol}=?`;
  execSQL(conn, sql, [param], (e, r)=>{
    countSignal(singleRowToPlainObject(e, r))
  })
  let count = await countGetter

  return {
    List: list,
    Count: count ? count.RowCount : 0
  }
}

module.exports = {
  simpleSelectSingleRow,
  simpleSelectMultiRow
}
