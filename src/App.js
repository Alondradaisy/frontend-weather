import React, { Component } from "react";
import axios from "axios";

import ShowWeather from "./components/ShowWeather/ShowWeather";
import ShowAllLocation from "./components/ShowAllLocation/ShowAllLocation";

export class App extends Component {
  state = {
    input: "",
    targetName: "",
    targetCountry: "",
    info: null,
    haveInfo: false,
    errorMessage: "",
    locationArray: [],
  };

  handleOnChange = (event) => {
    this.setState({
      input: event.target.value,
    });
  };

  async componentDidMount() {
    try {
      let allLocation = await axios.get(
        "http://localhost:8080/api/weather/get-all-location"
      );

      this.setState({
        locationArray: allLocation.data.payload,
      });
    } catch (e) {
      this.setState({
        errorMessage: e.response.data.message,
      });
    }
  }

  handleSearchSubmit = async () => {
    if (this.state.input.length === 0) {
      this.setState({
        errorMessage: "Please enter a location in this field!",
      });
    } else {
      try {
        let result = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather?q=${this.state.input}&appid=34607f1d0a8961ce8f701372a96ec2ec&units=imperial`
        );

        let foundIndex = this.state.locationArray.findIndex((item) => {
          if (item.city === result.data.name && result.data.sys.country) {
            return item;
          }
        });

        if (foundIndex === -1) {
          let savedLocation = await axios.post(
            "http://localhost:8080/api/weather/create-location",
            {
              city: result.data.name,
              country: result.data.sys.country,
            }
          );
          this.setState({
            targetName: result.data.name,
            targetCountry: result.data.sys.country,
            info: result.data.main,
            haveInfo: true,
            errorMessage: "",
            locationArray: [
              ...this.state.locationArray,
              savedLocation.data.payload,
            ],
          });
        }
      } catch (e) {
        this.setState({
          errorMessage: e.response.data.message,
        });
      }
    }
  };

  handleDeleteByID = async (id) => {
    try {
      let deleted = await axios.delete(
        `http://localhost:8080/api/weather/delete-by-id/${id}`
      );

      let filteredArray = this.state.locationArray.filter(
        (item) => item._id !== deleted.data.payload._id
      );

      this.setState({
        locationArray: filteredArray,
      });
    } catch (e) {
      this.setState({
        errorMessage: e.response.data.message,
      });
    }
  };

  getLocationWeather = async (location) => {
    try {
      let result = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=34607f1d0a8961ce8f701372a96ec2ec&units=imperial`
      );

      this.setState({
        targetName: result.data.name,
        targetCountry: result.data.sys.country,
        info: result.data.main,
        haveInfo: true,
        errorMessage: "",
      });
    } catch (e) {
      this.setState({
        errorMessage: e.response.data.message,
      });
    }
  };

  //add a search and submit button for user to search
  render() {
    //console.log(this.state);
    return (
      <div style={{ textAlign: "center", marginTop: "8%" }}>
        <h1>Search the Weather Forecast</h1>
        <input
          onChange={this.handleOnChange}
          type="text"
          value={this.state.input}
          name="input"
        />
        <button onClick={this.handleSearchSubmit}>Submit</button>
        <div>{this.state.errorMessage && this.state.errorMessage}</div>
        <div>
          <ShowWeather
            targetName={this.state.targetName}
            targetCountry={this.state.targetCountry}
            info={this.state.info}
            haveInfo={this.state.haveInfo}
          />
        </div>
        <div>
          <ShowAllLocation
            locationArray={this.state.locationArray}
            handleDeleteByID={this.handleDeleteByID}
            getLocationWeather={this.getLocationWeather}
          />
        </div>
      </div>
    );
  }
}

export default App;
