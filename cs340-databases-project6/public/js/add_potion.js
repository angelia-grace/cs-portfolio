//Citation for the follow code:
//Date: 5/24/2023
//Adapted from nodejs-starter-app steps 3-8 to fit project 
//https://github.com/osu-cs340-ecampus/nodejs-starter-app/tree/main/Step%200%20-%20Setting%20Up%20Node.js
// Get the objects we need to modify
let addPotionForm = document.getElementById('add-potions-form-ajax');

// Modify the objects we need
addPotionForm.addEventListener("submit", function (e) {
    
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputpotion_name = document.getElementById("input-potion_name");
    let inputpotion_effect = document.getElementById("input-potion_effect");
    let inputpotion_color = document.getElementById("input-potion_color");
    let inputpotion_price = document.getElementById("input-potion_price");

    // Get the values from the form fields
    let potion_nameValue = inputpotion_name.value;
    let potion_effectValue = inputpotion_effect.value;
    let potion_colorValue = inputpotion_color.value;
    let potion_priceValue = inputpotion_price.value;

    // Put our data we want to send in a javascript object
    let data = {
        potion_name: potion_nameValue,
        potion_effect: potion_effectValue,
        potion_color: potion_colorValue,
        potion_price: potion_priceValue
    }
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-potion-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            addRowToTable(xhttp.response);

            // Clear the input fields for another transaction
            inputpotion_name.value = '';
            inputpotion_effect.value = '';
            inputpotion_color.value = '';
            inputpotion_price.value = '';

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
    let currentTable = document.getElementById("potions-table");

    // Get the location where we should insert the new row (end of table)
    let newRowIndex = currentTable.rows.length;

    // Get a reference to the new row from the database query (last object)
    let parsedData = JSON.parse(data);
    let newRow = parsedData[parsedData.length - 1]

    // Create a row and 4 cells
    let row = document.createElement("TR");
    let idCell = document.createElement("TD");
    let potion_nameCell = document.createElement("TD");
    let potion_effectCell = document.createElement("TD");
    let potion_colorCell = document.createElement("TD");
    let potion_priceCell = document.createElement("TD");

    let deleteCell = document.createElement("TD");

    // Fill the cells with correct data
    idCell.innerText = newRow.potion_ID;
    potion_nameCell.innerText = newRow.potion_name;
    potion_effectCell.innerText = newRow.potion_effect;
    potion_colorCell.innerText = newRow.potion_color;
    potion_priceCell.innerText = newRow.potion_price;

    deleteCell = document.createElement("button");
    deleteCell.innerHTML = "Delete";
    deleteCell.onclick = function(){
        deletePotion(newRow.potion_ID);
    };

    // Add the cells to the row 
    row.appendChild(idCell);
    row.appendChild(potion_nameCell);
    row.appendChild(potion_effectCell);
    row.appendChild(potion_colorCell);
    row.appendChild(potion_priceCell);
    
    row.setAttribute('data-value', newRow.potion_ID);

    // Add the row to the table
    currentTable.appendChild(row);

    let selectMenu = document.getElementById("mySelect");
    let option = document.createElement("option");
    option.text = newRow.potion_name;
    option.value = newRow.potion_ID;
    selectMenu.add(option);
}