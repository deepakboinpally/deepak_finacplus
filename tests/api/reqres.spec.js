import { test, expect } from '../../fixtures';
import { logResponseBody, cleanUpUser } from '../../helpers/apiHelpers/apiUtilities';
import userData from '../constants/reqresUserData';

const { CREATE_USER, UPDATED_USER_DATA } = userData;

test.describe('ReqRes user lifecycle', () => {
  const missedCleanUpData = [];
  let createdUserId;

  test.beforeEach(() => {
    createdUserId = null;
  });

  test.afterEach(async ({ reqres }) => {
    const cleanUp = await cleanUpUser(reqres, createdUserId, test.info().title);
    if (cleanUp) {
      missedCleanUpData.push(cleanUp);
    }
    createdUserId = null;
  });

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

    await test.step('Create a user, validate status 201, and store userId', async () => {
      const response = await reqres.createUser(CREATE_USER);
      const responseBody = await logResponseBody(response);

      expect(response.status(), 'Create user failed').toBe(201);
      expect(responseBody.data.data).toMatchObject(CREATE_USER);
      expect(responseBody.data.id).toBeTruthy();

      userId = responseBody.data.id;
      createdUserId = userId;
    });

    await test.step('Get the created user and validate the stored details', async () => {
      const response = await reqres.getUser(userId);
      const responseBody = await logResponseBody(response);

      expect(response.status(), 'Fetch created user failed').toBe(200);
      expect(responseBody.data).toMatchObject({
        id: userId,
        data: CREATE_USER,
      });
    });

    await test.step("Update the user's name and validate the response", async () => {
      const response = await reqres.updateUser(userId, UPDATED_USER_DATA);
      const responseBody = await logResponseBody(response);

      expect(response.status(), 'Update user failed').toBe(200);
      expect(responseBody.data).toMatchObject({
        id: userId,
        data: UPDATED_USER_DATA,
      });
    });

    await test.step('Get the user again and confirm the updated details', async () => {
      const response = await reqres.getUser(userId);
      const responseBody = await logResponseBody(response);

      expect(response.status(), 'Fetch updated user failed').toBe(200);
      expect(responseBody.data.id).toBe(userId);
      expect(responseBody.data.data).toMatchObject(UPDATED_USER_DATA);
    });

    await test.step('Delete the created user as cleanup', async () => {
      const response = await reqres.deleteUser(userId);
      const responseBody = await logResponseBody(response);

      expect([200, 204], 'Delete user failed').toContain(response.status());
      if (responseBody?.data?.id) {
        expect(responseBody.data.id).toBe(userId);
      }
      createdUserId = null;
    });

    await test.step('Confirm the deleted user can no longer be fetched', async () => {
      const response = await reqres.getUser(userId);
      await logResponseBody(response);

      expect(response.status(), 'Deleted user was still available').toBe(404);
    });
  });
});
