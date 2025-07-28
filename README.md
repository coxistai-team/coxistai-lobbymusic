# CoXistAI Lobby Music

A modern, animated contact form with Supabase integration and enterprise-level code formatting.

## Features

- ✨ Beautiful animated UI with Framer Motion
- 🎨 Interactive particle effects and grid patterns
- 📝 Contact form with Supabase integration
- 🎯 Enterprise-level code formatting with Prettier
- 🔧 ESLint integration for code quality
- 📱 Responsive design with Tailwind CSS

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Database**: Supabase
- **UI Components**: shadcn/ui
- **Code Quality**: ESLint + Prettier
- **Package Manager**: pnpm

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm (recommended) or npm

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd coxistai-lobbymusic
```

2. Install dependencies:

```bash
pnpm install
```

3. Set up environment variables:

```bash
cp .env.example .env.local
# Add your Supabase credentials
```

4. Run the development server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Available Scripts

### Development

- `pnpm dev` - Start development server with Turbopack
- `pnpm build` - Build for production
- `pnpm start` - Start production server

### Code Quality

- `pnpm lint` - Run ESLint
- `pnpm format` - Format code with Prettier
- `pnpm format:check` - Check code formatting
- `pnpm format:fix` - Format code and fix ESLint issues

## Code Formatting

This project uses **Prettier** for consistent code formatting with enterprise-level configuration:

### Configuration Files

- `.prettierrc` - Prettier configuration
- `.prettierignore` - Files to ignore during formatting
- `.eslintrc.json` - ESLint configuration with Prettier integration
- `.vscode/settings.json` - VS Code settings for auto-formatting

### Formatting Rules

- **Semicolons**: Required
- **Quotes**: Double quotes
- **Line Length**: 80 characters (100 for JSON/MD/YAML)
- **Indentation**: 2 spaces
- **Trailing Commas**: ES5 compatible

### VS Code Integration

The project includes VS Code settings for:

- Auto-formatting on save
- ESLint auto-fix on save
- Import organization
- Tailwind CSS IntelliSense

### Pre-commit Hooks

The project is configured with:

- **Husky** for Git hooks
- **lint-staged** for staged file processing
- Automatic formatting and linting on commit

## Project Structure

```
coxistai-lobbymusic/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   └── ContactForm.tsx   # Main contact form
├── lib/                  # Utility functions
│   ├── supabase.ts       # Supabase client
│   └── utils.ts          # Helper functions
├── public/               # Static assets
└── configuration files   # Prettier, ESLint, etc.
```

## Environment Variables

Create a `.env.local` file with:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Database Schema

The project expects a `subscribers` table in Supabase with:

- `id` (uuid, primary key)
- `name` (text)
- `email` (text)
- `created_at` (timestamp)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run `pnpm format:fix` to ensure proper formatting
5. Run `pnpm lint` to check for issues
6. Submit a pull request

## License

© 2025 CoXistAI. Pioneering the future of artificial intelligence.
