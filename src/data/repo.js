
const Database = require('better-sqlite3')
const path = require('path')
const dbPath = path.resolve(__dirname, '../src/data/checkbook.db')

module.exports = {

  getData: function (sql, params, callback){
    const db = new Database(dbPath);

    try{
      const stmt = db.prepare(sql);
      const rows = stmt.all(params);
      callback(rows)
    }
    catch(err){
      handleError(err, sql, params)
    }
    finally{
      db.close();
    }
  },

  getRow: function (sql, params, callback){
    const db = new Database(dbPath);

    try{
      const stmt = db.prepare(sql);
      const row = stmt.get(params);
      callback(row)
    }
    catch(err){
      handleError(err, sql, params)
    }
    finally{
      db.close();
    }
  },

  executeStatement: function(sql, params, callback){
    const db = new Database(dbPath);

    try{ 
      const stmt = db.prepare(sql);
      stmt.run(params);
      callback()
    }
    catch(err){
      handleError(err, sql, params)
      callback(err)
    }
    finally{
      db.close();
    }
  }
}

function handleError(err, sql, params){

  if(err){
      err.sql = sql
      err.params = params
      console.log(err)
      return true
  }

  return false
}
