//Citation for the follow code:
//Date: 5/24/2023
//Adapted from nodejs-starter-app steps 3-8 to fit project 
//https://github.com/osu-cs340-ecampus/nodejs-starter-app/tree/main/Step%200%20-%20Setting%20Up%20Node.js
// Get the objects we need to modify
let addRecipeForm = document.getElementById('add-recipe-form-ajax');

// Modify the objects we need
addRecipeForm.addEventListener("submit", function (e) {
    
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputpotion_name = document.getElementById("input-potion_name");
    let inputingredient_name = document.getElementById("input-ingredient_name");
    let inputingredient_quantity = document.getElementById("input-ingredient_quantity");

    // Get the values from the form fields
    let potion_nameValue = inputpotion_name.value;
    let ingredient_nameValue = inputingredient_name.value;
    let ingredient_quantityValue = inputingredient_quantity.value;

    // Put our data we want to send in a javascript object
    let data = {
        potion_name: potion_nameValue,
        ingredient_name: ingredient_nameValue,
        ingredient_quantity: ingredient_quantityValue
    }
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-recipe-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            addRowToTable(xhttp.response);

            // Clear the input fields for another transaction
            inputingredient_quantity.value = '';

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
    let currentTable = document.getElementById("recipe-table");

    // Get the location where we should insert the new row (end of table)
    let newRowIndex = currentTable.rows.length;

    // Get a reference to the new row from the database query (last object)
    let parsedData = JSON.parse(data);
    let newRow = parsedData[parsedData.length - 1]

    // Create a row and 4 cells
    let row = document.createElement("TR");
    let idCell = document.createElement("TD");
    let potion_nameCell = document.createElement("TD");
    let ingredient_nameCell = document.createElement("TD");
    let ingredient_quantityCell = document.createElement("TD");

    let deleteCell = document.createElement("TD");

    // Fill the cells with correct data
    idCell.innerText = newRow.potion_recipes_ID;
    potion_nameCell.innerText = newRow.potion_name;
    ingredient_nameCell.innerText = newRow.ingredient_name;
    ingredient_quantityCell.innerText = newRow.ingredient_quantity;

    deleteCell = document.createElement("button");
    deleteCell.innerHTML = "Delete";
    deleteCell.onclick = function(){
        deleteBook(newRow.potion_recipes_ID);
    };

    // Add the cells to the row 
    row.appendChild(idCell);
    row.appendChild(potion_nameCell);
    row.appendChild(ingredient_nameCell);
    row.appendChild(ingredient_quantityCell);

    
    row.setAttribute('data-value', newRow.potion_recipes_ID);

    // Add the row to the table
    currentTable.appendChild(row);

    let selectMenu = document.getElementById("input-potion_name");
    let option = document.createElement("option");
    option.text = newRow.potion_name;
    option.value = newRow.potion_ID;
    selectMenu.add(option);

    let selectMenu2 = document.getElementById("input-ingredient_name");
    let option2 = document.createElement("option");
    option2.text = newRow.ingredient_name;
    option2.value = newRow.ingrdient_ID;
    selectMenu2.add(option2);
}