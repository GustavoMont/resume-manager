test("GET to /api/v1/hello should return 200", async () => {
  const response = await fetch("http://localhost:3000/api/v1/hello");
  expect(response.status).toBe(200);

  const responseBody = await response.json();

  expect(responseBody).toEqual({ hello_world: "hello, World" });
});
