# Simple METAR weather icon matcher 

Just a small code example that allow us to define a list of rules that map a weather state to a weather icon.

## Operators

The operators are simple composable functions that we chain together to obtain a parser. A parser is just a function that maps a weather state to a possible icon 

```
type Parser = (cw: Weather) => Icon | null
```

We have the following operators `withIntensity`, `withDescriptor`, `withPrecipitation`, `withObscuration`, `withOther` and `withIcon`. All of them work in a similar fashion. They take either a single list of values as the first argument, and a variable list of arguments of type parser. They always return a parser.

```
operator<T>(T | T[], ...parsers: Parser[]) => Parser
```

There is one exception to this rule, the `withIcon` operator. This specific operator takes a single icon as a first argument and the return value is always of type `Icon` (it can't be *null*, unlike the other parsers). We are going to understand why later in the examples.


### How do they work

The first argument if each operator is the value (or list of values) that we want to match on. If there's a match then the operator will run it's parsers (which are basically other operators) and return the first one that matches, otherwise it will immediately return *null*. The same is true for the `withIcon` operator, the only difference is that this operator matches any value and it always return an icon.

### Examples

```
const parser = withIcon(Icon.A)
```

This is the simplest of parsers. It will always return an icon **A**, independently of the current weather state.

```
const parser = withOther(
  Other.FC,
  withIntensity([Intensity.VC, Intensity.Plus], withIcon(Icon.B)),
  withIcon(Icon.C)
);
```

This one adds a bit more logic. One of the first things that we may notice is that this parser may return null depending on the weather state. This parser will return the icon **B** for a tornado when the intensity is either "+" or it is located on the vicinity (**+FC** and **VCFC**). For all the remaining tornado cases it will return the icon **C** instead.

```
const parser = withIcon(
  Icon.A,
  withOther(
    Other.FC,
    withIntensity([Intensity.VC, Intensity.Plus], withIcon(Icon.B)),
    withIcon(Icon.C)
  ),
  withPrecipitation(
    Precipitation.RA,
    withObscuration(
      Obscuration.HZ,
      withIntensity(Intensity.Plus, withIcon(Icon.D))
    ),
    withIcon(Icon.E)
  )
);

```

Here we have a more complete parser. This one combines the previous examples and adds a few extra rules. The behavior is the same for tornados, but this time we add some new rules for rain. For all kinds of rain we return the icon **E**, except in the cases when the rain comes with intense haze (**+RAHZ**), where the icon in this case will be **D** instead. For all the other cases the icon **A** will be returned, this shows how the `withIcon` operator can be used a tool to set a default value when used in higher levels of the rule tree.


### Conclusions

We can take the following conclusions. The priority of the rules is based on their position on the decision tree. The priority goes as follows, left to right and deeper to shallow.


#### Left to right

Take this example

```
const parser = withDescriptor(
  Descriptor.BC,
  withIntensity(Intensity.Plus, withIcon(Icon.A)),
  withPrecipitation(Precipitation.RA, withIcon(Icon.B))
);
```

In this sittuation a weather of type **+BCRA** will return the icon **A** even though it matches both rules. In this cases the first rule to match always wins.

#### Deep to Shallow

```

const parser = withIcon(
  Icon.C,
  withDescriptor(
    Descriptor.SH,
    withIntensity(Intensity.Minus, withIcon(Icon.A)),
    withIcon(Icon.B)
  )
);
```

As we previously seen, even though the weather state **-SH** would match both icons **A**, **B** and **C**, in this case the returned icon would be **A** since it's deeper in the tree.


#### Remarks

We can add a couple of interesting remarks for some situations

```
withIcon(Icon.A, withIcon(Icon.B), withIcon(Icon.C))
```
This parser will always return **C** because the deeper rule always wins. Nested operators that match the same as the parent operator are redundant (and have priority)

```
const parser1 = withDescriptor(
  Descriptor.BC,
  withPrecipitation(Precipitation.RA, withIcon(Icon.A)),
  withIcon(Icon.B)
);

const parser2 = withDescriptor(
  Descriptor.BC,
  withIcon(Icon.B, withPrecipitation(Precipitation.RA, withIcon(Icon.A)))
);
```
Both parsers here produce identical results. In this case we are changing between a *left to right* to a *deep to shallow* priority. Keep in mind that this equivalence may change depending on the adjacent rules

## Weather state

In all the above examples we describe how a parser always takes the current weather state to derive an icon.

How does that state looks like? Well, like this

```
type Weather = Partial<{
  intensity: Intensity;
  descriptor: Descriptor;
  precipitation: Precipitation;
  obscuration: Obscuration;
  other: Other;
}>;
```

where the properties can be of type

```
enum Intensity {
  Minus = "-" /* Light */,
  Plus = "+" /* Heavy */,
  Blank = "" /* Moderate */,
  VC = "VC" /* In the vicinity */,
}

enum Descriptor {
  MI = "MI" /* Shallow (French: Mince) */,
  PR = "PR" /* Partial */,
  BC = "BC" /* Patches (French: Bancs) */,
  DR = "DR" /* Low drifting */,
  BL = "BL" /* Blowing */,
  SH = "SH" /* Showers */,
  TS = "TS" /* Thunderstorm */,
  FZ = "FZ" /* Freezing */,
}

enum Precipitation {
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

enum Obscuration {
  FG = "FG" /* Fog */,
  VA = "VA" /* Volcanic Ash */,
  BR = "BR" /* Mist (French: Brume) */,
  HZ = "HZ" /* Haze */,
  DU = "DU" /* Widespread Dust */,
  FU = "FU" /* Smoke (French: Fumée) */,
  SA = "SA" /* Sand */,
  PY = "PY" /* Spray */,
}

enum Other {
  SQ = "SQ" /* Squall */,
  PO = "PO" /* Dust (French: Poussière) */,
  DS = "DS" /* Duststorm */,
  SS = "SS" /* Sandstorm */,
  FC = "FC" /* Funnel Cloud */,
}
```
								
