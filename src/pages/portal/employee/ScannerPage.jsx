import { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { reservationService } from "@/services/reservationService";
import { parseReservationId } from "@/utils/qr";
import { toast } from "@/components/feedback/Toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { QrCode, Camera, Keyboard, ShieldCheck, CheckCircle2, AlertCircle, Sparkles, RefreshCw, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const SCANNER_ELEMENT_ID = "qr-scanner-region";

export default function ScannerPage() {
  const scannerRef = useRef(null);
  const [mode, setMode] = useState("CAMERA"); // "CAMERA" | "MANUAL"
  const [scanning, setScanning] = useState(false);
  const [cameraError, setCameraError] = useState(false);
  const [manualInput, setManualInput] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [lastResult, setLastResult] = useState(null);

  useEffect(() => {
    if (mode !== "CAMERA") {
      stopCamera();
      return;
    }

    setCameraError(false);
    const scanner = new Html5Qrcode(SCANNER_ELEMENT_ID);
    scannerRef.current = scanner;

    scanner
      .start(
        { facingMode: "environment" },
        { fps: 10, qrbox: 250 },
        handleScanSuccess,
        () => {} // ignore per-frame scan failures
      )
      .then(() => setScanning(true))
      .catch(() => {
        setCameraError(true);
        setScanning(false);
      });

    return () => {
      stopCamera();
    };
  }, [mode]);

  function stopCamera() {
    if (scannerRef.current?.isScanning) {
      scannerRef.current.stop().catch(() => {});
    }
  }

  async function handleScanSuccess(decodedText) {
    if (!scannerRef.current?.isScanning) return;
    await scannerRef.current.pause(true);

    try {
      const reservationId = parseReservationId(decodedText);
      await reservationService.confirm(reservationId);
      setLastResult({
        ok: true,
        id: reservationId,
        message: `Ticket #${reservationId} verified & attendee checked in!`,
        timestamp: new Date().toLocaleTimeString(),
      });
      toast.success("Check-in verification successful.");
    } catch (err) {
      setLastResult({
        ok: false,
        message: err.response?.data?.message ?? err.message ?? "Invalid QR ticket.",
        timestamp: new Date().toLocaleTimeString(),
      });
      toast.error("Check-in verification failed.");
    }

    setTimeout(() => scannerRef.current?.resume(), 2000);
  }

  async function handleManualSubmit(e) {
    e.preventDefault();
    if (!manualInput.trim()) return;
    setVerifying(true);
    setLastResult(null);

    try {
      const reservationId = parseReservationId(manualInput.trim());
      await reservationService.confirm(reservationId);
      setLastResult({
        ok: true,
        id: reservationId,
        message: `Ticket #${reservationId} manually verified & attendee checked in!`,
        timestamp: new Date().toLocaleTimeString(),
      });
      toast.success("Manual check-in verification successful.");
      setManualInput("");
    } catch (err) {
      setLastResult({
        ok: false,
        message: err.response?.data?.message ?? err.message ?? "Invalid reservation ID.",
        timestamp: new Date().toLocaleTimeString(),
      });
      toast.error("Manual verification failed.");
    } finally {
      setVerifying(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)]/80 backdrop-blur-md p-6 shadow-md">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 size-48 rounded-full bg-gradient-to-br from-[var(--primary)]/10 to-[var(--ring)]/10 blur-2xl pointer-events-none" />
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--primary)]/10 border border-[var(--primary)]/30 px-3 py-0.5 text-xs font-bold text-[var(--primary)] uppercase tracking-wider">
                <ShieldCheck className="size-3" />
                Security & Access Control
              </span>
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight">Gate QR Scanner & Verification</h1>
            <p className="text-xs text-[var(--muted-foreground)]">
              Validate attendee ticket passes at exhibition entry points in real-time.
            </p>
          </div>

          <Button asChild variant="outline" size="sm" className="rounded-xl border-[var(--border)] bg-[var(--background)] shadow-sm shrink-0">
            <Link to="/portal/employee/check-ins" className="flex items-center gap-1.5">
              <span>Check-in Log</span>
              <ArrowRight className="size-3.5" />
            </Link>
          </Button>
        </div>
      </div>

      {/* Mode Switcher Tabs */}
      <div className="grid grid-cols-2 gap-3 p-1.5 rounded-2xl bg-[var(--muted)]/50 border border-[var(--border)]">
        <button
          type="button"
          onClick={() => setMode("CAMERA")}
          className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl font-bold text-xs transition-all ${
            mode === "CAMERA"
              ? "bg-[var(--card)] text-[var(--primary)] shadow-md border border-[var(--border)]"
              : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
          }`}
        >
          <Camera className="size-4" />
          <span>Live Camera Scanner</span>
        </button>

        <button
          type="button"
          onClick={() => setMode("MANUAL")}
          className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl font-bold text-xs transition-all ${
            mode === "MANUAL"
              ? "bg-[var(--card)] text-[var(--primary)] shadow-md border border-[var(--border)]"
              : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
          }`}
        >
          <Keyboard className="size-4" />
          <span>Manual Simulator Box</span>
        </button>
      </div>

      {/* Camera Mode Box */}
      {mode === "CAMERA" && (
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)]/80 backdrop-blur-md p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between text-xs font-bold text-[var(--muted-foreground)] uppercase tracking-wider border-b border-[var(--border)] pb-3">
            <span className="flex items-center gap-1.5">
              <Camera className="size-4 text-[var(--primary)]" />
              <span>Optical QR Reader</span>
            </span>
            {scanning && <span className="text-green-500 animate-pulse flex items-center gap-1">● Active Lens</span>}
          </div>

          <div className="relative mx-auto max-w-sm rounded-2xl overflow-hidden border-2 border-[var(--primary)]/30 bg-black/90 shadow-inner aspect-square flex items-center justify-center">
            <div id={SCANNER_ELEMENT_ID} className="w-full h-full" />
            {cameraError && (
              <div className="absolute inset-0 p-6 flex flex-col items-center justify-center text-center space-y-3 bg-[var(--card)]/95">
                <AlertCircle className="size-10 text-destructive opacity-80" />
                <p className="text-sm font-bold text-[var(--foreground)]">Camera Access Unavailable</p>
                <p className="text-xs text-[var(--muted-foreground)]">
                  Please enable camera permissions or switch to the Manual Simulator Box to verify tickets on desktop.
                </p>
                <Button size="sm" onClick={() => setMode("MANUAL")} className="rounded-xl shadow-sm mt-2">
                  Switch to Manual Box
                </Button>
              </div>
            )}
            {!scanning && !cameraError && (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center space-y-2 bg-[var(--card)]/80">
                <RefreshCw className="size-8 text-[var(--primary)] animate-spin" />
                <p className="text-xs font-bold text-[var(--muted-foreground)]">Initializing camera sensor...</p>
              </div>
            )}
          </div>

          <p className="text-[11px] text-center text-[var(--muted-foreground)]">
            Position the attendee's mobile screen or printed QR pass within the scanning viewfinder.
          </p>
        </div>
      )}

      {/* Manual Simulator Box */}
      {mode === "MANUAL" && (
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)]/80 backdrop-blur-md p-6 shadow-sm space-y-5">
          <div className="space-y-1 border-b border-[var(--border)] pb-3">
            <h3 className="font-bold text-base flex items-center gap-2">
              <Keyboard className="size-4 text-[var(--primary)]" />
              <span>Desktop / Manual Ticket Simulator</span>
            </h3>
            <p className="text-xs text-[var(--muted-foreground)]">
              Perfect for laptop testing or when hardware scanner lenses cannot focus on printed badges.
            </p>
          </div>

          <form onSubmit={handleManualSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[var(--muted-foreground)] uppercase tracking-wider">
                Reservation ID or Token Payload *
              </label>
              <div className="flex gap-2">
                <Input
                  required
                  value={manualInput}
                  onChange={(e) => setManualInput(e.target.value)}
                  placeholder="e.g. 101 or RES-101 or QR Token payload..."
                  className="glass-input rounded-xl text-sm font-mono h-11"
                />
                <Button
                  type="submit"
                  disabled={verifying || !manualInput.trim()}
                  className="rounded-xl shadow-md h-11 px-6 font-bold bg-gradient-to-r from-[var(--primary)] to-[var(--ring)] text-[var(--primary-foreground)] shrink-0"
                >
                  {verifying ? "Verifying..." : "Verify Pass"}
                </Button>
              </div>
            </div>
          </form>

          <div className="rounded-xl bg-[var(--muted)]/40 p-4 border border-[var(--border)]/60 space-y-2 text-xs text-[var(--muted-foreground)]">
            <p className="font-bold text-[var(--foreground)]">💡 Simulator Tips:</p>
            <ul className="list-disc pl-4 space-y-1">
              <li>Enter any numeric ID (e.g., <code className="bg-[var(--background)] px-1.5 py-0.5 rounded border">101</code>) to instantly trigger a confirmation check.</li>
              <li>You can paste the raw token string generated after a customer pays for their reservation.</li>
            </ul>
          </div>
        </div>
      )}

      {/* Verification Result Card */}
      {lastResult && (
        <div
          className={`rounded-2xl border p-5 shadow-lg transition-all animate-in fade-in slide-in-from-bottom-3 duration-300 ${
            lastResult.ok
              ? "border-green-500/40 bg-green-500/10 text-green-700 dark:text-green-400"
              : "border-destructive/40 bg-destructive/10 text-destructive"
          }`}
        >
          <div className="flex items-start gap-3">
            <div className={`p-2 rounded-xl shrink-0 ${lastResult.ok ? "bg-green-500/20" : "bg-destructive/20"}`}>
              {lastResult.ok ? <CheckCircle2 className="size-6 text-green-600 dark:text-green-400" /> : <AlertCircle className="size-6 text-destructive" />}
            </div>
            <div className="space-y-1 flex-1">
              <div className="flex items-center justify-between">
                <h4 className="font-extrabold text-base tracking-tight">
                  {lastResult.ok ? "ACCESS GRANTED" : "ACCESS DENIED"}
                </h4>
                <span className="text-[10px] font-mono opacity-80">{lastResult.timestamp}</span>
              </div>
              <p className="text-xs font-semibold leading-relaxed">{lastResult.message}</p>
              {lastResult.ok && (
                <div className="pt-2 mt-2 border-t border-green-500/20 text-[11px] font-medium opacity-90">
                  ✔ Attendee identity verified · Gate entry logged
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
