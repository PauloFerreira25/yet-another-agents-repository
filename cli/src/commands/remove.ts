import { unlinkSync, existsSync, readFileSync, writeFileSync } from 'fs';
import { resolve } from 'path';
import { readConfig, writeConfig } from '../lib/config.js';

export async function remove(agentName: string): Promise<void> {
  const config = readConfig();

  if (!config.agents[agentName]) {
    throw new Error(`Agent "${agentName}" is not installed.`);
  }

  console.log(`Removing agent: ${agentName}`);

  const entry = config.agents[agentName];

  for (const filePath of [entry.agent, ...entry.rules]) {
    const fullPath = resolve(process.cwd(), filePath);
    if (existsSync(fullPath)) {
      unlinkSync(fullPath);
      console.log(`  ✓ removed ${filePath}`);
    }
  }

  if (entry.entrypoint) {
    const block = `Read the agent below and become it — follow its instructions for every task:\n\n@${entry.agent}`;
    const claudeMdPath = resolve(process.cwd(), 'CLAUDE.md');
    if (existsSync(claudeMdPath)) {
      const content = readFileSync(claudeMdPath, 'utf-8');
      const updated = content.replace(block, '').replace(/\n{3,}/g, '\n\n').trim();
      if (updated !== content.trim()) {
        writeFileSync(claudeMdPath, updated ? updated + '\n' : '', 'utf-8');
        console.log(`  ✓ CLAUDE.md entrypoint removed`);
      }
    }
  }

  delete config.agents[agentName];
  writeConfig(config);

  console.log(`Agent "${agentName}" removed.`);
}
