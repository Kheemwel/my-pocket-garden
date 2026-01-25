// Shop configuration

export interface PlotPrice {
  plotNumber: number;  // Which plot this is (1-indexed for display)
  price: number;
}

// Plot prices - gets progressively more expensive
export const PLOT_PRICES: PlotPrice[] = [
  { plotNumber: 2, price: 500 },
  { plotNumber: 3, price: 1500 },
  { plotNumber: 4, price: 5000 },
  { plotNumber: 5, price: 15000 },
  { plotNumber: 6, price: 50000 },
  { plotNumber: 7, price: 150000 },
  { plotNumber: 8, price: 500000 },
];

// Shop configuration
export const SHOP_CONFIG = {
  restockIntervalMs: 5 * 60 * 1000,  // 5 minutes
  maxSeedTypes: 6,  // Maximum different seed types in shop at once
};

// Get the price for the next plot
export function getNextPlotPrice(currentPlotCount: number): number | null {
  const nextPlot = PLOT_PRICES.find(p => p.plotNumber === currentPlotCount + 1);
  return nextPlot?.price ?? null;
}

// Check if more plots can be purchased
export function canBuyMorePlots(currentPlotCount: number): boolean {
  return currentPlotCount < PLOT_PRICES.length + 1;
}
