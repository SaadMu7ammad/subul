const shell = require('shelljs');
const path = require('path');
const { spawn } = require('child_process');

// Get the list of changed files
const changedFiles = shell
  .exec('git diff --cached --name-only', { silent: true })
  .stdout.trim()
  .split('\n');

// Get unique parent directories for the changed files
const directories = new Set();
changedFiles.forEach(file => {
  const dir = path.dirname(file);
  if (dir.startsWith('src/components/')) {
    const componentsDir = dir.split(path.sep).slice(0, 3).join(path.sep);
    const parentDir = path.join('src', 'components', componentsDir.split(path.sep).slice(2, 3).join(path.sep));
    directories.add(parentDir);
  }
});

// Print a pretty message
if (directories.size > 0) {
  console.log('Running tests for the following directories:');
  directories.forEach(dir => console.log(`- ${dir}`));
} else {
  console.log('No changes in src/components/, skipping tests.');
}

// Build the test command arguments
const testArgs = [];
directories.forEach(dir => {
  testArgs.push(dir);
});
testArgs.push('--runInBand');

// Run the Jest command only if there are directories to test
if (directories.size > 0) {
  const jestProcess = spawn('npx', ['jest', ...testArgs], { stdio: 'inherit' });

  jestProcess.on('close', code => {
    process.exit(code);
  });
} else {
  console.log('No changes in src/components/, skipping tests.');
  process.exit(0);
}

