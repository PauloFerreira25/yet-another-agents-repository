#!/usr/bin/env node
import { Command } from 'commander';
import { add } from './commands/add.js';
import { update } from './commands/update.js';
import { remove } from './commands/remove.js';
import { list } from './commands/list.js';

const program = new Command();

program
  .name('yaar')
  .description('Yet Another Agents Repository CLI')
  .version('0.1.0');

program
  .command('add <agent>')
  .description('Add an agent to the current project')
  .option('-s, --source <owner/repo>', 'Source repository', 'PauloFerreira25/yet-another-agents-repository')
  .option('-r, --ref <ref>', 'Git ref (branch, tag or commit)', 'main')
  .action(async (agent: string, options: { source?: string; ref?: string }) => {
    await add(agent, options).catch(err => {
      console.error(err.message);
      process.exit(1);
    });
  });

program
  .command('update [agent]')
  .description('Update all installed agents, or a specific one')
  .action(async (agent?: string) => {
    await update(agent).catch(err => {
      console.error(err.message);
      process.exit(1);
    });
  });

program
  .command('remove <agent>')
  .description('Remove an agent from the current project')
  .action(async (agent: string) => {
    await remove(agent).catch(err => {
      console.error(err.message);
      process.exit(1);
    });
  });

program
  .command('list [scope]')
  .description('List agents — remote (default) or local')
  .action(async (scope?: string) => {
    await list(scope === 'local' ? 'local' : 'remote').catch(err => {
      console.error(err.message);
      process.exit(1);
    });
  });

program.parse();
