let map
let marker
let popup

window.onload = function () {

    // to put user IP on map on initial page load
    axios.get("https://api.ipify.org?format=json")
        .then(response => getAddressByIP(response.data.ip))
        .catch(error => {

            getAddressByDomain('google.com')
            throw new Error(error.message)
        })



    function search(){
        const inputValue = document.querySelector('input').value

        const inputIncludesLetter = Array.from('abcdefghijklmnopqrstuvwxyz').some(caractere => inputValue.toLowerCase().includes(caractere))

                                //to check if its an IPV6
        inputIncludesLetter && !(inputValue.includes(':')) ? getAddressByDomain(inputValue) : getAddressByIP(inputValue)

        document.querySelector('input').value = ''
    }

    function putLocationOnMap(latitude, longitude, location = 'default') {

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

        marker.bindPopup(location).openPopup();
    }


    async function getAddressByIP(ip) {
        try {
            const requestURL = 'https://geo.ipify.org/api/v2/country,city?apiKey=at_FhrMhVxJMxdo7yIMs1ibHFG7aZp9n&ipAddress=' + ip
            const response = await axios.get(requestURL)

            setResponseInDom(response.data)
            putLocationOnMap(response.data.location.lat, response.data.location.lng, `${response.data.location.city}, ${response.data.location.region}`)

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
            putLocationOnMap(response.data.location.lat, response.data.location.lng, `${response.data.location.city}, ${response.data.location.region}`)

        } catch (error) {

            alert('Check the domain name')
            throw new Error(error.message)
        }
    }


    function setResponseInDom(data) {
        document.getElementById("ip").textContent = data.ip;
        document.getElementById("timezone").textContent = "UTC " + data.location.timezone;
        document.getElementById("isp").textContent = data.isp;
        document.getElementById("location").textContent = `${data.location.city}, ${data.location.region}, ${data.location.country}`;
    }


    document.querySelector('input').addEventListener('keypress', evt =>{
        if(evt.key === 'Enter'){
            evt.preventDefault()
            search()
        }
    }) 
    document.getElementById('search-button').addEventListener('click', search)

}