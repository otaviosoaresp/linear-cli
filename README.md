# Linear CLI

[![npm version](https://badge.fury.io/js/@scmfury%2Flinear-cli.svg)](https://www.npmjs.com/package/@scmfury/linear-cli)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A modern command-line interface for Linear that brings powerful issue management directly to your terminal.

**Features:** Advanced filtering with exclusions, smart sorting, native Linear colors, and an intuitive interface inspired by GitHub CLI.

---

## Table of Contents

- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Authentication](#authentication)
- [Commands](#commands)
  - [Authentication](#authentication-commands)
  - [Issues](#issue-commands)
  - [Comments](#comment-commands)
- [Advanced Usage](#advanced-usage)
  - [Filtering](#filtering)
  - [Exclusion Filters](#exclusion-filters)
  - [Sorting](#sorting)
  - [Combining Filters](#combining-filters)
- [Examples](#examples)
- [Configuration](#configuration)
- [Development](#development)
- [Troubleshooting](#troubleshooting)

---

## Features

- **List and view issues** with rich, colorized output
- **Advanced filtering** by status, assignee, labels, and more
- **Exclusion filters** to remove unwanted results
- **Smart sorting** by updated date, created date, priority, or title
- **Native Linear colors** - status and labels use your workspace's configured colors
- **Comment management** - read and create issue comments
- **Clean table layout** with proper alignment and color support

---

## Prerequisites

- Node.js >= 18.0.0
- npm or yarn
- A Linear account with API access

---

## Installation

### npm (Recommended)

Install globally via npm:

```bash
npm install -g @scmfury/linear-cli
```

Verify installation:

```bash
linear --version
linear --help
```

### From Source (Development)

For development or contributing:

```bash
# Clone the repository
git clone https://github.com/otaviosoaresp/linear-cli.git
cd linear-cli

# Install dependencies
npm install

# Build the project
npm run build

# Link globally (makes 'linear' command available)
npm link
```

---

## Authentication

Before using the CLI, you must authenticate with your Linear API key.

### Get Your API Key

1. Go to https://linear.app/settings/api
2. Generate a new Personal API Key
3. Copy the key (starts with `lin_api_`)

### Login

```bash
linear auth login
```

You'll be prompted to enter your API key. The key is stored securely in `~/.config/linear-cli/config.json`.

### Alternative: Environment Variable

```bash
export LINEAR_API_KEY="lin_api_your_key_here"
```

---

## Commands

### Authentication Commands

#### `linear auth login`

Authenticate with your Linear API key.

```bash
linear auth login
```

---

### Issue Commands

#### `linear issue list [options]`

List issues with optional filtering and sorting.

**Options:**

```
--status <status...>           Filter by status (supports multiple values)
--assignee <email...>          Filter by assignee email
--label <label...>             Filter by label
--exclude-status <status...>   Exclude issues with these statuses
--exclude-assignee <email...>  Exclude issues assigned to these users
--exclude-label <label...>     Exclude issues with these labels
--sort <field>                 Sort by: updated, created, priority, title (default: updated)
--order <order>                Sort order: asc, desc (default: desc)
--limit <number>               Limit number of results (default: 50)
```

**Examples:**

```bash
# List all issues
linear issue list

# List issues with limit
linear issue list --limit 20

# Filter by status
linear issue list --status "In Progress"

# Multiple statuses
linear issue list --status "In Progress" "Todo"

# Exclude completed issues
linear issue list --exclude-status "Done" "Canceled"

# Sort by priority
linear issue list --sort priority

# Filter and sort
linear issue list --status "In Progress" --sort created --limit 10
```

#### `linear issue view <issue-id>`

View detailed information about a specific issue.

**Example:**

```bash
linear issue view LIN-123
```

**Output includes:**
- Issue title and identifier
- Status (with color)
- Assignee
- Creator
- Team
- Priority (with color)
- Labels (with colors)
- Dates (created, updated, due)
- Estimate
- Description
- URL

---

### Comment Commands

#### `linear issue comment list <issue-id>`

List all comments on an issue.

```bash
linear issue comment list LIN-123
```

#### `linear issue comment create <issue-id> --body <text>`

Create a new comment on an issue.

```bash
linear issue comment create LIN-123 --body "This looks great!"
```

---

## Advanced Usage

### Filtering

Filter issues using `--status`, `--assignee`, or `--label` flags. All filters support multiple values.

```bash
# Single value
linear issue list --status "In Progress"

# Multiple values
linear issue list --status "In Progress" "Todo" "Backlog"

# Multiple filter types
linear issue list --status "In Progress" --label "bug" --assignee "user@example.com"
```

### Exclusion Filters

Exclude specific issues using exclusion flags. This is perfect for filtering out completed or canceled work.

```bash
# Exclude by status
linear issue list --exclude-status "Done" "Canceled"

# Exclude by label
linear issue list --exclude-label "wont-fix" "duplicate"

# Exclude by assignee
linear issue list --exclude-assignee "bot@example.com"

# Combine inclusion and exclusion
linear issue list --status "In Progress" --exclude-label "blocked"
```

### Sorting

Sort results using the `--sort` flag.

**Available sort fields:**
- `updated` - Last updated date (default)
- `created` - Creation date
- `priority` - Priority level
- `title` - Alphabetical by title

**Sort order:**
- `desc` - Descending (default)
- `asc` - Ascending

```bash
# Most recently updated (default)
linear issue list --sort updated

# Oldest first
linear issue list --sort created --order asc

# Highest priority first
linear issue list --sort priority

# Alphabetical
linear issue list --sort title --order asc
```

### Combining Filters

Combine multiple filters, exclusions, and sorting for powerful queries.

```bash
# Active bugs, sorted by priority
linear issue list --label "bug" --exclude-status "Done" --sort priority

# My issues that aren't blocked
linear issue list --assignee "me@example.com" --exclude-label "blocked"

# Recent backlog items
linear issue list --status "Backlog" --sort created --limit 20

# Everything except done/canceled, sorted by update
linear issue list --exclude-status "Done" "Canceled" --sort updated
```

---

## Examples

### Daily Workflow

```bash
# Check what's in progress
linear issue list --status "In Progress"

# See your assigned issues
linear issue list --assignee "your.email@company.com"

# Review backlog by priority
linear issue list --status "Backlog" --sort priority --limit 10
```

### Bug Triage

```bash
# All open bugs
linear issue list --label "bug" --exclude-status "Done"

# High priority bugs
linear issue list --label "bug" --sort priority --limit 5

# Unassigned bugs
linear issue list --label "bug" --exclude-status "Done" --assignee "Unassigned"
```

### Sprint Planning

```bash
# Everything except done/canceled
linear issue list --exclude-status "Done" "Canceled" --limit 50

# Backlog sorted by priority
linear issue list --status "Backlog" --sort priority

# Recently updated issues
linear issue list --sort updated --limit 20
```

### Issue Investigation

```bash
# View issue details
linear issue view CAR-123

# Read comments
linear issue comment list CAR-123

# Add a comment
linear issue comment create CAR-123 --body "Investigating this issue"
```

---

## Configuration

Configuration is stored in `~/.config/linear-cli/config.json`

**Structure:**
```json
{
  "apiKey": "lin_api_..."
}
```

You can also use the `LINEAR_API_KEY` environment variable, which takes precedence over the config file.

---

## Development

### Build

```bash
npm run build
```

### Watch Mode

```bash
npm run dev
```

### Project Structure

```
linear-cli/
├── src/
│   ├── commands/
│   │   ├── auth/
│   │   │   └── login.ts           # Authentication
│   │   └── issue/
│   │       ├── list.ts            # List issues with filters
│   │       ├── view.ts            # View issue details
│   │       └── comment.ts         # Comment management
│   ├── core/
│   │   ├── config.ts              # Config management
│   │   └── client.ts              # Linear API client
│   ├── utils/
│   │   ├── colors.ts              # Color conversion and badges
│   │   ├── display.ts             # Table and output formatting
│   │   ├── errors.ts              # Error handling
│   │   └── filters.ts             # Filter parsing and building
│   └── index.ts                   # CLI entry point
├── dist/                          # Compiled output
├── package.json
├── tsconfig.json
└── README.md
```

---

## Troubleshooting

### Command not found: linear

Make sure you ran `npm link` after building:

```bash
npm run build
npm link
```

### Authentication errors

Verify your API key is valid:

```bash
# Re-authenticate
linear auth login

# Or set environment variable
export LINEAR_API_KEY="lin_api_your_key_here"
```

### Colors not showing

Colors should work automatically in most terminals. If colors aren't appearing, ensure your terminal supports ANSI colors.

### Issues not showing

Check your filters - you might be excluding everything:

```bash
# List without filters first
linear issue list --limit 5
```

### TypeScript errors during build

Make sure you have the correct Node.js version and all dependencies installed:

```bash
node --version  # Should be >= 18.0.0
npm install
npm run build
```

---

## Tech Stack

- **TypeScript** - Type-safe development
- **Linear SDK** - Official Linear GraphQL client
- **Commander.js** - CLI framework
- **Picocolors** - Terminal colors

---

## License

MIT

---

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
