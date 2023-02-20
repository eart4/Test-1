import conditions from './conditions.js';
console.log(conditions);


const apiKey = '3410acad2961490d9ca203750232701';

//api.weatherapi.com/v1/current.json?key=3410acad2961490d9ca203750232701&q=London

// Elements on the page

const header = document.querySelector('.header');
const form = document.querySelector('#form');
const input = document.querySelector('#inputCity');

function removeCard() {
    const prevCard = document.querySelector('.card');
    if (prevCard) prevCard.remove();
}

function showError(errorMessage) {
    // If have an error - show it
    const html = `<div class="card">${errorMessage}</div>`;

    // Display a card on the page    
    header.insertAdjacentHTML('afterend', html);   
}

function showCard({name, country, temp, condition, imgPath}) {
    // Markup for the card
    const html = `<div class="card">
                <h2 class="card-city">${name}
                    <span>${country}</span>
                </h2>
                <div class="card-weather">
                    <div class="card-value">${temp}<sup>°c</sup></div>
                    <img class="card-img" src="${imgPath}" alt="sun and cloud">
                </div>
                <div class="card-description">${condition}</div>
            </div>`;

    // Display a card on the page    
    header.insertAdjacentHTML('afterend', html);                    
}

async function getWeather(city) {
    // Making a request to the server
    const url = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}`;
    const response = await fetch(url);
    const data = await response.json();
    console.log(data);
    return data;    
}  

// Listen to form submission
form.onsubmit = async function (e) {
    // Cancel form submission
    e.preventDefault();
    

    // Take value from input, trim spaces
    let city = input.value.trim();

    // Get data from server
    const data = await getWeather(city);      

    // Check for error
    if (data.error) {
        // Delete previous card
        removeCard();

        // Show a card with an error
        showError(data.error.message);            
        
    } else {
        // If haven't error -show card
        // Display receiveed data in a card
        // Delete previous card
        removeCard();

        console.log(data.current.condition.code);

        const info = conditions.find(
            (obj) => obj.code === data.current.condition.code
        );
        
        console.log(info);
        console.log(info.languages[23]['day_text']);

        const filePath = './img/' + (data.current.is_day ? 'day' : 'night') + '/';  
        const fileName = (data.current.is_day ? info.day : info.night) + '.png';
        const imgPath = filePath + fileName;
        console.log('filePath', filePath + fileName);    
            

        const weatherData = {
            name: data.location.name,
            country: data.location.country,
            temp: data.current.temp_c,
            // condition: data.current.condition.text,
            condition: data.current.is_day 
                ? info.languages[23]['day_text'] 
                : info.languages[23]['night_text'],
            imgPath: imgPath,     
        };

        showCard(weatherData);                               
    }  
}
