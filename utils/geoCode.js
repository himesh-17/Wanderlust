const axios = require("axios");

async function geocode(location) {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(location)}&limit=1`;

    const response = await axios.get(url, {
        headers: { "User-Agent": "Wanderlust-App" }
    });

    if (response.data.length === 0) return null;

    const place = response.data[0];

    return {
        lat: parseFloat(place.lat),
        lon: parseFloat(place.lon)
    };
}

module.exports = geocode;