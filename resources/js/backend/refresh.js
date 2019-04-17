
$(document).ready(function()
{
    var interval = '';
    requestRefreshInterval ();

    //===========================================================
    //                      CLICK EVENTS
    //===========================================================

    // submit form
    $('#submitInterval').on('click', function(e)
    {
        var dataToSubmit = {
            'interval': document.getElementById('intervalOptions').value,
            '_token' : $('[name=_token]').val()
        };
        submitInterval(dataToSubmit);
    });

});

function requestRefreshInterval ()
{
    // get chart refresh interval info that are stored in db.
    $.get(
        'http://minidesk.laravel.coretekllc.com/admin/chartrefreshinterval/getInterval',
    ).done(function (data) {
        if (data != "") {
            document.getElementById("intervalOptions").value = data;
        }

    }).fail(function (data) {
        console.log("Error: " + data);
    }).always(function (data) {

    });
}

function submitInterval(data)
{
    var url = 'http://minidesk.laravel.coretekllc.com/admin/chartrefreshinterval/submitInterval';
    $.post(url, data,
        function(data){
            console.log("success: "  + data);
            alert("Successfully submit!");
        });
}