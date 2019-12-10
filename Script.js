const appName = "Treasure Hunterz";
const API_LINK = 'https://codecyprus.org/th/api/';
var questionType="";

// To show the list of available Treasure hunts
function apiList()
{                 //loads the list from the API
    let url = API_LINK + 'list';
    let serverRequest = new XMLHttpRequest();
    serverRequest.onload = handleList;
    serverRequest.open('GET', url, true);
    serverRequest.send();
}

function handleList()
{
    //shows the list of the loaded data from the server
    console.log(this.responseText);
    let hunts = JSON.parse(this.responseText);
    let huntArray = hunts['treasureHunts'];
    let availableTH = '<ul>';
    for (let i = 0; i < huntArray.length; i++)
    {
        //iterates to find all the available content
        let treasureHunt = huntArray[i];
        console.log(treasureHunt);
        availableTH += '<li><a href="Login.html?uuid=' + treasureHunt['uuid'] + '">' + treasureHunt['name'] + '</a>' + '</li>'; //creates a link that includes the uuid, and reads the name of the hunt
    }
    availableTH += '</ul>';
    let thsListDiv = document.getElementById('th-list');
    thsListDiv.innerHTML = '<p class="availableth">Treasure Hunts:</p>' + availableTH;
}

function getParameter(name)
{
    let url = new URL(window.location.href); //scans the current url
    return url.searchParams.get(name);  //gets the name attribute of the url (note that name is an argument and can be exchanged with anything
}

function loginInit()
{
    let player = document.getElementById('player').value;
    let uuid = getParameter('uuid'); //gets the uuid parameter
    apiChange(player, appName, uuid);
}

function apiChange(player, app, uuid)
{
    let url = API_LINK + 'start?player=' + player + '&app=' + app + '&treasure-hunt-id=' + uuid;
    let xmlHttpRequest = new XMLHttpRequest();
    xmlHttpRequest.onload = handleStart;
    xmlHttpRequest.open('GET', url, true);
    xmlHttpRequest.send();
}

let thisDiv = document.getElementById['errorsDiv'];

function handleStart()
{
    console.log(this.responseText);
    let resp = JSON.parse(this.responseText);
    if (resp['status'] === 'OK')
    {
        window.location.href = 'Question.html?session=' + resp['session'];
        setCookie(o['session']);
    }
    else
    {
        alert (resp['errorMessages'][0]);
    }
}


// QUESTIONING PART
function questionInit()
{
    let session = getParameter('session');
    questionStart(session);
}

function questionStart(session)
{
    let url = API_LINK + 'question?session=' + session;
    let xmlHttpRequest = new XMLHttpRequest();
    xmlHttpRequest.onload = handleQuestion;
    xmlHttpRequest.open('GET', url, true);
    xmlHttpRequest.send();
}

function handleQuestion()
{
    console.log(this.responseText);
    let qStatus = JSON.parse(this.responseText);
    if (qStatus['completed'] === false)

    {
        document.getElementById('th-question').innerHTML = 'Question:</br>' + qStatus['questionText'];
        if (qStatus['canBeSkipped'] === false)
            document.getElementById('th-skip').style.display='none';
        if (qStatus['questionType'] === 'TEXT')
        {
            document.getElementById("text").style.display = 'block';
            document.getElementById("numeric").style.display = 'none';
            document.getElementById("integer").style.display = 'none';
            document.getElementById("boolean").style.display = 'none';
            document.getElementById("mcq").style.display = 'none';

        }
        else if (qStatus['questionType'] === 'NUMERIC')
        {
            document.getElementById("text").style.display = 'none';
            document.getElementById("numeric").style.display = 'block';
            document.getElementById("integer").style.display = 'none';
            document.getElementById("boolean").style.display = 'none';
            document.getElementById("mcq").style.display = 'none';
        }
        else if (qStatus['questionType'] === 'INTEGER')
        {
            document.getElementById("text").style.display = 'none';
            document.getElementById("numeric").style.display = 'none';
            document.getElementById("integer").style.display = 'block';
            document.getElementById("boolean").style.display = 'none';
            document.getElementById("mcq").style.display = 'none';
        }
        else if (qStatus['questionType'] === 'BOOLEAN')
        {
            document.getElementById("text").style.display = 'none';
            document.getElementById("numeric").style.display = 'none';
            document.getElementById("integer").style.display = 'none';
            document.getElementById("boolean").style.display = 'block';
            document.getElementById("mcq").style.display = 'none';

        }
        else if (qStatus['questionType'] === 'MCQ')
        {
            document.getElementById("text").style.display = 'none';
            document.getElementById("numeric").style.display = 'none';
            document.getElementById("integer").style.display = 'none';
            document.getElementById("boolean").style.display = 'none';
            document.getElementById("mcq").style.display = 'block';
        }

    }
    else if (qStatus['completed'] === true)
    {
        window.location.href = 'Leaderboard.html?session=' + getParameter('session');
    }

    if (navigator.geolocation)
    {
        if (qStatus['requiresLocation'] === true)
        {
            document.getElementById('location-sensitive').innerHTML = '<div>REQUIRES LOCATION</div>';
            navigator.geolocation.getCurrentPosition(sendLocation);
        }
    }
    else
    {
        alert("Geolocation is not supported by this browser.");
    }
}

