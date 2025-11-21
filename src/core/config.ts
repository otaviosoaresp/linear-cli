import { homedir } from 'os';
import { join } from 'path';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs';

interface Config {
  apiKey?: string;
}

const CONFIG_DIR = join(homedir(), '.config', 'linear-cli');
const CONFIG_FILE = join(CONFIG_DIR, 'config.json');

export function ensureConfigDirectory(): void {
  if (!existsSync(CONFIG_DIR)) {
    mkdirSync(CONFIG_DIR, { recursive: true });
  }
}

export function loadConfig(): Config {
  ensureConfigDirectory();

  if (!existsSync(CONFIG_FILE)) {
    return {};
  }

  const content = readFileSync(CONFIG_FILE, 'utf-8');
  return JSON.parse(content);
}

export function saveConfig(config: Config): void {
  ensureConfigDirectory();
  writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2));
}

export function getApiKey(): string | undefined {
  const envKey = process.env.LINEAR_API_KEY;
  if (envKey) {
    return envKey;
  }

  const config = loadConfig();
  return config.apiKey;
}

export function setApiKey(apiKey: string): void {
  const config = loadConfig();
  config.apiKey = apiKey;
  saveConfig(config);
}
