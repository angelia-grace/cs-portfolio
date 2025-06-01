//Citation for the follow code:
//Date: 5/24/2023
//Adapted from nodejs-starter-app steps 3-8 to fit project 
//https://github.com/osu-cs340-ecampus/nodejs-starter-app/tree/main/Step%200%20-%20Setting%20Up%20Node.js
// Get the objects we need to modify
let updateRecipeForm = document.getElementById('update-recipe-form-ajax');

// Modify the objects we need
updateRecipeForm.addEventListener("submit", function (e) {
   
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let input_potion_recipes_ID = document.getElementById("input-potion_recipe-update")
    let input_potion_ID = document.getElementById("input-potion_name-update");
    let input_ingredient_ID = document.getElementById("input-ingredient_name-update");
    let input_quantity = document.getElementById("input-ingredient_quantity-update");

    // Get the values from the form fields
    let potion_recipes_IDValue = input_potion_recipes_ID.value;
    let potion_IDValue = input_potion_ID.value;
    let ingredient_IDValue = input_ingredient_ID.value;
    let quantityValue = input_quantity.value;

    
    // currently the database table for potion does not allow updating values to NULL
    // so we must abort if being bassed NULL for price


    // Put our data we want to send in a javascript object
    let data = {
        potion_recipes_ID: potion_recipes_IDValue,
        potion_ID: potion_IDValue,
        ingredient_ID: ingredient_IDValue,
        quantity: quantityValue
    }
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "/put-recipe-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            updateRow(xhttp.response, potion_recipes_IDValue);

            location.reload();

        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

})


function updateRow(data, potion_recipes_ID){
    let parsedData = JSON.parse(data);
    
    let table = document.getElementById("recipe-table");

    for (let i = 0, row; row = table.rows[i]; i++) {
       //iterate through rows
       //rows would be accessed using the "row" variable assigned in the for loop
       if (table.rows[i].getAttribute("data-value") == potion_recipes_ID) {

            // Get the location of the row where we found the matching person ID
            let updateRowIndex = table.getElementsByTagName("tr")[i];

            updateRowIndex.getElementsByTagName("td")[2].innerHTML = parsedData.potion_ID;
            updateRowIndex.getElementsByTagName("td")[3].innerHTML = parsedData.ingredient_ID;
            updateRowIndex.getElementsByTagName("td")[4].innerHTML = parsedData.quantity;
            
       }
    }
}
