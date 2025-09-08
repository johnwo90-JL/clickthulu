// Number scale utilities for formatting values for the client

/** @type {string[]} */
export const NUMBER_SCALES = [
  "<k",
  "k",
  "m",
  "b",
  "t",
  "qa",
  "qi",
  "sx",
  "st",
  "oc",
  "no",
  "dec",
  "udc",
  "ddc",
  "tdc",
  "qdc",
  "qnc",
  "sxd",
  "spd",
  "ocd",
  "nod",
];

function getScaleIndex(value) {
  const abs = Math.abs(Number(value || 0));
  if (abs < 1_000) return 0; // <k
  // each step is 10^3
  const exp = Math.floor(Math.log10(abs));
  const steps = Math.min(NUMBER_SCALES.length - 1, Math.floor(exp / 3) + 1);
  return steps;
}

export function formatNumberForScale(value) {
  const idx = getScaleIndex(value);
  if (idx === 0) return { value: Number(value || 0), scale: NUMBER_SCALES[0] };
  const divisor = 10 ** (3 * (idx - 1));
  const v = Number(value || 0) / divisor / 1_000; // normalize to the selected scale step
  return { value: v, scale: NUMBER_SCALES[idx] };
}

export function formatStatValue({
  value = 0,
  prSecond = 0,
  increment = false,
}) {
  const base = formatNumberForScale(value);
  return { value: base.value, scale: base.scale, prSecond, increment };
}

export function perSecondForField(stats, field) {
  switch (field) {
    case "xp":
      return Number(stats?.xpPerSecond || 0);
    case "totalDevotion":
      return Number(stats?.devotionPerSecond || 0);
    case "totalClicks":
      // Optional future support for auto-clickers
      return Number(stats?.clicksPerSecond || 0);
    default:
      return 0;
  }
}
