import sunny from "../assets/images/sunny.png";
import cloudy from "../assets/images/cloudy.png";
import rainy from "../assets/images/rainy.png";
import snowy from "../assets/images/snowy.png";
import loadingGif from "../assets/images/loading.gif"
import { useState, useEffect } from "react";


const WeatherApp = () => {
    const [data, setData] = useState({});
    const [location, setLocation] = useState(" ");
    const [loading, setLoading] = useState(false)
    const [aiCompletion, setAiCompletion] = useState("");
    const api_key = "f1c67c9a49dd257773513a865b558d9d";


    useEffect(() => {
        const fetchDefaultWeather = async () => {
            setLoading(true)
            const defaultLocation = "Dubai"
            const url = `https://api.openweathermap.org/data/2.5/weather?q=${defaultLocation}&units=Metric&appid=${api_key}`
            const res = await fetch(url)
            const defaultData = await res.json()
            setData(defaultData)
            setLoading(false)
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
            if (searchData.cod !== 200) {
                setData({ notFound: true })
            }
            else {
                setData(searchData);
                setLocation("");
            }
            setLoading(false)    
        }
    };

    const fetchAICompletion = async (weatherData) => {
        try {
            const response = await fetch('http://localhost:5000/get_completion', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: `Provide a brief weather forecast summary for ${weatherData.name} based on the following data: Temperature: ${weatherData.main.temp}°C, Weather: ${weatherData.weather[0].main}, Humidity: ${weatherData.main.humidity}%, Wind Speed: ${weatherData.wind.speed} km/h.`
                }),
            });
            
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            
            const data = await response.json();
            setAiCompletion(data.completion);
        } catch (error) {
            console.error('Error fetching AI completion:', error);
            setAiCompletion("Unable to fetch AI-generated summary at this time.");
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            search();
            fetchAICompletion();
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

    const formattedDate = `${dayOfWeek}, ${dayOfMonth} ${month}`

    return (
        <div className="container">
            <div className="weather-app" style={{ backgroundImage }}>
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
                {loading ? (<img className="loader" src={loadingGif} alt="loading"/>) : data.notFound ? (<div className="not-found">Incorrect City 🏙️ ☁️</div>) : <><div className="weather">
                    <img src={weatherImage} alt="sunny" />
                    <div className="weather-type">{data.weather ? data.weather[0].main : null}</div>
                    <div className="temp">{data.main ? `${Math.floor(data.main.temp)}°` : null}</div>
                </div>
                    <div className="weather-date">
                        <p>{formattedDate}</p>
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
                    </div></>}

            </div>
            <div className="genai" style={{ backgroundImage }}>
            <h3>Weather Forecast Summary</h3>
                <p>{aiCompletion}</p>
            </div>
        </div>
    );
};

export default WeatherApp;
