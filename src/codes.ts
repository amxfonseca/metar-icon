export const enum Intensity {
  Minus = "-" /* Light */,
  Plus = "+" /* Heavy */,
  Blank = "" /* Moderate */,
  VC = "VC" /* In the vicinity */,
}

export const enum Descriptor {
  MI = "MI" /* Shallow (French: Mince) */,
  PR = "PR" /* Partial */,
  BC = "BC" /* Patches (French: Bancs) */,
  DR = "DR" /* Low drifting */,
  BL = "BL" /* Blowing */,
  SH = "SH" /* Showers */,
  TS = "TS" /* Thunderstorm */,
  FZ = "FZ" /* Freezing */,
}

export const enum Precipitation {
  RA = "RA" /* Rain */,
  DZ = "DZ" /* Drizzle */,
  SN = "SN" /* Snow */,
  SG = "SG" /* Snow Grains */,
  IC = "IC" /* Ice Crystals */,
  PL = "PL" /* Ice Pellets */,
  GR = "GR" /* Hail (French: Grêle) */,
  GS = "GS" /* Snow Pellets (French: Grésil) */,
  UP = "UP" /* Unknown Precipitation */,
}

export const enum Obscuration {
  FG = "FG" /* Fog */,
  VA = "VA" /* Volcanic Ash */,
  BR = "BR" /* Mist (French: Brume) */,
  HZ = "HZ" /* Haze */,
  DU = "DU" /* Widespread Dust */,
  FU = "FU" /* Smoke (French: Fumée) */,
  SA = "SA" /* Sand */,
  PY = "PY" /* Spray */,
}

export const enum Other {
  SQ = "SQ" /* Squall */,
  PO = "PO" /* Dust (French: Poussière) */,
  DS = "DS" /* Duststorm */,
  SS = "SS" /* Sandstorm */,
  FC = "FC" /* Funnel Cloud */,
}
