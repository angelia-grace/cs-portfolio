//Citation for the follow code:
//Date: 5/24/2023
//Adapted from nodejs-starter-app steps 3-8 to fit project 
//https://github.com/osu-cs340-ecampus/nodejs-starter-app/tree/main/Step%200%20-%20Setting%20Up%20Node.js
// Get the objects we need to modify
let addBookTransactionForm = document.getElementById('add-book-transaction-form-ajax');

// Modify the objects we need
addBookTransactionForm.addEventListener("submit", function (e) {
    
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputtransaction_ID = document.getElementById("input-booktransaction_ID")
    let inputbook_ID = document.getElementById("input-book_ID");
    let inputbook_price = document.getElementById("input-book_price");
    let inputbook_quantity = document.getElementById("input-book-quantity");

    // Get the values from the form fields
    let transaction_IDValue = inputtransaction_ID.value;
    let book_IDValue = inputbook_ID.value;
    let book_priceValue = inputbook_price.value;
    let book_quantityValue = inputbook_quantity.value;

    // Put our data we want to send in a javascript object
    let data = {
        transaction_ID: transaction_IDValue,
        book_ID: book_IDValue,
        book_price: book_priceValue,
        book_quantity: book_quantityValue
    }
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-book-transaction-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            addRowToTable(xhttp.response);

            // Clear the input fields for another transaction
            inputbook_price.value = '';
            inputbook_quantity.value = '';

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
    let currentTable = document.getElementById("book_transaction-table");

    // Get the location where we should insert the new row (end of table)
    let newRowIndex = currentTable.rows.length;

    // Get a reference to the new row from the database query (last object)
    let parsedData = JSON.parse(data);
    let newRow = parsedData[parsedData.length - 1]

    // Create a row and 4 cells
    let row = document.createElement("TR");
    let idCell = document.createElement("TD");
    let book_IDCell = document.createElement("TD");
    let book_priceCell = document.createElement("TD");
    let book_quantityCell = document.createElement("TD");

    

    // Fill the cells with correct data
    idCell.innerText = newRow.transaction_ID;
    book_IDCell.innerText = newRow.book_ID;
    book_priceCell.innerText = newRow.book_price;
    book_quantityCell.innerText = newRow.book_quantity;

    

    // Add the cells to the row 
    row.appendChild(idCell);
    row.appendChild(book_IDCell);
    row.appendChild(book_priceCell);
    row.appendChild(book_quantityCell);

    
    row.setAttribute('data-value', newRow.transaction_ID);

    // Add the row to the table
    currentTable.appendChild(row);

    let selectMenu = document.getElementById("input-book_ID");
    let option = document.createElement("option");
    option.text = newRow.book_title;
    option.value = newRow.book_ID;
    selectMenu.add(option);

}