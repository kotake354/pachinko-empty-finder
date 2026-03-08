"use client";

import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";

const center = {
  lat: 35.681236,
  lng: 139.767125,
};

export default function MapPage() {
  return (
    <LoadScript googleMapsApiKey="YOUR_API_KEY">
      <GoogleMap
        mapContainerStyle={{
          width: "100%",
          height: "500px",
        }}
        center={center}
        zoom={12}
      >
        <Marker position={center} />
      </GoogleMap>
    </LoadScript>
  );
}