//LOCATION DETAILS
function sendLocation(position)
{
    let lat = position.coords.latitude;
    let lng = position.coords.longitude;
    let session = getCookie('session');
    apiLocation(getParameter(session, lat, lng));
}


function apiLocation(session, lat, lng)
{
    let url = API_LINK + 'location?session=' + session + '&latitude=' + lat + '&longitude=' + lng;
    let xmlHttpRequest = new XMLHttpRequest();
    xmlHttpRequest.open('GET', url, true);
    xmlHttpRequest.send();
}

//ANSWERING THE QUESTIONS
function triggerAnswer(answer)
{
    location.reload();
    let session = getParameter('session');
    answerStart(session, answer);
}


function answerStart(session, answer)
{
    let url = API_LINK + 'answer?session=' + session + '&answer=' + answer;
    let xmlHttpRequest = new XMLHttpRequest();
    xmlHttpRequest.onload = handleAnswer;
    xmlHttpRequest.open('GET', url, true);
    xmlHttpRequest.send();
}

function handleAnswer()
{
    console.log(this.responseText);
    let o = JSON.parse(this.responseText);
    document.getElementById('points').innerHTML = '<div>Result: ' + o['correct'] + '<div>' + o['message'] + '</div></div>';
    if (o['completed'] === 'true')
    {
        window.location.href = 'Leaderboard.html?session=' + o['session'];
    }
    else
    {
        handleQuestion();
    }
}

//SKIPPING QUESTIONS
function triggerSkip()
{
    let session=getParameter('session');
    skipStart(session);
}

function skipStart(session)
{
    let url=API_LINK+'skip?session='+session;
    let xmlHttpRequest = new XMLHttpRequest();
    xmlHttpRequest.onload=handleSkip;
    xmlHttpRequest.open('GET',url,true);
    xmlHttpRequest.send();
}

function handleSkip()
{
    console.log(this.responseText);
    let o=JSON.parse(this.responseText);
    if(o['status']==='OK')
    {
        location.reload();
    }
    else
    {
        console.log(o['errorMessages'][0])
        document.getElementById('skip-msg').innerHTML = o['errorMessages'][0];;
    }
}

function ConfirmSkip()
{
    let c=confirm("Are you sure you want to skip?");
    if(c==true)
    {
        triggerSkip();
    }
}

// COOKIES
function setCookie(cname, cvalue, exdays)
{
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires="+d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname)
{
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i = 0; i < ca.length; i++)
    {
        var c = ca[i];
        while (c.charAt(0) == ' ')
        {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0)
        {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

function checkCookie()
{
    var user = getCookie("sessionid");
    if (user != "")
    {
        LeaderboardStart(user);
        alert(user);
    }
    else
    {
        alert("user undefined");
    }
}

// LEADERBOARDS
function triggerLeaderboard()
{
    let session=getParameter('session');
    console.log("okay");
    console.log(session);
    setCookie("sessionid", session, 1);
    checkCookie();
}

function LeaderboardStart(session)
{
    let url=API_LINK+'leaderboard?session='+session+'&sorted&limit='+20;
    // alert("LEADERBOARD URL: " + url);
    let xmlHttpRequest = new XMLHttpRequest();

    xmlHttpRequest .onreadystatechange = function()
    {
        console.log(this.responseText);
        if (this.readyState == 4 && this.status == 200)
        {
            let o = JSON.parse(this.responseText);
            let playersArray=o['leaderboard'];
            let html='<ul>';
            for(let i in playersArray)
            {
                let th=playersArray[i];
                html+='<li>Player: '+th['player']+' scored '+th['score']+' in '+th['completionTime']+'</li>';
            }
            html+='</ul>';
            document.getElementById('showLeaderboard').innerHTML=html;
        }
        else
        {
            console.log("ERROR - Could not get leaderboard");
        }
    };

    xmlHttpRequest.onload=handleLeaderboard;
    xmlHttpRequest.open('GET',url,true);
    xmlHttpRequest.send();
}

function handleLeaderboard()
{
    console.log(this.responseText);
}

// SCORE
