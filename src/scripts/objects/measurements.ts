/** A record mapping a scale factor to a measurement name. For example, grams would contain a ScaledMeasurement of 1000: "kilogram" */
type ScaledMeasurement = Record<number, MeasurementName>;

type MeasurementInformation = {
    plural: string;
    abbreviation?: string;
    /** Omit abbreviationPlural if it is the same as abbreviation. */
    abbreviationPlural?: string;
    scaledEquivalents?: ScaledMeasurement;
};

/** Note: Measurements are not the same as units. A unit can be a measurement like the ones here, or a word like "clove" or "stalk." */
type MeasurementName = "cup" | "teaspoon" | "tablespoon" | "fluid ounce" | "gram" | "kilogram" | "ounce" | "pound";

const measurements: Record<MeasurementName, MeasurementInformation> = {
    cup: {
        plural: "cups"
    },
    "fluid ounce": {
        plural: "fluid ounces",
        abbreviation: "fl oz",
        scaledEquivalents: {
            [1 / 8]: "cup",
            6: "teaspoon"
        }
    },
    teaspoon: {
        plural: "teaspoons",
        abbreviation: "tsp",
        scaledEquivalents: {
            3: "tablespoon"
        }
    },
    tablespoon: {
        plural: "tablespoons",
        abbreviation: "tbsp",
        scaledEquivalents: {
            [1 / 3]: "teaspoon"
        }
    },
    gram: {
        plural: "grams",
        abbreviation: "g",
        scaledEquivalents: {
            1000: "kilogram"
        }
    },
    kilogram: {
        plural: "kilograms",
        abbreviation: "kg",
        scaledEquivalents: {
            [1 / 1000]: "gram"
        }
    },
    ounce: {
        plural: "ounces",
        abbreviation: "oz",
        scaledEquivalents: {
            16: "pound"
        }
    },
    pound: {
        plural: "pounds",
        abbreviation: "lb",
        abbreviationPlural: "lbs",
        scaledEquivalents: {
            [1 / 16]: "ounce"
        }
    }
};

/**
 * @returns The corresponding (singular) MeasurementName, or false.
 */
export function unitIsAbbreviatedMeasurement(unit: string): MeasurementName | false {
    for (const [measurementName, measurementInformation] of Object.entries(measurements) as [
        MeasurementName,
        MeasurementInformation
    ][]) {
        if (unit === measurementInformation.abbreviation) {
            return measurementName;
        }
    }
    return false;
}

/**
 * @returns The MeasurementName, or false.
 */
export function unitIsPureMeasurement(unit: string): MeasurementName | false {
    if (Object.hasOwn(measurements, unit)) {
        return unit as MeasurementName;
    }
    return false;
}

export function unitIsMeasurement(unit: string): MeasurementName | false {
    return unitIsPureMeasurement(unit) || unitIsAbbreviatedMeasurement(unit);
}

export function abbreviateUnit(unit: string): string {
    const unitAsPureMeasurement = unitIsPureMeasurement(unit);
    return (
        (unitIsAbbreviatedMeasurement(unit) ? unit : false) ||
        (unitAsPureMeasurement ? measurements[unitAsPureMeasurement].abbreviation : false) ||
        unit
    );
}

export function pluralizeUnit(unit: string, quantity: number) {
    if (quantity === 1) {
        return unit;
    }
    if (Object.hasOwn(measurements, unit)) {
        return measurements[unit as MeasurementName].plural;
    }
}
