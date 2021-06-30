import React from "react";

function ShowWeather(props) {
  //console.log(props);
  return (
    <div>
      {props.haveInfo === false ? (
        <div>Search!</div>
      ) : (
        <>
          <div>
            Current Weather: {props.targetName}, {props.targetCountry}{" "}
          </div>
          <div>
            Temperature: {props.info.temp}
            <br />
            Feels like: {props.info.feels_like}
            <br />
            Lowest: {props.info.temp_min}
            <br />
            Highest: {props.info.temp_max}
            <br />
            humidity: {props.info.humidity}
          </div>
        </>
        //weather description elements
      )}
    </div>
  );
}

export default ShowWeather;
