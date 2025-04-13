# CollabSpace: Connect. Collaborate. Create.

CollabSpace is a comprehensive platform designed to empower developers by bridging the gap between ideas and execution. Built on the Xion Network, it enables seamless project collaboration, real-time idea sharing, reputation building, and on-chain recognition — all in a Web3-native yet user-friendly way.

Whether you're looking to kickstart your idea, contribute to live projects, or build your blockchain reputation — CollabSpace is your hub for meaningful collaboration in the decentralized space.

## 🧩 Problem Statement

Thousands of brilliant project ideas are abandoned due to a lack of contributors or visibility. Simultaneously, developers (especially juniors) struggle to find relevant, real-world projects to gain experience, collaborate, or even monetize their efforts.

### Key Challenges:

- **Visibility Gap**: Incomplete ideas don't get the spotlight or collaborators.
- **Discovery Issue**: Developers lack visibility into quality Web3 projects.
- **Recognition Deficit**: No structured way to reward or recognize contributors.
- **Adoption Barrier**: Existing platforms feel too Web2 or too complex for new devs.

## 🌐 The CollabSpace Solution

CollabSpace solves these issues by offering a decentralized collaboration platform that enables users to:

- 🚀 **Submit Project Ideas**: Pitch incomplete or early-stage projects for feedback or collaboration.
- 🛠️ **Join Active Builds**: Find real projects to contribute to based on skill, interest, or incentives.
- 💼 **Build Profiles**: Showcase your skills, contributions, and earned XP (Experience Points).
- 📈 **Earn XP & Reputation**: On-chain XP for activity and verified contributions, building a public dev reputation.
- 🔗 **Onboard Seamlessly**: Gasless UX and wallet abstraction via Abstraxion makes Web3 access feel like Web2.

## 🏗️ Project Structure

CollabSpace is divided into three core components:

### 🖥️ 1. Client (Frontend)

Built with React + TypeScript, the frontend delivers a fast, responsive interface for users to browse, interact, and collaborate.

**Key Technologies:**
- React + TypeScript
- Tailwind CSS + Shadcn UI
- React Router
- Axios (for API communication)
- Abstraxion (for gasless wallet login)

**Pages:**
- Home: Landing + platform overview
- Projects: Explore real-time builds with filters
- Ideas: Submit/vote on early-stage ideas
- Profile: Showcase skills, contributions, XP
- Dashboard: Personalized project/activity hub

### 🛠️ 2. Server (Backend API)

The backend, powered by Express.js and hosted via Supabase, provides secure RESTful endpoints to manage users, profiles, projects, and ideas.

**Key Technologies:**
- Node.js + Express
- PostgreSQL (Supabase)
- JWT for authentication
- Supabase Realtime (optional chat or presence)

**API Routes:**
- `/api/auth/*`: Authentication
- `/api/user-data/*`: Fetch user data
- `/api/profile/*`: Manage profile info
- `/api/projects/*`: CRUD for projects
- `/api/ideas/*`: Submit & vote on ideas

### 🧠 3. Smart Contracts

CollabSpace smart contracts (on Xion Network, via CosmWasm) handle core logic like:

- Project submissions
- [Future build] XP minting or distribution
- [Future build] Contributor reputation updates

(More details on contract architecture available in the contract README.)

## 🛠️ Architecture Overview

- Supabase handles user data and auth
- Abstraxion abstracts wallet setup and enables seamless login
- Xion Contracts record XP, project actions, and future DAO voting

## 🌍 Deployment

| Component | Platform |
|-----------|----------|
| Frontend  | Vercel   |
| Backend   | Render   |
| Contracts | Xion Network Testnet |

## 🙌 Acknowledgements

- Built during the Xion Network Buildathon
- Powered by Burnt Labs' Abstraxion
- UI supported by Shadcn UI
