import { test, expect } from '../../fixtures';
import { logResponseBody, cleanUpUser } from '../../helpers/apiHelpers/apiUtilities';
import userData from '../constants/reqresUserData';

const { CREATE_USER, UPDATED_USER_DATA } = userData;

test.describe('ReqRes user lifecycle', () => {
  const missedCleanUpData = [];
  let createdUserId;

  // Reset the tracked ID so cleanup only targets a user created by this test.
  test.beforeEach(() => {
    createdUserId = null;
  });

  // Remove a user left behind by a failed test and retain any cleanup failures.
  test.afterEach(async ({ reqres }) => {
    const cleanUp = await cleanUpUser(reqres, createdUserId, test.info().title);
    if (cleanUp) {
      missedCleanUpData.push(cleanUp);
    }
    createdUserId = null;
  });

  // Report any users that could not be removed for manual cleanup.
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

    // Create the user, validate the response, and save its ID for later actions and cleanup.
    await test.step('Create a user, validate status 201, and store userId', async () => {
      const response = await reqres.createUser(CREATE_USER);
      const responseBody = await logResponseBody(response);

      expect(response.status(), 'Create user failed').toBe(201);
      expect(responseBody.data.data, 'Created user details did not match the request').toMatchObject(CREATE_USER);
      expect(responseBody.data.id, 'Create response did not include a user ID').toBeTruthy();

      userId = responseBody.data.id;
      createdUserId = userId;
    });

    // Fetch the new user and verify the API stored the submitted details.
    await test.step('Get the created user and validate the stored details', async () => {
      const response = await reqres.getUser(userId);
      const responseBody = await logResponseBody(response);

      expect(response.status(), 'Fetch created user failed').toBe(200);
      expect(responseBody.data, 'Fetched user details did not match the created user').toMatchObject({
        id: userId,
        data: CREATE_USER,
      });
    });

    // Update the user's data and validate the update response.
    await test.step("Update the user's name and validate the response", async () => {
      const response = await reqres.updateUser(userId, UPDATED_USER_DATA);
      const responseBody = await logResponseBody(response);

      expect(response.status(), 'Update user failed').toBe(200);
      expect(responseBody.data, 'Updated user response did not match the requested details').toMatchObject({
        id: userId,
        data: UPDATED_USER_DATA,
      });
    });

    // Fetch the user again to confirm the update persisted.
    await test.step('Get the user again and confirm the updated details', async () => {
      const response = await reqres.getUser(userId);
      const responseBody = await logResponseBody(response);

      expect(response.status(), 'Fetch updated user failed').toBe(200);
      expect(responseBody.data.id, 'Fetched user ID did not match the updated user').toBe(userId);
      expect(responseBody.data.data, 'Fetched user details did not match the update').toMatchObject(UPDATED_USER_DATA);
    });

    // Delete the created user and clear its cleanup ID after successful deletion.
    await test.step('Delete the created user as cleanup', async () => {
      const response = await reqres.deleteUser(userId);
      const responseBody = await logResponseBody(response);

      expect([200, 204], 'Expected user deletion to return 200 or 204').toContain(response.status());
      if (responseBody?.data?.id) {
        expect(responseBody.data.id, 'Delete response returned an unexpected user ID').toBe(userId);
      }
      createdUserId = null;
    });

    // Verify the deleted user is no longer available through the API.
    await test.step('Confirm the deleted user can no longer be fetched', async () => {
      const response = await reqres.getUser(userId);
      await logResponseBody(response);

      expect(response.status(), 'Expected fetching a deleted user to return 404').toBe(404);
    });
  });
});
