import readline from "readline";

function createSpinner() {
  let timer: NodeJS.Timeout;
  let currentIndex = 0;
  const frames = ["/", "-", "\\", "|"];

  function clearLastLine() {
    readline.moveCursor(process.stdout, 0, -1);
    readline.clearLine(process.stdout, 1);
  }

  function incrementIndex() {
    currentIndex = (currentIndex + 1) % frames.length;
  }

  function getCurrentFrame() {
    return frames[currentIndex];
  }

  function startSpinner(prefixMessage?: string) {
    timer = setInterval(() => {
      clearLastLine();
      console.log(`${prefixMessage ?? ""} ${getCurrentFrame()}`);
      incrementIndex();
    }, 250);
  }

  function stopSpinner() {
    clearLastLine();
    clearInterval(timer);
  }

  return {
    startSpinner,
    stopSpinner,
  };
}

export default {
  createSpinner,
};
