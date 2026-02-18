# Chat UI

A modern, full-featured chat application with RAG (Retrieval-Augmented Generation) capabilities, built with React 19, TypeScript, and Ant Design. This project demonstrates enterprise-level frontend architecture and best practices for building production-ready applications.

## Features

### AI Chat Interface
- Real-time streaming responses from multiple AI models
- Conversation management with persistent history
- Model selection (GPT-5, Llama, etc.)
- Message search and filtering
- Markdown rendering and syntax highlighting

### Knowledge Base Management
- Document upload and ingestion pipeline
- Vector search for semantic document retrieval
- RAG-powered queries with source citations
- Knowledge base selection for context-aware responses

### Authentication & Security
- JWT-based authentication
- Protected routes with automatic redirects
- Token management with axios interceptors
- Secure API communication

### User Experience
- Dark/light theme support
- Responsive design for all screen sizes
- Loading states and error handling
- Empty states and user feedback
- Smooth animations and transitions

## Architecture & Best Practices

### State Management
- React Context API for global state (Auth, Chat, Theme)
- Local state with hooks for component-level data
- Optimistic UI updates for better UX

### Code Organization
- Feature-based directory structure
- Separation of concerns (API, components, pages, utilities)
- Custom hooks for reusable logic
- TypeScript interfaces for type safety

### API Layer
- Centralized axios configuration with interceptors
- Streaming support for real-time responses
- Error handling and retry logic
- Environment-based configuration

### UI/UX Patterns
- Compound components pattern
- Protected route wrappers
- Layout components for consistent structure
- Conditional rendering for different states

## Tech Stack

**Core**
- React 19 - Latest features including automatic batching
- TypeScript - Type safety and better DX
- Vite - Fast build tool and dev server

**UI & Styling**
- Ant Design 6 - Enterprise-grade component library
- Tailwind CSS 4 - Utility-first styling
- CSS-in-JS with theme tokens

**Routing & State**
- React Router 7 - Client-side routing
- Context API - Global state management

**Data Fetching**
- Axios - HTTP client with interceptors
- Server-Sent Events (SSE) - Real-time streaming

**Development Tools**
- ESLint - Code linting with React rules
- TypeScript ESLint - Type-aware linting
- PostCSS - CSS processing

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Backend API server running

### Installation

1. Clone the repository and install dependencies:
```bash
npm install
```

2. Configure environment variables:
```bash
cp .env.example .env
```

Edit `.env` and set your backend API URL:
```env
VITE_API_URL=http://localhost:8000
```

3. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Building for Production

```bash
npm run build
```

Preview the production build:
```bash
npm run preview
```

## Available Scripts

- `npm run dev` - Start development server with HMR
- `npm run build` - Type check and build for production
- `npm run lint` - Run ESLint to check code quality
- `npm run preview` - Preview production build locally

## Project Structure

```
src/
├── api/           # API client and endpoints
├── auth/          # Authentication context and guards
├── chat/          # Chat context and logic
├── components/    # Reusable UI components
├── pages/         # Page components (routes)
├── theme/         # Theme provider and configuration
├── types/         # TypeScript type definitions
└── utils/         # Utility functions
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API base URL | `http://localhost:8000` |

## Key Dependencies

- `react` ^19.2.0 - UI library
- `antd` ^6.2.3 - Component library
- `axios` ^1.13.4 - HTTP client
- `react-router-dom` ^7.13.0 - Routing
- `tailwindcss` ^4.1.18 - Utility CSS
- `uuid` ^13.0.0 - Unique ID generation

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

This project is part of a personal portfolio.
