
/*
EXAMPLE CALLS

FOR ON/OFFLINE: 
https://wind-bow.glitch.me/twitch-api/streams/freecodecamp

FOR CHANNEL INFO AND ASSETS
https://wind-bow.glitch.me/twitch-api/channels/freecodecamp
*/

function fetchStatus (...streams) {
    return  Promise.all( streams.map( stream => fetch('https://wind-bow.glitch.me/twitch-api/streams/' + stream) ) )
            .then ( responses => Promise.all( responses.map(response => response.json()) ) )
            .then ( json => 
                json.map( (obj, i) => { return {stream: streams[i], online: obj['stream'] !== null} } ) )
            .then ( resultArray => {
                console.log(resultArray); 
                return resultArray
            } )
            .catch ( err => { console.log(err); } );
} // returns promise object which can be used within another promise chain or evaluate by looking at PromiseValue

fetchStatus('freecodecamp', 'testchannel');

