import { readFileSync, existsSync, writeFileSync } from 'fs';
import { resolve } from 'path';
import { parseFrontmatter, parseSkillsFromAgent } from '../lib/downloader.js';
import { getOrCreateConfig, writeConfig, DEFAULT_SOURCE, DEFAULT_REF, AgentEntry } from '../lib/config.js';
import { createFetcher, installAgentFiles } from '../lib/source.js';
import { checkRequiredSkills, missingSkillsError } from '../lib/skills.js';

export async function add(
  agentName: string,
  options: { source?: string; ref?: string }
): Promise<void> {
  const source = options.source ?? DEFAULT_SOURCE;
  const ref = options.ref ?? DEFAULT_REF;

  const config = getOrCreateConfig();

  console.log(`Adding agent: ${agentName}`);

  const fetchFile = await createFetcher(source, ref);
  const { agentLocalPath, agentContent, downloadedRules } = await installAgentFiles(agentName, fetchFile);

  const missingSkills = checkRequiredSkills(parseSkillsFromAgent(agentContent));
  if (missingSkills.length > 0) throw missingSkillsError(agentName, missingSkills);

  const entry: AgentEntry = { source, ref, agent: agentLocalPath, rules: downloadedRules };

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
