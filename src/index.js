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
const  __dirname = dirname(fileURLToPath(import.meta.url));
const homeDir = os.homedir();

//check if entries are already loaded on every restart
var entries_loaded = false;
import { sleep } from "../functions/ESMFunc.js";

var load_entries = async(terminal = false) => {
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
function enableFingerprinting(savePath =`${homeDir}/fingerprint.txt`){

  try{

    var home_path_fingerprint = path.join(savePath)
    var fingerprint_file_path = path.join(__dirname,".././system_fingerprint","fingerprint.txt");
    var fingerprint_file_dir = path.join(__dirname,".././system_fingerprint");

    if(!fs.existsSync(fingerprint_file_dir)){
      fs.mkdirSync(fingerprint_file_dir,{
          recursive:true,
          force:true
        })
    };


    //if fingerprint file exists

    if(fs.existsSync(fingerprint_file_path) && fs.existsSync(savePath))
    {

      var read_file_content = fs.readFileSync(fingerprint_file_path,{encoding:"utf8"});

      var readFileContent2 = fs.readFileSync(home_path_fingerprint);
        var package_file = String(read_file_content)?.trim()?.replace(/[^0-9a-f]/g,"");
                            
        var dir_file = String(readFileContent2)?.trim()?.replace(/[^0-9a-f]/g,"");

      if(package_file === dir_file){
       var safeComparison = crypto.timingSafeEqual(Buffer.from(package_file),Buffer.from(dir_file));
          if(safeComparison){
        return {
          already_fingerprinted: true,
          sha512: String(read_file_content).trim()
        }
          }else{
   throw new Error("safe fingerprint comparson failed...")
}
      }

    }else{
      fs.writeFileSync(fingerprint_file_path,"")
    };
    //file exists logic ends;


    //fingerprint indexing..
var new_512_hash = crypto.randomBytes(512).toString("hex");
    var structured_byte = new_512_hash?.split(" ");  
     structured_byte.splice(0,0,"--------BEGIN_FINGERPRINT--------");
      structured_byte.push("--------END_FINGERPRINT--------");
    
                                            
                                            
    var before_save_path = savePath?.split("/");
      
    var pop_file = (Array.isArray(before_save_path) && before_save_path?.length > 1 ) ? before_save_path.pop() : null;
      
      var final_save_path = String(before_save_path.join("/"));
      //console.log(final_save_path);return;
      
     if(!fs.existsSync(path.join(final_save_path))){
      fs.mkdirSync(path.join(final_save_path),{
          recursive:true,
          force:true
        });
    }
    else if(!fs.existsSync(path.join(fingerprint_file_dir))){
      fs.mkdirSync(path.join(fingerprint_file_dir),{
          recursive:true,
          force:true
        })
    };

    fs.writeFileSync(savePath,String(structured_byte.join(" ")).trim());
    fs.writeFileSync(fingerprint_file_path,String(structured_byte.join(" ")).trim());



    
    return {
      already_fingerprinted: false, 
      sha512Hex: String(String(structured_byte.join(" ")).trim())
    }


  }catch{
    return {
      already_fingerprinted: null,
      sha512Hex: null
    };
  };
};




//revoke fingerprint

function revoke_fingerprint(savePath=`${homeDir}/fingerprint.txt`){
try{
      if(!fs.existsSync(savePath) && String(savePath) !== `${homeDir}/fingerprint.txt`){
          
   return {
       revoke_success: false,
       reason: `${String(savePath)} has already been revoked or was never in your directory`
          };
}
    else if(!fs.existsSync(savePath)){
     return {
         revoke_success : false,
         reason: "no system fingerprint trace was found, create one if possible"
            }
};
  
    var before_revoke = fs.readFileSync(savePath,{ encoding:'utf8' });
    
   fs.unlinkSync(savePath,{ 
       recursive:true
   });
    
    
    var finger_print_read_array = before_revoke ? (before_revoke.replace(/[^0-9a-f]/g,"") ?? '' ) ?.trim() : null;
    
     //console.log(finger_print_read_array);
    
    return { 
        revoke_success:true,
        path : String(savePath),
        date : Number(Date.now()),
        revoked_fingerprint_byte_length: finger_print_read_array?.length
           }
    
}catch(e){
   return { 
     revoke_success: false, 
     reason : (e || void 0)
 };
}

};



function inlineDate(date,
                    options= { split: "/",
object:false                 
    }){
  var splitter = options?.split?.trim();
  //console.log(options);return;
  
  var padDigit = (num) => String(num).padStart(2, "0");
  var year = padDigit(date.getFullYear());
  var month = padDigit(date.getMonth() + 1);
  var day = padDigit(date.getDate());
  var hours = padDigit(date.getHours());
  var minutes = padDigit(date.getMinutes());
  var seconds = padDigit(date.getSeconds());
  //console.log(splitter);
  
  if(splitter){
    return (
      year
      +
      splitter
      +
      month
      +
      splitter
      +
      day
      +
      splitter
      +
      hours
      +
      splitter
      +
      minutes
      +
      splitter
      +
      seconds
    );
  }
  else if(options.object === true && !splitter){
    return {
      year: year,
      month: month,
      day:day,
      hour:hours,
      minutes:minutes,
      seconds:seconds
    };
  }
}





var matrix = {
  loadEntries : load_entries,
  getMediaType : getMediaType,
  fingerprintSystem: enableFingerprinting,
  revokeFingerprint: revoke_fingerprint,
  inlineDate : inlineDate
};

export { matrix as default };

//EOF
