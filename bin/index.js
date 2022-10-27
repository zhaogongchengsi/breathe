#!/usr/bin/env node

import { createCli } from "../dist/index.mjs";
const cli = createCli();

cli.help();
cli.parse();
