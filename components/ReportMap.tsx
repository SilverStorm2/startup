"use client";

import { useEffect, useRef, useState } from "react";
import maplibregl, { Map as MapLibreMap, Marker } from "maplibre-gl";
import { LocateFixed } from "lucide-react";

type Props = {
  value: { lat: number; lng: number };
  onChange: (value: { lat: number; lng: number }) => void;
  label: string;
};

const KRAKOW = { lat: 50.0647, lng: 19.945 };

export default function ReportMap({ value, onChange, label }: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<MapLibreMap | null>(null);
  const markerRef = useRef<Marker | null>(null);
  const [gpsState, setGpsState] = useState<"idle" | "loading" | "ok" | "error">("idle");

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = new maplibregl.Map({
      container: containerRef.current,
      center: [value.lng || KRAKOW.lng, value.lat || KRAKOW.lat],
      zoom: 13,
      style: {
        version: 8,
        sources: {
          osm: {
            type: "raster",
            tiles: ["https://tile.openstreetmap.org/{z}/{x}/{y}.png"],
            tileSize: 256,
            attribution: "© OpenStreetMap contributors"
          }
        },
        layers: [{ id: "osm", type: "raster", source: "osm" }]
      }
    });

    const marker = new maplibregl.Marker({ color: "#ff6b35", draggable: true })
      .setLngLat([value.lng || KRAKOW.lng, value.lat || KRAKOW.lat])
      .addTo(map);

    marker.on("dragend", () => {
      const point = marker.getLngLat();
      onChange({ lat: point.lat, lng: point.lng });
    });

    map.on("click", (event) => {
      marker.setLngLat(event.lngLat);
      onChange({ lat: event.lngLat.lat, lng: event.lngLat.lng });
    });

    mapRef.current = map;
    markerRef.current = marker;

    return () => {
      map.remove();
      mapRef.current = null;
      markerRef.current = null;
    };
  }, [onChange, value.lat, value.lng]);

  const useGps = () => {
    if (!navigator.geolocation) {
      setGpsState("error");
      return;
    }
    setGpsState("loading");
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const next = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        onChange(next);
        markerRef.current?.setLngLat([next.lng, next.lat]);
        mapRef.current?.flyTo({ center: [next.lng, next.lat], zoom: 16 });
        setGpsState("ok");
      },
      () => setGpsState("error"),
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  return (
    <div className="space-y-3">
      <div className="map-shell">
        <div ref={containerRef} className="h-[310px] w-full" />
        <button type="button" onClick={useGps} className="gps-button">
          <LocateFixed size={17} />
          {gpsState === "loading" ? "GPS..." : label}
        </button>
      </div>
      <p className="text-xs text-slate-500">
        {gpsState === "error"
          ? "Nie udało się pobrać GPS. Kliknij mapę lub przeciągnij pinezkę."
          : "Kliknij mapę lub przeciągnij pinezkę, aby poprawić lokalizację."}
      </p>
    </div>
  );
}
