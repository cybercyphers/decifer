#!/usr/bin/env node

//@ts-check

//Ready to brainstorm....

//unique system

import dir_heal from "../functions/self_defences/_dirRestore.js";
await dir_heal();

import fs from "node:fs";
import path, { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import matrix from "../functions/systemFuncs.js";
import { Err } from "../functions/Error.js";
import { _dirname } from "../functions/ESMFunc.js";
import { _mdir } from "../dirPath.js";

//console.log(JSON.stringify(process.env));

//every server listening on a port is defined...
var PORT = process.env.SERVER_PORT;
//console.log(`\n\x1b[1;32mstarting server on port ${PORT} \x1b[0m`);

//console.log(cypher)

export { matrix as default };

//EOF
