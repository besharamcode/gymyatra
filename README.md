# GymTrack Frontend

This is the frontend application for GymTrack, a comprehensive gym management system built with React and Vite.

## Technologies Used

- React 18
- Redux Toolkit for state management
- React Router for navigation
- Tailwind CSS for styling
- Vite for fast development and optimized builds
- Chart.js for data visualization

## Getting Started

### Prerequisites

- Node.js 14.x or higher
- npm 7.x or higher (or pnpm/yarn)

### Installation

1. Clone the repository
2. Navigate to the project directory
3. Install dependencies:

```bash
npm install
# or
pnpm install
# or
yarn install
```

### Development

To start the development server:

```bash
npm run dev
# or
pnpm dev
# or
yarn dev
```

This will start the Vite development server at `http://localhost:5173`.

### Building for Production

To build for production:

```bash
npm run build
# or
pnpm build
# or
yarn build
```

The build will be created in the `dist` directory.

### Preview Production Build

To preview the production build locally:

```bash
npm run preview
# or
pnpm preview
# or
yarn preview
```

## Project Structure

- `src/` - Main source code
  - `components/` - Reusable UI components
  - `pages/` - Page components
  - `redux/` - Redux store configuration and slices
  - `assets/` - Static assets like images
  - `styles/` - Global CSS styles
  - `utils/` - Utility functions
  - `App.jsx` - Main application component
  - `main.jsx` - Application entry point

## API Configuration

The application is configured to proxy API requests to `http://localhost:5000` during development. 