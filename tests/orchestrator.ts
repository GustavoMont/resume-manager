import AsyncRetry from "async-retry";

async function waitForServices() {
  await AsyncRetry(waitForServer, {
    maxTimeout: 1_000,
    retries: 100,
  });

  async function waitForServer() {
    const response = await fetch("http://localhost:3000/api/v1/hello");
    if (!response.ok) {
      throw new Error();
    }
  }
}

export default {
  waitForServices,
};
