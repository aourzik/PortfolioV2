import { useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

export default function ToulouseMap() {
  const containerRef = useRef(null)
  const mapRef       = useRef(null)

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return

    const map = L.map(containerRef.current, {
      center:            [43.6047, 1.4442],
      zoom:              12,
      zoomControl:       false,
      dragging:          false,
      touchZoom:         false,
      doubleClickZoom:   false,
      scrollWheelZoom:   false,
      boxZoom:           false,
      keyboard:          false,
      attributionControl: false,
    })

    // CartoDB dark — gratuit, zéro clé API
    L.tileLayer(
      'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
      { maxZoom: 19 }
    ).addTo(map)

    // Pin jaune accent
    const icon = L.divIcon({
      className: '',
      html: `
        <div style="
          width:14px; height:14px;
          border-radius:50%;
          background:#FFB703;
          border:3px solid rgba(255,250,232,0.85);
          box-shadow:0 0 14px rgba(255,183,3,0.7), 0 0 4px rgba(255,183,3,0.9);
        "></div>`,
      iconSize:   [14, 14],
      iconAnchor: [7, 7],
    })

    L.marker([43.6047, 1.4442], { icon }).addTo(map)

    mapRef.current = map

    return () => {
      map.remove()
      mapRef.current = null
    }
  }, [])

  return <div ref={containerRef} className="w-full h-full" />
}
