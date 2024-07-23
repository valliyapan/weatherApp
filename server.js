import express from "express";
import axios from "axios";

const app = express();
const API_KEY = '25f205605d1d3a73e6f5af1c2e5b5994';
const API_URL = `https://api.openweathermap.org/data/2.5/weather`;

// Need to specify that the static files are in the public directory
// This helps to identify the css files in the ejs file
app.use(express.static("public"));

app.use(express.urlencoded({ extended: true }));

// It is possible to edit the directory name by using the following code:
// app.set("views", "myViews");

app.get("/", (req, res) => {
    // By default express renders the files from the directory named "views"
    // So, we don't need to specify the absolute path of the file
    // It is possible to edit the directory name by using the following code:
    // app.set("views", "myViews");
    res.render("index.ejs");
});

app.get("/weather", async (req, res) => {
    const city = req.query.city;
    console.log('------->', city);
    try {
        const resp = await getWeather(city);
        resp.city = city;
        res.render("index.ejs", { content: resp });
    } catch (error) {
        console.error(error);
        res.render("index.ejs", { content: "An error occurred" });
    }
});

async function getWeather(city) {
    let resp = await axios.get(`${API_URL}?q=${city}&appid=${API_KEY}&units=metric`);
    resp = resp.data;
    let weather = resp.weather[0].description;
    weather = weather && weather[0].toUpperCase() + weather.slice(1);
    const formattedResponse = {
        weather,
        temperature: resp.main.temp,
        feelsLike: resp.main.feels_like,
        humidity: resp.main.humidity,
        windSpeed: resp.wind.speed,
        cloudiness: resp.clouds.all
    };
    return formattedResponse;
}

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});