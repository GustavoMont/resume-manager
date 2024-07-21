import { exec, ExecException } from "node:child_process";
import cliSpinner from "./cli-spinner";

const spinner = cliSpinner.createSpinner();
function checkDb() {
  exec("docker exec resume_database pg_isready --host localhost", handleReturn);

  function handleReturn(error: ExecException | null, stdout: string) {
    if (stdout.search("accepting connections") === -1) {
      checkDb();
      return;
    }
    spinner.stopSpinner();
    console.log("🎉🎉 Postgres is accepting connections\n");
  }
}
console.log();
spinner.startSpinner("👀 Waiting for postgres");
checkDb();
