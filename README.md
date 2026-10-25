# deepak_finacplus

Playwright UI and API automation in JavaScript. The suite covers DemoQA Book Store flows in the browser and a ReqRes user lifecycle over HTTP (create, fetch, update, delete, then confirm the user is gone).

Shared fixtures live in `fixtures.js`. UI tests use page objects and test data. API tests use an API client, helpers, and constants, with environment values in `config/dev.json`.

## Load the project

1. Clone the repository and open the project folder:

```sh
git clone https://github.com/deepakboinpally/deepak_finacplus.git
cd deepak_finacplus
```

2. Install Node.js dependencies:

```sh
npm ci
```

3. Install the Chromium browser used by Playwright:

```sh
npx playwright install chromium
```

4. Create a `.env` file in the project root and add the ReqRes API key:

```
REQRES_API_KEY=pro_fc5f531f32440b88b19b8f533ab5539a17254ce0de45e1c7e35f7f8bf801078b
```

You can copy `.env.example` and replace the placeholder with the key above.

5. Confirm the key is loaded, then run the tests (see commands below).

## Run the tests

From the `deepak_finacplus` folder:

```sh
npx playwright test tests/ui/demoqa.spec.js
npx playwright test tests/api/reqres.spec.js
```

Open the HTML report after a run:

```sh
npx playwright show-report
```

## What the tests do

**UI (`tests/ui/demoqa.spec.js`)**  
Opens DemoQA, logs in to the Book Store, searches for books, writes details under `test-results/`, and logs out.

**API (`tests/api/reqres.spec.js`)**  
Creates a user on ReqRes, fetches it, updates it, deletes it, and checks that a later GET returns 404. Failed deletes are reported after the suite so leftover records can be cleaned up.

## Project structure

- `fixtures.js` — shared fixtures: DemoQA base URL, Book Store page object, and the ReqRes API client
- `config/` — environment settings (`dev.json` has DemoQA and ReqRes URLs plus `projectId`)
- `helpers/apiHelpers/` — base API client, response logging, cleanup, and the ReqRes client
- `tests/page-objects/` — UI page helpers
- `tests/test-data/` — UI test data
- `tests/constants/` — API payloads
- `tests/actions/` — helpers such as writing book details to a file
- `tests/ui/` — UI specs
- `tests/api/` — API specs
- `.env` — local secrets (gitignored); `.env.example` is the template
