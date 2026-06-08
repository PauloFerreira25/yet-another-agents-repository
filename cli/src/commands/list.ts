import { listRemoteAgents } from '../lib/downloader.js';
import { readConfig, configExists, DEFAULT_SOURCE, DEFAULT_REF } from '../lib/config.js';

export async function list(scope: 'remote' | 'local' = 'remote'): Promise<void> {
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

    console.log(`Installed agents (${config.source}@${config.ref}):`);
    for (const name of agents) {
      console.log(`  - ${name}`);
    }
    return;
  }

  const source = configExists() ? readConfig().source : DEFAULT_SOURCE;
  const ref = configExists() ? readConfig().ref : DEFAULT_REF;
  const [owner, repo] = source.split('/');

  console.log(`Available agents (${source}@${ref}):`);
  const agents = await listRemoteAgents(owner, repo, ref);

  if (agents.length === 0) {
    console.log('  No agents found.');
    return;
  }

  for (const name of agents) {
    console.log(`  - ${name}`);
  }
}
