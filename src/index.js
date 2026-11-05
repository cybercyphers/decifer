#!/usr/bin/env node

//@ts-check

//Ready to brainstorm....

//unique system
import dir_heal from "../functions/self_defences/_dirRestore.js";
import versioner from "../functions/versioner.js";

import fs from "node:fs";
import path, { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import pre_matrix, { media_type as getMediaType } from "../functions/systemFuncs.js";
import { Err } from "../functions/Error.js";
import { _dirname } from "../functions/ESMFunc.js";
import { _mdir } from "../dirPath.js";
//check if entries are already loaded on every restart
var entries_loaded = false;
import { sleep } from "../functions/ESMFunc.js";

var load_entries = async(console = true) => {
  try{  
    if(console === true){
    console.log("setting_up binaries...");
    }
            await dir_heal();
    if(console === true){
    console.log("compiling binaries...");
    };
    
    var clean_up_after = await versioner();
    await sleep(800); 
    if(console === true){
    console.log("done");
    };
        if (clean_up_after && fs.existsSync(clean_up_after)) {
          if(console === true){
    console.log("cleaning up compiled binary trash...");
    };
            fs.unlinkSync(clean_up_after),
                {
                    recursive: true,
                };
          if(console === true){
    console.log("done");
    };
          
        };
    
    entries_loaded = true;
    if(console === true){
    console.log("exported main functions and classes...done");
    };
    return pre_matrix;
    
       }catch(e){
    entries_loaded = true;
    throw new Error(Err(e));
       };
    };

var matrix = {
  loadEntries : load_entries,
  getMediaType : getMediaType
};

export { matrix as default };

//EOF
