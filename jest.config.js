/* eslint-disable @typescript-eslint/no-var-requires */
const nextJest = require("next/jest");
const dotenv = require("dotenv");

dotenv.config({
  path: ".env.development",
});

const createJestConfig = nextJest({
  dir: "./",
});

/** @type {import('jest').Config} */
const config = {
  preset: "ts-jest",
  moduleDirectories: ["node_modules", "<rootDir>"],
  testTimeout: 60_000,
  setupFilesAfterEnv: ["./setup-jest.ts"],
};

module.exports = createJestConfig(config);
