# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Essential Commands
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run generate` - Generate static site

### Code Quality
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Run ESLint with auto-fix and format with Prettier
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting

## Project Architecture

### Tech Stack
- **Framework**: Nuxt 3 with TypeScript
- **UI Framework**: Nuxt UI with Tailwind CSS 4
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth with Google OAuth
- **Search**: Algolia for artist/music search
- **State Management**: Pinia with persistence
- **Styling**: Tailwind CSS with Prettier plugin

### Core Features
This is a music platform called "Comeback" that allows users to:
- Track music releases by artists
- Create and manage artist profiles
- Import music from YouTube playlists
- Search artists and music via Algolia
- Admin dashboard for content management

### Directory Structure
- `components/` - Vue components (PascalCase naming)
- `composables/` - Reusable logic (useXXX naming)
- `pages/` - File-based routing
- `middleware/` - Route middleware (auth.ts, admin.ts)
- `stores/` - Pinia stores
- `types/` - TypeScript definitions
- `plugins/` - Auto-imported plugins

### Key Architecture Patterns

#### Composables Organization
- `composables/Supabase/` - Database operations per table
- `composables/auth/` - Authentication logic
- Use functional/declarative patterns with Composition API

#### Database Layer
- Supabase client with TypeScript types generated
- Composables like `useSupabaseArtist`, `useSupabaseMusic`, etc.
- Proper error handling with toast notifications

#### Authentication Flow
- Supabase Auth with Google OAuth
- User store with Pinia persistence
- Route protection via middleware
- Role-based access (USER/ADMIN)

#### Search Integration
- Algolia for fast artist/music search
- Dedicated components for search UI
- Real-time search with debouncing

### Development Guidelines

#### Code Style (from .cursor/rules)
- Use Composition API with `<script setup>`
- Prefer functional/declarative patterns
- Use TypeScript throughout (interfaces over types)
- Follow Vue 3 + Nuxt 3 best practices

#### Data Fetching
- Use `useFetch` for SSR-compatible requests
- Use `$fetch` for client-side only requests
- Set `server: false` for client-only data
- Set `lazy: true` for non-critical data

#### Component Guidelines
- Use Nuxt UI components for consistency
- Implement responsive design (mobile-first)
- Use `<NuxtImage>` for images
- Follow PascalCase naming for components

### Environment Variables
Required environment variables:
- `SUPABASE_URL` - Supabase project URL
- `SUPABASE_KEY` - Supabase anon key
- `SUPABASE_SERVICE_KEY` - Supabase service key
- `YOUTUBE_API_KEY` - YouTube Data API key
- `ALGOLIA_APPLICATION_ID` - Algolia application ID
- `ALGOLIA_API_KEY` - Algolia API key
- `ALGOLIA_INDEX_NAME` - Algolia index name

### Database Schema
Key tables:
- `users` - User profiles with roles
- `artists` - Artist information with social/platform links
- `releases` - Music releases
- `musics` - Individual tracks
- `news` - News articles
- Junction tables for many-to-many relationships

### Key Features to Understand
- **Artist Management**: Create, edit, search artists with Algolia
- **Release Tracking**: Manual and automated release creation
- **YouTube Integration**: Import playlists and fetch metadata
- **Admin Dashboard**: Content management interface
- **Authentication**: Google OAuth with role-based access