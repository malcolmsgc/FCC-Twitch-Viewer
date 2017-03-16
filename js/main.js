
/*
EXAMPLE CALLS

FOR ON/OFFLINE: 
https://wind-bow.glitch.me/twitch-api/streams/freecodecamp

FOR CHANNEL INFO AND ASSETS
https://wind-bow.glitch.me/twitch-api/channels/freecodecamp
*/

function fetchStatus (...streams) {
    //validate args
    try {
        const errorArray = [];
        streams.map( (stream, i) => { if (typeof stream !== "string") errorArray.push(i); } );
        if (errorArray.length > 0) throw new Error (
            `fetchStatus called with ${errorArray.length} arguments of unsupported type in index ${errorArray}.
Arguments should be strings`);
    }
    catch (err) {
        console.error(err);
    }
    return  Promise.all( streams.map( stream => fetch('https://wind-bow.glitch.me/twitch-api/streams/' + stream) ) )
            .then ( responses => Promise.all( responses.map(response => response.json()) ) )
            .then ( json => 
                json.map( (obj, i) => { return {stream: streams[i], online: obj['stream'] !== null} } ) )
            .then ( resultArray => {
                console.log(resultArray); 
                return resultArray
            } )
            .catch ( err => { console.error(err); } );
} // returns promise object which can be used within another promise chain or evaluate by looking at PromiseValue

fetchStatus('freecodecamp', 'TwitchPresents');

