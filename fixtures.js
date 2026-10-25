import { test as base, expect } from '@playwright/test';
import config from './config/dev.json';
import { BookStore } from './tests/page-objects/bookStorePage';
import reqresAPI from './helpers/apiHelpers/clients/reqresAPI';

export const test = base.extend({
    uibaseURL: async ({}, use) => {
        await use(config.demoqa.baseURL);
    },
    apiBaseURL: async ({}, use) => {
        await use(config.reqres.baseURL);
    },
    bookStorePage: async ({ page }, use) =>{
        const bookStorePage = new BookStore(page);
        await use(bookStorePage);
    },
    reqres: async ({}, use) => {
        const reqres = await reqresAPI.connect();
        await use(reqres);
        await reqres.dispose();
    },
});

export { expect };
