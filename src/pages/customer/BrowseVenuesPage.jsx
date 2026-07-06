import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { venueService } from "@/services/venueService";
import { Loader } from "@/components/feedback/Loader";

export default function BrowseVenuesPage() {
  const [venues, setVenues] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    venueService
      .getAllPaged({ size: 50 })
      .then((page) => setVenues(page.content))
      .catch((err) => setError(err.response?.data?.message ?? "Failed to load venues."));
  }, []);

  if (error) return <p className="p-6 text-[var(--destructive)]">{error}</p>;
  if (!venues) return <Loader label="Loading venues..." />;

  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      <h1 className="text-2xl font-semibold mb-6">Venues</h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {venues.map((venue) => (
          <Link
            key={venue.id}
            to={`/venues/${venue.id}`}
            className="rounded-lg border border-[var(--border)] p-4 hover:shadow-md transition-shadow"
          >
            <h2 className="font-medium">{venue.name}</h2>
            <p className="text-sm text-[var(--muted-foreground)]">{venue.address}</p>
          </Link>
        ))}
        {venues.length === 0 && (
          <p className="text-[var(--muted-foreground)]">No venues found.</p>
        )}
      </div>
    </div>
  );
}
