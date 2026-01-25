// Main garden component
import { Component, Show, createMemo } from 'solid-js';
import { gameStore } from '../../core/GameStore';
import { GardenPlot } from './GardenPlot';
import { PlotSelector } from './PlotSelector';

export const Garden: Component = () => {
  const currentPlot = createMemo(() => {
    const index = gameStore.state.currentPlotIndex;
    return gameStore.state.plots[index];
  });
  
  const hasMultiplePlots = () => gameStore.state.plots.length > 1;
  
  return (
    <div class="garden">
      <Show when={hasMultiplePlots()}>
        <PlotSelector />
      </Show>
      
      <Show when={currentPlot()}>
        <GardenPlot plot={currentPlot()!} />
      </Show>
    </div>
  );
};
