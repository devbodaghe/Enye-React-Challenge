import React, { useState, useEffect} from 'react';
import './app.css';
import {Button, Select} from '@material-ui/core';

const key:string = "AIzaSyDLBm-g5esokD5x2NLshJ-Io5lCqK_nrtM";
 const dblink:string = "https://enye-bfbc2.firebaseio.com/search.json"
 const proxyuri:string = "https://secure-dusk-66741.herokuapp.com/"
//  const proxy2:string = "https://cors-anywhere.herokuapp.com/"

  const options = [
    {label: "5 km",value: 5000,},
    { label: "10 km", value: 10000 },
    { label: "15 km", value: 15000 },
    { label: "20 km", value: 20000 }, 
  ];
  const search = [
    {label: "Hospitals",value: "Hospital",},
    { label: "Pharmacies", value: "Pharmacy" },
    { label: "Clinics", value: "Clinic" },
    { label: "Medical Offices", value: "MedicalOffice" }, 
  ];

  type Props = {
    userID:string ,
    userName:string
  }

  const App:React.FC <Props> = (props) => {

    const [radius,setRadius] = useState<number>(5000);
    const [latitude,setLatitude] = useState<number | undefined>();
    const [longitude,setLongitude] = useState<number | undefined>();
    const [results,setResults] = useState<any[] | undefined>();
    const [searchTerm,setSearchTerm] = useState<string>("Hospital");
    const [history,setHistory] = useState<any[] | undefined>();
    const [showHistory,setShowHistory] = useState<boolean>(false);
    const [address,setAddress] = useState<string | undefined>();

  
    useEffect(() => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition( position => {
          let latitude = position.coords.latitude
          setLatitude(latitude)
          let longitude = position.coords.longitude
          setLongitude(longitude)
          getAddress(latitude,longitude)
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
    const stringifyUrl = (searchTerm:string):string => {
      if (searchTerm === "Clinic" || searchTerm === "Medicaloffice") {
        return `https://maps.googleapis.com/maps/api/place/textsearch/json?input=${searchTerm.toLowerCase()}&inputtype=textquery&fields=formatted_address,name&locationbias=circle:${radius}@${latitude},${longitude}&key=${key}`
      }
      return `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&type=${searchTerm.toLowerCase()}&radius=${radius}&key=${key}`;
    }
  
    const saveDB = () => {
      fetch(dblink, {
        method: 'POST',
        headers: {
          'Content-Type':'application/json'
        },
        body: JSON.stringify({
          searchTerm,
          userID:props.userID,
          radius,
          latitude,
          longitude,
          results,
          timeStamp : Date()
        })
      })
    }
  
    const getResults = () => {
      const url:string = stringifyUrl(searchTerm)
      // console.log(url)
      // console.log(searchTerm)
      fetch(proxyuri+url)
        .then(res => res.json())
        .then(data => {
          setResults(data.results)
          setShowHistory(false)
        })
        .then(() => saveDB())
        .catch(() => alert("error occurred, try again"))
    }
  
    const getHistory = () => {
      fetch(dblink)
        .then(res => res.json())
        .then(data => {
          const fetchedHistory = []
          for (let key in data) {
            if(data[key].userID === props.userID){
              fetchedHistory.push({
                id:key,
                ...data[key]
              })
            }
          }
          setHistory(fetchedHistory.reverse());
          setShowHistory(true)
        })
        .catch(() => alert("error occurred, try again"))
    }
  
    const show = (display: string) => {
      if(display === "history") {
        return (
          <div className="row">
            {history && history.map(r => (
              <div 

                className="row_display"
                key={r.id}
              >
                <p className="main__results">You searched for {r.searchTerm} at {r.timeStamp}</p>
              </div>
            ))}
          </div>
        )
      }
      return (
        <div className="row">
          {results && results.map(r => (
            <div 
              className="row_display"
              key={r.id}
            >
              <p className="main__results">{searchTerm} Name: {r.name}</p>
              {r.business_status ? <p className="main__results">Operational Status: {r.business_status}</p> : null}
              {r.vicinity ? <p className="main__results">{searchTerm} Address: {r.vicinity}</p> : null}
              {r.formatted_address ? <p className="main__results">{searchTerm} Address: {r.formatted_address}</p> : null}
            </div>
          ))}
      </div>
      )
    }
  
    return (
      <>
        <header className="header">
          <div className="header__text">
            <h1 >
              Hospital Locator
            </h1>
            <p >Locate Nearby Medical Institutions Close to Your Location</p>
            </div>
              {address && <p > User address: {address}</p>}
            {/* <div>
            <a className="header__btn" href="#search">Give it a try</a>
          </div> */}
        </header>
        <main className="main" id="search">
          <div className="row margin--b">
            <h2 className="main__row--text">Select Search Radius</h2>
            <select 
              className="main__row--radius"
              onChange = {(e) => setRadius(+e.target.value)}
            >
              {options.map(option => (
                <option key={option.label} 
                value={option.value}>{option.label}</option>
              ))}
            </select>
            <select 
              className="main__row--radius"
              onChange = {(e)=> {
                setSearchTerm(e.target.value) 
                setResults(undefined)
              }}
            >
              {search.map(option => (
                <option key={option.label} 
                value={option.value}>{option.label}</option>
              ))}
            </select>
            <Button  
              className="main__btn--search"
              onClick={getResults}
              variant = "outlined"
            >
              Search
            </Button>
            <Button 
              variant = "outlined"
              className="main__btn--search"
              onClick={getHistory}
            >
              History
            </Button>
            { showHistory ? show("history") : show("results") }
          </div>
          
        </main>
      </>
    )
  }
  
  export default App;