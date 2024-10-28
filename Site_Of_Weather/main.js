
let modalLabels = {
    removed: 'The item was successfully removed',
    warning: 'To add, delete the city ... because the maximum is 5',
    error: 'Something went wrong... Please, try again',
    firstMes: 'Please, choose your city',
}

let currentDayCity = [];

function getId(idCity) {
    let valId = currentDayCity.find(city => idCity === city.id);
    if (valId) {
        return getId(++idCity);
    } else {
        return idCity;
    }
}

function showInfoMessage(message) {
    let blockMess = document.createElement('div');
    blockMess.id = 'infoBlock';
    blockMess.className = "info-block";
    let h1 = document.createElement('h1');
    h1.className = "info-text";
    h1.innerHTML = message;
    blockMess.append(h1);
    mainBlock.append(blockMess);
}

showInfoMessage(modalLabels.firstMes);

navigator.geolocation.getCurrentPosition(pos => {
    removeLastEl();
    getInfo('', pos.coords.longitude, pos.coords.latitude);
}, error => alert("Please, allow access to the use of your geo-location!"));

let count = 0;
function upCount() {
    if (count === 0) {
        count++;
    }
}
function downCount() {
    count--;
}

function createLoader(city) {
    let item = document.getElementById('infoBlock');
    if (item) {
        removeLastEl();
    }

    mainBlock.classList = 'hidden';
    let loader = document.createElement('ul');
    loader.id = 'Loader';
    loader.className = 'spinner';

    let li1 = document.createElement('li');
    let li2 = document.createElement('li');
    let li3 = document.createElement('li');
    let li4 = document.createElement('li');
    loader.append(li1, li2, li3, li4);
    document.body.append(loader);
    setTimeout(() => {
        Loader.remove();
        mainBlock.classList = 'cards';
        getInfo(city);
    }, 1000);
}

function removeLastEl() {
    let item = mainBlock.children.length - 1;
    mainBlock.children[item].remove();
}

function createBlock(city, count = 0) {
    if (!count && mainBlock.children.length) {
        removeLastEl();
        createLoader(city);
    } else if (mainBlock.children.length === 5 && count === 1) {
        confirm(modalLabels.warning);
    } else if (!mainBlock.children.length) {
        createLoader(city);
    } else {
        downCount();
        createLoader(city);
    }
}

