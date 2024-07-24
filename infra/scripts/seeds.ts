import seeder from "infra/database/seeder";

function onSuccess() {
  console.log("🎉🎉 Seeds runned successfuly");
  process.exit(0);
}

function onFail(error: unknown) {
  console.log("🔴🔴 Error seeding database");
  console.log(error);
  process.exit(1);
}

seeder.seed().then(onSuccess).catch(onFail);
