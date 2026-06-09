import { readFileSync, existsSync, unlinkSync } from 'fs';
import { resolve } from 'path';
import { downloadFile, parseRulesFromAgent } from '../lib/downloader.js';
import { readConfig, writeConfig } from '../lib/config.js';

export async function update(agentName?: string): Promise<void> {
  const config = readConfig();
  const [owner, repo] = config.source.split('/');
  const { ref } = config;

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

    console.log(`Updating agent: ${name}`);

    const agentRemotePath = `agents-src/agents/${name}.md`;
    const agentLocalPath = `.claude/agents/${name}.md`;
    const oldRules = config.agents[name].rules;

    await downloadFile(owner, repo, ref, agentRemotePath, agentLocalPath);
    console.log(`  ✓ ${agentLocalPath}`);

    const agentContent = readFileSync(resolve(process.cwd(), agentLocalPath), 'utf-8');
    const ruleFiles = parseRulesFromAgent(agentContent);
    const downloadedRules: string[] = [];

    for (const rulePath of ruleFiles) {
      const remoteRulePath = `agents-src/.ia/.rules/${rulePath.replace(/^\.ia\/rules\//, '')}`;
      await downloadFile(owner, repo, ref, remoteRulePath, rulePath);
      console.log(`  ✓ ${rulePath}`);
      downloadedRules.push(rulePath);
    }

    const removedRules = oldRules.filter(r => !downloadedRules.includes(r));
    for (const rulePath of removedRules) {
      const fullPath = resolve(process.cwd(), rulePath);
      if (existsSync(fullPath)) {
        unlinkSync(fullPath);
        console.log(`  ✗ removed ${rulePath}`);
      }
    }

    config.agents[name] = {
      agent: agentLocalPath,
      rules: downloadedRules,
      ...(config.agents[name].entrypoint && { entrypoint: true }),
    };
  }

  writeConfig(config);
  console.log('Update complete.');
}
