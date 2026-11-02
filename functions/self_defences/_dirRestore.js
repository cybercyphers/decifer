import fs from "node:fs";
import { execFile,spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
import path,{ dirname } from "node:path";
var __dirname = dirname(fileURLToPath(import.meta.url));
import { Err } from "../Error.js";


export default async function restore_dir(){
  try{
    var dependent_dirs = [
      String(path.join(__dirname,"../../binaries")),
      String(path.join(__dirname,"../../functions"))
    ];

    dependent_dirs.forEach(dir_path=>{
        if(!fs.existsSync(dir_path)){
          fs.mkdirSync(dir_path,{ recursive:true })
        }
      });

  }catch(e){
    throw new Error(Err("fatal_error => Self_directory_reconstruction failed, please reinstall the package for a perfect reconstruction or report your issue on "))
  }
}
