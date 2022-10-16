let map
let marker

window.onload = function () {

    // to put user IP on map on initial page load
    axios.get("https://api.ipify.org?format=json")
        .then(response => getAddressByIP(response.data.ip))
        .catch(error => {

            getAddressByDomain('google.com')
            throw new Error(error.message)
        })




    document.getElementById('search-button').addEventListener('click', () => {

        const inputValue = document.querySelector('input').value

        //if the input value has at least one letter, then it is a domain name
        const inputIncludesLetter = Array.from('abcdefghijklmnopqrstuvwxyz').some(caractere => inputValue.toLowerCase().includes(caractere))

        inputIncludesLetter ? getAddressByDomain(inputValue) : getAddressByIP(inputValue)
    })


    function putLocationOnMap(latitude, longitude) {

        //verification needed to update the map according to the new input information
        if (map) {

            map = map.off()
            map = map.remove();
        }

        //creates the map
        map = L.map('map').setView([latitude, longitude], 13);


        //add a tile layer to add to the map
        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }).addTo(map)


        //creates the marker and places it at the given coordinates
        marker = L.marker([latitude, longitude]).addTo(map);
    }


    async function getAddressByIP(ip) {
        try {
            const requestURL = 'https://geo.ipify.org/api/v2/country,city?apiKey=at_FhrMhVxJMxdo7yIMs1ibHFG7aZp9n&ipAddress=' + ip
            const response = await axios.get(requestURL)

            setResponseInDom(response.data)
            putLocationOnMap(response.data.location.lat, response.data.location.lng)

        } catch (error) {

            alert('Verify the IP address')
            throw new Error(error.message)
        }
    }


    async function getAddressByDomain(domain) {
        try {

            const requestURL = 'https://geo.ipify.org/api/v2/country,city?apiKey=at_FhrMhVxJMxdo7yIMs1ibHFG7aZp9n&domain=' + domain
            const response = await axios.get(requestURL)

            setResponseInDom(response.data)
            putLocationOnMap(response.data.location.lat, response.data.location.lng)

        } catch (error) {

            alert('Check the domain name')
            throw new Error(error.message)
        }
    }


    function setResponseInDom(data) {
        document.getElementById("ip").textContent = data.ip;
        document.getElementById("timezone").textContent = data.location.timezone;
        document.getElementById("isp").textContent = data.isp;
        document.getElementById("location").textContent = `${data.location.country}, ${data.location.region}`;
    }


}