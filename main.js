let languagearray = [
    ['af', 'Afrikaans'],
    ['al', 'Albanian'],
    ['ar', 'Arabic'],
    ['az', 'Azerbaijani'],
    ['bg', 'Bulgarian'],
    ['ca', 'Catalan'],
    ['cz', 'Czech'],
    ['da', 'Danish'],
    ['de', 'German'],
    ['el', 'Greek'],
    ['en', 'English'],
    ['eu', 'Basque'],
    ['fa', 'Farsi'],
    ['fi', 'Finnish'],
    ['fr', 'French'],
    ['gl', 'Galician'],
    ['he', 'Hebrew'],
    ['hi', 'Hindi'],
    ['hr', 'Croatian'],
    ['hu', 'Hungarian'],
    ['id', 'Indonesian'],
    ['it', 'Italian'],
    ['ja', 'Japanese'],
    ['kr', 'Korean'],
    ['la', 'Latvian'],
    ['lt', 'Lithuanian'],
    ['mk', 'Macedonian'],
    ['no', 'Norwegian'],
    ['nl', 'Dutch'],
    ['pl', 'Polish'],
    ['pt', 'Portuguese'],
    ['pt_br', 'Português'],
    ['ro', 'Romanian'],
    ['ru', 'Russian'],
    ['sv,', 'se', 'Swedish'],
    ['sk', 'Slovak'],
    ['sl', 'Slovenian'],
    ['sp,', 'es', 'Spanish'],
    ['sr', 'Serbian'],
    ['th', 'Thai'],
    ['tr', 'Turkish'],
    ['ua,',// 'uk',
        'Ukrainian',
    ],
    ['vi', 'Vietnamese'],
    ['zh_cn', 'Chinese Simplified'],
    ['zh_tw', 'Chinese Traditional'],
    ['zu', 'Zulu'],
];

let shortlang= languagearray.map(e=>e[0]);
let longlang = languagearray.map(e=>e[1]);
let units = {'speed': 'm/s', 'temp': '°C'}; //standard metric

//enters language options into <datalist option>
function languageOptions(){
    let datalist = document.querySelector('datalist#langlist');
    for(let i=0; i<longlang.length;i++){
        let option = document.createElement('option');
        option.setAttribute('value', shortlang[i]);
        option.textContent= longlang[i];
        datalist.appendChild(option);
    }
}
languageOptions();

//request weather data
async function getWeather(location, unit, lang){
    const jsond = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=728591575ebc683cc40495a3093f1e15&units=${unit}&lang=${lang}`, {mode: 'cors'});
    const data = await jsond.json();
    const jsondimg = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=728591575ebc683cc40495a3093f1e15&units=${unit}&lang=en`, {mode: 'cors'});
    const dataimg = await jsondimg.json(); 
    if(data.cod=='404'){
        if (data['message']=='city not found'){
            let cityerror = document.querySelector('#cityicont>span.inputcont>span');
            dataError(cityerror, data.message);
        }
    }
    else{
        displayData(data, dataimg); //dataimg is english version to get proper description
    }
}
//display dataerror from weather website
function dataError(loc, error){
    loc.textContent=`${error}`;
}
//search image based on data.description/main
function searchImage(category){
    let gifurl = `https://api.giphy.com/v1/gifs/translate?api_key=BknCH5ZJNJ4g1A5Hsz8yeQBLN8YPKlci&s=${category}&weirdness=1`;
    let img = document.querySelector('img');

    fetch(gifurl, {mode: 'cors'})
        .then(function(response) {
            return response.json();
        })
        .then(function(response){
            img.src= response.data.images.original.url;
        });  
}
//display data and image
function displayData(data, dataimg){
    let description=document.getElementById('description');
    let temp = document.querySelector('li#temp>span.content');
    let windspeed = document.querySelector('li#windspeed>span.content');
    let country = document.getElementById('country');
    let city = document.getElementById('city');
    let langerror = document.querySelector('#langcont>span.inputcont>span');
    let cityerror = document.querySelector('#cityicont>span.inputcont>span');
    let tempunit = document.querySelector('li#temp>span.unit');
    let windspeedunit = document.querySelector('li#windspeed>span.unit');
    langerror.textContent='';
    cityerror.textContent='';

    description.innerHTML=`<span>Description: </span> <span>${data['weather'][0]['description']}</span>`;
    temp.innerHTML=`<span>Temperature: </span> <span>${data['main']['temp']}</span>`;
    windspeed.innerHTML=`<span>Windspeed: </span> <span>${data['wind']['speed']}</span>`;
    country.innerHTML=`<span>Country: </span> <span>${data['sys']['country']}</span>`;
    city.innerHTML=`<span>City: </span> <span>${data['name']}</span>`;
    tempunit.textContent= units.temp;
    windspeedunit.textContent=units.speed;
    searchImage(dataimg['weather'][0]['description']);
}
//addeventlistener to button
let button = document.querySelector('button');
button.addEventListener('click', (e)=>{
    e.preventDefault();
    let form = document.getElementsByTagName('form')[0];
    let cityvalue = form.querySelector('#cityi').value;
    let unitvalue = form.querySelector('#units').value;
    let langvalue = form.querySelector('#lang').value;
    let citygood = cityCheck();
    let languagegood =languageCheck();
    if(citygood && languagegood){
        form.reset();
        if(unitvalue=='metric'){
            units={'speed': 'm/s', 'temp': ' °C'};
        }
        else if(unitvalue=='imperial'){
            units= {'speed': 'm/h', 'temp': ' °F'};
        }
        if(longlang.find(e=>e===langvalue)!==undefined){ //correct language into short
            longlang.filter((e,i)=>{
                if(e==langvalue){
                    shortlang[i];
                }
            });
        }
        getWeather(cityvalue, unitvalue, langvalue);
    }
});
//check if city is valid enough (only checks if empty)
function cityCheck(){
    let city = document.querySelector('#cityi');
    let cityerror = document.querySelector('#cityicont>span.inputcont>span');
    if(!city.validity.valid){
        showError(city, cityerror);
        return false;
    }
    else{
        cityerror.textContent='';
        return true;
    }
}
//check if language belongs to list and isnt empty
function languageCheck(){
    let lang = document.querySelector('#lang');
    let langerror = document.querySelector('#langcont>span.inputcont>span');
    if(!lang.validity.valid){
        showError(lang,langerror);
        return false;
    }
    else if(longlang.find(e=>e===lang.value)===undefined && shortlang.find(e=>e===lang.value)===undefined ){
        langerror.textContent='Not a valid option';
        return false;
    }
    else{
        langerror.textContent='';
        return true;
    }
}
//check if box is empty
function showError(type,error){
    if(type.validity.valueMissing){
        error.textContent='You need to enter something';
    }
}