import React, { useState, useEffect} from 'react';
import './App.css';

const key:string = process.env.REACT_APP_API_KEY!;

const App: React.FC = () => {

  const [latitude,setLatitude] = useState<number | undefined>(); 
  const [longitude,setLongitude] = useState<number | undefined>(); 
  const [hospitals, setHospitals] = useState<any []>();
  const [pharmacies, setPharmacies] = useState<any []>();
  const [clinics, setClinics] = useState<any []>();
  const [medicalOffices, setMedicalOffices] = useState<any []>();
  const [address,setAddress] = useState<string | undefined>();
  const [radius, setRadius] = useState("5000");

  const options = [
    {label: "5 km",value: 5000,},
    { label: "10 km", value: 10000 },
    { label: "15 km", value: 15000 },
    { label: "20 km", value: 20000 }, 
  ];
  
  const PROXY_URL = 'https://secure-dusk-66741.herokuapp.com/';  
  const url_hospital:string = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&type=hospital&radius=${radius}&key=${key}`;
  const url_pharmacy:string = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&type=pharmacy&radius=${radius}&key=${key}`;
  const url_clinic:string = `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=clinic&inputtype=textquery&fields=formatted_address,name,rating&locationbias=circle:${radius}@${latitude},${longitude}&key=${key}`
  const url_medicalOffices:string = `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=medical%office&inputtype=textquery&fields=formatted_address,name,rating&locationbias=circle:${radius}@${latitude},${longitude}&key=${key}`
  
  const URL_HOSPITAL = PROXY_URL + url_hospital
  const URL_PHARMACY = PROXY_URL + url_pharmacy
  const URL_CLINIC = PROXY_URL + url_clinic
  const URL_MEDICALOFFICE = PROXY_URL + url_medicalOffices

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
  const getPharmacies = (): void => {
    fetch(URL_PHARMACY)
      .then(res => res.json())
      .then(data => setPharmacies(data.results))
  }
  const gethospitals = ():void => {
    fetch(URL_HOSPITAL)
      .then(res => res.json())
      .then(data => setHospitals(data.candidates))
  }
  const getClinics = ():void => {
    fetch(URL_CLINIC)
      .then(res => res.json())
      .then(data => setClinics(data.results))
  }

  const getMedicalOffice = ():void => {
    fetch(URL_MEDICALOFFICE)
      .then(res => res.json())
      .then(data => setMedicalOffices(data.candidates))
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
        </button > 
        <button 
        className = "btn__hospital"
        onClick = {getClinics}>
          Show Clinics
        </button>
        <button className = "btn__hospital"
        onClick = {getMedicalOffice}

        >
          Show Medical Offices
        </button>
        <button className="btn__hospital"
          onClick = {getPharmacies}
        >
          Show Pharmacies
        </button>
      </div>
      {address && <p className = "user--address"> User address: {address}</p>}
      <div>
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
      
      <div>
      {
        pharmacies && 
        pharmacies.map(result => (
          <div 
            className="hospitals"
            key={result.id}
          >
            
            <p>Pharmacy Name: {result.name}</p>
            <p>Pharmacy address: {result.vicinity}</p>
            <p>Operational Status: {result.business_status}</p>
          </div>
        ))
      }
      </div>
      <div>
      {
        clinics && 
        clinics.map(result => (
          <div 
            className="hospitals"
            key={result.id}
          >
            
            <p>Clinic Name: {result.name}</p>
            <p>Clinic address: {result.formatted_address}</p>
            <p>Operational Status: {result.rating}</p>
          </div>
        ))
      }
      </div>
      <div>
      
      {
        medicalOffices && 
        medicalOffices.map(result => (
          <div 
            className="hospitals"
            key={result.id}
          >
            
            <p>Medical Office Name: {result.name}</p>
            <p>Medical Office address: {result.formatted_address}</p>
            {/* <p>Operational Status: {result.rating}</p> */}
          </div>
        ))
      } 
      </div>
      
      
    </div>
  )
}

export default App;
