//@ts-check

/*
for function that are needed daily in the system.
these functions are system functions..
*/



import fs from "node:fs";
import { execFile,spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
import ffmpeg_pkg from "@ffmpeg-installer/ffmpeg";
import { promisify } from "node:util";
import path,{ dirname } from "node:path";
import crypto from "node:crypto";
import { Err } from "./Error.js";
import { _dirname } from "./ESMFunc.js";
import os from "node:os";
import { _mdir } from "../dirPath.js";
import { ytdlp_up_todate } from "./versioner.js";
var _dir = dirname(fileURLToPath(import.meta.url))
//time delay for important information or functions that need some time instead of async-await..
const sleep = (milliseconds)=>{
  const futureTime = Date.now()+milliseconds;
  while(Date.now() < futureTime){}
};

var ffmpeg = ffmpeg_pkg.path;
var execsync = promisify(execFile);



/*
@param {string} - the path if the file to be read;
*/
function media_type(content_path) {
  var to_buffer = fs.readFileSync(content_path);
  const hex = to_buffer.toString('hex', 0, 64).toUpperCase();

  //console.log(hex)

  if (hex.startsWith('89504E47')) return 'image/png';
  if (hex.startsWith('FFD8FF')) return 'image/jpeg';
  if (hex.startsWith('47494638')) return 'image/gif';
  if (hex.startsWith('424D')) return 'image/bmp';
  if (hex.startsWith('49492A00') || hex.startsWith('4D4D002A')) return 'image/tiff';
  if (hex.startsWith('38425053')) return 'image/vnd.adobe.photoshop';
  if (hex.startsWith('00000100')) return 'image/x-icon';

  if (hex.startsWith('52494646')) {
    const type = hex.slice(16, 24);
    if (type === '57454250') return 'image/webp';
    if (type === '41564920') return 'video/x-msvideo';
    if (type === '57415645') return 'audio/x-wav';
  }

  if (hex.slice(8, 16) === '66747970') {
    const brand = hex.slice(16, 24);
    const map = {
      '6D703431': 'video/mp4', '6D703432': 'video/mp4', '69736F6D': 'video/mp4',
      '61766331': 'video/mp4', '4D345620': 'video/mp4', '6B646469': 'video/mp4',
      '64617368': 'video/mp4', '6D703731': 'video/mp4', '49534F32': 'video/mp4',
      '71742020': 'video/quicktime',
      '33677034': 'video/3gpp', '33677035': 'video/3gpp', '33677036': 'video/3gpp',
      '66326D31': 'video/3gpp',
      '68656963': 'image/heic', '68656973': 'image/heic', '6D736631': 'image/heic',
      '68656978': 'image/heic', '6865696D': 'image/heic', '6D6D7031': 'image/heic',
      '61766966': 'image/avif', '61766973': 'image/avif',
      '4D344120': 'audio/mp4', '4D344220': 'audio/mp4', '4D345020': 'audio/mp4',
      '61636331': 'audio/mp4'
    };
    return map[brand] || 'video/mp4';
  }

  if (hex.startsWith('1A45DFA3')) {
    return hex.includes('7765626D') ? 'video/webm' : 'video/x-matroska';
  }

  if (hex.startsWith('3026B2758E66CF11')) return 'video/x-ms-wmv';
  if (hex.startsWith('464C5601')) return 'video/x-flv';
  if (hex.startsWith('000001BA') || hex.startsWith('000001B3')) return 'video/mpeg';

  if (hex.startsWith('494433') || hex.startsWith('FFFB') || hex.startsWith('FFF3') || hex.startsWith('FFF2')) return 'audio/mpeg';
  if (hex.startsWith('4F676753')) return 'audio/ogg';
  if (hex.startsWith('664C6143')) return 'audio/x-flac';
  if (hex.startsWith('2321414D52')) return 'audio/amr';
  if (hex.startsWith('4D546864')) return 'audio/midi';

  if (hex.startsWith('25504456') || hex.startsWith('25504446')) return 'application/pdf';
  if (hex.startsWith('504B0304')) return 'application/zip';
  if (hex.startsWith('526172211A07')) return 'application/x-rar-compressed';
  if (hex.startsWith('377ABCAF271C')) return 'application/x-7z-compressed';
  if (hex.startsWith('1F8B08')) return 'application/gzip';
  if (hex.startsWith('425A68')) return 'application/x-bzip2';
  if (hex.startsWith('FD377A585A00')) return 'application/x-xz';

  if (hex.startsWith('D0CF11E0A1B11AE1')) return 'application/msword';
  if (hex.startsWith('4D5A')) return 'application/x-msdownload';
  if (hex.startsWith('7F454C46')) return 'application/x-elf';

  return 'unknown';
}


//console.log(media_type(path.join(_dir,".","image.jpg")));


class matrix{

  constructor(){}
  //random uuid fingerprinting

  UUID() {
    return { uuid : `${"10000000-1000-4000-8000-100000000000".replace(/[018]/g, c =>
      (+c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> +c / 4).toString(16)
      )}` }
  };

  /*
  we promisify execFile to make it async and avoid errors if the media is very large which will take a lot of time to fetch links...
  */


  async ytvid(link=null,options ={},px="bestvideo+bestaudio/best"){
    if(!link){
      throw new Error("request url was now given")
    };
    //link validation, pls ensure you not trying to hack into any system here.Use the right link...
    const linkTest = /^https?:\/\/(www\.)?(youtube\.com|youtu\.be)\/.*$/i;

    if(linkTest.test(link) !== true){
      throw new Error("invalid youtube url given");
    };

    try{

      /*
      set permission to the binaries to avoid unauthorized errors from the bunaries folder
      */
      var binary_755_permission_set = fs.readdirSync(path.join(_dirname,"../binaries/"),{ recursive:true });
      for(const bin of binary_755_permission_set){

        const Stats = fs.statSync(path.join(_dirname,`../binaries/${bin}`))
        //permission checking before decision
        var binary_permissions = (Stats.mode & 0o755).toString(8);

        if(binary_permissions !== 755){
          /*only execute it the permission is not set to 755 wich allows read, write and execution*/
          fs.chmodSync(path.join(_dirname,`../binaries/${bin}`),0o755);
        };
      };

      /* var d = await execsync( path.join(_mdir,"/binaries","ytdlp"), ["-U"], {encoding:"utf8"});

      console.log(d);
      return;
      */
      if(!fs.existsSync(path.join(_dirname,"../binaries/ytdlp")) || !fs.existsSync(path.join(_dirname,"../binaries/ffprobe"))){

        console.trace("\n\x1b[31msome libraries have been deleted manually, while some binaries can be recreated automatically, some will need re-installation to be able to function...\n");
        try{

          var { stderr,stout } = await execsync("/bin/sh",
            [
              /* run bash command safely to install ytvid lib if not available but makes sure ffmpeg and ffprobe is is available to avoid re-install clean
              */
              "-c",`curl -L https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp -o ${path.join(_mdir,"/binaries","ytdlp")} && chmod a+rx ${path.join(_mdir,"/binaries","ytdlp")}`
            ],{ shell : true });
          console.log("\n\x1b[1;38mplease wait...\n\x1b[0m");
          await new Promise(resolve=>setTimeout(resolve,3000))
        }catch(err){
          Err(`Failed to get data with request, ${JSON.stringify({ requestUrl : link }) }`);

        };
      };

      var upToDate = await ytdlp_up_todate();
      /*console.log(upToDate);
      return;*/
      var dataArray = [];

      if(!upToDate){
        console.log('updating binary...');

        var _update = await spawn(path.join(_dir,"../binaries","ytdlp"), [ "-U" ], {
            stdio: [ "pipe","pipe","pipe" ]
          }
        );

        var ytdlpPromise = await new Promise((resolve,reject)=>{
            _update.stderr.on("data",(data)=>{
                dataArray.push(data);
              });
            _update.on("error",(err)=>{
                reject(err.toString());
              });
            _update.on("close",(code)=>{

                //be moved in the future
                //console.log(code);

                if(code > 0){

                  reject({
                      success:false,
                      message: "ytdlp update failed..."
                    });

                }else{
                  console.log("update complete, running process...");

                  resolve({
                      update_success : true, message:"update_succesfull"
                    });
                }

              })
          });

        //console.log(ytdlpPromise);

      }


      /*
      other alternative if user choose for double link. eg.one stream without audio and other with audio but not video in mp4.
      */


      if(options.dual === true){
        /*
        same command line if dualsplit is toggled false but one has sound only and the other has audio only but both in very high pixels than the pre-merged
        */
        var { stdout,stderr } = await execsync(path.join(_dirname,"../binaries/ytdlp"),[
            "--extractor-args", "youtube:player_client=web_safari,web_embedded,-tv_downgraded",
            "--js-runtimes",
            `node:${process.execPath}`,
            "--user-agent",
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            "--ffmpeg-location",ffmpeg,
            "-f",
            `bestvideo+bestaudio/best`,
            "-g",
            `${String(link)}`
          ]);
        var data = stdout.split('\n');

        /*return*/ console.log({ video_only_hp:`${data[0]}\n`,
            audio_only_hp : `${data[1]}\n`
          });

      }

      /*
      @param {object} options - the options in which all other objs are stored
      @param {object} options.json -respond with video information only.
      */

      else if(options.json === true){

        var { stdout,stderr } = await execsync(path.join(_dirname,"../binaries/ytdlp"),[
            "--extractor-args", "youtube:player_client=web_safari,web_embedded,-tv_downgraded",
            "--js-runtimes",
            `node:${process.execPath}`,
            "--user-agent",
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            "--ffmpeg-location",ffmpeg,
            "--skip-download",
            "--dump-json",
            `${String(link)}`
          ],{
            maxBuffer : 1024 * 1024 * 20
          });
        return { json:JSON.parse(stdout,null,3)};

      }

      /*
      @param {object} options.mergeUrl - respond with  stream url as one
      */
      else if(options.merge === true){

        //start fetch
        var { stdout,stderr } = await execsync(path.join(_dirname,"../binaries/ytdlp"),[
            "--extractor-args", "youtube:player_client=web_safari,web_embedded,-tv_downgraded",
            "--js-runtimes", `node:${process.execPath}`,
            "--user-agent",
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            "--ffmpeg-location",ffmpeg,
            "-f",
            `${String(px)}`,
            "-g",
            `${String(link)}`
          ]);
        return { merged_split :stdout };
      }

      else{

        var vid_title_path = "/%(title)s.%(ext)s";

        var stdout2 = await execsync(
          path.join(_dirname,"../binaries/ytdlp"), [
            '--get-title',
            "--js-runtimes", `node:${process.execPath}`,
            "--extractor-args", "youtube:player_client=web_safari,web_embedded,-tv_downgraded",
            '--user-agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            "--ffmpeg-location",ffmpeg,
            String(link)
          ] ,{
            stdio : ["pipe","pipe","pipe"]
          })
        vid_title_path = stdout2?.stdout?.trim()?.replaceAll(" ","_")?.replaceAll("/","")+".mp4";
        var final_media_path = os.homedir()+"/"+vid_title_path;
        //console.log(vid_title_path);
        //return;

        var { stdout,stderr } = await execsync(path.join(_dirname,"../binaries/ytdlp"),[
            "--extractor-args", "youtube:player_client=web_safari,web_embedded,-tv_downgraded",
            "--user-agent",
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            "--ffmpeg-location",ffmpeg,
            "-f",
            "bv*[ext=mp4]+ba[ext=m4a]/bv+ba",
            "--merge-output-format",
            "mp4",
            "--js-runtimes",
            `node:${process.execPath}`,
            "-o", path.join(os.homedir(),vid_title_path.replaceAll(" ","")),
            `${String(link)}`,
            "--newline",
            "--no-playlist"
          ]);
        /* return*/
        //console.log(stdout,stderr);

      };
      //console.log(final_media_path);
      // return;



      if(final_media_path){
        var crypto_identifier = crypto.randomBytes(8).toString("hex").toUpperCase();

        var new_final_path = final_media_path?.replace(".mp4","")+"_"+crypto_identifier?.replaceAll('"',"")+".mp4";

        var dataArray2 = [];

        var ffmpeg_spawn = await spawn(ffmpeg,
          [
            "-threads", "0",
            "-i",
            path.join(final_media_path),
            "-c:v","libx264",
            "-preset","veryfast",
            "-movflags","+faststart",
            "-c:a", "copy",
            "profile:v", "baseline",
            "-tune","fastdecode",
            path.join(new_final_path)
          ],
          {
            stdio: ["pipe","pipe","pipe"]

          }
        )


      }
      var promiseData = await new Promise((resolve,reject)=>{

          //console.log(options.console);

          ffmpeg_spawn.stderr.on("data",(data)=>{
              dataArray2.push(data);

              if(options.console === true){

                console.log(`\x1b[32m${data.toString("utf8")}\x1b[0m`);
                //reject(data.toString());
              }
            });

          ffmpeg_spawn.on("error",(e)=>{
              reject(e.toString());
            });

          ffmpeg_spawn.on("close",(code)=>{
              if(code > 0){

                resolve({ data : `saved merged format ${JSON.stringify({link})} to ${final_media_path} directory but ffmpeg worker failed to execute global formatting => { recommended_player_in_this_situation: VLC player }`});

              }else{

                var finished_response = { data : `saved merged format ${JSON.stringify({link})} to ${final_media_path} directory...`};

                if(fs.existsSync(final_media_path)){
                  fs.unlinkSync(final_media_path,{ recursive:true })
                }

                resolve(Buffer.concat(dataArray2).toString());


              }
            })
        });
      return promiseData;

    }catch(err){
      Err(`an error occured executing command ytvid, ${String(err) || JSON.stringify(err)}. If error persist, please report at https://github.com/cybercyphers/decifer/issues`)
    }
  };




  async toSticker(buffer){
    if(!buffer){
      throw new Error(`expected an image or video buffer by received ${typeof buffer}`)
    }
    var mediaTypeBuffer = mediaType(buffer);


    //ytvid("https://vt.tiktok.com/ZS4Kc2jHg/");
  };

  /*
  @param {string} - the path to the media file
  */

  getMediaType(media_path){
    try{
      //console.log(media_path);

      if(!media_path){
        throw new Error(`media path is ${media_path}, perhaps you forgot to include the path to the media file`);
      }
      media_type(media_path);

    }catch(e){
      throw new Error(e);
    }

  }

  //to general media playable

  async global_media_format(media_path){
    try{
      //throw new Error("trial error");

      if(!media_path){
        return Err(`expected a file or dir path but received ${typeof media_path} `)
      };

    }catch(e){
      return Err(e.stack);
    }
  }




}

/*var k = fs.readFileSync(path.join(_dirname,"." ,"trail.mp4"));*/

/*var e = new cypher();
console.log(e)*/




export  {
  matrix as default,
  media_type
}

