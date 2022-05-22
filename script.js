import {VOICERSS_API_KEY, RAPID_API_VOICERSS_KEY, JOKE_API_KEY} from './config.js';

const audio = document.getElementById('audio');
const button = document.getElementById('button');

async function getJoke() {
    const options = {
        method: 'GET',
        url: 'https://jokes-by-api-ninjas.p.rapidapi.com/v1/jokes',
        headers: {
          'X-RapidAPI-Host': 'jokes-by-api-ninjas.p.rapidapi.com',
          'X-RapidAPI-Key': JOKE_API_KEY
        }
      };
      const res = await axios.request(options);
    //   console.log(res.data[0].joke);
      return res.data[0].joke;
}

async function speak({trans, lang, voice, speed}) {
    const options = {
        method: 'GET', 
        url: `https://voicerss-text-to-speech.p.rapidapi.com/`,
        params: {
            key: VOICERSS_API_KEY,
            src: trans || 'text is not defined',
            hl: lang,
            v: voice,
            r: speed,
            c: 'MP3',
            f: '8khz_8bit_stereo',
            b64: true,
        },
        headers: {
            'X-RapidAPI-Host': 'voicerss-text-to-speech.p.rapidapi.com',
            'X-RapidAPI-Key': RAPID_API_VOICERSS_KEY
            }
    };
    const res = await axios.request(options);
    audio.setAttribute('src', res.data);
}

button.addEventListener('click', async () => {
    const speechInput = {
        trans: await getJoke(),
        lang: 'en-gb',
        voice: 'Lily',
        //speed range: -10 to 10;
        speed: 1
    }
    await speak(speechInput);
    audio.play();
})


