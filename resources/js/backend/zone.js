//---------------------------------------------------------------
//                      OTHER FUNCTION
//---------------------------------------------------------------
$(document).ready(function() {
    var pair = '';
    let today = new Date().toISOString().substr(0, 10);
    for (var i = 0; i < 6; i++) {
        $('#zoneTableBody').append('<tr><td>' + (i + 1) + '</td>' +
            '<td><input type="date" id="date-' + i + '" max="' + today + '" class="fromDate" form="zoneForm"></td>' +
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
        {pair: argument['pair']}

    ).done(function (data) {
        var length = (data.length > 5) ? 6 : data.length;
        for (var i = 0; i < length; i++) {
            document.getElementById("date-" + i).value = data[i][4].substr(0, 10);
            document.getElementById("high-" + i).value = data[i][2];
            document.getElementById("low-" + i).value = data[i][3];

        }
    }).fail(function (data) {
        console.log("Error: " + data);
    }).always(function (data) {

    });

}

function getForm () {
    var jsonForm = JSON.parse('{"fromTime":[], "high":[], "low": []}');
    for (var i = 0; i < 6; i++) {
        jsonForm['fromTime'].push(document.getElementById("date-" + i).value);
        jsonForm['high'].push(document.getElementById("high-" + i).value);
        jsonForm['low'].push(document.getElementById('low-' + i).value);
    }
    return jsonForm;

}

function submitZone(data) {
    var url = 'http://minidesk.laravel.coretekllc.com/admin/zoneeditor/submitZone';

    $.post(url, data,
        function(data){

            console.log("success: "  + data);
    });
}