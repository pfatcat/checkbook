import utilities from "../helpers/utilities.js"

module.exports = {

  render_transactions: function(transactions){
    let html = "";

    for (let i = 0, len = transactions.length; i < len; i++) {

      const transaction = transactions[i];

      const transactionDate = utilities.toMMDDYYYY(new Date(transaction.date))

      let record = `<div class="record">
          <div id="date">${transactionDate}</div>
          <div id="payee_category_memo">
            <div id="payee" >${transaction.payee}</div>
            <div id="category_memo">
              <div id="category">${transaction.category}</div>
              <div id="memo">${utilities.nullToSpace(transaction.memo)}</div>
            </div>
          </div>
          <div id="amount">${transaction.amount}</div>
        </div>`;

      html += record
    }

    document.querySelector("#transactions").innerHTML = html;
  },
  buildCategoryOptions: function(categories){

    let options = "<option value=''>Select a category...</option>"

    for (let i = 0, len = categories.length; i < len; i++) {
      const category = categories[i]

      const option = "<option value='"+ category.id +"'>" + category.name + "</option>"
      options += option
    }

    return options
  }
};


