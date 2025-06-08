//Citation for the follow code:
//Date: 5/24/2023
//Adapted from nodejs-starter-app steps 3-8 to fit project 
//https://github.com/osu-cs340-ecampus/nodejs-starter-app/tree/main/Step%200%20-%20Setting%20Up%20Node.js
// Get the objects we need to modify
let updateTransactionForm = document.getElementById('update-transaction-form-ajax');

// Modify the objects we need
updateTransactionForm.addEventListener("submit", function (e) {
   
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let input_transaction_ID = document.getElementById("input-transaction_ID1");
    let input_customer_name = document.getElementById("input-customer_name-update");
    let input_transaction_date = document.getElementById("input-transaction_date-update");
    let input_payment_method = document.getElementById("input-payment_method-update");

    // Get the values from the form fields
    let transaction_IDValue = input_transaction_ID.value;
    let customer_nameValue = input_customer_name.value;
    let transaction_dateValue = input_transaction_date.value;
    let payment_methodValue = input_payment_method.value;

    
    // currently the database table for potion does not allow updating values to NULL
    // so we must abort if being bassed NULL for price


    // Put our data we want to send in a javascript object
    let data = {
        transaction_ID: transaction_IDValue,
        customer_name: customer_nameValue,
        transaction_date: transaction_dateValue,
        payment_method: payment_methodValue
    }
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "/put-transaction-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            updateRow(xhttp.response, transaction_IDValue);

            location.reload();

        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

})


function updateRow(data, transaction_ID){
    let parsedData = JSON.parse(data);
    
    let table = document.getElementById("transaction-table");

    for (let i = 0, row; row = table.rows[i]; i++) {
       //iterate through rows
       //rows would be accessed using the "row" variable assigned in the for loop
       if (table.rows[i].getAttribute("data-value") == transaction_ID) {

            // Get the location of the row where we found the matching person ID
            let updateRowIndex = table.getElementsByTagName("tr")[i];

            updateRowIndex.getElementsByTagName("td")[1].innerHTML = parsedData.transaction_ID;
            updateRowIndex.getElementsByTagName("td")[2].innerHTML = parsedData.customer_name;
            updateRowIndex.getElementsByTagName("td")[3].innerHTML = parsedData.transaction_date;
            updateRowIndex.getElementsByTagName("td")[4].innerHTML = parsedData.payment_method;
            
       }
    }
}