var timeFormat = (function () {
    return function (ms) {
        let months = ['Jan, Feb', 'Maê', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

        let a = new Date(ms * 1000);
        let hour = a.getHours();
        let date = a.getDate();
        let month = a.getMonth();

        return {
            time: hour + ":00",
            date,
            month: months[month - 1],
        };
    };
})();


        const getInfo = async (city, Lon = 0, Lat = 0, day = 0, id = 0) => {
            try {
                let response = null;
                let dataWeather = null;

                if (city) {
                    response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=5796abbde9106b7da4febfae8c44c232`);
                    dataWeather = response.data;
                }

                let { lat, lon } = Lon === 0 && Lat === 0 ? dataWeather.coord : { lon: Lon, lat: Lat };

                if (!city) {
                    response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${Lat}&lon=${Lon}&appid=70f3a9c2d617493de79c5fec2b5612c5`);
                    dataWeather = response.data;
                }

                const response2 = await axios.get(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=metric&appid=5796abbde9106b7da4febfae8c44c232`)
                let hourlyTemp = response2.data;


                let allHourTemp = hourlyTemp.hourly.map(item => {
                    return {
                        date: timeFormat(item.dt),
                        temp: item.temp,
                        feels_like: item.feels_like,
                        pressure: item.pressure,
                        humidity: item.humidity,
                        wind_speed: item.wind_speed,
                        weather: item.weather,
                    }
                });

                let currentDay = !day ? allHourTemp[0].date.date : day;

                let filteredTemp = allHourTemp.filter(item => item.date.date === currentDay);

                let prevDay = document.createElement('img');
                prevDay.src = './imgs/back.png';
                prevDay.title = 'Previous Day';
                prevDay.addEventListener('click', event => {
                    let id = parseInt(event.currentTarget.parentElement.parentElement.parentElement.id);
                    event.currentTarget.parentElement.parentElement.parentElement.innerHTML = '';

                    let curCity = currentDayCity.findIndex(city => city.id === id);

                    let filDates = allHourTemp.filter(item => item.date.date === currentDay - 1);
                    if (filDates.length) {
                        currentDayCity[curCity].currentDay -= 1;
                    } else {
                        currentDayCity[curCity].currentDay = allHourTemp[allHourTemp.length - 1].date.date;
                    }

                    getInfo(currentDayCity[curCity].currentCity, 0, 0, currentDayCity[curCity].currentDay, id);
                });

                let nextDay = document.createElement('img');
                nextDay.src = './imgs/next.png';
                nextDay.title = 'Next Day';
                nextDay.addEventListener('click', event => {                    
                    let id = parseInt(event.currentTarget.parentElement.parentElement.parentElement.id);
                    event.currentTarget.parentElement.parentElement.parentElement.innerHTML = '';

                    let curCity = currentDayCity.findIndex(city => city.id === id);

                    let filDates = allHourTemp.filter(item => item.date.date === currentDay + 1);
                    if (filDates.length) {
                        currentDayCity[curCity].currentDay += 1;
                    } else {
                        currentDayCity[curCity].currentDay = allHourTemp[0].date.date;
                    }

                    getInfo(currentDayCity[curCity].currentCity, 0, 0, currentDayCity[curCity].currentDay, id);
                });

                let mainImg = filteredTemp[0].weather[0].main;

                let idCity = getId(1)

                let block = null;

                if (!id) {
                    block = document.createElement('div');
                    block.className = "card";
                    block.id = `${idCity}Block`;
                } else {
                    block = document.getElementById(`${id}Block`);
                }

                currentDayCity.push({
                    id: Number(parseInt(block.id)),
                    currentCity: dataWeather?.name,
                    currentDay,
                });

                let mainDiv1 = document.createElement('div');

                let img = document.createElement('img');
                img.src = './imgs/basket.png';
                img.className = 'basket';
                img.addEventListener('click', event => {
                    let id = parseInt(event.currentTarget.parentElement.parentElement.parentElement.id);
                    let index = currentDayCity.findIndex(city => city.id === id);
                    currentDayCity.splice(index, 1);
                    event.currentTarget.parentElement.parentElement.parentElement.remove();
                    if (mainBlock.children.length === 0) {
                        showInfoMessage(modalLabels.firstMes);
                    }
                });

                let a = document.createElement('a');
                a.href = '#popup-small';
                a.append(img);

                message.innerHTML = modalLabels.removed;


                let h1 = document.createElement('h1');
                h1.className = "card-city";
                h1.innerHTML = `${dataWeather?.name} `;

                let sup = document.createElement('sup');
                sup.innerHTML = dataWeather.sys.country;

                let h4 = document.createElement('h4');
                h4.innerHTML = filteredTemp[0].date.date + " " + filteredTemp[0].date.month;

                h1.append(sup);

                let div = document.createElement('div');
                div.className = "card-weather";

                let div2 = document.createElement('div');
                div2.className = "card-value";

                let currentImg = document.createElement('img');
                currentImg.src = `./imgs/${mainImg.toLowerCase()}.png`;
                currentImg.style = "width: 100px; height: 100px";

                let temp = (filteredTemp[0].temp).toFixed(0);
                let sup2 = document.createElement('sup');
                sup2.innerHTML = 'o';
                let span = document.createElement('span');
                div2.innerHTML = `${temp}`;
                div2.append(sup2, span);
                div.append(div2, currentImg);

                let p2 = document.createElement('p');
                p2.className = "card-description";
                p2.innerHTML = `${dataWeather.weather[0].description}`;

                let divDay = document.createElement('div');
                divDay.className = 'blockDay';

                divDay.append(prevDay, h4, nextDay,)

                mainDiv1.append(a, h1, divDay, div, p2);

                let chart1 = document.createElement('div');
                let canva1 = document.createElement('canvas');

                new Chart(canva1, {
                    type: 'line',
                    data: {
                        labels: filteredTemp.map(item => item.date.time),
                        datasets: [{
                            label: '',
                            data: filteredTemp.map(item => Math.round(item.temp)),
                            borderWidth: 1,
                            borderColor: '#FF6384',
                            backgroundColor: '#FFB1C1',
                        }]
                    },
                    options: {
                        scales: {
                            y: {
                                beginAtZero: true,
                            }
                        }
                    }
                });

                chart1.append(canva1);
                block.append(mainDiv1, chart1);
                mainBlock.append(block);
            } catch(err) {
                confirm(modalLabels.error);
            }
        };

