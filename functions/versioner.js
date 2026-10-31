import fs from "node:fs";
import { execFile,spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";
import path,{ dirname } from "node:path";
var __dirname = dirname(fileURLToPath(import.meta.url));

export async function pre_check_update(){
    var dataArray = [];
    
var update_spawn = await spawn(
       path.join(__dirname,"../binaries/ytdlp"),
   ["--version"],
                        {
         shell:true,
                            stdio:[ "pipe","pipe","pipe" ]
     }
                       );
    
  //var update_spawn = "";
    
  var spawn_promise = await new Promise((resolve,reject)=>{
        
    update_spawn.stdout.on("data",(data)=>{
    dataArray.push(data);
} );
                      
    update_spawn.on("error",(e)=>{
   reject(e.toString());
});
      
    update_spawn.on("close",(code)=>{
      if(code > 0){
        return null;
}else{
     resolve(Buffer.concat(dataArray).toString());
};
   });
        
 })
     
return { system_version : String(spawn_promise).trim() };
    
};





export default async function versioner(){
   var version_fetch = await fetch("https://raw.githubusercontent.com/yt-dlp/yt-dlp/refs/heads/master/yt_dlp/version.py",{ method:"GET", headers:{ "Content-Type":"application/text" }});
    if(!version_fetch.ok){
    return { version : null };
}
    var version_text = await version_fetch.text();
    if(!version_text){
   return { version: null };
}
    var regex_to_match = /\'(\d+\.\d+\.\d+)'$/m;
    var version_matched = version_text.match(regex_to_match)[0].replaceAll(`'`,"");
  
    return { web_version : String(version_matched).trim() || null }
}




export async function ytdlp_up_todate(){
   var ytdlp_web_version = await versioner();
    var ytldlp_inner_version = await pre_check_update()
    
    var new_web_version = ytdlp_web_version?.web_version;
    var old_system_version = ytldlp_inner_version.system_version;
    return old_system_version === new_web_version
   
}
