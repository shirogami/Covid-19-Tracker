import React from 'react';
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import './Map.css';
import { showDataOnMap } from './util';

function Map({ countries, caseType, center, zoom }) {
    function ChangeView({ center, zoom }) {
        const map = useMap();
        map.setView(center, zoom);
        return null
    }

    return (
        <MapContainer
            caseType={caseType}
            className="map"
            center={center}
            zoom={zoom}
            scrollWheelZoom={false}
        >
            <ChangeView center={center} zoom={zoom} />
            <TileLayer
                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                url='https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png'
            />
            {/*showDataOnMap(countries, casesType)*/}
            {showDataOnMap(countries, caseType)}
        </MapContainer>
    );
}

export default Map;

// normal map
// https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png


//dark- theme -map
// 'https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png'


// different types of leaflet-map previews
// https://leaflet-extras.github.io/leaflet-providers/preview/