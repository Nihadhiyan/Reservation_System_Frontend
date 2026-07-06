import { GoogleMap, MarkerF, useJsApiLoader } from "@react-google-maps/api";

const CONTAINER_STYLE = { width: "100%", height: "100%" };

/**
 * Outer/real-world map for a Venue's street location, using its
 * VenueResponse.latitude/longitude (distinct from the indoor SVG floor
 * plan in FloorPlanCanvas, which uses the Hall's own local coordinate space).
 */
export function VenueLocationMap({ latitude, longitude, name }) {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
  });

  if (!import.meta.env.VITE_GOOGLE_MAPS_API_KEY) {
    return (
      <div className="flex h-full items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--muted)] text-sm text-[var(--muted-foreground)] p-4 text-center">
        Set VITE_GOOGLE_MAPS_API_KEY to display the venue location map.
      </div>
    );
  }

  if (!isLoaded || latitude == null || longitude == null) {
    return (
      <div className="flex h-full items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--muted)] text-sm text-[var(--muted-foreground)]">
        Loading map...
      </div>
    );
  }

  const center = { lat: latitude, lng: longitude };

  return (
    <GoogleMap mapContainerStyle={CONTAINER_STYLE} center={center} zoom={15}>
      <MarkerF position={center} title={name} />
    </GoogleMap>
  );
}
