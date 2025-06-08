//Citation for the follow code:
//Date: 5/24/2023
//Adapted from nodejs-starter-app steps 3-8 to fit project 
//https://github.com/osu-cs340-ecampus/nodejs-starter-app/tree/main/Step%200%20-%20Setting%20Up%20Node.js
// Get the objects we need to modify
let addPotionTransactionForm = document.getElementById('add-potion-transaction-form-ajax');

// Modify the objects we need
addPotionTransactionForm.addEventListener("submit", function (e) {
    
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputtransaction_ID = document.getElementById("input-transaction_ID")
    let inputpotion_ID = document.getElementById("input-potion_ID");
    let inputpotion_price = document.getElementById("input-potion_price");
    let inputpotion_quantity = document.getElementById("input-potion-quantity");

    // Get the values from the form fields
    let transaction_IDValue = inputtransaction_ID.value;
    let potion_IDValue = inputpotion_ID.value;
    let potion_priceValue = inputpotion_price.value;
    let potion_quantityValue = inputpotion_quantity.value;

    // Put our data we want to send in a javascript object
    let data = {
        transaction_ID: transaction_IDValue,
        potion_ID: potion_IDValue,
        potion_price: potion_priceValue,
        potion_quantity: potion_quantityValue
    }
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-potion-transaction-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            addRowToTable(xhttp.response);

            // Clear the input fields for another transaction
            inputpotion_price.value = '';
            inputpotion_quantity.value = '';

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
    let currentTable = document.getElementById("potion_transaction-table");

    // Get the location where we should insert the new row (end of table)
    let newRowIndex = currentTable.rows.length;

    // Get a reference to the new row from the database query (last object)
    let parsedData = JSON.parse(data);
    let newRow = parsedData[parsedData.length - 1]

    // Create a row and 4 cells
    let row = document.createElement("TR");
    let idCell = document.createElement("TD");
    let potion_IDCell = document.createElement("TD");
    let potion_priceCell = document.createElement("TD");
    let potion_quantityCell = document.createElement("TD");

    

    // Fill the cells with correct data
    idCell.innerText = newRow.transaction_ID;
    potion_IDCell.innerText = newRow.potion_ID;
    potion_priceCell.innerText = newRow.potion_price;
    potion_quantityCell.innerText = newRow.potion_quantity;

    

    // Add the cells to the row 
    row.appendChild(idCell);
    row.appendChild(potion_IDCell);
    row.appendChild(potion_priceCell);
    row.appendChild(potion_quantityCell);

    
    row.setAttribute('data-value', newRow.transaction_ID);

    // Add the row to the table
    currentTable.appendChild(row);

    let selectMenu = document.getElementById("input-potion_ID");
    let option = document.createElement("option");
    option.text = newRow.potion_name;
    option.value = newRow.potion_ID;
    selectMenu.add(option);

}