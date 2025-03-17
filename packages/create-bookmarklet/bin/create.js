
#!/usr/bin/env node
const fs = require('fs-extra');
const path = require('path');
const inquirer = require('inquirer');
const chalk = require('chalk');
const { promisify } = require('util');

const copy = promisify(fs.copy);
const readJson = promisify(fs.readJson);
const writeJson = promisify(fs.writeJson);
const pathExists = promisify(fs.pathExists);

const LANGUAGES = ['javascript', 'typescript', 'react', 'python', 'ruby'];

async function init() {
    try {
        const { projectName, language, description, author, license } = await inquirer.prompt([
            {
                type: 'input',
                name: 'projectName',
                message: 'Project name:',
                validate: input => {
                    if (!input.trim()) return 'Project name cannot be empty.';
                    if (!/^[a-zA-Z0-9-_]+$/.test(input)) return 'Invalid characters in project name. Use only letters, numbers, hyphens, and underscores.';
                    return true;
                }
            },
            {
                type: 'list',
                name: 'language',
                message: 'Choose language:',
                choices: LANGUAGES
            },
            {
                type: 'input',
                name: 'description',
                message: 'Project description (optional):',
            },
            {
                type: 'input',
                name: 'author',
                message: 'Author (optional):',
            },
            {
                type: 'input',
                name: 'license',
                message: 'License (e.g., MIT, GPL-3.0, etc.) (optional):',
            }
        ]);

        const targetDir = path.resolve(projectName);
        const templateDir = path.join(__dirname, '../templates', language);

        // Check if template directory exists
        if (!(await pathExists(templateDir))) {
            console.error(chalk.red(`Template directory not found: ${templateDir}`));
            process.exit(1);
        }

        // Check if target directory exists
        if (await pathExists(targetDir)) {
            const { overwrite } = await inquirer.prompt([
                {
                    type: 'confirm',
                    name: 'overwrite',
                    message: `Directory ${projectName} already exists. Overwrite?`,
                    default: false
                }
            ]);
            if (!overwrite) {
                console.log(chalk.yellow('Operation cancelled.'));
                process.exit(0); // Exit cleanly
            }
            await fs.remove(targetDir); // Remove existing directory
        }


        // Copy template
        await copy(templateDir, targetDir);

        // Update package.json
        const pkgPath = path.join(targetDir, 'package.json');
        const pkg = await readJson(pkgPath);
        pkg.name = projectName.toLowerCase().replace(/ /g, '-');
        pkg.description = description;
        pkg.author = author;
        pkg.license = license;
        await writeJson(pkgPath, pkg, { spaces: 2 });

        console.log(chalk.green(`
Project created in ${targetDir}
Next steps:
  cd ${projectName}
  npm install
  npm run build
  `));

    } catch (error) {
        console.error(chalk.red('An error occurred:'), error);
        process.exit(1); // Exit with an error code
    }
}

init();
