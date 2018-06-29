import utilities from "../helpers/utilities.js";
import repo from "../data/repo";
import enums from "../data/enums.js"

const getCategoryByName = function (category_name, callback) {

  const sql = `SELECT *
            FROM categories
            WHERE name = ?`

  const params = [category_name]

  repo.getRow(sql, params, function (category) {
    callback(category)
  })
}

const getAllCategories = function (callback) {
  const sql = `SELECT * FROM categories`

  const params = []

  repo.getData(sql, params, function (categories, error) {
    callback(categories, error)
  });
}

const getAllCategoriesPromise = function () {
  return new Promise(function (resolve, reject) {
    getAllCategories(function (categories, error) {
      if (error) {
        reject(error)
        return
      }
      resolve(categories)
    })
  })
}

const createCategory = function (category, callback) {

  const sql = `INSERT INTO categories(id, name) VALUES(?,?)`

  const params = [category.id, category.name]

  repo.executeStatement(sql, params, function (error) {
    callback(error);
  });
}

const findOrCreateCategory = function (categoryName, callback, categoryLookups) {

  if (!categoryName || categoryName == "") {
    return enums.categories.uncategorized
  }

  const fetchedCategory = categoryLookups && categoryLookups[categoryName]

  if (fetchedCategory) {
    return callback(fetchedCategory)
  }

  getCategoryByName(categoryName, function (category) {
    if (category) {
      return callback(category)
    }

    const newCategory = {
      id: utilities.createGuid(),
      name: categoryName
    }

    createCategory(newCategory, function (error) {
      if (error) {
        console.error(error)
        callback(null, error)
        return
      }
      if (categoryLookups) {
        categoryLookups[newCategory.name] = newCategory
      }
    })

    //TODO: handle errors
    callback(newCategory)
  })
}

const findOrCreateCategoryPromise = function (categoryName) {
  return new Promise(function (resolve, reject) {
    findOrCreateCategory(categoryName, function (category, error) {
      if (error) {
        console.error(error)
        reject(error)
        return
      }
      resolve(category)
    })
  })
}

module.exports = {
  getCategoryByName: getCategoryByName,
  getAllCategories: getAllCategories,
  getAllCategoriesPromise: getAllCategoriesPromise,
  findOrCreateCategoryPromise: findOrCreateCategoryPromise,
  findOrCreateCategory: findOrCreateCategory
}
