# My Pocket Garden

A relaxing farming and crafting idle game built with [SolidJS](https://www.solidjs.com/) and [SolidStart](https://start.solidjs.com/).

## What is My Pocket Garden?

My Pocket Garden is a web-based farming simulation game where you manage your own virtual farm. Plant seeds, watch them grow, harvest crops, cook meals, craft items, and expand your farm—all while the game progresses even when you're away.

## Features

- **🌱 Gardening System**: Plant seeds in plot slots, watch them grow over time, and harvest for rewards
- **🏪 Shop System**: Buy seeds and plot expansions with automatic restocking
- **👨‍🍳 Cooking System**: Cook recipes using harvested ingredients to create new items
- **🔨 Crafting System**: Craft tools and items to expand your farm capabilities
- **📦 Inventory Management**: Organize and manage your items and seeds
- **⏰ Offline Progress**: Your plants continue growing even when you're not playing
- **💾 Auto-Save**: Game progress is automatically saved to your browser's local storage
- **📱 Responsive Design**: Play on desktop or mobile devices

## Tech Stack

- **Framework**: [SolidJS](https://www.solidjs.com/) + [SolidStart](https://start.solidjs.com/)
- **Language**: TypeScript
- **Build Tool**: [Vinxi](https://vinxi.vercel.app/)
- **Styling**: CSS with custom theme
- **State Management**: SolidJS reactivity with centralized game store
- **Persistence**: Browser localStorage

## Getting Started

### Prerequisites

- Node.js 22 or later
- npm, yarn, or your preferred package manager

### Installation

1. Clone this repository:
   ```bash
   git clone <repository-url>
   cd my-pocket-garden
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:3000`

### Building for Production

To create an optimized production build:

```bash
npm run build
npm start
```

## Project Structure

```
src/
├── components/           # React components organized by feature
│   ├── Cooking/         # Recipe card and cooking station UI
│   ├── Crafting/        # Crafting station and recipe cards
│   ├── Garden/          # Garden plots and planting UI
│   ├── Inventory/       # Inventory management UI
│   ├── Layout/          # Main layout and navigation
│   ├── Settings/        # Settings panel
│   ├── Shop/            # Shop UI for seeds and plots
│   └── UI/              # Reusable UI components
├── core/                # Core game logic
│   ├── GameStore.ts     # Centralized game state and actions
│   ├── EventBus.ts      # Event system for game events
│   ├── TimeManager.ts   # Time calculations for plant growth
│   └── types.ts         # TypeScript type definitions
├── data/                # Game content and configuration
│   ├── items.ts         # Item definitions
│   ├── seeds.ts         # Seed and plant data
│   ├── recipes.ts       # Cooking and crafting recipes
│   └── shop.ts          # Shop inventory definitions
├── persistence/         # Save and load logic
│   ├── SaveManager.ts   # Handle game saving
│   └── OfflineProgress.ts # Calculate offline progress
├── systems/             # Game systems
│   ├── GardenSystem.ts  # Planting and harvesting logic
│   ├── CookingSystem.ts # Cooking mechanics
│   ├── CraftingSystem.ts # Crafting mechanics
│   ├── InventorySystem.ts # Inventory operations
│   └── ShopSystem.ts    # Shop mechanics
├── routes/              # Page routes
└── styles/              # Global styles and theme
```

## Game Mechanics

### Gardening

- Each plot contains 25 slots for planting
- Seeds grow over a specific time duration (varies by seed type)
- Harvesting yields items based on the seed type
- You can expand your farm by purchasing new plots from the shop

### Economy

- Earn money by harvesting plants and cooking recipes
- Spend money to buy seeds and unlock new plots
- Manage your farm profitably to unlock new content

### Cooking & Crafting

- Combine ingredients through cooking recipes
- Create tools and items through crafting recipes
- Complete recipes to earn money or unlock new gameplay features

### Offline Progress

- Time spent away from the game is automatically calculated
- Plants continue growing while offline
- Ready-to-harvest plants are processed on your return

## Game Data Format

Game data (seeds, recipes, items, shop) is defined in TypeScript files in `src/data/`:

- **seeds.ts**: Defines seed types, growth times, and harvest yields
- **recipes.ts**: Cooking and crafting recipes with ingredients and outputs
- **items.ts**: Item metadata and properties
- **shop.ts**: Shop inventory and restock behavior

## Architecture

### Centralized Game Store

All game state is managed through `GameStore.ts` which provides a single source of truth using SolidJS's reactive store. Actions on the store emit events through the event bus for other systems to react to.

### Event System

The `EventBus` provides a publish-subscribe pattern for game events (plant harvested, money gained, etc.), allowing systems to stay decoupled while reacting to state changes.

### Systems

Each major feature (gardening, cooking, crafting, inventory, shop) has a dedicated system that encapsulates the logic for that feature.

## Contributing

Contributions are welcome! To contribute:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Commit your changes (`git commit -m 'Add amazing feature'`)
5. Push to the branch (`git push origin feature/amazing-feature`)
6. Open a Pull Request

When contributing, please:

- Follow the existing code style and naming conventions
- Add TypeScript types for new functions and data
- Test your changes in the development environment
- Update relevant documentation

## Support & Documentation

- **Issues**: Report bugs and suggest features via GitHub Issues
- **Development**: See this README for setup and architecture overview
- **Code Comments**: Refer to inline code comments for detailed implementation notes

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Built with [SolidJS](https://www.solidjs.com/) - a lightweight reactive JavaScript library
- Powered by [SolidStart](https://start.solidjs.com/) - the full-stack framework for SolidJS
