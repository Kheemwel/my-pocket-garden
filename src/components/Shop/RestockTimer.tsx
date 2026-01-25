// Restock countdown timer
import { Component, createMemo } from 'solid-js';
import { timeManager } from '../../core/TimeManager';

export const RestockTimer: Component = () => {
  // Subscribe to tick for timer updates
  const tick = timeManager.lastTick;
  
  const timeUntilRestock = createMemo(() => {
    tick(); // Subscribe to updates
    return timeManager.getTimeUntilRestock();
  });
  
  const formattedTime = createMemo(() => {
    return timeManager.formatTimeRemaining(timeUntilRestock());
  });
  
  return (
    <div class="restock-timer">
      <span class="timer-label">Shop restocks in:</span>
      <span class="timer-value">{formattedTime()}</span>
    </div>
  );
};
