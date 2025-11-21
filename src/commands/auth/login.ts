import { LinearClient } from '@linear/sdk';
import { setApiKey } from '../../core/config';
import { displaySuccess, handleError } from '../../utils/errors';
import * as readline from 'readline';

async function promptForApiKey(): Promise<string> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question('Enter your Linear API key: ', (answer) => {
      rl.close();
      resolve(answer.trim());
    });
  });
}

async function validateApiKey(apiKey: string): Promise<boolean> {
  try {
    const client = new LinearClient({ apiKey });
    await client.viewer;
    return true;
  } catch {
    return false;
  }
}

export async function login(): Promise<void> {
  try {
    console.log('Get your API key from: https://linear.app/settings/api');
    console.log();

    const apiKey = await promptForApiKey();

    if (!apiKey) {
      throw new Error('API key is required');
    }

    console.log('Validating API key...');
    const isValid = await validateApiKey(apiKey);

    if (!isValid) {
      throw new Error('Invalid API key');
    }

    setApiKey(apiKey);
    displaySuccess('Authentication successful');
  } catch (error) {
    handleError(error);
  }
}
