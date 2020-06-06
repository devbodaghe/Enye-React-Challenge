import React, { useState, useEffect} from 'react';
import './App.css';

const key:string = "AIzaSyDMbJoOSv1cbnHZ2mWOcjIUj4r4GyGF1Pg";

const App: React.FC = () => {

  const [latitude,setLatitude] = useState<number | undefined>(); 
  const [longitude,setLongitude] = useState<number | undefined>(); 
  const [hospitals, setHospitals] = useState<any []>();
  const [address,setAddress] = useState<string | undefined>();
  const [radius, setRadius] = useState("5000");

  const options = [
    {label: "5 km",value: 5000,},
    { label: "10 km", value: 10000 },
    { label: "15 km", value: 15000 },
    { label: "20 km", value: 20000 }, 
  ];
  
  const PROXY_URL = 'https://cors-anywhere.herokuapp.com/';  
  const url:string = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&type=hospital&radius=${radius}&key=${key}`;
  const URL = PROXY_URL + url
  
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition( position => {
        let lat = position.coords.latitude
        setLatitude(lat)
        let long = position.coords.longitude
        setLongitude(long)
        getAddress(lat,long)
      });
    }
    else {
      alert("Enable location")
    }
  },[])
  const getAddress = (lat:number,long:number):void => {
    fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${long}&sensor=false&key=${key}`)
    .then(response => response.json())
    .then(data => setAddress(data.results[0].formatted_address))
  }
  const gethospitals = ():void => {
    fetch(URL)
      .then(res => res.json())
      .then(data => setHospitals(data.results))
  }
  return (
    <div className="container">
      <h1 className="heading">covid hospital locator</h1>
      <div className="btn__container">
        <select
          className="radius"
          value={radius}
          onChange={(e) => {
            setRadius(e.target.value);
          }}
        >
          {options.map((item) => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>
        <button className="btn__hospital"
          onClick={gethospitals}
        >
          Show Hospitals
        </button>
      </div>
      {address && <p className = "user--address"> User address: {address}</p>}
      {
        hospitals && 
        hospitals.map(result => (
          <div 
            className="hospitals"
            key={result.id}
          >
            
            <p>Hospital Name: {result.name}</p>
            <p>Hospital address: {result.vicinity}</p>
            <p>Operational Status: {result.business_status}</p>
          </div>
        ))
      }
    </div>
  )
}

export default App;
