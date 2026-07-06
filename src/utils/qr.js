/**
 * Reservation QR codes encode a plain string produced by the backend
 * (ReservationService): "RES-<reservationId>". No JSON, no signature -
 * the server re-validates the reservation's actual status on confirm.
 */
export function parseReservationId(rawValue) {
  const match = /^RES-([0-9a-fA-F-]{36})$/.exec(rawValue.trim());
  if (!match) {
    throw new Error("QR code is not a valid reservation code.");
  }
  return match[1];
}
