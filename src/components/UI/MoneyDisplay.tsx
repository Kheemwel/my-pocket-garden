// Money display component
import { Component } from 'solid-js';
import { gameStore } from '../../core/GameStore';

export const MoneyDisplay: Component = () => {
  const money = () => gameStore.state.money;
  
  const formatMoney = (amount: number): string => {
    if (amount >= 1000000) {
      return `${(amount / 1000000).toFixed(2)}M`;
    }
    if (amount >= 10000) {
      return `${(amount / 1000).toFixed(1)}K`;
    }
    return amount.toLocaleString();
  };
  
  return (
    <div class="money-display">
      <span class="money-icon">💰</span>
      <span class="money-amount">{formatMoney(money())} G$</span>
    </div>
  );
};
