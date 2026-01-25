// Plot selector/tab navigation
import { Component, For, createMemo } from 'solid-js';
import { gameStore } from '../../core/GameStore';
import { gardenSystem } from '../../systems/GardenSystem';
import { timeManager } from '../../core/TimeManager';

export const PlotSelector: Component = () => {
  const plots = () => gameStore.state.plots;
  const currentIndex = () => gameStore.state.currentPlotIndex;
  
  // Subscribe to tick for ready count updates
  const tick = timeManager.lastTick;
  
  const getPlotStatus = (plotId: number) => {
    tick(); // Subscribe to updates
    const ready = gardenSystem.countReadyPlants(plotId);
    const growing = gardenSystem.countGrowingPlants(plotId);
    const empty = gardenSystem.countEmptySlots(plotId);
    return { ready, growing, empty };
  };
  
  return (
    <div class="plot-selector">
      <For each={plots()}>
        {(plot, index) => {
          const status = createMemo(() => getPlotStatus(plot.id));
          
          return (
            <button
              class={`plot-tab ${currentIndex() === index() ? 'active' : ''}`}
              onClick={() => gameStore.setCurrentPlotIndex(index())}
            >
              <span class="tab-label">Plot {index() + 1}</span>
              <div class="tab-indicators">
                {status().ready > 0 && (
                  <span class="indicator ready" title={`${status().ready} ready`}>
                    {status().ready}
                  </span>
                )}
                {status().growing > 0 && (
                  <span class="indicator growing" title={`${status().growing} growing`}>
                    {status().growing}
                  </span>
                )}
              </div>
            </button>
          );
        }}
      </For>
    </div>
  );
};
