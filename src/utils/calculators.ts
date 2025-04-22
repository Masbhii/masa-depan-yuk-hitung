
/**
 * Utility functions for financial calculations in BerapaNanti app
 */

/**
 * Historical annual inflation rates for Indonesia (in percentages)
 * Data example from 2010-2024, you can replace with actual historical data
 */
export const INFLATION_RATES: Record<number, number> = {
  2010: 5.13,
  2011: 5.38,
  2012: 4.28,
  2013: 6.97,
  2014: 6.42,
  2015: 6.38,
  2016: 3.53,
  2017: 3.81,
  2018: 3.20,
  2019: 2.72,
  2020: 1.68,
  2021: 1.87,
  2022: 5.47,
  2023: 3.35,
  2024: 2.84, // Current year estimation
};

/**
 * Default inflation rate scenarios for projections
 */
export const INFLATION_SCENARIOS = {
  LOW: 2.5,
  MEDIUM: 4.0,
  HIGH: 6.0,
};

/**
 * Get the current inflation rate (latest available year)
 */
export function getCurrentInflationRate(): number {
  const currentYear = new Date().getFullYear();
  return INFLATION_RATES[currentYear] || INFLATION_RATES[Object.keys(INFLATION_RATES).map(Number).sort().pop() || 0];
}

/**
 * Calculate future value with compound inflation
 * @param presentValue Current price/value
 * @param years Number of years in the future
 * @param inflationRate Annual inflation rate (in percentage)
 * @returns Estimated future value
 */
export function calculateFutureValue(
  presentValue: number, 
  years: number, 
  inflationRate: number
): number {
  // Convert percentage to decimal
  const rate = inflationRate / 100;
  
  // Future value = Present Value * (1 + inflation rate)^years
  return presentValue * Math.pow(1 + rate, years);
}

/**
 * Calculate historical value adjusted for inflation
 * @param historicalValue Original value
 * @param fromYear Starting year
 * @param toYear Target year (defaults to current year)
 * @returns Inflation-adjusted value
 */
export function calculateInflationAdjustedValue(
  historicalValue: number,
  fromYear: number,
  toYear: number = new Date().getFullYear()
): number {
  let adjustedValue = historicalValue;
  
  // Get the years between fromYear and toYear in ascending order
  const years = Object.keys(INFLATION_RATES)
    .map(Number)
    .filter(year => year >= fromYear && year < toYear)
    .sort((a, b) => a - b);
  
  // Apply inflation compounding for each year
  for (const year of years) {
    const inflationRate = INFLATION_RATES[year] || 0;
    adjustedValue *= (1 + inflationRate / 100);
  }
  
  return adjustedValue;
}

/**
 * Investment return types
 */
export type AssetType = 'crypto' | 'stocks' | 'commodity';

/**
 * Sample historical annual returns data (in percentages)
 * This is example data - you should replace with actual historical data
 */
export const ASSET_RETURNS: Record<AssetType, Record<number, number>> = {
  crypto: {
    2010: 1300,
    2011: 1473,
    2012: 186,
    2013: 5507,
    2014: -58,
    2015: 35,
    2016: 125,
    2017: 1331,
    2018: -72,
    2019: 95,
    2020: 302,
    2021: 59,
    2022: -65,
    2023: 155,
    2024: 58,
  },
  stocks: {
    2010: 46.13,
    2011: 3.20,
    2012: 12.94,
    2013: -0.98,
    2014: 22.29,
    2015: -12.13,
    2016: 15.32,
    2017: 19.99,
    2018: -2.54,
    2019: 1.70,
    2020: -5.09,
    2021: 10.08,
    2022: 4.09,
    2023: 0.22,
    2024: 2.21,
  },
  commodity: {
    2010: 29.76,
    2011: 10.23,
    2012: 7.14,
    2013: -28.65,
    2014: -1.72,
    2015: -11.67,
    2016: 8.56,
    2017: 13.51,
    2018: -1.94,
    2019: 18.31,
    2020: 24.81,
    2021: -3.64,
    2022: -0.28,
    2023: 1.31,
    2024: 14.12,
  },
};

/**
 * Calculate investment returns over time
 * @param initialAmount Starting investment amount
 * @param assetType Type of investment asset
 * @param startYear Investment beginning year
 * @param endYear Investment end year (defaults to current year)
 * @returns Final investment value
 */
export function calculateInvestmentReturn(
  initialAmount: number,
  assetType: AssetType,
  startYear: number,
  endYear: number = new Date().getFullYear()
): number {
  const assetReturns = ASSET_RETURNS[assetType];
  let currentValue = initialAmount;
  
  // Get the years between startYear and endYear in ascending order
  const years = Object.keys(assetReturns)
    .map(Number)
    .filter(year => year >= startYear && year <= endYear)
    .sort((a, b) => a - b);
  
  // Apply returns compounding for each year
  for (const year of years) {
    const returnRate = assetReturns[year] || 0;
    currentValue *= (1 + returnRate / 100);
  }
  
  return currentValue;
}

/**
 * UMR (Upah Minimum Regional) data by province/city (in Rupiah)
 * Example data for 2024, replace with actual data
 */
export const UMR_DATA: Record<string, number> = {
  "Jakarta": 5200000,
  "Bandung": 4300000,
  "Surabaya": 4600000,
  "Medan": 3700000,
  "Makassar": 3500000,
  "Yogyakarta": 2051000,
  "Semarang": 3050000,
  "Bali": 2900000,
  "Balikpapan": 3200000,
  "Palembang": 3400000,
};

/**
 * Calculate the percentage difference between two values
 * @param value1 First value
 * @param value2 Second value
 * @returns Percentage difference
 */
export function calculatePercentageDifference(value1: number, value2: number): number {
  return ((value2 - value1) / value1) * 100;
}
