import { useEffect, useState }                       from 'react'
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import placesData                                      from '@/data/places.json'

// Build a name → place object lookup
const PLACES_MAP = Object.fromEntries(placesData.places.map(p => [p.name, p]))

export default function MapModal({ insight, onClose }) {
  const insightPlaces = (insight.places ?? [])
    .map(name => PLACES_MAP[name])
    .filter(Boolean)

  const centerPlace = insight.center
    ? PLACES_MAP[insight.center]
    : insightPlaces[0]

  const [activePlace, setActivePlace] = useState(centerPlace ?? insightPlaces[0] ?? null)

  const mapCenter = centerPlace
    ? [centerPlace.lat, centerPlace.lng]
    : [32.0, 35.2]

  useEffect(() => {
    function onKey(e) { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <div
      className="map-modal-backdrop open"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="map-modal" role="dialog" aria-modal="true">
        <div className="map-modal-header">
          <div>
            <div className="map-modal-title">{insight.title}</div>
            {insight.sub && <div className="map-modal-sub">{insight.sub}</div>}
          </div>
          <button className="map-close" onClick={onClose} aria-label="Close">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="map-body">
          <div className="map-leaflet-area">
            <MapContainer
              center={mapCenter}
              zoom={8}
              style={{ width: '100%', height: '100%' }}
              scrollWheelZoom
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
              />
              {insightPlaces.map((place) => (
                <CircleMarker
                  key={place.name}
                  center={[place.lat, place.lng]}
                  radius={7}
                  pathOptions={{
                    fillColor: '#8b6f47',
                    color: '#5c4f3a',
                    weight: 1.5,
                    fillOpacity: 0.85,
                  }}
                  eventHandlers={{ click: () => setActivePlace(place) }}
                >
                  <Popup>{place.name}</Popup>
                </CircleMarker>
              ))}
            </MapContainer>
          </div>

          <div className="map-info">
            {insight.sub && (
              <div className="map-ref">{insight.sub}</div>
            )}
            {activePlace ? (
              <>
                <div className="map-place-title">{activePlace.name}</div>
                <div className="map-place-text">{activePlace.description}</div>
              </>
            ) : (
              <div className="map-place-text" style={{ color: 'var(--ink-faint)' }}>
                Select a marker to see details.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
