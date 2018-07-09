import React, { Component } from 'react';
import {Map, InfoWindow, Marker, GoogleApiWrapper} from 'google-maps-react';
import Search from './Search'

export class MapContainer extends Component {

  state = {
    showingInfoWindow: false,
    zoom: 15,
    locations: [
      { name: "smitten ice cream", ID:'4d964291daec224b08b9123e', location: {lat: 37.77628641647586 , lng: -122.42419481277466}, },
      { name: "Zuni Café", ID:'435d7580f964a5201a291fe3', location: {lat: 37.77364852834092, lng: -122.42156041354832}, },
      { name: "four barrel cafee, CA, USA", ID:'480d1a5ef964a520284f1fe3', location: {lat: 37.767019 , lng: -122.421961} },
      { name: "Pauline's Pizza, Valencia Street, San Francisco, CA, USA ", ID:"49f94956f964a520766d1fe3", location: {lat: 37.7686806, lng: -122.42252940000003}, },
      { name: "Tawla, Valencia Street, San Francisco, CA, USA", ID:"575b94c1498ec532717a27c6", location: {lat: 37.769615, lng: -122.422457}, }
    ],
    mark:[
      { name: "Can't fetchAPI", ID:'4d964291daec224b08b9123e', location: {lat: 37.77628641647586 , lng: -122.42419481277466},},
      { name: "Can't fetchAPI", ID:'435d7580f964a5201a291fe3', location: {lat: 37.77364852834092, lng: -122.42156041354832},  },
      { name: "Can't fetchAPI", ID:'480d1a5ef964a520284f1fe3', location: {lat: 37.767019 , lng: -122.421961}, },
      { name: "Can't fetchAPI", ID:"49f94956f964a520766d1fe3", location: {lat: 37.7686806, lng: -122.42252940000003},  },
      { name: "Can't fetchAPI", ID:"575b94c1498ec532717a27c6", location: {lat: 37.769615, lng: -122.422457}, }
    ],
    unique: [
      { name: "smitten ice cream", ID:'4d964291daec224b08b9123e', location: {lat: 37.77628641647586 , lng: -122.42419481277466}, unique_info:"" },
      { name: "Zuni Café", ID:'435d7580f964a5201a291fe3', location: {lat: 37.77364852834092, lng: -122.42156041354832}, unique_info:"" },
      { name: "four barrel cafee, CA, USA", ID:'480d1a5ef964a520284f1fe3', location: {lat: 37.767019 , lng: -122.421961} },
      { name: "Pauline's Pizza, Valencia Street, San Francisco, CA, USA ", ID:"49f94956f964a520766d1fe3", location: {lat: 37.7686806, lng: -122.42252940000003}, unique_info:"" },
      { name: "Tawla, Valencia Street, San Francisco, CA, USA", ID:"575b94c1498ec532717a27c6", location: {lat: 37.769615, lng: -122.422457}, unique_info:""}
    ],
    position:null,
    name:''
  };

  onMarkerClick = (location) =>{
    this.setState({
      position: {lat:location.position.lat, lng:location.position.lng },
      showingInfoWindow: true,
      name: location.name
    });
  }

  onError = (status, clearSuggestions) => {
    console.log('Google Maps API returned error with status: ', status)
    alert('Google Maps API returned error with status: ', status);
    clearSuggestions()
}

gm_authFailure(){
window.alert("Failed to load Google Map due to Authentication failure!");
}
// fetch marker API
  fetchAPI() {
    let temp = this.state.mark
    temp.map((place)=>{
      fetch('https://api.foursquare.com/v2/venues/'+place.ID+'?&client_secret=WWDQS3WBJDBTW3PHYSAIOYCKPSBEBAWMFI3VDG3JP05TXWXD&client_id=B4WHMGWJJNMWBVRSA4LWYF0ITZ3CNFZKFWGK1HX21XFVJKAQ&v=20180605')
      .then((response)=> {
        return response.json();
      }).then((result)=> {
        if(result.response.venue.name)
        place.name = result.response.venue.name +" " +result.response.venue.location.address
        place.unique_info= result.response.venue.name + " Contact: " + result.response.venue.contact.phone +" "+ result.response.venue.location.address + " "
      }).catch((reason) => {
        console.log('Handle rejected promise ('+reason+') here.');
      });
    })
    this.setState({unique:temp})
  }

  componentDidMount(){
    this.fetchAPI();
    window.gm_authFailure = this.gm_authFailure;
    this.setState({locations:this.state.mark})
  }

  onMapClicked = (props) => {
    if (this.state.showingInfoWindow) {
     this.setState({
       showingInfoWindow: false,
       name: null
     })
   }
 };

 onSearchClick = (location) =>{
   console.log(location.location);
   this.setState({
     position: {lat:location.location.lat, lng:location.location.lng },
     showingInfoWindow: true,
     name: location.name
   });
 }
// will show the place when you clicked on an item in the listview
 ShowPlace= (place)=>{
   let marks
     marks = this.state.locations.filter((mark)=>
       place.ID === mark.ID
   )
   this.setState({mark:marks})
   this.onSearchClick(place);
 }
//when clicking on showALl button will show all marker
 ShowAll=()=>
  this.setState({mark:this.state.locations})

// this fun used for filtering the marker when you search for specific place
 filtr=(places)=>{
   this.setState({
     mark:places,
   })
 }


  render() {
    const mark= this.state.mark
    const style = {
      position: 'inherit'
    }

    return (
    <div role="main">
      <Map google={this.props.google}
        style={style}
        onReady={this.fetchPlaces}
        onError={this.onError}
        className={'map'}
        zoom={this.state.zoom} onClick={this.onMapClicked}>
        {mark.map( (location) => (
          <Marker key={location.ID} onClick={this.onMarkerClick}
            name={location.name}
            position={{lat:location.location.lat, lng:location.location.lng}}
            animation={ this.props.google.maps.Animation.DROP}/>
        ))
      }
      <InfoWindow
        position={this.state.position}
        visible={this.state.showingInfoWindow}>
        <h7>{this.state.name}</h7>
      </InfoWindow>
      </Map>
      <Search
        locations ={this.state.locations}
        ShowPlace={this.ShowPlace}
        ShowAll={this.ShowAll}
        filtr={this.filtr}
        unique={this.state.unique}
        />
    </div>
    );
  }
}

export default GoogleApiWrapper({
  apiKey: 'AIzaSyAJU-Tk3lFUICw9QmyAQKjYLGNWVoyeYqs',
})(MapContainer)
