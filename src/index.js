#!/usr/bin/env node

//@ts-check

//Ready to brainstorm....

//unique system
import dir_heal from "../functions/self_defences/_dirRestore.js";
import versioner from "../functions/versioner.js";
import os from "node:os";
import fs from "node:fs";
import crypto from "node:crypto";
import path, { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import pre_matrix, { media_type as getMediaType } from "../functions/systemFuncs.js";
import { Err } from "../functions/Error.js";
import { _dirname } from "../functions/ESMFunc.js";
import { _mdir } from "../dirPath.js";
//check if entries are already loaded on every restart
var entries_loaded = false;
import { sleep } from "../functions/ESMFunc.js";

var load_entries = async(terminal = true) => {
  try{  
    if(terminal === true){
    console.log("setting_up binaries...");
    }
            await dir_heal();
    if(terminal === true){
    console.log("compiling binaries...");
    };
    
    var clean_up_after = await versioner();
    await sleep(800); 
    if(terminal === true){
    console.log("done");
    };
        if (clean_up_after && fs.existsSync(clean_up_after)) {
          if(terminal === true){
    console.log("cleaning up compiled binary trash...");
    };
            fs.unlinkSync(clean_up_after),
                {
                    recursive: true,
                };
          if(terminal === true){
    console.log("done");
    };
          
        };
    
    entries_loaded = true;
    if(terminal === true){
    console.log("exported main functions and classes...done");
    };
    return pre_matrix;
    
       }catch(e){
    entries_loaded = true;
    throw new Error(Err(e));
       };
    };

//system fingerprintig logic
function enableFingerprinting(savePath =`${os.homedir()}/fingerprint.txt`){

  try{

    var home_path_fingerprint = path.join(savePath)
    var fingerprint_file_path = path.join(__dirname,"../system_fingerprint","fingerprint.txt");
    var fingerprint_file_dir = path.join("../system_fingerprint","fingerprint.txt");

    if(!fs.existsSync(path.join(__dirname,"../system_fingerprint"))){
      fs.mkdirSync(path.join(__dirname,"../system_fingerprint"),{
          recursive:true,
          force:true
        })
    };


    //if fingerprint file exists
    if(fs.existsSync(fingerprint_file_path) && fs.existsSync(savePath))
    {

      var read_file_content = fs.readFileSync(fingerprint_file_path,{encoding:"utf8"});

      var readFileContent2 = fs.readFileSync(home_path_fingerprint);
      if(String(read_file_content)?.trim() === String(readFileContent2)?.trim()){

        return {
          already_fingerprinted: true,
          sha512: String(read_file_content).trim()
        }
      }

    }else{
      fs.writeFileSync(fingerprint_file_path,"")
    };
    //file exists logic ends;




    var new_512_hash = crypto.randomBytes(512).toString("hex");

    if(!fs.existsSync(path.join(savePath))){
      fs.mkdirSync(path.join(savePath),{
          recursive:true,
          force:true
        });
    }
    else if(!fs.existsSync(path.join(fingerprint_file_dir))){
      fs.mkdirSync(path.join(savePath),{
          recursive:true,
          force:true
        })
    };
    fs.writeFileSync(savePath,new_512_hash);
    fs.writeFileSync(fingerprint_file_path,new_512_hash);

    return {
      already_fingerprinted: false,
      sha512Hex: String(new_512_hash)
    }


  }catch{
    return {
      already_fingerprinted: null,
      sha512Hex: null
    }
  }
}





var matrix = {
  loadEntries : load_entries,
  getMediaType : getMediaType,
  fingerprintSystem: enableFingerprinting
};

export { matrix as default };

//EOF
