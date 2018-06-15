
const Database = require('better-sqlite3')
const path = require('path')
const dbPath = path.resolve(__dirname, '../src/data/checkbook.db')

module.exports = {

  getData: function (sql, params, callback){
    const db = new Database(dbPath);

    let records = [];

    var stmt = db.prepare(sql);
    const rows = stmt.all(params);
    callback(rows)

    db.close();
  },

  getRow: function (sql, params, callback){
    const db = new Database(dbPath);

    var stmt = db.prepare(sql);
    const row = stmt.get(params);
    callback(row)

    db.close();
  },

  executeStatement: function(sql, params, callback){
    const db = new Database(dbPath);

    var stmt = db.prepare(sql);
    const response = stmt.run(params);
    callback()

    db.close();
  }
}

function handleError(err){

  if(err){
      console.log(err)
      return true
  }

  return false
}
