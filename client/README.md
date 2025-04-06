# Frontend

## Tech Stack

- React with TypeScript
- Vite for build tooling
- Shadcn UI components
- React Router for navigation
- TanStack Query for data fetching
- Burnt Labs Abstraxion for wallet connection

## Environment Configuration

Create a `.env` file in the root directory with the following variables:

```
VITE_API_URL=http://localhost:5000
VITE_TREASURY_ADDRESS=your-treasury-address-here
VITE_CONTRACT_ADDRESS=your-contract-address-here
```

## Getting Started

To install dependencies:

```bash
npm install
# or
yarn
# or
pnpm install
```

To start the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

To build the project for production:

```bash
npm run build
# or
yarn build
# or
pnpm build
```

To preview the production build:

```bash
npm run preview
# or
yarn preview
# or
pnpm preview
```

## Folder Structure

- `src/`: Contains the source code of the application.
    - `/components`: UI components including shadcn components
    - `/context`: React context providers for auth and theme
    - `/hooks`: Custom React hooks for authentication and wallet integration
    - `/lib`: Utility functions and constants
    - `/pages`: Page components organized by route
    - `/styles`: Global CSS and theme variables
- `public/`: Static assets like images and icons.
- `vite.config.ts`: Configuration file for Vite.
- `package.json`: Project dependencies and scripts.

## License

This project is licensed under the MIT License. See the `LICENSE` file for details.
