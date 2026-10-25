import { readFileSync } from 'fs';
import { join } from 'path';

class APIClient {
  constructor() {}

  getEnvVariables() {
    const nodeEnv = process.env.NODE_ENV || 'dev';
    const configPath = join(process.cwd(), 'config', `${nodeEnv}.json`);
    return JSON.parse(readFileSync(configPath, 'utf8'));
  }
}

export default APIClient;
