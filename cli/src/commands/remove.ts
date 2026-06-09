import { unlinkSync, existsSync } from 'fs';
import { resolve } from 'path';
import { readConfig, writeConfig } from '../lib/config.js';

export async function remove(agentName: string): Promise<void> {
  const config = readConfig();

  if (!config.agents[agentName]) {
    console.error(`Agent "${agentName}" is not installed.`);
    process.exit(1);
    return;
  }

  console.log(`Removing agent: ${agentName}`);

  for (const filePath of config.agents[agentName].files) {
    const fullPath = resolve(process.cwd(), filePath);
    if (existsSync(fullPath)) {
      unlinkSync(fullPath);
      console.log(`  ✓ removed ${filePath}`);
    }
  }

  delete config.agents[agentName];
  writeConfig(config);

  console.log(`Agent "${agentName}" removed.`);
}
