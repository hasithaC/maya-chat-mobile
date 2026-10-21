import type { CallSessionStatus } from "../../domain/calls/store/call.store";

const STATUS_LABEL: Record<Exclude<CallSessionStatus, "connected">, string> = {
  ringing: "Incoming Voice Call ...",
  dialing: "Dialing ...",
  connecting: "Connecting ...",
  reconnecting: "Reconnecting ...",
};

// The subtitle under the peer's name: the live timer once connected,
// otherwise what the call is waiting on.
export function getCallStatusLabel(
  status: CallSessionStatus,
  duration: string | null,
): string {
  if (status === "connected") return duration ?? "00:00:00";
  return STATUS_LABEL[status];
}
