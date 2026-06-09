import { unlinkSync, existsSync, readFileSync, writeFileSync } from 'fs';
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

  const entry = config.agents[agentName];
  if (entry.entrypoint) {
    const reference = `@${entry.entrypoint}`;
    const claudeMdPath = resolve(process.cwd(), 'CLAUDE.md');
    if (existsSync(claudeMdPath)) {
      const content = readFileSync(claudeMdPath, 'utf-8');
      const updated = content.split('\n').filter(line => line.trim() !== reference).join('\n');
      if (updated !== content) {
        writeFileSync(claudeMdPath, updated, 'utf-8');
        console.log(`  ✓ CLAUDE.md reference removed`);
      }
    }
  }

  delete config.agents[agentName];
  writeConfig(config);

  console.log(`Agent "${agentName}" removed.`);
}
