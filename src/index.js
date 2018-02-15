import { spawn } from 'child_process';

// Startable node processes
const STARTS = ['worker', 'app'];

const { START } = process.env;

// output to shell
const opts = {
  stdio: 'inherit',
  cwd: 'build',
  shell: true,
};

// start node process
if (START && STARTS.includes(START)) {
  spawn('node', [START], opts);
} else {
  throw new Error(`invalid script :${START}`);
}
