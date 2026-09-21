const apiKey = "099edf0348bf4b86835152531261109"

async function getWeather() {
    const city = document.getElementById("cityInput").value;
    const resultDiv = document.getElementById("weatherResult");

    if (!city) {
        resultDiv.innerHTML = "<p>Masukkan nama kota terlebih dahulu.</p>";
        return;
    }

    const url = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}&lang=id`;

    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error("Kota tidak ditemukan");

        const data = await response.json();

        resultDiv.innerHTML = `
            <h3> ${data.location.name}, ${data.location.country}</h3>
            <p><strong>${Math.round(data.current.temp_c)}°C</strong></p>
            <p>${data.current.condition.text}</p>
            <p>Kelembapan: ${data.current.humidity}%</p>
        `;
    } catch (error) {
        resultDiv.innerHTML = `<p style="color:red;">${error.message}</p>`;

    }


}