// Main shop component
import { Component } from 'solid-js';
import { SeedShop } from './SeedShop';
import { PlotShop } from './PlotShop';

export const Shop: Component = () => {
  return (
    <div class="shop">
      <SeedShop />
      <PlotShop />
    </div>
  );
};
