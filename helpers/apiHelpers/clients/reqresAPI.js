import { request } from '@playwright/test';
import APIClient from '../APIClient';

class reqresAPI extends APIClient {
  constructor() {
    super();
  }

  static async connect() {
    const instance = new reqresAPI();
    const envVars = instance.getEnvVariables();
    const apiKey = process.env.REQRES_API_KEY;

    if (!apiKey) {
      throw new Error('REQRES_API_KEY is missing. Set it in your environment or local .env file.');
    }

    instance.baseUrl = envVars.reqres.baseURL;
    instance.projectId = envVars.reqres.projectId;
    instance.apiKey = apiKey;
    instance.req = await request.newContext({
      extraHTTPHeaders: {
        'x-api-key': apiKey,
        'X-Reqres-Env': 'production',
        'Content-Type': 'application/json',
      },
    });
    return instance;
  }

  recordURL(userId) {
    const url = new URL(`${this.baseUrl}/api/collections/users/records${userId ? `/${userId}` : ''}`);
    url.searchParams.set('project_id', this.projectId);
    return url.toString();
  }

  async createUser(userData) {
    return this.req.post(this.recordURL(), {
      data: { data: userData },
    });
  }

  async getUser(userId) {
    return this.req.get(this.recordURL(userId));
  }

  async updateUser(userId, userData) {
    return this.req.put(this.recordURL(userId), {
      data: { data: userData },
    });
  }

  async deleteUser(userId) {
    return this.req.delete(this.recordURL(userId));
  }

  async dispose() {
    await this.req.dispose();
  }
}

export default reqresAPI;
