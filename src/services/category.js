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

const createCategory = function(category, callback){

  const sql = `INSERT INTO categories(id, name) VALUES(?,?)`

  const params = [category.id, category.name]

  repo.executeStatement(sql, params, function(error){
      callback(error);
  });
}

const findOrCreateCategoryPromise = function(categoryName){
  return new Promise(function(resolve, reject) {
    getCategoryByName(categoryName, function(category){
        if(category){
          return resolve(category)
        }
        const newCategory = {
          id: utilities.createGuid(),
          name: categoryName
        }
        createCategory(newCategory)

        //TODO: handle errors
        resolve(newCategory)
    })
  })
}

module.exports = {
  getCategoryByName: getCategoryByName,
  getAllCategories: getAllCategories,
  getAllCategoriesPromise: getAllCategoriesPromise
}
