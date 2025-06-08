//Citation for the follow code:
//Date: 5/24/2023
//Adapted from nodejs-starter-app steps 3-8 to fit project 
//https://github.com/osu-cs340-ecampus/nodejs-starter-app/tree/main/Step%200%20-%20Setting%20Up%20Node.js
// Get the objects we need to modify
let addCustomerForm = document.getElementById('add-customer-form-ajax');

// Modify the objects we need
addCustomerForm.addEventListener("submit", function (e) {
    
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputfirst_name = document.getElementById("input-first_name");
    let inputlast_name = document.getElementById("input-last_name");
    let inputemail = document.getElementById("input-email");

    // Get the values from the form fields
    let first_nameValue = inputfirst_name.value;
    let last_nameValue = inputlast_name.value;
    let emailValue = inputemail.value;

    // Put our data we want to send in a javascript object
    let data = {
        first_name: first_nameValue,
        last_name: last_nameValue,
        email: emailValue
    }
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-customer-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            addRowToTable(xhttp.response);

            // Clear the input fields for another transaction
            inputfirst_name.value = '';
            inputlast_name.value = '';
            inputemail.value = '';

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
    let currentTable = document.getElementById("customer-table");

    // Get the location where we should insert the new row (end of table)
    let newRowIndex = currentTable.rows.length;

    // Get a reference to the new row from the database query (last object)
    let parsedData = JSON.parse(data);
    let newRow = parsedData[parsedData.length - 1]

    // Create a row and 4 cells
    let row = document.createElement("TR");
    let idCell = document.createElement("TD");
    let first_nameCell = document.createElement("TD");
    let last_nameCell = document.createElement("TD");
    let emailCell = document.createElement("TD");

    let deleteCell = document.createElement("TD");

    // Fill the cells with correct data
    idCell.innerText = newRow.customer_ID;
    first_nameCell.innerText = newRow.first_name;
    last_nameCell.innerText = newRow.last_name;
    emailCell.innerText = newRow.email;

    deleteCell = document.createElement("button");
    deleteCell.innerHTML = "Delete";
    deleteCell.onclick = function(){
        deleteCustomer(newRow.customer_ID);
    };

    // Add the cells to the row 
    row.appendChild(idCell);
    row.appendChild(first_nameCell);
    row.appendChild(last_nameCell);
    row.appendChild(emailCell);

    
    row.setAttribute('data-value', newRow.customer_ID);

    // Add the row to the table
    currentTable.appendChild(row);

    let selectMenu = document.getElementById("mySelect");
    let option = document.createElement("option");
    option.text = newRow.first_name;
    option.value = newRow.last_name;
    selectMenu.add(option);
}