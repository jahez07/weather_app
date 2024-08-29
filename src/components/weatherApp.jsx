import sunny from "../assets/images/sunny.png";
import cloudy from "../assets/images/cloudy.png";
import rainy from "../assets/images/rainy.png";
import snowy from "../assets/images/snowy.png";
import { useState, useEffect } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";


// Access your API key as an environment variable (see "Set up your API key" above)
const API_KEY = "AIzaSyC7Js7InDNF2K7yrJPKph7Bab99g_E_XOs"
const genAI = new GoogleGenerativeAI(API_KEY);
const sysPrompt = `Weather Summary and Suggestion AI Agent
You are a helpful AI agent designed to provide weather summaries and suggestions based on the current temperature and weather conditions. Your goal is to offer practical advice to users about what actions they should take given the weather.
Input
You will receive two pieces of information:

Temperature (in Celsius)
Weather condition (one of: Clouds, Rain, Sunny, Mist, Haze, Clear)

Output
Provide a response in the following format:

A brief summary of the weather
A suggestion for what the user should do, wear, or prepare for
Any additional relevant advice or precautions

Guidelines

Tailor your suggestions to the specific combination of temperature and weather condition.
Consider both comfort and safety in your recommendations.
Be specific in your advice (e.g., suggest particular types of clothing or activities).
Adjust your tone to be more urgent for extreme weather conditions.
Include relevant health or safety tips when appropriate.

Examples
Input: 25°C, Sunny
Output:
It's a warm, sunny day with a temperature of 25°C (77°F).
Suggestion: It's perfect weather for outdoor activities! Consider wearing light, breathable clothing like a t-shirt and shorts.
Don't forget to apply sunscreen, wear sunglasses, and stay hydrated throughout the day.
Input: 5°C, Rain
Output:
The weather is cold and rainy with a temperature of 5°C (41°F).
Suggestion: Stay dry and warm by wearing a waterproof jacket, boots, and carrying an umbrella.
Layer your clothing for warmth and consider indoor activities or visiting cozy cafes to escape the chill and rain.
Input: 30°C, Haze
Output:
It's a hot day with hazy conditions and a temperature of 30°C (86°F).
Suggestion: The haze may impact air quality, so consider limiting outdoor exposure. If you must go out, wear light, loose-fitting clothing.
Stay hydrated and be aware of any air quality warnings in your area. Indoor activities in air-conditioned spaces are recommended.
Remember to adjust your responses based on the specific input provided and consider any seasonal context that might be relevant.`;


const WeatherApp = () => {
    const [data, setData] = useState({});
    const [location, setLocation] = useState(" ");
    const api_key = "f1c67c9a49dd257773513a865b558d9d";


    useEffect(() => {
        const fetchDefaultWeather = async () => {
            const defaultLocation = "Dubai"
            const url = `https://api.openweathermap.org/data/2.5/weather?q=${defaultLocation}&units=Metric&appid=${api_key}`
            const res = await fetch(url)
            const defaultData = await res.json()
            setData(defaultData)
        }
        fetchDefaultWeather()
    }, [])

    const handleInputChange = (e) => {
        setLocation(e.target.value);
    };

    const search = async () => {
        if (location.trim() !== "") {
            const url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&units=Metric&appid=${api_key}`;
            const res = await fetch(url);
            const searchData = await res.json();
            console.log(searchData);
            setData(searchData);
            setLocation("");

        }
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            search()
        }
    }

    const weatherImages = {
        Sunny: sunny,
        Clear: sunny,
        Clouds: cloudy,
        Rain: rainy,
        Snow: snowy,
        Haze: cloudy,
        Mist: cloudy
    }

    const weatherImage = data.weather ? weatherImages[data.weather[0].main] : null

    const backgroundImages = {
        Sunny: 'linear-gradient(to top, #f3b07c, #fcd283)',
        Clear: 'linear-gradient(to top, #f3b07c, #fcd283)',
        Clouds: 'linear-gradient(to top, #57d6d4, #71eeec)',
        Rain: 'linear-gradient(to top, #5bc8fb, #80eaff)',
        Snow: 'linear-gradient(to top, #aff2ff, #fff)',
        Haze: 'linear-gradient(to top, #57d6d4, #71eeec)',
        Mist: 'linear-gradient(to top, #57d6d4, #71eeec)',
    }

    const backgroundImage = data.weather ? backgroundImages[data.weather[0].main] : 'linear-gradient(to top, #f3b07c, #fcd283)'

    // D A T E
    const currentDate = new Date()
    const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
    const months = ["Jan", "Feb", "March", "April", "May", "June", "July", "Aug", "Sep", "Oct", "Nov", "Dec"]

    const dayOfWeek = daysOfWeek[currentDate.getDay()]
    const month = months[currentDate.getMonth()]
    const dayOfMonth = currentDate.getDate()

    const formattedDate =  `${dayOfWeek}, ${dayOfMonth} ${month}`

    return (
        <div className="container">
            <div className="weather-app" style={{backgroundImage}}>
                <div className="search">
                    <div className="search-top">
                        <i className="fa-solid fa-location-dot"></i>
                        <div className="location">{data.name}</div>
                    </div>
                    <div className="search-bar">
                        <input
                            type="text"
                            placeholder="Enter Location"
                            value={location}
                            onChange={handleInputChange}
                            onKeyDown={handleKeyDown}
                        />
                        <i className="fa-solid fa-magnifying-glass" onClick={search}></i>
                    </div>
                </div>
                <div className="weather">
                    <img src={weatherImage} alt="sunny" />
                    <div className="weather-type">{data.weather ? data.weather[0].main : null}</div>
                    <div className="temp">{data.main ? `${Math.floor(data.main.temp)}°` : null}</div>
                </div>
                <div className="weather-date">
                    <p>Fri, 3 May</p>
                </div>
                <div className="weather-data">
                    <div className="humidity">
                        <div className="data-name">Humidity</div>
                        <i className="fa-solid fa-droplet"></i>
                        <div className="data">{data.main ? data.main.humidity : null}%</div>
                    </div>
                    <div className="wind">
                        <div className="data-name">Wind</div>
                        <i className="fa-solid fa-wind"></i>
                        <div className="data">{data.wind ? data.wind.speed : null} km/h</div>
                    </div>
                </div>
            </div>
            <div className="genai" style={{backgroundImage}}>Weather Focast Summary</div>
        </div>
    );
};

export default WeatherApp;
