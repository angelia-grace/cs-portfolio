//Citation for the follow code:
//Date: 5/24/2023
//Adapted from nodejs-starter-app steps 3-8 to fit project 
//https://github.com/osu-cs340-ecampus/nodejs-starter-app/tree/main/Step%200%20-%20Setting%20Up%20Node.js
// Get the objects we need to modify
let addTransactionForm = document.getElementById('add-transaction-form-ajax');

// Modify the objects we need
addTransactionForm.addEventListener("submit", function (e) {
    
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputcustomer_ID = document.getElementById("input-customer_ID");
    let inputtransaction_date = document.getElementById("input-transaction_date");
    let inputpayment_method = document.getElementById("input-payment_method");

    // Get the values from the form fields
    let customer_IDValue = inputcustomer_ID.value;
    let transaction_dateValue = inputtransaction_date.value;
    let payment_methodValue = inputpayment_method.value;

    // Put our data we want to send in a javascript object
    let data = {
        customer_ID: customer_IDValue,
        transaction_date: transaction_dateValue,
        payment_method: payment_methodValue
    }
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-transaction-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            addRowToTable(xhttp.response);

            // Clear the input fields for another transaction
            inputcustomer_ID.value = '';
            inputtransaction_date.value = '';
            inputpayment_method.value = '';

            location.reload();
        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

})


// Creates a single row from an Object representing a single record from 
// bsg_people
addRowToTable = (data) => {

    // Get a reference to the current table on the page and clear it out.
    let currentTable = document.getElementById("transaction-table");

    // Get the location where we should insert the new row (end of table)
    let newRowIndex = currentTable.rows.length;

    // Get a reference to the new row from the database query (last object)
    let parsedData = JSON.parse(data);
    let newRow = parsedData[parsedData.length - 1]

    // Create a row and 4 cells
    let row = document.createElement("TR");
    let idCell = document.createElement("TD");
    let customer_IDCell = document.createElement("TD");
    let transaction_dateCell = document.createElement("TD");
    let payment_methodCell = document.createElement("TD");

    let deleteCell = document.createElement("TD");

    // Fill the cells with correct data
    idCell.innerText = newRow.customer_ID;
    customer_IDCell.innerText = newRow.customer_ID;
    transaction_dateCell.innerText = newRow.transaction_date;
    payment_methodCell.innerText = newRow.payment_method;

    deleteCell = document.createElement("button");
    deleteCell.innerHTML = "Delete";
    deleteCell.onclick = function(){
        deleteTransaction(newRow.transaction_ID);
    };

    // Add the cells to the row 
    row.appendChild(idCell);
    row.appendChild(customer_IDCell);
    row.appendChild(transaction_dateCell);
    row.appendChild(payment_methodCell);

    
    row.setAttribute('data-value', newRow.transaction_ID);

    // Add the row to the table
    currentTable.appendChild(row);

    let selectMenu = document.getElementById("input-customer_ID");
    let option = document.createElement("option");
    option.text = newRow.first_name;
    option.value = newRow.customer_ID;
    selectMenu.add(option);
}