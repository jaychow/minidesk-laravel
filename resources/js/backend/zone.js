
$(document).ready(function() {
    var pair = '';
    let today = new Date().toISOString().substr(0, 10);
    for (var i = 0; i < 6; i++) {
        $('#zoneTableBody').append('<tr><td>' + (i + 1) + '</td>' +
            '<td><input type="date" id="date-' + i + '" max="' + today + '" class="fromDate" form="zoneForm"></td>' +
            '<td><select name="tradeType" id="tradeType-' + i + '" form="zoneForm">' +
            '       <option disabled selected value> -- type -- </option>' +
            '       <option value="Buy">buy</option>' +
            '       <option value="Sell">sell</option>' +
            '   </select></td>' +
            '<td><input type="number" id="high-' + i + '" class="high" form="zoneForm"></td>' +
            '<td><input type="number" id="low-' + i + '" class="low" form="zoneForm"></td>' +
            '<td><button class="panelButton" id="zoneRmBtn_' + i + '">&#10005</button></td></tr><br/>'
        );
    }

    //===========================================================
    //                      CLICK EVENTS
    //===========================================================
    // prevent from the button can only submit once
    $('#zoneForm').on('submit', function(e) {
        e.preventDefault();
    });

    $('#homeCurrency').on('change', function(e) {
        var homeCurrency = e.target.value;
        var foreignCurrency = document.getElementById("foreignCurrency");

        // disable the same option in foreignCurrency drop down list
        var length = document.getElementById("foreignCurrency").length;
        for (var i = 0; i < length; i++) {
            if (foreignCurrency.chart[i].value == homeCurrency) {
                foreignCurrency.chart[i].disabled = true;
            } else {
                foreignCurrency.chart[i].disabled = false;
            }
        }

        // every time when user select homeCurrency, he will need to select foreignCurrency again.
        foreignCurrency.selectedIndex = "0";
    });

    $('#foreignCurrency').on('change', function(e) {
        var foreignCurrency = e.target;
        var homeCurrency = document.getElementById("homeCurrency");
        var pair;

        // if user haven't yet choose home currency
        if (homeCurrency.value == "") {
            alert("Please select home currency first");
            foreignCurrency.selectedIndex = "0";
        } else {
            // save input
            pair = foreignCurrency.value + "_" + homeCurrency.value;
            requestData({'pair': pair});
        }
    });


        // once pull-down list change
    $('#pairOptions').on('change', function(e) {
        pair = e.target.value;
        requestData({'pair': e.target.value});
    });

    // submit form
    $('#submitButton').on('click', function(e) {
        var dataToSubmit = getForm();
        dataToSubmit['pair'] = document.getElementById('pairOptions').value;
        dataToSubmit['_token'] = $('[name=_token]').val()
        submitZone(dataToSubmit);
    });

});

function requestData (argument) {
    // get zones info that are stored in db.
    $.get(
        'http://minidesk.laravel.coretekllc.com/admin/zoneeditor/getZone',
        {pair: argument['pair'], trade: 'All'}

    ).done(function (data) {
        var length = (data.length > 5) ? 6 : data.length;
        for (var i = 0; i < length; i++) {
            document.getElementById("date-" + i).value = data[i][4].substr(0, 10);
            document.getElementById("tradeType-" + i).value = data[i][1];
            document.getElementById("high-" + i).value = data[i][2];
            document.getElementById("low-" + i).value = data[i][3];

        }
    }).fail(function (data) {
        console.log("Error: " + data);
    }).always(function (data) {

    });

}

function getForm () {
    var jsonForm = JSON.parse('{"fromTime":[], "trade":[], "high":[], "low": []}');
    for (var i = 0; i < 6; i++) {
        jsonForm['fromTime'].push(document.getElementById("date-" + i).value);
        jsonForm['trade'].push(document.getElementById("tradeType-" + i).value);
        jsonForm['high'].push(document.getElementById("high-" + i).value);
        jsonForm['low'].push(document.getElementById('low-' + i).value);
    }
    return jsonForm;

}

function submitZone(data) {
    var url = 'http://minidesk.laravel.coretekllc.com/admin/zoneeditor/submitZone';

    $.post({
        url: url,
        data: data
    }).done(function(data) {
        console.log("success: "  + data);
        alert("Successfully submit!");
    }).fail(function (message) {
    });
}
