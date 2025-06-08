//Citation for the follow code:
//Date: 5/24/2023
//Adapted from nodejs-starter-app steps 3-8 to fit project 
//https://github.com/osu-cs340-ecampus/nodejs-starter-app/tree/main/Step%200%20-%20Setting%20Up%20Node.js
// Get the objects we need to modify
let updateCustomerForm = document.getElementById('update-customer-form-ajax');

// Modify the objects we need
updateCustomerForm.addEventListener("submit", function (e) {
   
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let input_full_name = document.getElementById("input-full-name");
    let input_last_name = document.getElementById("input-last_name-update");
    let input_email = document.getElementById("input-email-update");

    // Get the values from the form fields
    let full_nameValue = input_full_name.value;
    let last_nameValue = input_last_name.value;
    let emailValue = input_email.value;

    
    // currently the database table for potion does not allow updating values to NULL
    // so we must abort if being bassed NULL for price


    // Put our data we want to send in a javascript object
    let data = {
        full_name: full_nameValue,
        last_name: last_nameValue,
        email: emailValue
    }
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "/put-customer-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            updateRow(xhttp.response, full_nameValue);

            location.reload();

        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

})


function updateRow(data, customer_ID){
    let parsedData = JSON.parse(data);
    
    let table = document.getElementById("customer-table");

    for (let i = 0, row; row = table.rows[i]; i++) {
       //iterate through rows
       //rows would be accessed using the "row" variable assigned in the for loop
       if (table.rows[i].getAttribute("data-value") == customer_ID) {

            // Get the location of the row where we found the matching person ID
            let updateRowIndex = table.getElementsByTagName("tr")[i];

            updateRowIndex.getElementsByTagName("td")[1].innerHTML = parsedData.full_name;
            updateRowIndex.getElementsByTagName("td")[2].innerHTML = parsedData.last_name;
            updateRowIndex.getElementsByTagName("td")[3].innerHTML = parsedData.email;
            
       }
    }
}