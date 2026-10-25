export const logResponseBody = async (response) => {
  const responseText = await response.text();
  const responseBody = responseText ? JSON.parse(responseText) : null;

  console.log(`${response.url()} -> ${response.status()}`);
  console.log('Response body:', responseBody ? JSON.stringify(responseBody, null, 2) : '(empty)');

  return responseBody;
};

export const cleanUpUser = async (reqres, userId, testTitle) => {
  if (!userId) {
    return;
  }

  try {
    const response = await reqres.deleteUser(userId);
    if (![200, 204, 404].includes(response.status())) {
      return {
        testTitle,
        userId,
        status: response.status(),
      };
    }
  } catch (error) {
    return {
      testTitle,
      userId,
      error: error.message,
    };
  }
};
