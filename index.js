const path = require("path");
const fs = require("fs-extra");
const os = require("os");
const spawn = require("cross-spawn");

async function generate(appPath, { empty }) {
  const appName = path.basename(appPath);

  console.log(`Generating ${appName} project`);

  fs.ensureDirSync(appPath);

  const gitIgnore = "node_modules/\n";

  fs.writeFileSync(path.join(appPath, ".gitignore"), gitIgnore + os.EOL);

  const packageJson = {
    name: appName,
    version: "1.0.0",
    private: true,
    scripts: {
      start: "multi-mock"
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

  if (!empty) {
    console.log("Creating examples");

    const helpFiles = ["hello1.json", "hello2.json", "path/hello3.json"];

    helpFiles.forEach(file => {
      const filePath = path.join(endpointsPath, file);

      fs.ensureDirSync(path.dirname(filePath));

      fs.writeFileSync(
        path.join(endpointsPath, file),
        JSON.stringify(require(`./examples/${file}`), null, 2) + os.EOL
      );
    });
  }

  console.log("Finishing...");
  console.log();
  console.log("Everything is done!");
  console.log();
  console.log(`cd ${appPath}`);
  console.log("npm start");
  console.log();
  console.log("Happy mock! :)");
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
