// Plot shop component for buying additional plots
import { Component, Show, createMemo } from 'solid-js';
import { gameStore } from '../../core/GameStore';
import { shopSystem } from '../../systems/ShopSystem';

export const PlotShop: Component = () => {
  const money = () => gameStore.state.money;
  const plotCount = () => gameStore.state.plots.length;
  
  const nextPlotPrice = createMemo(() => shopSystem.getNextPlotPrice());
  const canBuyMore = createMemo(() => shopSystem.canBuyMorePlots());
  const canAfford = createMemo(() => {
    const price = nextPlotPrice();
    return price !== null && money() >= price;
  });
  
  const handleBuyPlot = () => {
    const result = shopSystem.buyPlot();
    if (result.success) {
      console.log('Purchased new plot:', result.plotId);
    } else {
      console.log('Failed to buy plot:', result.error);
    }
  };
  
  const formatPrice = (price: number): string => {
    if (price >= 1000000) {
      return `${(price / 1000000).toFixed(1)}M`;
    }
    if (price >= 1000) {
      return `${(price / 1000).toFixed(1)}K`;
    }
    return price.toString();
  };
  
  return (
    <div class="plot-shop">
      <h3>Plot Expansion</h3>
      
      <div class="plot-info">
        <span class="current-plots">
          Current plots: {plotCount()}
        </span>
      </div>
      
      <Show
        when={canBuyMore()}
        fallback={
          <div class="max-plots">
            <p>You have the maximum number of plots!</p>
          </div>
        }
      >
        <div class="plot-purchase">
          <div class="next-plot">
            <span class="plot-icon">🏡</span>
            <span class="plot-label">Plot {plotCount() + 1}</span>
            <span class="plot-price">{formatPrice(nextPlotPrice()!)} G$</span>
          </div>
          
          <button
            class="buy-plot-btn"
            onClick={handleBuyPlot}
            disabled={!canAfford()}
          >
            {canAfford() ? 'Buy Plot' : 'Not Enough G$'}
          </button>
        </div>
      </Show>
    </div>
  );
};
