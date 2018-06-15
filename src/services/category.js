import repo from "../data/repo";

const getCategoryByName = function(category_name, callback){

  const sql = `SELECT *
            FROM categories
            WHERE name = ?`

  const params = [category_name]

  repo.getRow(sql, params, function(category){
      callback(category)
      })
  }

const getAllCategories =  function(callback){
    const sql = `SELECT * FROM categories`

    const params = []

    repo.getData(sql, params, function(categories, error){
      callback(categories, error)
    });
  }

const getAllCategoriesPromise = function(){
  return new Promise(function(resolve, reject) {
    getAllCategories(function(categories,error){
      if(error){
        reject(error)
        return
      }
      resolve(categories)
    })
  })
}

module.exports = {
  getCategoryByName: getCategoryByName,
  getAllCategories: getAllCategories,
  getAllCategoriesPromise: getAllCategoriesPromise
}
