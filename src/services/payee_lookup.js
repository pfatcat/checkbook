import repo from "../data/repo";
import utilities from "../helpers/utilities.js";

const createPayeeLookup = function(payeeLookup, callback){

    const sql = `INSERT INTO payee_lookup(id, payee_id, reference_name)
                SELECT ?,?,?
                WHERE NOT EXISTS (SELECT * FROM payee_lookup WHERE reference_name = ?)`

    const params = [payeeLookup.id, payeeLookup.payee_id, payeeLookup.reference_name, payeeLookup.reference_name]

    repo.executeStatement(sql, params, function(error){
        callback(error);
    });
}

module.exports = {
  createPayeeLookup: createPayeeLookup
}
