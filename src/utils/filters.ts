interface FilterValue {
  isNegated: boolean;
  value: string;
}

export function parseFilterValue(input: string): FilterValue {
  const NEGATION_PREFIX = '!';
  const isNegated = input.startsWith(NEGATION_PREFIX);
  const value = isNegated ? input.substring(1) : input;

  return { isNegated, value };
}

export function parseFilterValues(inputs: string[]): FilterValue[] {
  return inputs.map((input: string) => parseFilterValue(input));
}

export function buildStringFilter(values: string[]): Record<string, unknown> | undefined {
  if (values.length === 0) {
    return undefined;
  }

  const parsedValues = parseFilterValues(values);
  const positiveValues = parsedValues
    .filter((item: FilterValue) => !item.isNegated)
    .map((item: FilterValue) => item.value);
  const negativeValues = parsedValues
    .filter((item: FilterValue) => item.isNegated)
    .map((item: FilterValue) => item.value);

  if (positiveValues.length > 0 && negativeValues.length > 0) {
    return {
      and: [
        { in: positiveValues },
        { nin: negativeValues }
      ]
    };
  }

  if (positiveValues.length > 0) {
    return positiveValues.length === 1
      ? { eq: positiveValues[0] }
      : { in: positiveValues };
  }

  if (negativeValues.length > 0) {
    return negativeValues.length === 1
      ? { neq: negativeValues[0] }
      : { nin: negativeValues };
  }

  return undefined;
}
