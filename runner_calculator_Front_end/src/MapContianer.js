import React from "react";
import { Map, GoogleApiWrapper, Marker } from "google-maps-react";

class MapContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = { currentLatitude: null, currentLongitude: null };
  }

  componentDidMount = async () => {
    window.navigator.geolocation.getCurrentPosition(
      (position) => {
        console.log(position, "all data");
        this.setState({
          currentLatitude: position.coords.latitude,
          currentLongitude: position.coords.longitude,
        });
      }, //no argumento estamos a passar uma função que será chamada de correr tudo bem
      (err) => {
        console.log(err);
      }
    );
  };

  handleClick() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.setState(() => ({
          currentLatitude: position.coords.latitude,
          currentLongitude: position.coords.longitude,
        }));
      });
    } else {
      alert("Geoloaction is not supported by your browser");
    }
  }

  render() {
    if (
      this.state.currentLongitude != null &&
      this.state.currentLatitude != null
    ) {
      return (
        <div>
          <Map
            //onClick={this.handleClick}
            google={this.props.google}
            zoom={14}
            style={{
              width: "100%",
              height: "80%",
            }}
            initialCenter={{
              lat: this.state.currentLatitude,
              lng: this.state.currentLongitude,
            }}
          >
            <Marker
              onClick={this.onMarkerClick}
              name={"Current location"}
              icon={{
                url:
                  "https://upload.wikimedia.org/wikipedia/commons/thumb/4/48/Bluedot.svg/1200px-Bluedot.svg.png",
                scaledSize: new this.props.google.maps.Size(30, 30),
              }}
              height={"10px"}
              width={"10px"}
            />
          </Map>
        </div>
      );
    }
    return <div>Loading</div>;
  }
}

export default GoogleApiWrapper({
  apiKey: "AIzaSyCyfHnbKTDBLrvBnUfJh0KbccRTEST9Mhc",
})(MapContainer);
