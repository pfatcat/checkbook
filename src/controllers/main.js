import view from "../views/main.js"
import transaction_service from "../services/transaction.js"
import category_service from "../services/category.js"
import datepicker from "../../node_modules/js-datepicker/datepicker.min"
import utilities from "../helpers/utilities.js"
import payee_service from "../services/payee.js"
import payee_lookup_service from "../services/payee_lookup.js"
import ofxImporter_service from "../services/ofx_importer.js"
import qifImporter_service from "../services/qif_importer.js"
import enums from "../helpers/enums.js"

const saveTransaction = function () {

  const ddlCategory = document.getElementById("ddlCategory");
  const category_id = ddlCategory.options[ddlCategory.selectedIndex].value;

  const transactionDate = utilities.toISODate(new Date(document.querySelector("#txt_date").value))

  const payeeName = document.querySelector("#txt_payee").value

  payee_service.findOrCreatePayeeId(payeeName, category_id, function (payee_id) {

    const newTransaction = {
      "id": utilities.createGuid(),
      "transaction_date": transactionDate,
      "payee_id": payee_id,
      "category_id": category_id,
      "memo": document.querySelector("#txt_memo").value,
      "amount": document.querySelector("#txt_amount").value
    }

    newTransaction.reference_code = utilities.buildReferenceCode(newTransaction)

    transaction_service.saveTransaction(newTransaction, function (response) {
      loadTransactions()
      resetInput()
    })
  })
}

const mapOFXTransactions = function (filename) {

  const payeesPromise = payee_service.getAllPayeesPromise()

  const categoriesPromise = category_service.getAllCategoriesPromise()

  const transactionPromise = new Promise(function (resolve, reject) {
    const filename = '../src/data/samples/suntrust_export.ofx'
    ofxImporter_service.parseOFXfile(filename, resolve)
  });

  const promises = [payeesPromise, categoriesPromise, transactionPromise]

  Promise.all(promises).then(function (values) {
    const payees = values[0]
    const categories = values[1]
    const transactions = values[2]

    view.render_transaction_mapping(payees, categories, transactions)
  });
}

const saveOFXTransactions = function () {
  const str_ofx_transactions = document.getElementById('ofx_transactions').getAttribute("data-transactions");
  const ofx_transactions = JSON.parse(str_ofx_transactions)

  const mappingDivs = document.getElementsByClassName('mapping')

  let transactionsToCreate = false

  let payeePromises = [];

  //iterate through the mapping rows (divs)
  for (let i = 0; i < mappingDivs.length; i++) {
    var transDiv = mappingDivs[i]
    const reference_code = transDiv.getAttribute("data-reference_code").trim()

    transaction_service.getTransactionByReferenceCode(reference_code, function (existingTransaction) {

      if (existingTransaction) {
        //transaction exists...bail
        return
      }

      transactionsToCreate = true;

      //TODO: check for null references?
      const targetDiv = transDiv.getElementsByClassName("targetPayee")
      const targetSelect = targetDiv[0].getElementsByClassName("ddlPayee")[0]
      const payee_id = targetSelect == null ? -1 : targetSelect.value

      //iterate through transactions, find this reference_code and set the payee_id
      for (let i = 0; i < ofx_transactions.length; i++) {
        const transaction = ofx_transactions[i]

        if (transaction.reference_code == reference_code) {
          if (payee_id == -1) {
            //payee was not selected
            const new_payee_id = utilities.createGuid()
            const payee = { id: new_payee_id, name: transaction.payee, defaultCategoryId: enums.categories.uncategorized }
            transaction.payee_id = new_payee_id
            payeePromises.push(payee_service.createPayeePromise(payee))
          }
          else {
            //payee was selected
            transaction.payee_id = targetSelect.value

            //create a lookup for the payee if it does not already exist
            const payeeLookup = {
              "id": utilities.createGuid(),
              "payee_id": targetSelect.value,
              "reference_name": transaction.payee
            }

            payee_lookup_service.createPayeeLookup(payeeLookup, function (error) {
              if (error) {
                console.log(error)
              }
            })
          }

          break
        }
      }
    })
  }

  if (transactionsToCreate) {

    //save OFX transactions
    Promise.all(payeePromises).then(function (resolve) {

      var ofx_transaction_promises = []

      for (let i = 0; i < ofx_transactions.length; i++) {
        let transaction = ofx_transactions[i]
        transaction.id = utilities.createGuid()
        const promise = transaction_service.saveOFXTransactionPromise(transaction)

        ofx_transaction_promises.push(promise)
      }

      Promise.all(ofx_transaction_promises).then(function (resolve) {
        loadTransactions()
        closeMappingWindow()
      })
    })
  }
  else {
    closeMappingWindow()
  }
}

const newPayee = function () {
  alert("new payee")
}

const importQIF = function () {
  const filename = '../src/data/samples/2018.qif'
  qifImporter_service.importQIFfile(filename, function () {
    loadTransactions()
  })
}

/**** PRIVATE FUNCTIONS ****/
function resetInput() {
  document.querySelector("#txt_date").value = utilities.toMMDDYYYY(new Date())
  document.querySelector("#txt_payee").value = ""
  document.getElementById("ddlCategory").selectedIndex = 0
  document.querySelector("#txt_memo").value = ""
  document.querySelector("#txt_amount").value = ""
}

function wireUpEvents() {
  const postButton = document.getElementById("btn_post")
  postButton.addEventListener("click", saveTransaction)

  const importButton = document.getElementById("btn_mapTransactions")
  importButton.addEventListener("click", mapOFXTransactions)

  const importQIFButton = document.getElementById("btn_importQIF")
  importQIFButton.addEventListener("click", importQIF)

  var newPayeeLinks = document.getElementsByClassName("lnk_newPayee");
  for (let i = 0, len = newPayeeLinks.length; i < len;) {
    lnkNewPayee = newPayeeLinks[i]
    lnkNewPayee.addEventListener("click", newPayee)
  }

  const saveOFXTransactionsButton = document.getElementById("btn_save_OFX_transactions")
  saveOFXTransactionsButton.addEventListener("click", saveOFXTransactions)

  const cancelOFXButton = document.getElementById("btn_cancel_OFX")
  cancelOFXButton.addEventListener("click", closeMappingWindow)
}

function populateElements() {
  loadTransactions()

  buildDatePicker()

  buildCategoryList()
}

function loadTransactions() {
  transaction_service.getTransactions(view.render_transactions)
}

function closeMappingWindow() {
  let map_import = document.querySelector("#map_import")
  map_import.style.display = "none"
}

function buildDatePicker() {
  const options = {
    dateSelected: new Date(),
    formatter: function (el, date) {
      const formattedDate = utilities.toMMDDYYYY(date)
      el.value = formattedDate;
    }
  }

  datepicker('#txt_date', options);
}


function buildCategoryList() {
  category_service.getAllCategories(function (categories) {
    const options = view.buildCategoryOptions(categories)
    document.querySelector("#ddlCategory").innerHTML = options
  })
}

//on_load...this is probably a terrible way to do this
(function onLoad() {
  wireUpEvents()
  populateElements()
})();
