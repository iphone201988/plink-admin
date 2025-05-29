import { useEffect, useRef } from "react";
import { GoogleMap } from "@react-google-maps/api";

interface MapComponentProps {
  court: any; // Replace 'any' with a more specific type if possible
  markerPosition: google.maps.LatLngLiteral | null;
  handleMapClick: (event: google.maps.MapMouseEvent) => void;
}

function MapComponent({ court, markerPosition, handleMapClick }: MapComponentProps) {
  const mapRef = useRef<google.maps.Map | null>(null);
  const markerRef = useRef<google.maps.marker.AdvancedMarkerElement | null>(null);

  const mapContainerStyle = {
    height: "400px",
    width: "800px"
  };

  const defaultCenter = { lat: 37.7749, lng: -122.4194 }; // example fallback

  const center = markerPosition || (court && court.latitude && court.longitude)
    ? { lat: court?.latitude || markerPosition?.lat || defaultCenter.lat, lng: court?.longitude || markerPosition?.lng || defaultCenter.lng }
    : defaultCenter;

  useEffect(() => {
    if (mapRef.current && markerPosition) {
      // Clear existing marker
      if (markerRef.current) {
        markerRef.current.map = null;
      }

      // Create AdvancedMarkerElement
      markerRef.current = new google.maps.marker.AdvancedMarkerElement({
        map: mapRef.current,
        position: markerPosition,
        title: "Custom Marker"
      });
    }
  }, [markerPosition]);

  return (
    <GoogleMap
      mapContainerStyle={mapContainerStyle}
      center={center}
      zoom={10}
      onClick={handleMapClick}
      onLoad={(map) => {
        mapRef.current = map;
      }}
    />
  );
}

export default MapComponent;
