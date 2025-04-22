/**
 * Utility functions for financial calculations in BerapaNanti app
 */

/**
 * Historical annual inflation rates for Indonesia (in percentages)
 * Data from 1990-2050, you can replace with actual historical data
 */
export const INFLATION_RATES: Record<number, number> = {
  1990: 7.84,
  1991: 9.42,
  1992: 7.53,
  1993: 9.77,
  1994: 8.52,
  1995: 9.43,
  1996: 7.97,
  1997: 6.23,
  1998: 58.39,
  1999: 20.49,
  2000: 3.72,
  2001: 11.50,
  2002: 11.88,
  2003: 6.79,
  2004: 6.06,
  2005: 10.40,
  2006: 13.33,
  2007: 6.40,
  2008: 9.06,
  2009: 4.39,
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
  2024: 2.84,
  2025: 3.0,
  2026: 3.1,
  2027: 3.0,
  2028: 3.2,
  2029: 3.1,
  2030: 3.0,
  2031: 3.0,
  2032: 3.0,
  2033: 3.0,
  2034: 3.0,
  2035: 3.0,
  2036: 3.0,
  2037: 3.0,
  2038: 3.0,
  2039: 3.0,
  2040: 3.0,
  2041: 3.0,
  2042: 3.0,
  2043: 3.0,
  2044: 3.0,
  2045: 3.0,
  2046: 3.0,
  2047: 3.0,
  2048: 3.0,
  2049: 3.0,
  2050: 3.0,
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
    2025: 25,
    2026: 30,
    2027: 28,
    2028: 32,
    2029: 27,
    2030: 25,
    2031: 20,
    2032: 15,
    2033: 10,
    2034: 5,
    2035: 0,
    2036: -5,
    2037: -10,
    2038: -15,
    2039: -20,
    2040: -25,
    2041: -30,
    2042: -35,
    2043: -40,
    2044: -45,
    2045: -50,
    2046: -55,
    2047: -60,
    2048: -65,
    2049: -70,
    2050: -75,
  },
  stocks: {
    1990: 18.24,
    1991: -8.35,
    1992: 24.56,
    1993: 54.96,
    1994: -19.12,
    1995: 9.12,
    1996: 23.75,
    1997: -37.04,
    1998: -1.32,
    1999: 70.12,
    2000: -38.54,
    2001: -8.09,
    2002: 8.39,
    2003: 62.83,
    2004: 44.56,
    2005: 16.24,
    2006: 55.30,
    2007: 52.08,
    2008: -50.64,
    2009: 87.01,
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
    2025: 8,
    2026: 7,
    2027: 9,
    2028: 8,
    2029: 7,
    2030: 8,
    2031: 8,
    2032: 8,
    2033: 8,
    2034: 8,
    2035: 8,
    2036: 8,
    2037: 8,
    2038: 8,
    2039: 8,
    2040: 8,
    2041: 8,
    2042: 8,
    2043: 8,
    2044: 8,
    2045: 8,
    2046: 8,
    2047: 8,
    2048: 8,
    2049: 8,
    2050: 8,
  },
  commodity: {
    1990: 12.34,
    1991: -5.67,
    1992: 8.90,
    1993: 15.43,
    1994: -8.76,
    1995: 11.23,
    1996: 7.89,
    1997: -12.45,
    1998: -3.21,
    1999: 18.90,
    2000: -7.65,
    2001: 4.32,
    2002: 9.87,
    2003: 23.45,
    2004: 19.87,
    2005: 12.34,
    2006: 28.90,
    2007: 23.45,
    2008: -28.76,
    2009: 32.10,
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
    2025: 5,
    2026: 6,
    2027: 4,
    2028: 5,
    2029: 6,
    2030: 5,
    2031: 5,
    2032: 5,
    2033: 5,
    2034: 5,
    2035: 5,
    2036: 5,
    2037: 5,
    2038: 5,
    2039: 5,
    2040: 5,
    2041: 5,
    2042: 5,
    2043: 5,
    2044: 5,
    2045: 5,
    2046: 5,
    2047: 5,
    2048: 5,
    2049: 5,
    2050: 5,
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
