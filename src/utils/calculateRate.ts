// src/utils/calculateRate.ts

interface RateOptions {
  dieselPricePerGallon: number; // Local diesel price, e.g., from API or manual entry
  truckMpg: number;             // Truck miles per gallon
  fixedCostsPerMile: number;    // Insurance, permits, depreciation etc.
  variableCostsPerMile: number; // Maintenance, driver pay, tolls, etc.
  profitMarginPercent: number;  // Desired margin, e.g., 20 means 20%
  baselineDieselPrice?: number; // Optional baseline for surcharge logic
}

/**
 * Calculate total rate per mile for delivery.
 */
export function calculateRatePerMile({
  dieselPricePerGallon,
  truckMpg,
  fixedCostsPerMile,
  variableCostsPerMile,
  profitMarginPercent,
  baselineDieselPrice = 3.20, // National average diesel baseline
}: RateOptions): number {
  // Calculate fuel cost per mile
  const fuelCostPerMile = dieselPricePerGallon / truckMpg;

  // Optional fuel surcharge
  let fuelSurcharge = 0;
  if (dieselPricePerGallon > baselineDieselPrice) {
    const delta = dieselPricePerGallon - baselineDieselPrice;
    fuelSurcharge = delta / truckMpg;
  }

  // Base cost before margin
  const baseCostPerMile =
    fixedCostsPerMile + variableCostsPerMile + fuelCostPerMile + fuelSurcharge;

  // Apply profit margin
  const totalRatePerMile =
    baseCostPerMile * (1 + profitMarginPercent / 100);

  return parseFloat(totalRatePerMile.toFixed(2)); // Round to 2 decimal places
}
