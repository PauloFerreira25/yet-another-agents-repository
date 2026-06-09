import { readFileSync, existsSync, writeFileSync } from 'fs';
import { resolve } from 'path';
import { downloadFile, parseRulesFromAgent, parseFrontmatter } from '../lib/downloader.js';
import { getOrCreateConfig, writeConfig, DEFAULT_SOURCE, DEFAULT_REF, AgentEntry } from '../lib/config.js';

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
  const downloadedRules: string[] = [];

  for (const rulePath of ruleFiles) {
    const remoteRulePath = `agents-src/.ia/.rules/${rulePath.replace(/^\.ia\/rules\//, '')}`;
    await downloadFile(owner, repo, ref, remoteRulePath, rulePath);
    console.log(`  ✓ ${rulePath}`);
    downloadedRules.push(rulePath);
  }

  const entry: AgentEntry = { agent: agentLocalPath, rules: downloadedRules };

  const frontmatter = parseFrontmatter(agentContent);
  if (frontmatter.entrypoint === true) {
    const block = `Read the agent below and become it — follow its instructions for every task:\n\n@${agentLocalPath}`;
    const claudeMdPath = resolve(process.cwd(), 'CLAUDE.md');
    const existing = existsSync(claudeMdPath) ? readFileSync(claudeMdPath, 'utf-8') : '';

    if (!existing.includes(block)) {
      const updated = existing ? existing.trimEnd() + '\n\n' + block + '\n' : block + '\n';
      writeFileSync(claudeMdPath, updated, 'utf-8');
      console.log(`  ✓ CLAUDE.md → entrypoint injected`);
    }

    entry.entrypoint = true;
  }

  config.agents[agentName] = entry;
  writeConfig(config);

  console.log(`Agent "${agentName}" added successfully.`);
}
