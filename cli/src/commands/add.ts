import { readFileSync } from 'fs';
import { resolve } from 'path';
import { downloadFile, parseRulesFromAgent } from '../lib/downloader.js';
import { getOrCreateConfig, writeConfig, DEFAULT_SOURCE, DEFAULT_REF } from '../lib/config.js';

export async function add(
  agentName: string,
  options: { source?: string; ref?: string }
): Promise<void> {
  const source = options.source ?? DEFAULT_SOURCE;
  const ref = options.ref ?? DEFAULT_REF;
  const [owner, repo] = source.split('/');

  const config = getOrCreateConfig(source, ref);

  console.log(`Adding agent: ${agentName}`);

  const agentRemotePath = `agents-src/agents/${agentName}.md`;
  const agentLocalPath = `.claude/agents/${agentName}.md`;

  await downloadFile(owner, repo, ref, agentRemotePath, agentLocalPath);
  console.log(`  ✓ ${agentLocalPath}`);

  const agentContent = readFileSync(resolve(process.cwd(), agentLocalPath), 'utf-8');
  const ruleFiles = parseRulesFromAgent(agentContent);

  const downloadedFiles = [agentLocalPath];

  for (const rulePath of ruleFiles) {
    const remoteRulePath = `agents-src/${rulePath}`;
    await downloadFile(owner, repo, ref, remoteRulePath, rulePath);
    console.log(`  ✓ ${rulePath}`);
    downloadedFiles.push(rulePath);
  }

  config.agents[agentName] = { files: downloadedFiles };
  writeConfig(config);

  console.log(`Agent "${agentName}" added successfully.`);
}
