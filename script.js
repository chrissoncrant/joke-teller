import {VOICERSS_API_KEY, RAPID_API_VOICERSS_KEY, JOKE_API_KEY} from './config.js';
const jokeButton = document.getElementById('button');
const voiceButton = document.getElementById('voiceBtn');
const audioElement = document.getElementById('audio');
const langSelect = document.getElementById('lang');
const voiceSelect = document.getElementById('voice');

const voices = {
    Australian: ['Zoe', 'Isla', 'Evie', 'Jack'],
    Canadian: ['Rose', 'Clara', 'Emma', 'Mason'],
    British: ['Alice', 'Nancy', 'Lily', 'Harry'],
    Indian: ['Eka', 'Jai', 'Ajit'],
    Irish: ['Oran'],
    American: ['Linda', 'Amy', 'Mary', 'John', 'Mike', ]
};

function setVoiceOptions(acc, arr) {
    if (voiceSelect.options) {
        while (voiceSelect.firstChild) {
            voiceSelect.removeChild(voiceSelect.firstChild);
        }
    };
    for (let i = 0; i < arr.length; i++) {
        const opt = document.createElement('option');
        opt.setAttribute('value', acc);
        opt.textContent = arr[i];
        voiceSelect.appendChild(opt);
    }
}

function getSelectedOption(element) {
    return Array.from(element.options).find(opt => opt.selected)
}

voiceButton.addEventListener('click', () => {
    const selected = getSelectedOption(langSelect);
    setVoiceOptions(selected.value, voices[selected.textContent]);
})

// VoiceRSS Javascript SDK
const VoiceRSS={speech:function(e){this._validate(e),this._request(e)},_validate:function(e){if(!e)throw"The settings are undefined";if(!e.key)throw"The API key is undefined";if(!e.src)throw"The text is undefined";if(!e.hl)throw"The language is undefined";if(e.c&&"auto"!=e.c.toLowerCase()){var a=!1;switch(e.c.toLowerCase()){case"mp3":a=(new Audio).canPlayType("audio/mpeg").replace("no","");break;case"wav":a=(new Audio).canPlayType("audio/wav").replace("no","");break;case"aac":a=(new Audio).canPlayType("audio/aac").replace("no","");break;case"ogg":a=(new Audio).canPlayType("audio/ogg").replace("no","");break;case"caf":a=(new Audio).canPlayType("audio/x-caf").replace("no","")}if(!a)throw"The browser does not support the audio codec "+e.c}},_request:function(e){var a=this._buildRequest(e),t=this._getXHR();t.onreadystatechange=function(){if(4==t.readyState&&200==t.status){if(0==t.responseText.indexOf("ERROR"))throw t.responseText;audioElement.src=t.responseText,audioElement.play()}},t.open("POST","https://api.voicerss.org/",!0),t.setRequestHeader("Content-Type","application/x-www-form-urlencoded; charset=UTF-8"),t.send(a)},_buildRequest:function(e){var a=e.c&&"auto"!=e.c.toLowerCase()?e.c:this._detectCodec();return"key="+(e.key||"")+"&src="+(e.src||"")+"&hl="+(e.hl||"")+"&v="+(e.v||"")+"&r="+(e.r||"")+"&c="+(a||"")+"&f="+(e.f||"")+"&ssml="+(e.ssml||"")+"&b64=true"},_detectCodec:function(){var e=new Audio;return e.canPlayType("audio/mpeg").replace("no","")?"mp3":e.canPlayType("audio/wav").replace("no","")?"wav":e.canPlayType("audio/aac").replace("no","")?"aac":e.canPlayType("audio/ogg").replace("no","")?"ogg":e.canPlayType("audio/x-caf").replace("no","")?"caf":""},_getXHR:function(){try{return new XMLHttpRequest}catch(e){}try{return new ActiveXObject("Msxml3.XMLHTTP")}catch(e){}try{return new ActiveXObject("Msxml2.XMLHTTP.6.0")}catch(e){}try{return new ActiveXObject("Msxml2.XMLHTTP.3.0")}catch(e){}try{return new ActiveXObject("Msxml2.XMLHTTP")}catch(e){}try{return new ActiveXObject("Microsoft.XMLHTTP")}catch(e){}throw"The browser does not support HTTP request"}};

async function setAudioText(text, lang, voice) {
    VoiceRSS.speech({
        key: VOICERSS_API_KEY,
        src: text,
        hl: lang,
        v: voice,
        r: 0, 
        c: 'mp3',
        f: '44khz_16bit_stereo',
        ssml: false
    });
};

async function getJoke() {
    try {
        let response = await fetch('https://v2.jokeapi.dev/joke/Programming?blacklistFlags=nsfw,religious,political,racist,sexist,explicit');
        response = await response.json();
        if (response.type === 'single') {
            console.log('single', response)
            return response.joke;
        } else {
            return `${response.setup} ... \n ${response.delivery}`
        };
    }
    catch(err) {
        console.log('Error getting joke', err);
    }
}

jokeButton.addEventListener('click', async () => {
    const joke = await getJoke();
    const voiceSelection = getSelectedOption(voiceSelect);
    const lang = voiceSelection.value === 'Choose' ? 'en-us' : voiceSelection.value;
    const voice = voiceSelection.textContent === 'Choose Language to Load Voices' ? 'Linda' : voiceSelection.textContent;
    setAudioText(joke, lang, voice);
    audioElement.play(); 
}) 

audioElement.addEventListener('playing', () => {
    console.log('playing');
    jokeButton.setAttribute('disabled', 'true');
    jokeButton.textContent = 'Telling joke now...';
})

audioElement.addEventListener('ended', () => {
    console.log('yo');
    jokeButton.removeAttribute('disabled');
    jokeButton.textContent = 'Tell me another!';
})