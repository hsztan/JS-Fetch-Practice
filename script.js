'use strict';

const btn = document.querySelector('.btn-country');
const countriesContainer = document.querySelector('.countries');

const renderError = function (msg) {
  countriesContainer.insertAdjacentText('beforeend', msg)
  // countriesContainer.style.opacity = 1;
}

const renderCountry = function (data, className = '') {
  const html = `
  <article class="country ${className}">
    <img class="country__img" src="${data.flag}" />
    <div class="country__data">
      <h3 class="country__name">${data.name}</h3>
      <h4 class="country__region">${data.region}</h4>
      <p class="country__row"><span>👫</span>${(+data.population / 1000000).toFixed(1)} people</p>
      <p class="country__row"><span>🗣️</span>${data.languages[0].name}</p>
      <p class="country__row"><span>💰</span>${data.currencies[0].name}</p>
    </div>
  </article>
`
  countriesContainer.insertAdjacentHTML('beforeend', html);
  // countriesContainer.style.opacity = 1;
}
///////////////////////////////////////

// const getCountryData = function (country) {
//   const request = new XMLHttpRequest();
//   request.open('GET', `https://restcountries.eu/rest/v2/name/${country}`);
//   request.send();

//   request.addEventListener('load', function () {
//     const data = JSON.parse(this.responseText)[0]
//     console.log(data);

//     const html = `
//       <article class="country">
//         <img class="country__img" src="${data.flag}" />
//         <div class="country__data">
//           <h3 class="country__name">${data.name}</h3>
//           <h4 class="country__region">${data.region}</h4>
//           <p class="country__row"><span>👫</span>${(+data.population / 1000000).toFixed(1)} people</p>
//           <p class="country__row"><span>🗣️</span>${data.languages[0].name}</p>
//           <p class="country__row"><span>💰</span>${data.currencies[0].name}</p>
//         </div>
//       </article>
//   `
//     countriesContainer.insertAdjacentHTML('beforeend', html);
//     countriesContainer.style.opacity = 1;
//   })
// }
// getCountryData('peru')
// getCountryData('chile')
//9:22


// const getCountryAndNeighbor = function (country) {
//   // AJAX call country 1
//   const request = new XMLHttpRequest();
//   request.open('GET', `https://restcountries.eu/rest/v2/name/${country}`);
//   request.send();

//   request.addEventListener('load', function () {
//     const [data] = JSON.parse(this.responseText)
//     console.log(data);
//     //Render Country 1
//     renderCountry(data);
//     //Get neighbor countries
//     const [neighbor] = data.borders;

//     if (!neighbor) return;

//     // AJAX call country 2
//     const request2 = new XMLHttpRequest();
//     request2.open('GET', `https://restcountries.eu/rest/v2/alpha/${neighbor}`);
//     request2.send();

//     request2.addEventListener('load', function () {
//       const data2 = JSON.parse(this.responseText)
//       console.log(data2);

//       renderCountry(data2, 'neighbour')
//     })

//   })
// }

// getCountryAndNeighbor('peru')

//  const request = new XMLHttpRequest();
//   request.open('GET', `https://restcountries.eu/rest/v2/name/${country}`);
//   request.send();

// const request = fetch('https://restcountries.eu/rest/v2/name/peru')
// console.log(request);

const getJSON = function (url, errorMsg = 'Something went wrong') {
  return fetch(url).then(response => {
    console.log(response);

    if (!response.ok)
      throw new Error(`${errorMsg} (${response.status})`)

    return response.json();
  })
};

let country;

const getCountryData = function (country) {
  //Country1
  getJSON(`https://restcountries.eu/rest/v2/name/${country}`, 'Country not found')
    .then(data => {
      renderCountry(data[0]);
      console.log(data);
      const neighbor = data[0].borders[0];
      console.log(neighbor);

      if (!neighbor) throw new Error('No neighboring countries found')
      //Country2
      return getJSON(`https://restcountries.eu/rest/v2/alpha/${neighbor}`, 'Country not found');
    })
    .then(data => renderCountry(data, 'neighbour'))
    .catch(err => {
      console.error(`${err} 💥💥💥`);
      renderError(`Something went wrong 💥💥💥 ${err.message}. Try again!`)
    })
    .finally(() => {
      countriesContainer.style.opacity = 1;
    })
}

// getCountryData('peru')

const baseUrl = 'https://geocode.xyz'
const whereAmI = function (lat, lng) {
  fetch(`${baseUrl}/${lat},${lng}?geoit=json`)
    .then(response => {
      console.log(response);
      if (response.status === 403)
        throw new Error('Don\'t load too fast')
      return response.json();
    })
    .then(data => {
      console.log(data);
      console.log(`You are in ${data.city}, ${data.country}`);
      country = data.country
    })
    .catch(error => {
      console.error(error.message)
    })
}

whereAmI(-33.933, 18.474)

btn.addEventListener('click', function () {
  getCountryData(country)
})