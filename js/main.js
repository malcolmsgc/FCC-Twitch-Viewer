function validateArgs (...channels) {
    try {
        const errorArray = [];
        channels.map( (channel, i) => { if (typeof channel !== "string") errorArray.push(i); } );
        if (errorArray.length > 0) throw new Error (
            `${errorArray.length} arguments of unsupported type in index ${errorArray}.
Arguments should be strings`);
    }
    catch (err) {
        console.error(err);
    }
}

/*
function fetchStatus (...streams) {
    return Promise.all( streams.map( stream => fetch('https://wind-bow.glitch.me/twitch-api/streams/' + stream) ) )
            .then ( responses => Promise.all( responses.map(response => response.json()) ) )
            .then ( json => 
                json.map( (obj, i) => { 
                    return {
                        stream: streams[i],
                        online: obj['stream'] !== null
                    }
                } ) )
            .then ( resultArray => {
                console.log(resultArray); 
                return resultArray;
            } )
            .catch ( err => { console.error(err); } );
} // returns promise object which can be used within another promise chain or evaluate by looking at PromiseValue

function fetchDetails (...channels) {
     return Promise.all( channels.map( channel => fetch('https://wind-bow.glitch.me/twitch-api/channels/' + channel) ) )
    .then ( responses => Promise.all( responses.map(response => response.json()) ) )
    .then ( json =>
        json.map( obj => {
            const {display_name, logo, name, url, status} = obj;
            return {display_name, logo, name, url, status};
        } ) )
    .then ( resultArray => {
                console.log(resultArray); 
                return resultArray;
            } )
    .catch ( err => { console.error(err); } );
}*/

class fetchData {
    
    constructor(url, refineResultsCallback , ...channels) {
        this.url = url;
        this.refineResultsCallback = refineResultsCallback
        this.channels = channels;
        }
    

    _validateArgs () {
    try {
        const errorArray = [];
        channels.map( (channel, i) => { if (typeof channel !== "string") errorArray.push(i); } );
        if (errorArray.length > 0) throw new Error (
            `${errorArray.length} arguments of unsupported type in index ${errorArray}.
Arguments should be strings`);
        if (typeof url !== 'string') throw new Error (`${url} should be a string but is a ${typeof url}.`);
        if (typeof refineResultsCallback !== 'function') 
            throw new Error (`refineResultsCallback passed into fetchData is not a function`);
    }
    catch (err) {
        console.error(err);
    }
}

    _fetchFunc() {
        _validateArgs (url, refineResultsCallback, ...channels);
        return Promise.all( channels.map( channel => fetch(url + channel) ) )
        .then ( responses => Promise.all( responses.map(response => response.json()) ) )
        .then ( json =>
            json.map( refineResultsCallback ) )
         .then ( resultArray => {
                console.log(resultArray); 
                return resultArray;
        } )
        .catch ( err => { console.error(err); } );
    }

} //end of fetchData class

/*
function fetchFunc (url, refineResultsCallback , ...channels) {
     return Promise.all( channels.map( channel => fetch(url + channel) ) )
    .then ( responses => Promise.all( responses.map(response => response.json()) ) )
    .then ( json =>
        json.map( refineResultsCallback ) )
    .then ( resultArray => {
                console.log(resultArray); 
                return resultArray;
            } )
    .catch ( err => { console.error(err); } );
}


}
*/

function renderLists ({ stream , online } = {}) {
    console.log('render');
}

const channels = ['freecodecamp', 'TwitchPresents']; // add channels to include in results in this array
//validateArgs(...channels);
const fetchDetails = new fetchData (
    'https://wind-bow.glitch.me/twitch-api/channels/',
    obj => {
            const {display_name, logo, name, url, status} = obj;
            return {display_name, logo, name, url, status};
        },
        ...channels
),
fetchStatus = new fetchData ( 
    'https://wind-bow.glitch.me/twitch-api/streams/',
    (obj, i) => { 
            return {
                stream: channels[i],
                online: obj['stream'] !== null
            }
    },
    ...channels           
    );

Promise.all ( [fetchDetails , fetchStatus] )
    .then ( results => {
        const [details , status] = results; //destructure results into two arrays
        console.log(details, status);
        renderLists()
    }
    )
    .catch ( err => {console.error(err)} );
//fetchStatus(...channels);
//fetchDetails(...channels);

