import React, { useEffect, useState } from 'react';
import './App.css';
import { MenuItem, FormControl, Select, Card, CardContent } from '@material-ui/core';
import InfoBox from './InfoBox';
import Map from './Map';
import Table from './Table';
import { sortData } from './util';
import LineGraph from './LineGraph';
import "leaflet/dist/leaflet.css";

function App() {

  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState('worldwide');
  const [countryInfo, setCountryInfo] = useState({});
  const [tableData, setTableData] = useState([]);
  const [mapCenter, setMapCenter] = useState({ lat: 34.80746, lng: -40.4796 });
  const [mapCountries, setMapCountries] = useState([]);
  const [zoom, setZoom] = useState(3);
  const [caseType, setCaseType] = useState("cases");
  // STATE = how to write a variable in REACT

  // https://disease.sh/v3/covid-19/countries

  // useEffect(powerful-react-hook) = run a piece of code based om a given condition
  // the code inside runs here once when the component loads and not again
  // useEffect run again when the  variable changes in useEffect

  // for worldwide(all countries total stats)
  useEffect(() => {
    fetch("https://disease.sh/v3/covid-19/all")
      .then((response) => response.json())
      .then((data) => {
        setCountryInfo(data);
      })
  }, []);


  // for selected country from dropdown
  useEffect(() => {
    // async : wait for response from API request

    // return countries array
    const getCountries = async () => {
      await fetch("https://disease.sh/v3/covid-19/countries")
        .then((response) => response.json())
        .then((data) => {
          const countries = data.map((country) => ({
            name: country.country,  // United States, United Kingdom, India
            value: country.countryInfo.iso2 // US, Uk, IN
          }));

          const sortedData = sortData(data);
          setTableData(sortedData);
          setMapCountries(data);
          setCountries(countries);
        });
    };

    getCountries();

  }, []);


  const onCountryChange = async (event) => {
    const countryCode = event.target.value;
    // console.log(countryCode);
    setCountry(countryCode);

    const url = countryCode === "worldwide"
      ? "https://disease.sh/v3/covid-19/all"
      : `https://disease.sh/v3/covid-19/countries/${countryCode}`;

    await fetch(url)
      .then((response) => response.json())
      .then((data) => {

        setCountry(countryCode);

        // all of the data from country response
        setCountryInfo(data);

        if (countryCode === 'worldwide') {
          setMapCenter([34.80746, -40.4796]);
        }
        else {
          setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
          setZoom(4);
        }
      });

    // console.log(countryInfo);

  }


  return (
    <div className="app">

      <div className="app__left">

        <div className="app__header">
          <div className="app__image">
            <img src="./coronavirus-icon.png" width="48px" height="48px" ></img>
            <h1> COVID-19 TRACKER</h1>
          </div>
          <FormControl className="app__dropdown">
            <Select
              variant="outlined"
              onChange={onCountryChange}
              value={country}
            >
              {/*Loop through all countries and show a drop down List */}


              <MenuItem value="worldwide">Worldwide</MenuItem>
              {countries.map((country) => {
                return <MenuItem value={country.value}> {country.name}</MenuItem>
              })}

            </Select>

          </FormControl>
        </div>

        <div className="app__stats">
          <InfoBox
            caseType={caseType}
            active={caseType === 'cases'}
            isRed
            onClick={e => setCaseType('cases')}
            title="Coronavirus Cases"
            cases={countryInfo.todayCases}
            total={countryInfo.cases} />
          <InfoBox
            caseType={caseType}
            active={caseType === 'recovered'}
            onClick={e => setCaseType('recovered')}
            title="Recovered"
            cases={countryInfo.todayRecovered}
            total={countryInfo.recovered} />
          <InfoBox
            caseType={caseType}
            active={caseType === 'deaths'}
            isRed
            onClick={e => setCaseType('deaths')}
            title="Deaths"
            cases={countryInfo.todayDeaths}
            total={countryInfo.deaths} />
        </div>

        {/* Map */}
        <Map
          caseType={caseType}
          countries={mapCountries}
          center={mapCenter}
          zoom={zoom}
          caseType={caseType}
        />

      </div>

      <Card className="app__right">
        <CardContent>
          <h3>Live Cases by Country</h3>
          <Table countries={tableData} />

          <h3 className="app__graphTitle">Worldwide new {caseType}</h3>
          <LineGraph className="app__graph" caseType={caseType} />
        </CardContent>
      </Card>

    </div >
  );
}

export default App;
