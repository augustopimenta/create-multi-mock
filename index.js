const path = require("path");
const fs = require("fs-extra");
const os = require("os");
const spawn = require("cross-spawn");

async function generate(appPath, options) {
  const appName = path.basename(appPath);

  console.log(`Generating ${appName} project...`);

  fs.ensureDirSync(appPath);

  const packageJson = {
    name: appName,
    version: "1.0.0",
    private: true,
    scripts: {
      start: "multi-mock"
    },
    bin: {
      [appName]: "multi-mock"
    }
  };

  fs.writeFileSync(
    path.join(appPath, "package.json"),
    JSON.stringify(packageJson, null, 2) + os.EOL
  );

  const endpointsPath = path.join(appPath, "endpoints");

  fs.ensureDirSync(endpointsPath);

  console.log("Installing dependencies...");

  const dependencies = ["multi-mock"];

  try {
    await runCommand(
      appPath,
      "npm",
      ["install", "--save", "--loglevel", "error"].concat(dependencies)
    );
  } catch (e) {
    console.error("Sorry couldn't install dependencies!");
  }

  console.log("Finishing...");
}

function runCommand(path, command, args) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, { cwd: path, stdio: "inherit" });

    child.on("close", code => {
      if (code !== 0) {
        reject();
        return;
      }
      resolve();
    });
  });
}

module.exports = generate;
