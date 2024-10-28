let cities = [
    'Amsterdam',
    'Athens',
    'Baghdad',
    'Bangkok',
    'Barcelona',
    'Beijing',
    'Belgrade',
    'Berlin',
    'Bogota',
    'Bratislava',
    'Brussels',
    'Bucharest',
    'Budapest',
    'Buenos Aires',
    'Cairo',
    'Cape Town',
    'Caracas',
    'Chicago',
    'Copenhagen',
    'Dhaka',
    'Dubai',
    'Dublin',
    'Frankfurt',
    'Geneva',
    'The Hague',
    'Hanoi',
    'Helsinki',
    'Hong Kong',
    'Istanbul',
    'Jakarta',
    'Jerusalem',
    'Johannesburg',
    'Kabul',
    'Karachi',
    'Kyiv',
    'Kuala Lumpur',
    'Lagos',
    'Lahore',
    'Lima',
    'Lisbon',
    'Ljubljana',
    'London',
    'Los Angeles',
    'Luxembourg',
    'Madrid',
    'Marrakesh',
    'Manila',
    'Mexico City',
    'Montreal',
    'Mumbai',
    'Nairobi',
    'New Delhi',
    'New York',
    'Nicosia',
    'Oslo',
    'Ottawa',
    'Paris',
    'Prague',
    'Reykjavik',
    'Riga',
    'Rio de Janeiro',
    'Rome',
    'Kharkiv',
    'Lviv',
    'San Francisco',
    'Santiago',
    'São Paulo',
    'Seoul',
    'Shanghai',
    'Singapore',
    'Stockholm',
    'Sydney',
    'Tehran',
    'Tokyo',
    'Toronto',
    'Venice',
    'Vienna',
    'Vilnius',
    'Warsaw',
    'Washington',
    'Wellington',
    'Zagreb',
    'Poltava',
    'Manchester',
];

function autocomplete(inp, arr) {
    var currentFocus;
    inp.addEventListener("input", function (e) {
        let item = document.getElementById('search');
        var a, b, i, val = this.value;
        closeAllLists();
        if (!val) { return false; }
        currentFocus = -1;
        a = document.createElement("DIV");
        a.setAttribute("id", this.id + "autocomplete-list");
        a.setAttribute("class", "autocomplete-items");
        item.append(a);
        for (i = 0; i < arr.length; i++) {
            if (arr[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
                b = document.createElement("DIV");
                b.innerHTML = "<strong>" + arr[i].substr(0, val.length) + "</strong>";
                b.innerHTML += arr[i].substr(val.length);
                b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
                b.addEventListener("click", function (e) {
                    inp.value = this.getElementsByTagName("input")[0].value;
                    closeAllLists();
                });
                a.appendChild(b);
            }
        }
    });

    inp.addEventListener("keydown", function (e) {
        var x = document.getElementById(this.id + "autocomplete-list");
        if (x) x = x.getElementsByTagName("div");
        if (e.keyCode == 40) {
            currentFocus++;
            addActive(x);
        } else if (e.keyCode == 38) {
            currentFocus--;
            addActive(x);
        } else if (e.keyCode == 13) {
            e.preventDefault();
            if (currentFocus > -1) {
                if (x) x[currentFocus].click();
            }
        }
    });
    function addActive(x) {
        if (!x) return false;
        removeActive(x);
        if (currentFocus >= x.length) currentFocus = 0;
        if (currentFocus < 0) currentFocus = (x.length - 1);
        x[currentFocus].classList.add("autocomplete-active");
    }
    function removeActive(x) {
        for (var i = 0; i < x.length; i++) {
            x[i].classList.remove("autocomplete-active");
        }
    }
    function closeAllLists(elmnt) {
        var x = document.getElementsByClassName("autocomplete-items");
        for (var i = 0; i < x.length; i++) {
            if (elmnt != x[i] && elmnt != inp) {
                x[i].parentNode.removeChild(x[i]);
            }
        }
    }

    document.addEventListener("click", function (e) {
        closeAllLists(e.target);
    });
}


autocomplete(document.getElementById("NameOfCity"), cities);
