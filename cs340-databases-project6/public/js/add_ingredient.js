//Citation for the follow code:
//Date: 5/24/2023
//Adapted from nodejs-starter-app steps 3-8 to fit project 
//https://github.com/osu-cs340-ecampus/nodejs-starter-app/tree/main/Step%200%20-%20Setting%20Up%20Node.js
// Get the objects we need to modify
let addIngredientForm = document.getElementById('add-ingredient-form-ajax');

// Modify the objects we need
addIngredientForm.addEventListener("submit", function (e) {
    
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputingredient_name = document.getElementById("input-ingredient_name");
    let inputingredient_source = document.getElementById("input-ingredient_source");

    // Get the values from the form fields
    let ingredient_nameValue = inputingredient_name.value;
    let ingredient_sourceValue = inputingredient_source.value;

    // Put our data we want to send in a javascript object
    let data = {
        ingredient_name: ingredient_nameValue,
        ingredient_source: ingredient_sourceValue,
    }
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-ingredient-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            addRowToTable(xhttp.response);

            // Clear the input fields for another transaction
            inputingredient_name.value = '';
            inputingredient_source.value = '';

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
    let currentTable = document.getElementById("ingredient-table");

    // Get the location where we should insert the new row (end of table)
    let newRowIndex = currentTable.rows.length;

    // Get a reference to the new row from the database query (last object)
    let parsedData = JSON.parse(data);
    let newRow = parsedData[parsedData.length - 1]

    // Create a row and 4 cells
    let row = document.createElement("TR");
    let idCell = document.createElement("TD");
    let ingredient_nameCell = document.createElement("TD");
    let ingredient_sourceCell = document.createElement("TD");

    let deleteCell = document.createElement("TD");

    // Fill the cells with correct data
    idCell.innerText = newRow.ingredient_ID;
    ingredient_nameCell.innerText = newRow.ingredient_name;
    ingredient_sourceCell.innerText = newRow.ingredient_source;

    deleteCell = document.createElement("button");
    deleteCell.innerHTML = "Delete";
    deleteCell.onclick = function(){
        deleteBook(newRow.ingredient_ID);
    };

    // Add the cells to the row 
    row.appendChild(idCell);
    row.appendChild(ingredient_nameCell);
    row.appendChild(ingredient_sourceCell);

    
    row.setAttribute('data-value', newRow.ingredient_ID);

    // Add the row to the table
    currentTable.appendChild(row);

    let selectMenu = document.getElementById("mySelect");
    let option = document.createElement("option");
    option.text = newRow.ingredient_name;
    option.value = newRow.ingredient_ID;
    selectMenu.add(option);
}