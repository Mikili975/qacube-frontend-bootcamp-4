const modal = document.getElementById('error-modal');
const closeBtn = document.getElementById('modal-close-button');
const searchBtn = document.getElementById('search-button');
let embedElements = [];
const snInputField = document.getElementById('sn-input-field');
const tweetsDiv = document.getElementById('tweets');
const bars = document.getElementById('bars');
const activityInterval = document.getElementById('interval-picker');
let interval = activityInterval.value;
let isSnValid = true;
let tweets = [];
const idList = [];
let dateEntry = '';
const monthList = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
let sn = '';
let rawTimeData = [];
let data = [];
let counts = [];
let dateStr = [];
let frequencies = [];

// embed function
let embed = (i, sn, id) => {
    fetch('http://localhost:5000/api/tweet/' + sn + '/' + id)
        .then(response => response.json())
        .then(json => {
            let html = json.html;
            const embeddedDiv = document.getElementById('embedded-' + i);
            embeddedDiv.innerHTML = html;
        })
}

// noEmbed function
let noEmbed = (i, tweet) => {
    const embeddedDiv = document.getElementById('embedded-' + i);
    embeddedDiv.innerHTML = '<p class="created-at">Created at: ' + tweet.created_at + '</p>'
        + '<p class="t-text">' + tweet.text + '</p>';
    const x = new Date(Date.parse(tweet.created_at));
    rawTimeData.push(x);
}

// Check duplicate entry function
let notDuplicate = (dateEntry) => {
    let flag = true;
    counts.forEach(entry => {
        if (dateEntry === entry.date_str) {
            flag = false;
        }
    });
    return flag;
};

let getWeek = (date) => {
    date.setUTCDate(date.getUTCDate() + 4 - (date.getUTCDay() || 7));
    const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
    const weekNo = Math.ceil((((date - yearStart) / 86400000) + 1) / 7);
    return [date.getUTCFullYear(), weekNo];
}

// click and enter handler
const getTweets = () => {
    rawTimeData = [];
    data = [];
    counts = [];
    sn = snInputField.value;
    if (sn === '' || sn.indexOf(' ') >= 0) {
        isSnValid = false;
    }
    if (isSnValid) {
        fetch('http://localhost:5000/api/tweets/' + sn)
            .then(response => response.json())
            .then(json => {
                tweets = json;
            })
            .then(() => { tweetsDiv.innerHTML = '' })
            .then(() => {
                tweets.forEach((tweet, index) => {
                    tweetsDiv.innerHTML += '<p class="embed-element">Tweet ' + (index + 1) + '</p>' + '\n'
                        + '<div id="embedded-' + index + '" class="t-text"' + '></div>'
                })
            })
            .then(() => {
                embedElements = document.getElementsByClassName('embed-element');
                for (let i = 0; i < embedElements.length; i++) {
                    // embed(i, tweets[i].user.screen_name, tweets[i].id_str);
                    noEmbed(i, tweets[i]);
                };
            })
            .then(() => {
                rawTimeData.forEach(date => {
                    dateEntry = 'week ' + getWeek(date)[1] + ' of ' + getWeek(date)[0];
                    if (interval === 'daily') {
                        dateEntry = date.getDate() + ' ' + (1 + parseFloat(date.getMonth())).toString() + ' ' + date.getUTCFullYear();
                    }
                    if (interval === 'monthly') {
                        dateEntry = monthList[date.getMonth()] + ' ' + date.getUTCFullYear();
                    }
                    data.push(dateEntry);
                    if (notDuplicate(dateEntry)) {
                        counts.push({ date_str: dateEntry, frequency: 0 })
                    }
                })
            })
            .then(() => {
                data.forEach(date => {
                    counts.forEach(entry => {
                        if (entry.date_str === date) {
                            entry.frequency += 1;
                        }
                    })
                })
            })
            .then(() => {
                dateStr = counts.map(d => { return d.date_str });
                frequencies = counts.map(d => { return d.frequency });
                updateGraph();
            });
    } else {
        modal.style.display = "block";
        isSnValid = !isSnValid;
    }
}

// enter on search field
snInputField.addEventListener('keyup', event => {
    if (event.keyCode === 13) { getTweets(); }
});

// click on search button
searchBtn.addEventListener('click', () => { getTweets(); });

// changing activity interval value
activityInterval.addEventListener('change', () => {
    interval = activityInterval.value;
    getTweets();
})

// click on bars button
bars.addEventListener('click', () => {
    const x = document.getElementById("myTopnav");
    if (x.className === "topnav") {
        x.className += " responsive";
    } else {
        x.className = "topnav";
    }
});

// closing modal
closeBtn.addEventListener('click', () => { modal.style.display = "none" });