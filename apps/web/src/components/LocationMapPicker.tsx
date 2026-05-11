"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMap,
  useMapEvents,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Button } from "@/components/ui/button";
import { MapPin, Crosshair, Globe } from "lucide-react";
import { useGeolocation } from "@/views/communities/hooks/geolocation_hooks";
import L from "leaflet";

// Fix for default marker icons in Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

interface LocationMapPickerProps {
  onLocationSelect: (location: {
    coordinates: { latitude: number; longitude: number };
    accuracy?: number;
    altitude?: number;
    altitudeAccuracy?: number;
    timestamp: number;
  }) => void;
  initialLocation?: { latitude: number; longitude: number };
  className?: string;
}

const mapContainerStyle = {
  width: "100%",
  height: "400px",
};

const defaultCenter = {
  lat: 33.8933, // NYC
  lng: 35.5016,
};

// Custom marker icon
const customIcon = new L.Icon({
  iconUrl:
    "data:image/svg+xml;charset=UTF-8," +
    encodeURIComponent(`
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M16 0C10.477 0 6 4.477 6 10c0 7 10 22 10 22s10-15 10-22c0-5.523-4.477-10-10-10zm0 15c-2.761 0-5-2.239-5-5s2.239-5 5-5 5 2.239 5 5-2.239 5-5 5z" fill="#3B82F6"/>
      <circle cx="16" cy="10" r="3" fill="white"/>
    </svg>
  `),
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

// Map click handler component
function MapClickHandler({
  onLocationSelect,
}: {
  onLocationSelect: (lat: number, lng: number) => void;
}) {
  useMapEvents({
    click: (e) => {
      onLocationSelect(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

// Map center updater component
function MapCenterUpdater({
  center,
}: {
  center: { lat: number; lng: number };
}) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, map.getZoom());
  }, [center, map]);
  return null;
}

export default function LocationMapPicker({
  onLocationSelect,
  initialLocation,
  className = "",
}: LocationMapPickerProps) {
  const {
    location,
    isLoading: isLoadingLocation,
    error: locationError,
    getCurrentPosition,
    forceFreshLocation,
  } = useGeolocation();
  const [selectedLocation, setSelectedLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [mapCenter, setMapCenter] = useState(defaultCenter);

  // Initialize map center based on initial location or geolocation
  useEffect(() => {
    if (initialLocation) {
      const center = {
        lat: initialLocation.latitude,
        lng: initialLocation.longitude,
      };
      setMapCenter(center);
      setSelectedLocation(center);
    }
  }, [initialLocation]);

  // Update map when geolocation is obtained
  useEffect(() => {
    if (location && !selectedLocation) {
      const center = { lat: location.latitude, lng: location.longitude };
      setMapCenter(center);
      setSelectedLocation(center);

      // Notify parent component
      onLocationSelect({
        coordinates: {
          latitude: location.latitude,
          longitude: location.longitude,
        },
        accuracy: location.accuracy,
        altitude: location.altitude,
        altitudeAccuracy: location.altitudeAccuracy,
        timestamp: location.timestamp,
      });
    }
  }, [location, selectedLocation, onLocationSelect]);

  // Handle map click to place marker
  const handleMapClick = useCallback(
    (lat: number, lng: number) => {
      const newLocation = { lat, lng };
      setSelectedLocation(newLocation);

      // Notify parent component
      onLocationSelect({
        coordinates: { latitude: lat, longitude: lng },
        timestamp: Date.now(),
      });
    },
    [onLocationSelect]
  );

  // Handle current location button click
  const handleGetCurrentLocation = async () => {
    await forceFreshLocation();
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Map Controls */}
      <div className="flex flex-wrap gap-2">
        <Button
          onClick={handleGetCurrentLocation}
          disabled={isLoadingLocation}
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
        >
          <Crosshair className="h-4 w-4" />
          {isLoadingLocation ? "Getting Location..." : "Use My Location"}
        </Button>

        {/* Location Accuracy Display */}
        {location && (
          <div className="text-sm text-secondary bg-secondary-tint px-3 py-2 rounded border">
            <p className="font-medium">
              GPS Accuracy:{" "}
              {location.accuracy
                ? `${Math.round(location.accuracy)}m`
                : "Unknown"}
            </p>
            <p className="text-xs">
              Lat: {location.latitude.toFixed(6)}, Lng:{" "}
              {location.longitude.toFixed(6)}
            </p>
            {location.accuracy && location.accuracy > 100 && (
              <p className="text-xs text-primary mt-1">
                ⚠️ Low accuracy ({Math.round(location.accuracy)}m). Consider
                manual placement.
              </p>
            )}
          </div>
        )}

        {locationError && (
          <div className="text-sm text-primary bg-primary-tint px-3 py-2 rounded border ">
            <p className="font-medium">Location Error:</p>
            <p className="text-xs">{locationError}</p>
            <p className="text-xs mt-1">
              You can still click on the map to select a location manually.
            </p>
          </div>
        )}
      </div>

      {/* Leaflet Map */}
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <MapContainer
          center={mapCenter}
          zoom={13}
          style={mapContainerStyle}
          zoomControl={true}
          attributionControl={true}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* Map click handler */}
          <MapClickHandler onLocationSelect={handleMapClick} />

          {/* Map center updater */}
          <MapCenterUpdater center={mapCenter} />

          {/* Show selected location marker */}
          {selectedLocation && (
            <Marker position={selectedLocation} icon={customIcon} />
          )}
        </MapContainer>
      </div>

      {/* Location Summary */}
      {selectedLocation && (
        <div className="p-3 bg-blue-50 rounded border border-blue-200">
          <div className="flex items-center gap-2 text-secondary-shade mb-2">
            <MapPin className="h-4 w-4" />
            <span className="text-sm font-medium">Selected Location</span>
          </div>
          <div className="text-xs text-secondary space-y-1">
            <p>Latitude: {selectedLocation.lat.toFixed(6)}</p>
            <p>Longitude: {selectedLocation.lng.toFixed(6)}</p>
            {location && location.accuracy && (
              <p>GPS Accuracy: ±{Math.round(location.accuracy)}m</p>
            )}
            {location && location.altitude && (
              <p>Altitude: {Math.round(location.altitude)}m</p>
            )}
          </div>
          <p className="text-xs text-secondary mt-2">
            💡 Click anywhere on the map to change the location
          </p>
        </div>
      )}

      {/* Instructions */}
      <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded border border-gray-200">
        <div className="flex items-start gap-2">
          <Globe className="h-4 w-4 text-gray-500 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-medium text-gray-700 mb-1">
              How to select a location:
            </p>
            <ul className="text-xs text-gray-600 space-y-1">
              <li>
                • Click &quot;Use My Location&quot; to automatically detect your
                current location
              </li>
              <li>• Click anywhere on the map to place a marker manually</li>
              <li>• Use zoom and pan controls to navigate the map</li>
              <li>• The marker will show your selected community location</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
