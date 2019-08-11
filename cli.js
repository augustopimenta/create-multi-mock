#!/usr/bin/env node
"use strict";

const meow = require("meow");
const generate = require(".");

const options = {
  flags: {
    empty: {
      type: "boolean",
      alias: "e"
    }
  }
};

const cli = meow(
  `
Usage
  $ create-multi-mock <project-directory>

Options
  --empty, -e  Not include example files
  --help       See this help
`,
  options
);

if (!cli.input[0]) {
  cli.showHelp();
  return;
}

(async () => {
  await generate(cli.input[0], cli.flags);
})();
