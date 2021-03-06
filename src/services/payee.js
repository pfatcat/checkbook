import repo from "../data/repo";
import utilities from "../helpers/utilities.js";


const getPayeeByName = function (payee_name, callback) {

  const sql = "SELECT * FROM payees WHERE name = ?"

  const params = [payee_name.trim()]

  repo.getRow(sql, params, function (payee, error) {
    callback(payee, error)
  })
}

const getPayeeByReferenceName = function (reference_name, callback) {

  const sql = `SELECT p.*
                FROM payee_lookup pl
                JOIN payees p
                  ON pl.payee_id = p.id
                WHERE pl.reference_name = ?`

  const params = [reference_name]

  repo.getRow(sql, params, function (payee, error) {
    callback(payee, error)
  })
}

const findPayeeId = function (payeeName, callback) {

  getPayeeByName(payeeName, function (payee, error) {

    if (payee) {
      callback(payee.id, error)
      return
    }
    getPayeeByReferenceName(payeeName, function (payee) {
      if (payee) {
        callback(payee.id, error)
        return
      }
      callback(null)
    })
  })
}

const getAllPayees = function (callback) {

  const sql = `SELECT * FROM payees ORDER BY name`

  const params = []

  repo.getData(sql, params, function (payees, error) {
    callback(payees, error)
  });
}

const createPayee = function (payee, callback) {

  const sql = `INSERT INTO payees(id, name, default_category_id) VALUES(?,?,?)`

  const params = [payee.id, payee.name, payee.defaultCategoryId]

  repo.executeStatement(sql, params, function (error) {
    callback(error);
  });
}

const createPayeePromise = function (payee) {
  const createPayeePromise = new Promise(function (resolve, reject) {
    createPayee(payee, function (error) {
      if (error) {
        console.error(error)
        reject(error)
        return
      }
      resolve()
    })
  });

  return createPayeePromise
}


const findOrCreatePayee = function (payeeName, default_category_id, callback) {
  getPayeeByName(payeeName, function (payee) {
    if (payee) {
      return callback(payee)
    }
    const newPayee = {
      id: utilities.createGuid(),
      name: payeeName,
      default_category_id: default_category_id
    }
    createPayee(newPayee, function (error) {
      if (error) {
        console.error(error)
      }
    })

    //TODO: handle errors...this fire and forget could cause foreign key problems
    callback(newPayee)
  })
}

const findOrCreatePayeePromise = function (payeeName, default_category_id) {
  return new Promise(function (resolve, reject) {
    findOrCreatePayee(payeeName, default_category_id, function (payee) {
      resolve(payee)
    })
  })
}

const getAllPayeesPromise = function () {
  return new Promise(function (resolve, reject) {
    getAllPayees(function (payees, error) {
      if (error) {
        reject(error)
        return
      }
      resolve(payees)
    })
  });
}

module.exports = {
  getPayeeByName: getPayeeByName,

  getPayeeByReferenceName: getPayeeByReferenceName,

  createPayee: createPayee,

  createPayeePromise: createPayeePromise,

  findPayeeId: findPayeeId,

  getAllPayees: getAllPayees,

  getAllPayeesPromise: getAllPayeesPromise,

  findOrCreatePayee: findOrCreatePayee,

  findOrCreatePayeePromise: findOrCreatePayeePromise
}
