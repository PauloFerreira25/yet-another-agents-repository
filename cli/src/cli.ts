import { Command } from 'commander';
import { add as addFn } from './commands/add.js';
import { update as updateFn } from './commands/update.js';
import { remove as removeFn } from './commands/remove.js';
import { list as listFn } from './commands/list.js';

export interface ProgramDeps {
  add: typeof addFn;
  update: typeof updateFn;
  remove: typeof removeFn;
  list: typeof listFn;
}

export function createProgram(deps?: Partial<ProgramDeps>): Command {
  const { add, update, remove, list } = {
    add: addFn,
    update: updateFn,
    remove: removeFn,
    list: listFn,
    ...deps,
  };

  const program = new Command();

  program
    .name('yaar')
    .description('Yet Another Agents Repository CLI')
    .version('0.1.0');

  program
    .command('add <agents...>')
    .description('Add one or more agents to the current project')
    .option('-s, --source <owner/repo>', 'Source repository', 'PauloFerreira25/yet-another-agents-repository')
    .option('-r, --ref <ref>', 'Git ref (branch, tag or commit)', 'main')
    .action(async (agents: string[], options: { source?: string; ref?: string }) => {
      for (const agent of agents) {
        await add(agent, options).catch(err => {
          console.error(err.message);
          process.exit(1);
        });
      }
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
    .command('remove <agents...>')
    .description('Remove one or more agents from the current project')
    .action(async (agents: string[]) => {
      for (const agent of agents) {
        await remove(agent).catch(err => {
          console.error(err.message);
          process.exit(1);
        });
      }
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

  return program;
}
