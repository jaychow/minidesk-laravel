import api from '../../api/api'


export default { 
    getByNav(){
        if("geolocation" in navigator){
            navigator.geolocation.getCurrentPosition(
                function success(position){
                    console.log('latitude', position.coords.latitude, 
                     'longitude', position.coords.longitude);
                },
                function error(error_message) {
                    // for when getting location results in an error
                    console.error('An error has occured while retrieving location', error_message)
                }  
            );
        }else{
            console.log('geolocation is not enabled on this browser')
        }
    },
    ipLookUp(callback){
        $.ajax('http://ip-api.com/json')
        .then(
        function success(response) {
            // console.log('User\'s Location Data is ', response);
            // console.log('User\'s Country', response.country);
            callback(response)
        },

        function fail(data, status) {
            // console.log('Request failed.  Returned status of',
                        // status);
            callback(status)
        });
    }
}

