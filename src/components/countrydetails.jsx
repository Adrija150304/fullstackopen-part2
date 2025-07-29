// components/CountryDetails.jsx
import { useEffect, useState } from 'react'
import axios from 'axios'

const CountryDetails = ({ country }) => {
  const [weather, setWeather] = useState(null)
  const api_key = import.meta.env.VITE_SOME_KEY

  useEffect(() => {
    if (!country.capital || country.capital.length === 0) return

    const capital = country.capital[0]
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${capital}&units=metric&appid=${api_key}`

    axios.get(url)
      .then(response => {
        setWeather(response.data)
      })
      .catch(error => {
        console.error("Weather data fetch failed:", error)
      })
  }, [country])

  return (
    <div>
      <h2>{country.name.common}</h2>
      <p>Capital: {country.capital?.[0]}</p>
      <p>Area: {country.area} km²</p>
      <h4>Languages:</h4>
      <ul>
        {Object.values(country.languages).map(lang => (
          <li key={lang}>{lang}</li>
        ))}
      </ul>
      <img
        src={country.flags.png}
        alt={`Flag of ${country.name.common}`}
        width="150"
      />

      {weather && (
        <div>
          <h3>Weather in {country.capital[0]}</h3>
          <p>Temperature: {weather.main.temp} °C</p>
          <img
            src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
            alt="Weather icon"
          />
          <p>Wind: {weather.wind.speed} m/s</p>
        </div>
      )}
    </div>
  )
}

export default CountryDetails
