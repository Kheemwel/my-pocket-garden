// Individual plot slot component
import { Component, Show, createMemo } from 'solid-js';
import { gameStore } from '../../core/GameStore';
import { gardenSystem } from '../../systems/GardenSystem';
import { getSeed } from '../../data/seeds';
import { timeManager } from '../../core/TimeManager';
import type { PlotSlot as PlotSlotType } from '../../core/types';

interface PlotSlotProps {
  plotId: number;
  slot: PlotSlotType;
  onPlant: () => void;
}

export const PlotSlot: Component<PlotSlotProps> = (props) => {
  // Force re-render every tick for timer updates
  const tick = timeManager.lastTick;
  
  const isReady = createMemo(() => {
    tick(); // Subscribe to tick updates
    return gardenSystem.isReadyToHarvest(props.plotId, props.slot.id);
  });
  
  const timeRemaining = createMemo(() => {
    tick(); // Subscribe to tick updates
    return gardenSystem.getFormattedTimeRemaining(props.plotId, props.slot.id);
  });
  
  const growthProgress = createMemo(() => {
    tick(); // Subscribe to tick updates
    return gardenSystem.getGrowthProgress(props.plotId, props.slot.id);
  });
  
  const seedInfo = createMemo(() => {
    const plant = props.slot.plant;
    if (!plant) return null;
    return getSeed(plant.seedId);
  });
  
  const handleClick = () => {
    const plant = props.slot.plant;
    
    if (!plant) {
      // Empty slot - try to plant
      props.onPlant();
    } else if (isReady()) {
      // Ready to harvest
      gardenSystem.harvestPlant(props.plotId, props.slot.id);
    }
    // If growing, do nothing on click
  };
  
  return (
    <div
      class={`plot-slot ${props.slot.plant ? 'has-plant' : 'empty'} ${isReady() ? 'ready' : ''}`}
      onClick={handleClick}
    >
      <Show
        when={props.slot.plant}
        fallback={
          <div class="slot-empty">
            <span class="empty-icon">+</span>
          </div>
        }
      >
        <div class="slot-plant">
          <span class="plant-emoji">
            {seedInfo()?.growingEmoji || '🌱'}
          </span>
          
          <Show when={!isReady()}>
            <div class="growth-bar">
              <div 
                class="growth-fill" 
                style={{ width: `${growthProgress()}%` }}
              />
            </div>
            <span class="time-remaining">{timeRemaining()}</span>
          </Show>
          
          <Show when={isReady()}>
            <span class="harvest-badge">Harvest!</span>
          </Show>
        </div>
      </Show>
    </div>
  );
};
