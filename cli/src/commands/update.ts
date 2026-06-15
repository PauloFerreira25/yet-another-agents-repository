import { existsSync, unlinkSync } from 'fs';
import { resolve } from 'path';
import { readConfig, writeConfig } from '../lib/config.js';
import { createFetcher as createFetcherDefault, installAgentFiles } from '../lib/source.js';

export interface UpdateDeps {
  createFetcher?: typeof createFetcherDefault;
}

export async function update(agentName?: string, deps: UpdateDeps = {}): Promise<void> {
  const { createFetcher } = { createFetcher: createFetcherDefault, ...deps };
  const config = readConfig();

  const agentsToUpdate = agentName ? [agentName] : Object.keys(config.agents);

  if (agentsToUpdate.length === 0) {
    console.log('No agents installed.');
    return;
  }

  for (const name of agentsToUpdate) {
    if (!config.agents[name]) {
      console.error(`Agent "${name}" is not installed.`);
      continue;
    }

    const entry = config.agents[name];
    const { source, ref } = entry;
    const oldRules = entry.rules;

    console.log(`Updating agent: ${name}`);

    const fetchFile = await createFetcher(source, ref);
    const { agentLocalPath, downloadedRules } = await installAgentFiles(name, fetchFile);

    for (const rulePath of oldRules.filter(r => !downloadedRules.includes(r))) {
      const fullPath = resolve(process.cwd(), rulePath);
      if (existsSync(fullPath)) {
        unlinkSync(fullPath);
        console.log(`  ✗ removed ${rulePath}`);
      }
    }

    config.agents[name] = {
      source,
      ref,
      agent: agentLocalPath,
      rules: downloadedRules,
      ...(entry.entrypoint && { entrypoint: true }),
    };
  }

  writeConfig(config);
  console.log('Update complete.');
}
