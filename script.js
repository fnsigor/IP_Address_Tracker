let latitude
let longitude

let map
let marker

window.onload = function () {

    axios.get("https://api.ipify.org?format=json")
        .then(response => getAddressByIP(response.data.ip))
        .catch(error => {
            getAddressByDomain('google.com')
        })




    document.querySelector('button').addEventListener('click', () => {
        const inputValue = document.querySelector('input').value

        const dotCounter = Array.from(inputValue).reduce((acc, caractere) => caractere === '.' ? ++acc : acc, 0)

        dotCounter === 3 ? getAddressByIP(inputValue) : getAddressByDomain(inputValue)

    })


    function setMapLocalization(lat, long) {

        if (map) {

            map = map.off()
            map = map.remove();
        }


        //create the map
        map = L.map('map').setView([lat, long], 13);


        //add a tile layer to add to our map
        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }).addTo(map)


        //create the marker and putting at the coordinates
        marker = L.marker([lat, long]).addTo(map);
    }


    async function getAddressByIP(ip) {
        try {
            const requestURL = 'https://geo.ipify.org/api/v2/country,city?apiKey=at_FhrMhVxJMxdo7yIMs1ibHFG7aZp9n&ipAddress=' + ip
            const response = await axios.get(requestURL)

            setResponseInDom(response.data)
            getCoordinates(response.data.location.lat, response.data.location.lng)
            setMapLocalization(latitude, longitude)

        } catch (error) {
            
            alert('Verify the IP address')
            throw new Error(error.message)
        }
    }


    async function getAddressByDomain(domain) {
        try {

            const requestURL = 'https://geo.ipify.org/api/v2/country,city?apiKey=at_FhrMhVxJMxdo7yIMs1ibHFG7aZp9n&domain=' + domain
            const response = await axios.get(requestURL)
            console.log(response.data)

            setResponseInDom(response.data)
            getCoordinates(response.data.location.lat, response.data.location.lng)
            setMapLocalization(latitude, longitude)

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


    function getCoordinates(lat, long) {
        latitude = lat
        longitude = long
    }










    // =====================================MAP CONFIGS





}