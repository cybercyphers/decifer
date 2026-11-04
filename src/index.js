#!/usr/bin/env node

//@ts-check

//Ready to brainstorm....

//unique system

import fs from "node:fs";
import path, { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import pre_matrix from "../functions/systemFuncs.js";
import { Err } from "../functions/Error.js";
import { _dirname } from "../functions/ESMFunc.js";
import { _mdir } from "../dirPath.js";
//check if entries are already loaded on every restart
var entries_loaded = false;

var load_entries = () => {
  try{  
            await dir_heal();
    var clean_up_after = await versioner();
    await sleep(800); 
        if (clean_up_after && fs.existsSync(clean_up_after)) {
            fs.unlinkSync(clean_up_after),
                {
                    recursive: true,
                };
        };
    
    entries_loaded = true;
    return pre_matrix;
    
       }catch(e){
    entries_loaded = true;
    throw new Error(Err(e));
       };
    };

var matrix = {
  loadEntries : load_entries
};

export { matrix as default };

//EOF
