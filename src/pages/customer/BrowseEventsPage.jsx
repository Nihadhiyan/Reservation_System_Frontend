import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { eventService } from "@/services/eventService";
import { Loader } from "@/components/feedback/Loader";
import { formatDate } from "@/utils/formatters";

export default function BrowseEventsPage() {
  const [events, setEvents] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    eventService
      .getUpcoming()
      .then(setEvents)
      .catch((err) => setError(err.response?.data?.message ?? "Failed to load events."));
  }, []);

  if (error) return <p className="p-6 text-[var(--destructive)]">{error}</p>;
  if (!events) return <Loader label="Loading events..." />;

  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      <h1 className="text-2xl font-semibold mb-6">Upcoming Events</h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {events.map((event) => (
          <Link
            key={event.id}
            to={`/events/${event.id}`}
            className="rounded-lg border border-[var(--border)] p-4 hover:shadow-md transition-shadow"
          >
            <h2 className="font-medium">{event.name}</h2>
            <p className="text-sm text-[var(--muted-foreground)]">
              {formatDate(event.startDateTime)}
            </p>
          </Link>
        ))}
        {events.length === 0 && (
          <p className="text-[var(--muted-foreground)]">No upcoming events.</p>
        )}
      </div>
    </div>
  );
}
