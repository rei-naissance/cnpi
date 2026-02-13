# CNPI

A URL shortening application built with React, TypeScript, and Supabase. It allows users to create shortened links, manage them through a dashboard, and view detailed click analytics.

## Features

- **Link Shortening**: Generate short URLs with optional custom aliases.
- **Analytics Tracking**: Capture click data including geographic location and device type.
- **QR Code Support**: Automatic QR code generation for every link.
- **Dashboard**: Centralized management for links and performance metrics.
- **Authentication**: Secure user accounts powered by Supabase Auth.

## Tech Stack

- **Core**: React 19, Vite, TypeScript
- **Database/Backend**: Supabase
- **Styling**: Tailwind CSS
- **Components**: Radix UI
- **Visualization**: Recharts
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or pnpm

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/rei-naissance/cnpi.git
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables in a `.env` file:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_KEY=your_supabase_anon_key
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

## Deployment

The application is configured for deployment on Vercel. Ensure environment variables are set in the Vercel project settings.

---

[rei-naissance](https://github.com/rei-naissance)

