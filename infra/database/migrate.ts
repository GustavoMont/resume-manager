import database from "./database";

async function onSuccess() {
  console.log("🎉🎉 Migrations applied successfuly 🎉🎉");
  process.exit(0);
}

async function onFail(err: unknown) {
  console.log("🔴🔴 Error running migrations 🔴🔴");
  console.log("====================================");
  console.error(err);
  console.log("====================================");
  process.exit(1);
}

database.migrate().then(onSuccess).catch(onFail);
