import pc from 'picocolors';

export function handleError(error: unknown): void {
  if (error instanceof Error) {
    console.error(pc.red(`Error: ${error.message}`));
  } else {
    console.error(pc.red('An unexpected error occurred'));
  }
  process.exit(1);
}

export function displayErrorAndExit(message: string): never {
  console.error(pc.red(`Error: ${message}`));
  process.exit(1);
}

export function displaySuccess(message: string): void {
  console.log(pc.green(`✓ ${message}`));
}
