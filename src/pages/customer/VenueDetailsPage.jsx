import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { venueService } from "@/services/venueService";
import { Loader } from "@/components/feedback/Loader";
import { VenueLocationMap } from "@/components/map/VenueLocationMap";

export default function VenueDetailsPage() {
  const { venueId } = useParams();
  const [venue, setVenue] = useState(null);
  const [buildings, setBuildings] = useState(null);

  useEffect(() => {
    venueService.getById(venueId).then(setVenue);
    venueService.getBuildings(venueId).then(setBuildings);
  }, [venueId]);

  if (!venue || !buildings) return <Loader label="Loading venue..." />;

  return (
    <div className="mx-auto max-w-5xl px-6 py-8 grid gap-6 lg:grid-cols-[1.2fr_1fr]">
      <div>
        <h1 className="text-2xl font-semibold">{venue.name}</h1>
        <p className="text-sm text-[var(--muted-foreground)] mb-4">
          {[venue.address, venue.city, venue.country].filter(Boolean).join(", ")}
        </p>

        <div className="h-72 rounded-lg overflow-hidden mb-6">
          <VenueLocationMap
            latitude={venue.latitude}
            longitude={venue.longitude}
            name={venue.name}
          />
        </div>

        {venue.description && (
          <p className="text-sm text-[var(--muted-foreground)]">{venue.description}</p>
        )}

        <dl className="grid grid-cols-2 gap-2 text-sm mt-4">
          {venue.contactNumber && (
            <>
              <dt className="text-[var(--muted-foreground)]">Contact</dt>
              <dd>{venue.contactNumber}</dd>
            </>
          )}
          {venue.website && (
            <>
              <dt className="text-[var(--muted-foreground)]">Website</dt>
              <dd>
                <a href={venue.website} target="_blank" rel="noreferrer" className="underline">
                  {venue.website}
                </a>
              </dd>
            </>
          )}
          <dt className="text-[var(--muted-foreground)]">Parking</dt>
          <dd>{venue.parkingAvailable ? "Available" : "Not available"}</dd>
          <dt className="text-[var(--muted-foreground)]">Food court</dt>
          <dd>{venue.foodCourtAvailable ? "Available" : "Not available"}</dd>
        </dl>
      </div>

      <aside>
        <h2 className="font-medium mb-2">Buildings</h2>
        <ul className="space-y-1">
          {buildings.map((building) => (
            <li key={building.id} className="rounded-md border border-[var(--border)] px-3 py-2 text-sm">
              {building.name}{" "}
              <span className="text-[var(--muted-foreground)]">
                ({building.numberOfFloors ?? 0} floors)
              </span>
            </li>
          ))}
          {buildings.length === 0 && (
            <p className="text-sm text-[var(--muted-foreground)]">No buildings listed yet.</p>
          )}
        </ul>
        <Link to="/events" className="inline-block mt-4 text-sm underline">
          Browse events at this venue
        </Link>
      </aside>
    </div>
  );
}
