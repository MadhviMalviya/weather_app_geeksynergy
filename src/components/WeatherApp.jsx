import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Weather.css';
import cold from './cold.gif';
import sky from './skyy.gif';
import rain from './rainy.gif';
import warm from './warmm.gif';
import { WiHumidity } from "react-icons/wi";
import { FaTemperatureFull } from "react-icons/fa6";
import { LuWind } from "react-icons/lu";
import { MdCompress } from "react-icons/md";
import { GoSmiley } from "react-icons/go";
import { IoArrowUp, IoArrowDown } from "react-icons/io5";

const API_KEY = '0f28e5a693f311a08ee149b19a5c6d1d';
const CITIES = ['Bangalore', 'Hyderabad', 'Chennai', 'Pune', 'Kerala', 'Mumbai', 'Bhopal', 'Kolkata', 'Delhi', 'Punjab'];

const Weather = () => {
    const [city, setCity] = useState('Bangalore');
    const [weatherData, setWeatherData] = useState(null);
    const [suggestions, setSuggestions] = useState([]);
    const [background, setBackground] = useState(sky);

    useEffect(() => {
        fetchWeatherData(city);
    }, []);

    const fetchWeatherData = async (city) => {
        try {
            const res = await axios.get(
                `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
            );
            setWeatherData(res.data);
            handleBackgroundChange(res.data);
        } catch (error) {
            console.error("Error fetching weather data:", error);
            alert("Ops!! Could not fetch weather data. Please try again!");
        }
    };

    const handleSearch = () => {
        if (city) {
            fetchWeatherData(city);
            setSuggestions([]); // Clear suggestions after search
        }
    };

    const handleCityChange = (e) => {
        const value = e.target.value;
        setCity(value);

        if (value.trim() !== "") {
            const filteredSuggestions = JSON.parse(localStorage.getItem('searchedCities')) || [];
            const matches = filteredSuggestions.filter((s) =>
                s.toLowerCase().includes(value.toLowerCase())
            );
            setSuggestions(matches);
        } else {
            setSuggestions([]); 
        }
    };

    const handleSuggestionClick = (suggestion) => {
        setCity(suggestion);
        fetchWeatherData(suggestion);
        setSuggestions([]); 
    };

    const handleDropdownChange = (e) => {
        const selectedCity = e.target.value;
        setCity(selectedCity);
        fetchWeatherData(selectedCity);
        setSuggestions([]); 
    };

    const handleBackgroundChange = (data) => {
        const temp = data.main.temp;
        const weatherDescription = data.weather[0].main.toLowerCase();
        if (weatherDescription.includes("rain")) {
            setBackground(rain);
        } else if (temp > 30) {
            setBackground(warm);
        } else if (temp < 10) {
            setBackground(cold);
        } 
        
        else {
            setBackground(sky);
        }
    };

    return (
        <div className='main' style={{ backgroundImage: `url(${background})`, backgroundSize: 'cover', height: "100vh" }}>
            <div className="weather-container">
                <h1>Weather App</h1>
                <div className="input-row">
                    <div className="dropdown-container">
                        <select onChange={handleDropdownChange} value={city}>
                            <option value="">Select a city</option>
                            {CITIES.map((cityName, index) => (
                                <option key={index} value={cityName}>
                                    {cityName}
                                </option>
                            ))}
                        </select>
                    </div>
                    <input
                        type="text"
                        value={city}
                        onChange={handleCityChange}
                        placeholder="Enter city"
                    />
                    <button onClick={handleSearch}>Search</button>
                </div>
                {suggestions.length > 0 && (
                    <ul>
                        {suggestions.map((suggestion, index) => (
                            <li key={index} onClick={() => handleSuggestionClick(suggestion)}>
                                {suggestion}
                            </li>
                        ))}
                    </ul>
                )}
                {weatherData && (
                    <div className="weather-details">
                        <div className="heading">
                            <div className="icon">
                                <img
                                    src={`https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@4x.png`}
                                    alt={weatherData.weather[0].description}
                                    className="weather-icon"
                                />
                                <p>Weather: {weatherData.weather[0].description}</p>

                            </div>
                            <h1>{weatherData.name}</h1>
                           
                                
                            <h1 className='temp' > <FaTemperatureFull color='red' size={40} /> {weatherData.main.temp} °C</h1>
                           
                        </div>
                        <div className="small-details">
                            <div className='lists'>
                                <WiHumidity size={50} />
                                <p>Humidity: {weatherData.main.humidity} %</p>
                            </div>
                            <div className='lists'>
                                <LuWind size={50} />
                                <p>Wind Speed: {weatherData.wind.speed} m/s</p>
                            </div>
                            <div className='lists'>
                                <MdCompress size={50} />
                                <p>Pressure: {weatherData.main.pressure} hPa</p>
                            </div>
                            <div className='lists'>
                                <IoArrowUp size={50} />
                                <p>Max Temperature: {weatherData.main.temp_max} °C</p>
                            </div>
                            <div className='lists'>
                                <IoArrowDown size={50} />
                                <p>Min Temperature: {weatherData.main.temp_min} °C</p>
                            </div>
                            <div className='lists'>
                                <GoSmiley size={50} />
                                <p>Feels Like: {weatherData.main.feels_like} °C</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Weather;
