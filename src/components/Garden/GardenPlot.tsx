// Garden plot component - 5x5 grid of slots
import { Component, For, Show, createMemo } from 'solid-js';
import { gameStore } from '../../core/GameStore';
import { gardenSystem } from '../../systems/GardenSystem';
import { PlotSlot } from './PlotSlot';
import type { Plot } from '../../core/types';

interface GardenPlotProps {
  plot: Plot;
}

export const GardenPlot: Component<GardenPlotProps> = (props) => {
  const selectedSeedId = () => gameStore.state.selectedSeedId;
  
  const handlePlantInSlot = (slotId: number) => {
    const seedId = selectedSeedId();
    if (seedId) {
      gardenSystem.plantSeed(props.plot.id, slotId, seedId);
    }
  };
  
  const readyCount = createMemo(() => 
    gardenSystem.countReadyPlants(props.plot.id)
  );
  
  const emptyCount = createMemo(() => 
    gardenSystem.countEmptySlots(props.plot.id)
  );
  
  const growingCount = createMemo(() => 
    gardenSystem.countGrowingPlants(props.plot.id)
  );
  
  const seedCount = createMemo(() => {
    const seedId = selectedSeedId();
    if (!seedId) return 0;
    return gameStore.getItemCount(seedId);
  });
  
  const handleHarvestAll = () => {
    gardenSystem.harvestAll(props.plot.id);
  };
  
  const handlePlantAll = () => {
    gardenSystem.bulkPlant(props.plot.id);
  };
  
  return (
    <div class="garden-plot">
      <div class="plot-header">
        <div class="plot-title">
          <h3>Plot {props.plot.id + 1}</h3>
          <div class="plot-indicators">
            <Show when={emptyCount() > 0}>
              <span class="indicator empty">{emptyCount()}</span>
            </Show>
            <Show when={growingCount() > 0}>
              <span class="indicator growing">{growingCount()}</span>
            </Show>
            <Show when={readyCount() > 0}>
              <span class="indicator ready">{readyCount()}</span>
            </Show>
          </div>
        </div>
        <div class="plot-actions">
          <Show when={selectedSeedId() && emptyCount() > 0}>
            <button class="plant-all-btn" onClick={handlePlantAll}>
              Plant All ({Math.min(emptyCount(), seedCount())})
            </button>
          </Show>
          <Show when={readyCount() > 0}>
            <button class="harvest-all-btn" onClick={handleHarvestAll}>
              Harvest ({readyCount()})
            </button>
          </Show>
        </div>
      </div>
      
      <div class="plot-grid">
        <For each={props.plot.slots}>
          {(slot) => (
            <PlotSlot
              plotId={props.plot.id}
              slot={slot}
              onPlant={() => handlePlantInSlot(slot.id)}
            />
          )}
        </For>
      </div>
      
      <Show when={!selectedSeedId()}>
        <div class="plot-hint">
          Select a seed to plant
        </div>
      </Show>
    </div>
  );
};
