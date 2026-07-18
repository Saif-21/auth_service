import path from 'path';
import fs from 'fs';
import { Express } from 'express';
import chalk from 'chalk';

export const loadRoutes = (app: Express) => {
  const modulesPath = path.join(__dirname, '../modules');

  if (!fs.existsSync(modulesPath)) {
    console.log(chalk.red(`Modules path not found: ${modulesPath}`));
    return;
  }

  const moduleFolders = fs.readdirSync(modulesPath);

  for (const moduleName of moduleFolders) {
    const routeDir = path.join(modulesPath, moduleName, 'routes');

    if (!fs.existsSync(routeDir)) {
      console.log(chalk.red(`No routes folder in module: ${moduleName}`));
      continue;
    }

    const routeFiles = fs.readdirSync(routeDir);

    for (const file of routeFiles) {
      const isRouteFile = (file.endsWith('.ts') || file.endsWith('.js')) &&
        !file.endsWith('.swagger.ts') &&
        !file.endsWith('.swagger.js');

      if (isRouteFile) {
        const routePath = path.join(routeDir, file);

        try {
          const routeModule = require(routePath);

          if (typeof routeModule.default === 'function') {
            routeModule.default(app);
            console.log(chalk.cyan(`✔ Loaded route: ${routePath}`));
          } else {
            console.log(
              chalk.red(`✖ No default export function: ${routePath}`)
            );
          }
        } catch (error) {
          console.log(chalk.red(`✖ Failed to load route: ${routePath}`));

          if (error instanceof Error) {
            console.error(`   → ${error.message}`);
          }
        }
      }
    }
  }
};