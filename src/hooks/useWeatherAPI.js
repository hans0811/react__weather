import { useState, useEffect, useCallback } from 'react';

const fetchCurrentWeather = ( { locationName, authorizationKey}) => {
    // Add return, fetch API then
  
    // setWeatherElement((prevState)=>({
    //   ...prevState,
    //   isLoading: true,
    // }));
  
    return fetch(
      `https://opendata.cwb.gov.tw/api/v1/rest/datastore/O-A0003-001?Authorization=${authorizationKey}&locationName=${locationName}`
    )
      .then((response) => response.json())
      .then((data) => {
        const locationData = data.records.location[0];
  
        const weatherElements = locationData.weatherElement.reduce(
          (neededElements, item) => {
            if (['WDSD', 'TEMP'].includes(item.elementName)) {
              neededElements[item.elementName] = item.elementValue;
            }
            return neededElements;
          },
          {}
        );
  
        return{
          observationTime: locationData.time.obsTime,
          locationName: locationData.locationName,
          temperature: weatherElements.TEMP,
          windSpeed: weatherElements.WDSD,
          //isLoading: false,
        };
      });
  };

  const fetchWeatherForecast = ( { cityName, authorizationKey}) =>{
    return fetch(
      `https://opendata.cwb.gov.tw/api/v1/rest/datastore/F-C0032-001?Authorization=${authorizationKey}&locationName=${cityName}`
    )
      .then((response) => response.json())
      .then((data) => {
        const locationData = data.records.location[0];
        console.log(data);
        const weatherElements = locationData.weatherElement.reduce(
          (neededElements, item) => {
            if (['Wx', 'PoP', 'CI'].includes(item.elementName)) {
              neededElements[item.elementName] = item.time[0].parameter;
            }
            return neededElements;
          },
          {}
        );
  
        return{
          description: weatherElements.Wx.parameterName,
          weatherCode: weatherElements.Wx.parameterValue,
          rainPossibility: weatherElements.PoP.parameterName,
          comfortability: weatherElements.CI.parameterName,
        };
      });
  };

  const useWeatherAPI = ( { locationName, cityName, authorizationKey } ) => {
    const date = new Date(Date.UTC(2012, 11, 20, 3, 0, 0));
    const [weatherElement, setWeatherElement] = useState({
        locationName: '',
        description: '',
        windSpeed: 0,
        temperature: 0,
        rainPossibility: 0,
        observationTime: new Date(),
        isLoading: true,
        weatherCode: 0,
        comfortability:'',
        
      });

      const fetchData = useCallback( async() => {

        setWeatherElement((prevState) => ({
          ...prevState,
          isLoading: true,
        }));
    
        const [currentWeather, weatherForecast] = await Promise.all([
          fetchCurrentWeather( { locationName, cityName, authorizationKey}), 
          fetchWeatherForecast( { cityName, authorizationKey } ),
        ]);
    
        // get data
        setWeatherElement({
          ...currentWeather,
          ...weatherForecast,
          isLoading: false,
        });
      }, [locationName, cityName, authorizationKey]);

      useEffect(() => {
        console.log('execute function in useEffect');
        fetchData();
      }, [fetchData]);

      // Return data and method
      return [weatherElement, fetchWeatherForecast];

  };


export default useWeatherAPI;