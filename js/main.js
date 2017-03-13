
/*
EXAMPLE CALLS

FOR ON/OFFLINE: 
https://wind-bow.glitch.me/twitch-api/streams/freecodecamp

FOR CHANNEL INFO AND ASSETS
https://wind-bow.glitch.me/twitch-api/channels/freecodecamp
*/

function fetchStatus (streams = ['freecodecamp']) {
    Promise
        .all( streams.map( stream => {
            const   statusResult = fetch('https://wind-bow.glitch.me/twitch-api/streams/' + stream);
                    statusResult
                        .then (result => result.json())
                        .then (jsonObj => { console.log(jsonObj);
                            console.log(`{${stream}, online: ${jsonObj['stream'] !== null}}`); 
                            return {stream, online: jsonObj['stream'] !== null}})
                        .catch(err => (console.log(err)));
    }
        ))
        .then( (resultsArray) => { console.log(resultsArray) } )
    

} 