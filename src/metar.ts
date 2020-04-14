import type Icon from "./icons";
import type {
  Intensity,
  Descriptor,
  Precipitation,
  Obscuration,
  Other,
} from "./codes";

export type Weather = Partial<{
  intensity: Intensity;
  descriptor: Descriptor;
  precipitation: Precipitation;
  obscuration: Obscuration;
  other: Other;
}>;

export type Parser = (cw: Weather) => Icon | null;

export type Operator<T> = (
  targetValue: T | T[],
  ...parsers: Parser[]
) => Parser;

export type IconOperator = (
  icon: Icon,
  ...parsers: Parser[]
) => (cw: Weather) => Icon;

const findFirstMatchingParser = (
  cw: Weather,
  parsers: Parser[]
): Icon | null => {
  for (let parser of parsers) {
    const result = parser(cw);
    if (result !== null) return result;
  }

  return null;
};

const runOperator: <T>(
  weather: Weather,
  current: T,
  target: T | T[],
  parsers: Parser[]
) => Icon | null = (weather, current, target, parsers) => {
  const isMatch = Array.isArray(target)
    ? target.indexOf(current) >= 0
    : current === target;

  return isMatch ? findFirstMatchingParser(weather, parsers) : null;
};

const withIntensity: Operator<Intensity> = (val, ...parsers) => (cw) =>
  runOperator(cw, cw.intensity, val, parsers);

const withDescriptor: Operator<Descriptor> = (val, ...parsers) => (cw) =>
  runOperator(cw, cw.descriptor, val, parsers);

const withPrecipitation: Operator<Precipitation> = (val, ...parsers) => (cw) =>
  runOperator(cw, cw.precipitation, val, parsers);

const withObscuration: Operator<Obscuration> = (val, ...parsers) => (cw) =>
  runOperator(cw, cw.obscuration, val, parsers);

const withOther: Operator<Other> = (val, ...parsers) => (cw) =>
  runOperator(cw, cw.other, val, parsers);

const withIcon: IconOperator = (icon, ...parsers) => (cw) =>
  findFirstMatchingParser(cw, parsers) ?? icon;

export {
  withIntensity,
  withDescriptor,
  withPrecipitation,
  withObscuration,
  withOther,
  withIcon,
};
