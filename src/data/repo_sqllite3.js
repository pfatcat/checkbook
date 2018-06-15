var sqlite3 = require('sqlite3').verbose();
const path = require('path')
const dbPath = path.resolve(__dirname, '../src/data/checkbook.db')

module.exports = {

  getData: function (sql, params, callback){

    const db = new sqlite3.Database(dbPath)

    let records = [];

    db.each(sql, params, function(err, row) {
          records.push(row);
    }, function(err, rows) {
        handleError(err)
        callback(records, err);
    });


    db.close();
  },

  getRow: function (sql, params, callback){

    const db = new sqlite3.Database(dbPath)

    db.get(sql, params, function(err, row) {
          handleError(err)
          callback(row, err);
    });

    db.close();
  },

  executeStatement: function(sql, params, callback){

    const db = new sqlite3.Database(dbPath)

    db.run(sql, params, function(err){
      handleError(err)
      callback(err);
    });

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
