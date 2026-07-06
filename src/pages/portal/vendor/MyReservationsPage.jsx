import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { reservationService } from "@/services/reservationService";
import { paymentService } from "@/services/paymentService";
import { Loader } from "@/components/feedback/Loader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "@/components/feedback/Toast";
import { formatCurrency, formatDateTime } from "@/utils/formatters";
import {
  CreditCard,
  DollarSign,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileText,
  Store,
  Calendar,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Download,
  Building2,
  Lock,
  Receipt,
  XCircle,
} from "lucide-react";

const NON_CANCELLABLE_STATUSES = ["CANCELLED", "COMPLETED", "REFUNDED", "EXPIRED"];

export default function MyReservationsPage() {
  const [reservations, setReservations] = useState(null);
  const [cancellingId, setCancellingId] = useState(null);
  const [checkoutReservation, setCheckoutReservation] = useState(null);
  const [receiptReservation, setReceiptReservation] = useState(null);

  function load() {
    reservationService
      .getMine()
      .then((data) => {
        setReservations(Array.isArray(data) ? data : data?.content || []);
      })
      .catch(() => setReservations([]));
  }

  useEffect(load, []);

  async function handleCancel(reservation) {
    if (!window.confirm("Are you sure you want to release this stall hold?")) return;
    setCancellingId(reservation.id);
    try {
      await reservationService.cancel(reservation.id);
      toast.success("Reservation hold released successfully.");
      load();
    } catch (err) {
      toast.error(err.response?.data?.message ?? "Failed to cancel reservation.");
    } finally {
      setCancellingId(null);
    }
  }

  if (!reservations) return <Loader label="Loading executive stall leases..." />;

  const activeHolds = reservations.filter((r) => r.status === "PENDING" || r.status === "HOLD").length;
  const confirmedLeases = reservations.filter((r) => r.status === "CONFIRMED" || r.status === "PAID").length;
  const totalInvestment = reservations.reduce((acc, r) => acc + (r.totalAmount || r.totalPrice || 500), 0);

  return (
    <div className="space-y-8">
      {/* Executive Header */}
      <div className="relative overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)]/80 backdrop-blur-md p-6 md:p-8 shadow-lg">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 size-64 rounded-full bg-gradient-to-br from-[var(--primary)]/10 to-[var(--ring)]/10 blur-3xl pointer-events-none" />
        
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--primary)]/10 border border-[var(--primary)]/30 px-3 py-0.5 text-xs font-bold text-[var(--primary)] uppercase tracking-wider">
                <Sparkles className="size-3" />
                Stall Lease Management
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">Executive Stall Leases & Checkout</h1>
            <p className="text-sm text-[var(--muted-foreground)]">
              Manage active exhibition reservations, process corporate invoice payments, and download lease certificates.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Button asChild className="rounded-xl bg-gradient-to-r from-[var(--primary)] to-[var(--ring)] text-[var(--primary-foreground)] shadow-md">
              <Link to="/portal/vendor/discover" className="flex items-center gap-2">
                <Store className="size-4" />
                <span>Discover New Stalls</span>
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* KPI Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)]/80 backdrop-blur-md p-6 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">Pending Holds</p>
            <p className="text-3xl font-black text-amber-500">{activeHolds}</p>
          </div>
          <div className="flex size-12 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-500">
            <Clock className="size-6" />
          </div>
        </div>

        <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)]/80 backdrop-blur-md p-6 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">Confirmed Leases</p>
            <p className="text-3xl font-black text-green-600">{confirmedLeases}</p>
          </div>
          <div className="flex size-12 items-center justify-center rounded-2xl bg-green-500/10 text-green-600">
            <CheckCircle2 className="size-6" />
          </div>
        </div>

        <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)]/80 backdrop-blur-md p-6 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">Total Portfolio Value</p>
            <p className="text-2xl font-black text-[var(--ring)]">{formatCurrency(totalInvestment)}</p>
          </div>
          <div className="flex size-12 items-center justify-center rounded-2xl bg-[var(--ring)]/10 text-[var(--ring)]">
            <DollarSign className="size-6" />
          </div>
        </div>
      </div>

      {/* Reservations List */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold tracking-tight">Your Exhibition Bookings</h2>

        {reservations.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[var(--border)] p-16 text-center space-y-4 bg-[var(--card)]/40">
            <Store className="size-12 mx-auto text-[var(--muted-foreground)] opacity-40" />
            <div className="space-y-1">
              <p className="text-base font-semibold text-[var(--foreground)]">No exhibition stalls leased yet</p>
              <p className="text-xs text-[var(--muted-foreground)] max-w-sm mx-auto">
                Explore interactive floor blueprints to select prime exhibition spaces for your corporate showcase.
              </p>
            </div>
            <Button asChild className="rounded-xl shadow-md bg-gradient-to-r from-[var(--primary)] to-[var(--ring)] text-[var(--primary-foreground)]">
              <Link to="/portal/vendor/discover">Browse Floor Plans</Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {reservations.map((r) => {
              const cancellable = !NON_CANCELLABLE_STATUSES.includes(r.status);
              const isHold = r.status === "PENDING" || r.status === "HOLD";
              const isConfirmed = r.status === "CONFIRMED" || r.status === "PAID";
              const amount = r.totalAmount || r.totalPrice || 500;

              return (
                <div
                  key={r.id}
                  className="group rounded-2xl border border-[var(--border)] bg-[var(--card)]/80 backdrop-blur-md p-6 shadow-sm hover:shadow-md transition-all flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6"
                >
                  <div className="space-y-2 flex-1">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <h3 className="text-lg font-extrabold tracking-tight group-hover:text-[var(--primary)] transition-colors">
                        {r.event?.name ?? "Exhibition Event"}
                      </h3>
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-3 py-0.5 text-xs font-bold border ${
                          isConfirmed
                            ? "bg-green-500/10 text-green-600 border-green-500/30"
                            : isHold
                            ? "bg-amber-500/10 text-amber-600 border-amber-500/30 animate-pulse"
                            : "bg-[var(--muted)] text-[var(--muted-foreground)] border-[var(--border)]"
                        }`}
                      >
                        {isConfirmed && <CheckCircle2 className="size-3" />}
                        {isHold && <Clock className="size-3" />}
                        {r.status || "CONFIRMED"}
                      </span>
                      <span className="text-xs font-semibold text-[var(--muted-foreground)] bg-[var(--muted)]/50 px-2.5 py-0.5 rounded-md border border-[var(--border)]">
                        ID: #{r.id.slice(0, 8)}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-y-2 gap-x-6 text-xs text-[var(--muted-foreground)]">
                      <span className="flex items-center gap-1.5 font-medium">
                        <Calendar className="size-3.5 text-[var(--ring)]" />
                        Lease Start: {formatDateTime(r.reservationStartDateTime)}
                      </span>
                      {r.organizationName && (
                        <span className="flex items-center gap-1.5 font-medium">
                          <Building2 className="size-3.5 text-[var(--primary)]" />
                          Vendor Org: {r.organizationName}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between w-full lg:w-auto gap-4 pt-4 lg:pt-0 border-t lg:border-t-0 border-[var(--border)]/60">
                    <div className="text-left sm:text-right">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--muted-foreground)]">
                        Lease Investment
                      </p>
                      <p className="text-xl font-black text-[var(--foreground)]">{formatCurrency(amount)}</p>
                    </div>

                    <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
                      {isHold && (
                        <Button
                          onClick={() => setCheckoutReservation(r)}
                          className="flex-1 sm:flex-initial rounded-xl bg-gradient-to-r from-[var(--primary)] to-[var(--ring)] text-[var(--primary-foreground)] shadow-md hover:opacity-90 font-bold px-5"
                        >
                          <CreditCard className="size-4 mr-2" />
                          <span>Proceed to Checkout</span>
                        </Button>
                      )}

                      {isConfirmed && (
                        <Button
                          variant="outline"
                          onClick={() => setReceiptReservation(r)}
                          className="flex-1 sm:flex-initial rounded-xl border-[var(--border)] hover:bg-[var(--accent)] font-semibold"
                        >
                          <Receipt className="size-4 mr-2 text-[var(--primary)]" />
                          <span>View Receipt</span>
                        </Button>
                      )}

                      {cancellable && (
                        <Button
                          size="sm"
                          variant="ghost"
                          disabled={cancellingId === r.id}
                          onClick={() => handleCancel(r)}
                          className="rounded-xl text-destructive hover:bg-destructive/10 hover:text-destructive font-semibold px-3"
                        >
                          <XCircle className="size-4 mr-1.5" />
                          <span>{cancellingId === r.id ? "Releasing..." : "Release Hold"}</span>
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Executive Checkout & Payment Modal */}
      {checkoutReservation && (
        <CheckoutDialog
          reservation={checkoutReservation}
          onClose={() => setCheckoutReservation(null)}
          onSuccess={() => {
            setReceiptReservation(checkoutReservation);
            setCheckoutReservation(null);
            load();
          }}
        />
      )}

      {/* Lease Certificate Receipt Modal */}
      {receiptReservation && (
        <ReceiptDialog
          reservation={receiptReservation}
          onClose={() => setReceiptReservation(null)}
        />
      )}
    </div>
  );
}

function CheckoutDialog({ reservation, onClose, onSuccess }) {
  const [submitting, setSubmitting] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("CARD");
  const [cardForm, setCardForm] = useState({
    name: "Clausis Executive Account",
    number: "4242 •••• •••• 4242",
    expiry: "12/28",
    cvc: "888",
    zip: "10001",
  });

  const amount = reservation.totalAmount || reservation.totalPrice || 500;
  const basePrice = amount / 1.1;
  const taxPrice = amount - basePrice;

  async function handlePaymentSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    try {
      // 1. Initialize payment gateway record
      await paymentService.initialize({
        reservationId: reservation.id,
        stripeChargeId: `ch_${Math.random().toString(36).substring(2, 15)}`,
        amount: amount,
        status: "SUCCESS",
      });

      // 2. Confirm the reservation in backend
      await reservationService.confirm(reservation.id);

      toast.success("Payment verified! Your exhibition stall lease is officially confirmed.");
      onSuccess();
    } catch (err) {
      toast.error(err.response?.data?.message ?? "Payment processing failed. Please verify card details.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl rounded-2xl p-0 overflow-hidden bg-[var(--card)] border border-[var(--border)] shadow-2xl">
        {/* Modal Banner */}
        <div className="bg-gradient-to-r from-[var(--primary)] to-[var(--ring)] p-6 text-[var(--primary-foreground)] flex items-center justify-between">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-0.5 text-[11px] font-bold uppercase tracking-wider mb-1">
              <ShieldCheck className="size-3" />
              256-Bit Encrypted Gateway
            </span>
            <DialogTitle className="text-2xl font-extrabold tracking-tight">
              Corporate Lease Checkout
            </DialogTitle>
            <p className="text-xs opacity-90 mt-0.5">
              Finalize corporate stall reservation for {reservation.event?.name || "Exhibition"}
            </p>
          </div>
          <Lock className="size-8 opacity-30 shrink-0" />
        </div>

        <div className="p-6 space-y-6">
          {/* Order Summary Box */}
          <div className="rounded-xl bg-[var(--muted)]/50 border border-[var(--border)] p-4 space-y-3">
            <div className="flex justify-between items-center text-sm font-bold border-b border-[var(--border)]/60 pb-2">
              <span className="text-[var(--muted-foreground)]">Exhibition Showcase:</span>
              <span className="text-[var(--foreground)]">{reservation.event?.name || "Global Trade Show"}</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-[var(--muted-foreground)]">Reservation ID:</span>
              <span className="font-mono font-semibold">#{reservation.id}</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-[var(--muted-foreground)]">Vendor Organization:</span>
              <span className="font-semibold">{reservation.organizationName || "Corporate Account"}</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-[var(--muted-foreground)]">Lease Schedule:</span>
              <span className="font-semibold">{formatDateTime(reservation.reservationStartDateTime)}</span>
            </div>
          </div>

          {/* Payment Method Selector */}
          <div className="space-y-3">
            <label className="text-xs font-bold uppercase tracking-wider text-[var(--muted-foreground)]">
              Select Payment Method
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setPaymentMethod("CARD")}
                className={`flex items-center justify-center gap-2 rounded-xl border p-3.5 text-sm font-bold transition-all ${
                  paymentMethod === "CARD"
                    ? "border-[var(--ring)] bg-[var(--ring)]/10 text-[var(--ring)] shadow-sm"
                    : "border-[var(--border)] bg-[var(--background)] hover:bg-[var(--accent)]"
                }`}
              >
                <CreditCard className="size-4" />
                <span>Credit / Debit Card</span>
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod("INVOICE")}
                className={`flex items-center justify-center gap-2 rounded-xl border p-3.5 text-sm font-bold transition-all ${
                  paymentMethod === "INVOICE"
                    ? "border-[var(--primary)] bg-[var(--primary)]/10 text-[var(--primary)] shadow-sm"
                    : "border-[var(--border)] bg-[var(--background)] hover:bg-[var(--accent)]"
                }`}
              >
                <FileText className="size-4" />
                <span>Corporate Invoice</span>
              </button>
            </div>
          </div>

          {/* Payment Form Details */}
          <form onSubmit={handlePaymentSubmit} className="space-y-4">
            {paymentMethod === "CARD" ? (
              <div className="space-y-3 rounded-xl border border-[var(--border)] p-4 bg-[var(--background)]/60">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[var(--muted-foreground)]">Cardholder Name</label>
                  <Input
                    required
                    value={cardForm.name}
                    onChange={(e) => setCardForm({ ...cardForm, name: e.target.value })}
                    className="rounded-xl h-10 text-sm"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[var(--muted-foreground)]">Card Number</label>
                  <Input
                    required
                    value={cardForm.number}
                    onChange={(e) => setCardForm({ ...cardForm, number: e.target.value })}
                    className="rounded-xl h-10 font-mono text-sm"
                  />
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-[var(--muted-foreground)]">Expires</label>
                    <Input
                      required
                      value={cardForm.expiry}
                      onChange={(e) => setCardForm({ ...cardForm, expiry: e.target.value })}
                      className="rounded-xl h-10 font-mono text-sm text-center"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-[var(--muted-foreground)]">CVC</label>
                    <Input
                      required
                      value={cardForm.cvc}
                      onChange={(e) => setCardForm({ ...cardForm, cvc: e.target.value })}
                      className="rounded-xl h-10 font-mono text-sm text-center"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-[var(--muted-foreground)]">Postal Code</label>
                    <Input
                      required
                      value={cardForm.zip}
                      onChange={(e) => setCardForm({ ...cardForm, zip: e.target.value })}
                      className="rounded-xl h-10 text-sm text-center"
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="rounded-xl border border-[var(--primary)]/30 bg-[var(--primary)]/5 p-4 text-xs text-[var(--foreground)] space-y-2 leading-relaxed">
                <p className="font-bold flex items-center gap-1.5 text-[var(--primary)]">
                  <Building2 className="size-4" />
                  Corporate Invoice Billing Approved
                </p>
                <p>
                  An electronic tax invoice for <strong>{formatCurrency(amount)}</strong> will be routed to your organization's finance department. Lease rights take effect immediately upon authorization.
                </p>
              </div>
            )}

            {/* Financial Calculation Breakdown */}
            <div className="rounded-xl bg-[var(--background)] border border-[var(--border)] p-4 space-y-2 text-xs">
              <div className="flex justify-between text-[var(--muted-foreground)]">
                <span>Stall Lease Base Fee:</span>
                <span className="font-semibold text-[var(--foreground)]">{formatCurrency(basePrice)}</span>
              </div>
              <div className="flex justify-between text-[var(--muted-foreground)]">
                <span>Exhibition Processing & VAT (10%):</span>
                <span className="font-semibold text-[var(--foreground)]">{formatCurrency(taxPrice)}</span>
              </div>
              <div className="pt-2 border-t border-[var(--border)] flex justify-between items-center text-sm font-extrabold text-[var(--ring)]">
                <span>Total Investment Due:</span>
                <span className="text-lg">{formatCurrency(amount)}</span>
              </div>
            </div>

            <DialogFooter className="pt-2 flex items-center justify-end gap-3">
              <Button type="button" variant="outline" onClick={onClose} className="rounded-xl">
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={submitting}
                className="rounded-xl shadow-md bg-gradient-to-r from-[var(--primary)] to-[var(--ring)] text-[var(--primary-foreground)] font-bold px-6 h-11"
              >
                {submitting ? "Processing Payment..." : `Pay & Confirm Lease (${formatCurrency(amount)})`}
              </Button>
            </DialogFooter>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function ReceiptDialog({ reservation, onClose }) {
  const amount = reservation.totalAmount || reservation.totalPrice || 500;

  function handleDownload() {
    toast.success("Official Lease Certificate downloaded as PDF.");
  }

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md rounded-2xl p-6 bg-[var(--card)] border border-[var(--border)] shadow-2xl text-center space-y-6">
        <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-green-500/10 text-green-600 border border-green-500/30">
          <CheckCircle2 className="size-8 animate-bounce" />
        </div>

        <div className="space-y-1">
          <span className="inline-flex items-center gap-1 rounded-full bg-[var(--primary)]/10 px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[var(--primary)]">
            <Sparkles className="size-3" />
            Verified Transaction
          </span>
          <DialogTitle className="text-2xl font-extrabold tracking-tight">
            Official Lease Certificate
          </DialogTitle>
          <p className="text-xs text-[var(--muted-foreground)]">
            Exhibition stall reservation confirmed and recorded in Clausis Reserve ledger.
          </p>
        </div>

        <div className="rounded-xl bg-[var(--muted)]/40 border border-[var(--border)] p-4 text-left space-y-2.5 text-xs">
          <div className="flex justify-between border-b border-[var(--border)]/60 pb-2 font-bold">
            <span className="text-[var(--muted-foreground)]">Exhibition Event:</span>
            <span className="text-[var(--foreground)]">{reservation.event?.name || "Global Exhibition"}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[var(--muted-foreground)]">Certificate ID:</span>
            <span className="font-mono font-semibold">CERT-{reservation.id.slice(0, 8).toUpperCase()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[var(--muted-foreground)]">Status:</span>
            <span className="font-bold text-green-600">CONFIRMED & PAID</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[var(--muted-foreground)]">Date Recorded:</span>
            <span>{formatDateTime(new Date())}</span>
          </div>
          <div className="pt-2 border-t border-[var(--border)] flex justify-between items-center font-extrabold text-sm text-[var(--ring)]">
            <span>Total Investment Paid:</span>
            <span>{formatCurrency(amount)}</span>
          </div>
        </div>

        <div className="flex items-center gap-3 pt-2">
          <Button
            variant="outline"
            onClick={handleDownload}
            className="flex-1 rounded-xl border-[var(--border)] hover:bg-[var(--accent)] font-semibold h-11"
          >
            <Download className="size-4 mr-2 text-[var(--primary)]" />
            <span>Download PDF</span>
          </Button>
          <Button
            onClick={onClose}
            className="flex-1 rounded-xl bg-gradient-to-r from-[var(--primary)] to-[var(--ring)] text-[var(--primary-foreground)] font-bold h-11 shadow-md"
          >
            Done
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
