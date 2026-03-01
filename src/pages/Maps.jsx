import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import placesData from '@/data/places.json'

export default function Maps() {
  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <MapContainer
        center={[32.0, 35.2]}
        zoom={7}
        style={{ width: '100%', height: '100%' }}
        scrollWheelZoom
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />
        {placesData.places.map((place) => (
          <CircleMarker
            key={place.name}
            center={[place.lat, place.lng]}
            radius={6}
            pathOptions={{
              fillColor: '#8b6f47',
              color: '#5c4f3a',
              weight: 1.5,
              fillOpacity: 0.85,
            }}
          >
            <Popup>
              <strong style={{ fontFamily: 'Jost, sans-serif' }}>{place.name}</strong>
              {place.description && (
                <p style={{ marginTop: '0.35rem', fontSize: '0.8rem', lineHeight: 1.5 }}>
                  {place.description}
                </p>
              )}
            </Popup>
          </CircleMarker>
        ))}
      </MapContainer>
    </div>
  )
}
