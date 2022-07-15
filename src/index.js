import './css/styles.css';
import fetchCountries from './fetchCountries';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const DEBOUNCE_DELAY = 300;

const input = document.querySelector('#search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');

input.addEventListener('input', debounce(onInputChange, DEBOUNCE_DELAY));

function onInputChange() {
    const isFilled = input.value.trim();
    countryInfo.innerHTML = "";
    countryList.innerHTML = "";
    if (isFilled) {
        fetchCountries(isFilled).then(dataProcessing).catch(error => {
            Notify.failure("Oops, there is no country with that name");
            console.log(error);
        })
    }
}

function dataProcessing(data) {
    if (data.length > 10) {
        Notify.info("Too many matches found. Please enter a more specific name.");
        return;
    }
    markUp(data);
};

function markUp(data) {
    const markUpData = data.map(({ flags: { svg }, name: { official } }) => {
        return `<li><img src="${svg}" alt="${official}" width="100" height="50"/>
   ${official}</li>`
    }).join("");

    if (data.length === 1) {
        const languages = Object.values(data[0].languages).join(", ");
        const markUpInfo = `<ul><li>Capital: ${data[0].capital}</li>
                                <li>Population: ${data[0].population}</li>
                                <li>Languages: ${languages}</li></ul>`;
        
        countryInfo.insertAdjacentHTML('afterbegin', markUpInfo);
    }
    return countryList.insertAdjacentHTML('afterbegin', markUpData); 
}

