/*---------------------------------------------------------------------------------------------------------------------
CLASSES
---------------------------------------------------------------------------------------------------------------------*/

class FetchData {
    
    constructor(url, refineResultsCallback , ...channels) {
        this.url = url;
        this.refineResultsCallback = refineResultsCallback
        this.channels = channels;
        }

    run () {
        this._validateArgs();
        const results = this._fetchFunc();
        return results;
    }

    _validateArgs () {
    try {
        const errorArray = [];
        this.channels.map( (channel, i) => { if (typeof channel !== "string") errorArray.push(i); } );
        if (errorArray.length > 0) throw new Error (
            `${errorArray.length} arguments of unsupported type in index ${errorArray}.
Arguments should be strings`);
        if (typeof this.url !== 'string') throw new Error (`${url} should be a string but is a ${typeof url}.`);
        if (typeof this.refineResultsCallback !== 'function') 
            throw new Error (`refineResultsCallback passed into fetchData is not a function`);
    }
    catch (err) {
        console.error(err);
    }
}

    _fetchFunc() {
        this._validateArgs (this.url, this.refineResultsCallback, ...this.channels);
        return Promise.all( this.channels.map( channel => fetch(this.url + channel) ) )
        .then ( responses => Promise.all( responses.map(response => response.json()) ) )
        .then ( json =>
            json.map( this.refineResultsCallback ) )
         .then ( resultArray => {
                console.log(resultArray); 
                return resultArray;
        } )
        .catch ( err => { console.error(err); } );
    }

} //end of FetchData class

class DisplayData {

    constructor ( channelsObj ) {
        this.channelsObj = channelsObj;
        this.channelList = document.querySelector('#channel-list');
        this.tabs = Array.from(document.querySelectorAll('.tab'));
        this.liItems = Array.from(document.querySelectorAll('#channel-list > *'));
        this.tabAll = document.querySelector('#tab-all');
        this.tabOnline = document.querySelector('#tab-online');
        this.tabOffline = document.querySelector('#tab-offline');
    }

// Event listeners bombing because vars unavailable after closure

    run () {
            this._renderList ( this.channelsObj.all_Ordered );
            this.tabOnline.addEventListener ( 'click' , (event) => {
                this._switchTab (event , this.channelsObj.online )
            } );
            this.tabOffline.addEventListener ( 'click' , (event) => {
                this._switchTab (event , this.channelsObj.offline )
            } );
            this.tabAll.addEventListener ( 'click' , (event) => {
                this._switchTab (event , this.channelsObj.all_Ordered)
            } );
        }

    _switchTab ( event, statusArray, className = 'active-tab' ) {
    const target = event.target || event.srcElement;
    this.tabs.forEach(tab => {tab.classList.remove(className)});
    this.liItems.forEach(item => {item.remove()});
    target.classList.add(className);
    this._renderList ( statusArray );
    }

    _renderList ( statusArray ) {
    let markup = '';
    if ( statusArray.length < 1 ) {
        markup += `<a href='#' class="offline">
                    <li>
                        <div>There are no results for this status</div>
                    </li>
                </a>`
    }
    else {
        for (let obj of statusArray ) {
                    if (obj.online) {
                    markup += `<a href=${obj.url} class="online">
                        <li>
                            <img class="logo" src=${obj.logo} />
                            <div class="channelname">${obj.display_name}</div>
                            <div class="statusmsg">${obj.status}</div>
                        </li>
                    </a>`
                }
                else {
                    markup += `<a href=${obj.url} class="offline">
                        <li>
                            <img class="logo" src=${obj.logo} />
                            <div class="channelname">${obj.display_name}</div>
                            <div class="statusmsg">${obj.status}</div>
                        </li>
                    </a>`
                }
        }
    }
    this.channelList.innerHTML = markup;
}

} //end of DisplayData class

/*---------------------------------------------------------------------------------------------------------------------
MAIN VARS AND FUNCTIONS 
---------------------------------------------------------------------------------------------------------------------*/
const TWITCH = {    channels : ['freecodecamp', 'TwitchPresents', 'cretetion', 'storbeck', 'gearsofwar', 'ESL_SC2', 'OgamingSC2', 'habathcx', 'RobotCaleb', 'noobs2ninjas'],
                    _sortChannels (reducedResults) { //takes array, sorts alphabetically, filters between on/offline and produces object of 3 arrays
                        let online = [],
                            offline = [];
                        const all_Ordered = reducedResults.sort (
                            (nameA, nameB) => {
                                const name_A = nameA.display_name.toLowerCase();
                                const name_B = nameB.display_name.toLowerCase();
                                if (name_A < name_B) {return -1}
                                if (name_A > name_B) {return 1}
                                else return 0;
                            });
                            all_Ordered.map(
                                obj => { obj.online ? online.push(obj) : offline.push(obj);}
                            ); 
                        console.log('Sorted arrays created');
                        return {
                            all_Ordered,
                            online,
                            offline
                        }
                    }
},

fetchDetails = new FetchData (
    'https://wind-bow.glitch.me/twitch-api/channels/',
    obj => {
            const {display_name, logo, name, url, status} = obj;
            return {display_name, logo, name, url, status};
        },
        ...TWITCH.channels
),

fetchStatus = new FetchData ( 
    'https://wind-bow.glitch.me/twitch-api/streams/',
    (obj, i) => { 
            return {
                stream: TWITCH.channels[i],
                online: obj['stream'] !== null
            }
    },
    ...TWITCH.channels           
    );

/*---------------------------------------------------------------------------------------------------------------------
MAIN SCRIPT THREAD
---------------------------------------------------------------------------------------------------------------------*/

Promise.all ( [fetchDetails.run() , fetchStatus.run()] )
    .then ( results => {
        const [details , status] = results; //destructure results into two arrays
        console.log(details, status);
        const smushed = details.map ( (dObj, i) => {
            //check for non-existent channels
            if (!dObj.name || dObj.status === 404) {
                 dObj.name = TWITCH.channels[i];
                 dObj.display_name = TWITCH.channels[i];
                 dObj.logo = "http://placehold.it/70x70?text=😟";
                 dObj.status = 'This channel does not exist';
                 dObj.url = "#";
            }
            const channelStatus = status.find ( sObj => sObj.stream.toLowerCase() === dObj.name.toLowerCase() );
            if (channelStatus) { dObj.online = channelStatus.online }
            else { throw new Error (`Could not match status and details objects for ${dObj.online} at index ${i}`) }
            return dObj;
        } );
        console.log(smushed);
        const sortedChannels = TWITCH._sortChannels(smushed);
        console.log(sortedChannels);
        return sortedChannels;
    })
    .then ( sortedChannels => { 
        const displayData = new DisplayData( sortedChannels );
        displayData.run();
        return;
    })
    .catch ( err => {console.error(err)} );



