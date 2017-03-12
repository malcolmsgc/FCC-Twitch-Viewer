
/*
EXAMPLE CALLS

FOR ON/OFFLINE: 
https://wind-bow.gomix.me/twitch-api/streams/freecodecamp

FOR CHANNEL INFO AND ASSETS
https://wind-bow.gomix.me/twitch-api/channels/freecodecamp
*/

function fetchStatus (streams = ['freecodecamp']) {
    const statusArray = streams.map(
        //callback
        function(stream) {
            const statusResult = fetch('https://wind-bow.gomix.me/twitch-api/streams/' + stream);
            statusResult
                .then (result => result.json())
                //.then (json => {console.log(json)})
                .then (jsonObj => {console.log(jsonObj);
                                    console.log(`{${stream}, online: ${jsonObj['stream'] !== null}}`); 
                                    return {stream, online: jsonObj['stream'] !== null}})
                .catch(err => (console.log(err)));
    });
    return statusArray;
} 