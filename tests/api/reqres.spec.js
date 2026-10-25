import { test, expect } from '../../fixtures';
import { logResponseBody, cleanUpUser } from '../../helpers/apiHelpers/apiUtilities';
import userData from '../constants/reqresUserData';

const { CREATE_USER, UPDATED_USER_DATA } = userData;

test.describe('ReqRes user lifecycle', () => {
  const missedCleanUpData = [];
  let createdUserId;

  // Reset the tracked user ID before each test so cleanup only targets this test's user.
  test.beforeEach(() => {
    createdUserId = null;
  });

  // Remove the created user after each test, including when an earlier assertion fails.
  test.afterEach(async ({ reqres }) => {
    const cleanUp = await cleanUpUser(reqres, createdUserId, test.info().title);
    if (cleanUp) {
      missedCleanUpData.push(cleanUp);
    }
    createdUserId = null;
  });

  // Report any users that could not be removed automatically.
  test.afterAll(() => {
    if (missedCleanUpData.length > 0) {
      console.log('Data cleanup incomplete for the following users, please manually clean these!!!');
      missedCleanUpData.forEach((item) => {
        console.log(item);
      });
    }
  });

  test('create, fetch, update, and delete a user', async ({ reqres }) => {
    let userId;

    // Create a user and save its ID for the remaining requests and cleanup.
    await test.step('Create a user, validate status 201, and store userId', async () => {
      const response = await reqres.createUser(CREATE_USER);
      const responseBody = await logResponseBody(response);

      expect(response.status(), 'Expected user creation to return 201').toBe(201);
      expect(responseBody.data.data).toMatchObject(CREATE_USER);
      expect(responseBody.data.id).toBeTruthy();

      userId = responseBody.data.id;
      createdUserId = userId;
    });

    // Fetch the user by ID and confirm the API returns the created details.
    await test.step('Get the created user and validate the stored details', async () => {
      const response = await reqres.getUser(userId);
      const responseBody = await logResponseBody(response);

      expect(response.status(), 'Expected to fetch created user').toBe(200);
      expect(responseBody.data).toMatchObject({
        id: userId,
        data: CREATE_USER,
      });
    });

    // Update the user's details and verify the response contains the new values.
    await test.step("Update the user's name and validate the response", async () => {
      const response = await reqres.updateUser(userId, UPDATED_USER_DATA);
      const responseBody = await logResponseBody(response);

      expect(response.status(), 'Expected user update to return 200').toBe(200);
      expect(responseBody.data).toMatchObject({
        id: userId,
        data: UPDATED_USER_DATA,
      });
    });

    // Fetch the user again to verify the updated details are returned.
    await test.step('Get the user again and confirm the updated details', async () => {
      const response = await reqres.getUser(userId);
      const responseBody = await logResponseBody(response);

      expect(response.status(), 'Expected to fetch updated user').toBe(200);
      expect(responseBody.data.id).toBe(userId);
      expect(responseBody.data.data).toMatchObject(UPDATED_USER_DATA);
    });

    // Delete the user and clear its tracked ID to prevent duplicate cleanup.
    await test.step('Delete the created user as cleanup', async () => {
      const response = await reqres.deleteUser(userId);
      const responseBody = await logResponseBody(response);

      expect([200, 204], 'Expected user deletion to return 200 or 204').toContain(response.status());
      if (responseBody?.data?.id) {
        expect(responseBody.data.id).toBe(userId);
      }
      createdUserId = null;
    });

    // Confirm the deleted user is no longer available.
    await test.step('Confirm the deleted user can no longer be fetched', async () => {
      const response = await reqres.getUser(userId);
      await logResponseBody(response);

      expect(response.status(), 'Expected deleted user to return 404').toBe(404);
    });
  });
});
