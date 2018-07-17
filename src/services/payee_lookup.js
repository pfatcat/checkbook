import repo from "../data/repo";
import utilities from "../helpers/utilities.js";

const createPayeeLookup = function(payeeId, payeeName, callback){

    const payeeLookupId = utilities.createGuid()

    const sql = `INSERT INTO payee_lookup(id, payee_id, reference_name)
                SELECT ?,?,?
                WHERE NOT EXISTS (SELECT * FROM payee_lookup WHERE reference_name = ?)`

    const params = [payeeLookupId, payeeId, payeeName, payeeName]

    repo.executeStatement(sql, params, function(error){
        if(error){
            console.error(error)
            return callback(error);
        }
        callback(payeeLookupId)
    });
}

module.exports = {
  createPayeeLookup: createPayeeLookup
}
