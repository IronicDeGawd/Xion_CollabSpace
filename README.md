# CollabSpace: Web3 Developer Collaboration Platform

CollabSpace is a comprehensive platform designed to connect developers, facilitate project collaboration, and foster community-driven innovation in the blockchain space. Built on Xion Network, this platform enables developers to find projects, share ideas, track contributions, and build their on-chain reputation.

## Project Structure

The project consists of three main components:

- [Frontend](https://github.com/IronicDeGawd/Xion_CollabSpace/blob/15ecf18b492d90f55838215db86abbafb700f337/client/README.md)

- [API](https://github.com/IronicDeGawd/Xion_CollabSpace/blob/15ecf18b492d90f55838215db86abbafb700f337/server/README.md)

- [Contract](https://github.com/IronicDeGawd/Xion_CollabSpace/blob/15ecf18b492d90f55838215db86abbafb700f337/contract/README.md)

### Features

- **Wallet Integration**: Seamless authentication with Xion Network wallets via Abstraxion
- **Project Discovery**: Browse and filter Web3 projects looking for collaborators
- **Idea Sharing**: Submit and vote on project ideas to gauge community interest
- **Developer Profiles**: Create and manage your developer profile with skills and experience
- **Experience Points (XP)**: Earn on-chain XP for contributions and project completions

## Client (Frontend)

The frontend is built with React, TypeScript, and Tailwind CSS, providing a responsive and intuitive user interface.

### Key Technologies

- React with TypeScript
- React Router for navigation
- Tailwind CSS with Shadcn UI components
- Abstraxion for wallet connection
- Axios for API communication

### Pages

- **Home**: Landing page with platform overview
- **Projects**: Browse available projects with filtering options
- **Ideas**: Community-driven project ideas with voting system
- **Profile**: User profiles with skills, contributions, and XP
- **Dashboard**: Personalized view of projects and activities

[Read more about the client setup and development](https://github.com/IronicDeGawd/Xion_CollabSpace/blob/15ecf18b492d90f55838215db86abbafb700f337/client/README.md)

## Server (Backend)

The backend provides RESTful API endpoints for data management and authentication, using Express.js with PostgreSQL via Supabase.

### Key Technologies

- Node.js with Express
- PostgreSQL database (hosted on Supabase)
- JWT for authentication

### API Endpoints

- **Authentication**: `/api/auth/*`
- **User data**: `/api/user-data/*`
- **Profile management**: `/api/profile/*`
- **Projects**: `/api/projects/*`
- **Ideas**: `/api/ideas/*`

[Read more about the server setup and development](https://github.com/IronicDeGawd/Xion_CollabSpace/blob/15ecf18b492d90f55838215db86abbafb700f337/server/README.md)

## Smart Contracts

Smart contracts handles the project submission.

[Read more about the contract architecture and deployment](https://github.com/IronicDeGawd/Xion_CollabSpace/blob/15ecf18b492d90f55838215db86abbafb700f337/contract/README.md)

## Deployment

### Frontend

The frontend is deployed on Vercel at [https://xion-collabspace.vercel.app](https://xion-collabspace.vercel.app)

### Backend

The backend API is deployed on:

- Render

See the server README for detailed deployment instructions.

### Smart Contracts

Smart contracts are deployed on the Xion Network.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgements

- Built during the Xion Network Buildathon
- Powered by Burnt Labs' Abstraxion wallet integration
- UI components by Shadcn

---

**CollabSpace** - *Connect. Collaborate. Create.*
