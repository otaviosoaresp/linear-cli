# Linear CLI

A command-line interface for Linear, inspired by the GitHub CLI.

## Installation

```bash
npm install
npm run build
npm link
```

## Authentication

Before using the CLI, you need to authenticate with your Linear API key:

```bash
linear auth login
```

Get your API key from: https://linear.app/settings/api

Alternatively, set the `LINEAR_API_KEY` environment variable.

## Usage

### List Issues

```bash
# List all issues
linear issue list

# Filter by status
linear issue list --status "In Progress"

# Filter by assignee
linear issue list --assignee user@example.com

# Filter by label
linear issue list --label bug

# Limit results
linear issue list --limit 10

# Combine filters
linear issue list --status "Todo" --label feature --limit 20
```

### View Issue Details

```bash
linear issue view LIN-123
```

### Comments

```bash
# List comments on an issue
linear issue comment list LIN-123

# Create a comment
linear issue comment create LIN-123 --body "This is a comment"
```

## Configuration

Configuration is stored in `~/.config/linear-cli/config.json`

## Development

```bash
# Build
npm run build

# Watch mode
npm run dev
```

## Project Structure

```
src/
  commands/     # CLI commands
    auth/       # Authentication commands
    issue/      # Issue-related commands
  core/         # Core functionality
    config.ts   # Configuration management
    client.ts   # Linear client initialization
  utils/        # Utility functions
    display.ts  # Output formatting
    errors.ts   # Error handling
  index.ts      # Entry point
```
