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
  
  const handleHarvestAll = () => {
    gardenSystem.harvestAll(props.plot.id);
  };
  
  return (
    <div class="garden-plot">
      <div class="plot-header">
        <h3>Plot {props.plot.id + 1}</h3>
        <div class="plot-stats">
          <span class="stat empty">{emptyCount()} empty</span>
          <Show when={readyCount() > 0}>
            <button class="harvest-all-btn" onClick={handleHarvestAll}>
              Harvest All ({readyCount()})
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
