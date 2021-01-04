import React, { useState, useEffect, useCallback, useMemo } from 'react';

import WeatherCard from './views/weatherCard.js';
import WeatherSetting from './views/WeatherSetting';

import {getMoment, findLocation} from './utils/helpers.js';
import useWeatherAPI from './hooks/useWeatherAPI';


//import './App.css';
// import styled from '@emotion/styled';

// attention 
import styled from 'styled-components';
import { ThemeProvider } from "styled-components";


const theme = {
  light: {
    backgroundColor: '#ededed',
    foregroundColor: '#f9f9f9',
    boxShadow: '0 1px 3px 0 #999999',
    titleColor: '#212121',
    temperatureColor: '#757575',
    textColor: '#828282',
  },
  dark: {
    backgroundColor: '#1F2022',
    foregroundColor: '#121416',
    boxShadow:
      '0 1px 4px 0 rgba(12, 12, 13, 0.2), 0 0 0 1px rgba(0, 0, 0, 0.15)',
    titleColor: '#f9f9fa',
    temperatureColor: '#dddddd',
    textColor: '#cccccc',
  },
};

const Container = styled.div`
  background-color: ${({ theme }) => theme.backgroundColor};
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const AUTHORIZATION_KEY = 'CWB-F0DB4414-929A-440F-A869-17857C42A884';
// const LOCATION_NAME = '臺北';
// const LOCATION_NAME_FORECAST= '臺北市';


const App = () => {
  console.log('Invoke function component');

  const storageCity = localStorage.getItem('cityName') || '臺北市';

  const [currentCity, setCurrentCity] = useState(storageCity);
  // Change page by using react-router
  const [currentPage, setCurrentPage] = useState('WeatherCard');
  const [currentTheme, setCurrentTheme] = useState('dark');

  const handleCurrentPageChange = (currentPage) => {
    setCurrentPage(currentPage);
  };

  const handleCurrentCityChange = (currentCity) => {
    setCurrentCity(currentCity);
  }

  const currentLocation = useMemo(() => findLocation(currentCity), [
    currentCity,
  ]);

  const { cityName, locationName, sunriseCityName } = currentLocation;
  // Todo: When chage city name 
  const moment = useMemo( () => getMoment(sunriseCityName), [sunriseCityName]);
  const [weatherElement, fetchData] = useWeatherAPI({
    locationName,
    cityName,
    authorizationKey: AUTHORIZATION_KEY,
  });

  useEffect(() => {
    setCurrentTheme(moment === 'day' ? 'light' : 'dark');
  }, [moment]);

  return (
    <ThemeProvider theme={theme[currentTheme]}>
      {/* Decide which componment to present it */}
    <Container>

    {currentPage === 'WeatherCard' && (  
      <WeatherCard
            cityName = {cityName}
            weatherElement = {weatherElement}
            moment         = {moment}
            fetchData      = {fetchData}
            handleCurrentPageChange = {handleCurrentPageChange}
          />
      )}
      

      {/* { currentPage === 'WeatherSetting' && <WeatherSetting/>} */}
      {/* props into weatherCard by handlecurrenth */}
      {currentPage === 'WeatherSetting' && (
      <WeatherSetting 
      cityName                = {cityName}
      handleCurrentCityChange = {handleCurrentCityChange}
      handleCurrentPageChange = {handleCurrentPageChange}
      />
      
      )}

    </Container>
    </ThemeProvider>
  );
};

export default App;
