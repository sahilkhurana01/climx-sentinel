import { useEffect, useRef, useState, useCallback } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { mockProjects } from "@/lib/mockData";

const MAPBOX_TOKEN = "pk.eyJ1Ijoiam9obnBwcHA2NiIsImEiOiJjbWx0OGRycnMwZjM5M2VzMWYzd3pqZXd5In0.47U3tmtwU8xRpubt3wPeXw";

interface MapViewProps {
  onProjectClick?: (projectId: string) => void;
  showHeatmap?: boolean;
}

export default function MapView({ onProjectClick, showHeatmap = true }: MapViewProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [loaded, setLoaded] = useState(false);

  const flyToProject = useCallback((coords: [number, number]) => {
    map.current?.flyTo({
      center: coords,
      zoom: 12,
      pitch: 60,
      bearing: -20,
      duration: 2500,
      essential: true,
    });
  }, []);

  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    mapboxgl.accessToken = MAPBOX_TOKEN;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/standard",
      center: [78.9629, 20.5937], // India center
      zoom: 4.5,
      pitch: 45,
      bearing: 0,
      antialias: true,
      projection: "globe",
    });

    map.current.addControl(new mapboxgl.NavigationControl({ visualizePitch: true }), "top-right");

    map.current.on("style.load", () => {
      const m = map.current!;
      // Enable 3D terrain
      m.setFog({
        color: "hsl(220, 40%, 6%)",
        "high-color": "hsl(220, 30%, 14%)",
        "horizon-blend": 0.08,
        "space-color": "hsl(222, 47%, 4%)",
        "star-intensity": 0.6,
      });

      setLoaded(true);
    });

    map.current.on("load", () => {
      const m = map.current!;

      // Add project markers as GeoJSON
      const geojson: GeoJSON.FeatureCollection = {
        type: "FeatureCollection",
        features: mockProjects.map((p) => ({
          type: "Feature",
          geometry: { type: "Point", coordinates: p.location.coordinates },
          properties: { id: p.id, name: p.name, riskScore: p.riskScore, riskLevel: p.riskLevel, hazardType: p.hazardType },
        })),
      };

      m.addSource("projects", { type: "geojson", data: geojson });

      m.addLayer({
        id: "project-points",
        type: "circle",
        source: "projects",
        paint: {
          "circle-radius": ["interpolate", ["linear"], ["get", "riskScore"], 30, 8, 90, 16],
          "circle-color": [
            "match", ["get", "riskLevel"],
            "High", "hsl(0, 72%, 51%)",
            "Medium", "hsl(38, 92%, 50%)",
            "Low", "hsl(152, 69%, 45%)",
            "hsl(192, 100%, 50%)",
          ],
          "circle-opacity": 0.8,
          "circle-stroke-width": 2,
          "circle-stroke-color": "rgba(255,255,255,0.2)",
          "circle-blur": 0.3,
        },
      });

      // Flood heatmap layer
      if (showHeatmap) {
        m.addLayer({
          id: "flood-heatmap",
          type: "heatmap",
          source: "projects",
          paint: {
            "heatmap-weight": ["interpolate", ["linear"], ["get", "riskScore"], 0, 0, 100, 1],
            "heatmap-intensity": 0.6,
            "heatmap-radius": 60,
            "heatmap-opacity": 0.5,
            "heatmap-color": [
              "interpolate", ["linear"], ["heatmap-density"],
              0, "rgba(0,0,0,0)",
              0.2, "hsl(220, 80%, 60%)",
              0.4, "hsl(192, 100%, 50%)",
              0.6, "hsl(38, 92%, 50%)",
              1, "hsl(0, 72%, 51%)",
            ],
          },
        });
      }

      // Click handler
      m.on("click", "project-points", (e) => {
        if (e.features?.[0]?.properties?.id) {
          const id = e.features[0].properties.id;
          const coords = (e.features[0].geometry as GeoJSON.Point).coordinates as [number, number];
          flyToProject(coords);
          onProjectClick?.(id);
        }
      });

      m.on("mouseenter", "project-points", () => { m.getCanvas().style.cursor = "pointer"; });
      m.on("mouseleave", "project-points", () => { m.getCanvas().style.cursor = ""; });
    });

    return () => {
      map.current?.remove();
      map.current = null;
    };
  }, [flyToProject, onProjectClick, showHeatmap]);

  return (
    <div className="relative w-full h-full">
      <div ref={mapContainer} className="absolute inset-0 rounded-xl overflow-hidden" />
      {!loaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/80 rounded-xl">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      )}
    </div>
  );
}
