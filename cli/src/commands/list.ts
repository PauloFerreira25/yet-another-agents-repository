import { listSourceAgents } from '../lib/source.js';
import { readConfig, configExists, DEFAULT_SOURCE, DEFAULT_REF } from '../lib/config.js';

export async function list(scope: 'remote' | 'local' = 'remote', source?: string, ref?: string): Promise<void> {
  if (scope === 'local') {
    if (!configExists()) {
      console.log('No agents installed. Run: yaar add <agent>');
      return;
    }

    const config = readConfig();
    const agents = Object.keys(config.agents);

    if (agents.length === 0) {
      console.log('No agents installed.');
      return;
    }

    console.log('Installed agents:');
    for (const name of agents) {
      const entry = config.agents[name];
      console.log(`  - ${name} (${entry.source}@${entry.ref})`);
    }
    return;
  }

  const resolvedSource = source ?? DEFAULT_SOURCE;
  const resolvedRef = ref ?? DEFAULT_REF;

  console.log(`Available agents (${resolvedSource}@${resolvedRef}):`);
  const agents = await listSourceAgents(resolvedSource, resolvedRef);

  if (agents.length === 0) {
    console.log('  No agents found.');
    return;
  }

  for (const name of agents) {
    console.log(`  - ${name}`);
  }
}
