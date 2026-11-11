//@ts-check

/*
for function that are needed daily in the system.
these functions are system functions..
*/

import dir_heal from "./self_defences/_dirRestore.js";
import fs from "node:fs";
import { execFile, spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";
import path, { dirname } from "node:path";
import crypto from "node:crypto";
import { Err } from "./Error.js";
import { _dirname, sleep } from "./ESMFunc.js";
import media_type from "./media_typesetting.js";
import os from "node:os";
import { _mdir } from "../dirPath.js";
import { ytdlp_up_todate } from "./versioner.js";
import versioner from "./versioner.js";
var _dir = dirname(fileURLToPath(import.meta.url));

//time delay for important information or functions that need some time instead of async-await..

var execsync = promisify(execFile);
var ffmpeg = path.join(_dirname, "../binaries/ffmpeg");

//main process logic begins...

var pre_matrix = class matrix {

    constructor() {
        this.ffmpeg = path.join(_dir,"../binaries","ffmpeg");
        this.ffprobe = path.join(_dir,"../binaries","ffprobe");
        this.ytdlp = path.join(_dir,"../binaries","ytdlp");
    }

    //await versioner();
    //random uuid fingerprinting

    

    randomuuid() {
        return {
            uuid: `${"10000000-1000-4000-8000-100000000000".replace(
                /[018]/g,
                (c) =>
                    (
                        +c ^
                        (crypto.getRandomValues(new Uint8Array(1))[0] &
                            (15 >> (+c / 4)))
                    ).toString(16),
            )}`,
        };
    }

    /*
  we promisify execFile to make it async and avoid errors if the media is very large which will take a lot of time to fetch links...
  */

    async ytvid(link = null, options = {}, px = "bestvideo+bestaudio/best") {
        if (!link) {
            throw new Error("request url was not given");
        }
        //link validation, pls ensure you not trying to hack into any system here.Use the right link...
        const linkTest = /^https?:\/\/(?:www\.|m\.|music\.)?(?:youtube\.com\/(?:watch\?(?:.*&)?v=[\w-]{11}|(?:embed|v|shorts|live)\/[\w-]{11}|playlist\?list=[\w-]+|channel\/UC[\w-]{22}|(?:c\/|user\/)?[\w.-]+|@[\w.-]+)|youtu\.be\/[\w-]{11})(?:[?&]\S*)?$/i


        if (linkTest.test(String(link?.trim())) !== true) {
            throw new Error("invalid youtube url given");
        }

        try {
            /*
      set permission to the binaries to avoid unauthorized errors from the bunaries folder
      */
            var binary_755_permission_set = fs.readdirSync(
                path.join(_dirname, "../binaries/"),
                { recursive: true },
            );
            for (const bin of binary_755_permission_set) {
                //console.log(bin);

                const Stats = fs.statSync(
                    path.join(_dirname, `../binaries/${bin}`),
                );
                //permission checking before decision
                var binary_permissions = (Stats.mode & 0o755).toString(8);

                if (binary_permissions !== 755) {
                    /*only execute it the permission is not set to 755 wich allows read, write and execution*/
                    fs.chmodSync(
                        path.join(_dirname, `../binaries/${bin}`),
                        0o755,
                    );
                }
            }

            var upToDate = await ytdlp_up_todate();
            /*console.log(upToDate);
      return;*/
            var dataArray = [];

            if (!upToDate) {
                console.log("updating binary...");

                var _update = await spawn(
                    path.join(_dir, "../binaries", "ytdlp"),
                    ["-U"],
                    {
                        stdio: ["pipe", "pipe", "pipe"],
                    },
                );

                var ytdlpPromise = await new Promise((resolve, reject) => {
                    _update.stderr.on("data", (data) => {
                        dataArray.push(data);
                    });
                    _update.on("error", (err) => {
                        reject(err.toString());
                    });
                    _update.on("close", (code) => {
                        //be moved in the future
                        //console.log(code);

                        if (code > 0) {
                            reject({
                                success: false,
                                message: "ytdlp update failed...",
                            });
                        } else {
                            console.log("update complete, running process...");

                            resolve({
                                update_success: true,
                                message: "update_succesfull",
                            });
                        }
                    });
                });

                //console.log(ytdlpPromise);
            }

            /*
      other alternative if user choose for double link. eg.one stream without audio and other with audio but not video in mp4.
      */

            if (options.dual === true) {
                /*
        same command line if dualsplit is toggled false but one has sound only and the other has audio only but both in very high pixels than the pre-merged
        */
                var { stdout, stderr } = await execsync(
                    path.join(_dirname, "../binaries/ytdlp"),
                    [
                        "--extractor-args",
                        "youtube:player_client=default,web_embedded",
                        "--js-runtimes",
                        `node:${process.execPath}`,
                        "--user-agent",
                        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
                        "--ffmpeg-location",
                        ffmpeg,
                        "-f",
                        `bestvideo+bestaudio/best`,
                        "-g",
                        `${String(link)}`,
                        '--socket-timeout', parseInt(options.timeout),
        '--retries', '3',
        '-4',
        '-v',
                    ],
                );
                var data = stdout.split("\n");

                /*return*/ console.log({
                    video_only_hp: `${data[0]}\n`,
                    audio_only_hp: `${data[1]}\n`,
                });
            } else if (options.json === true) {

            /*
      @param {object} options - the options in which all other objs are stored
      @param {object} options.json -respond with video information only.
      */
                var { stdout, stderr } = await execsync(
                    path.join(_dirname, "../binaries/ytdlp"),
                    [
                        "--extractor-args",
                        "youtube:player_client=default,web_embedded",
                        "--js-runtimes",
                        `node:${process.execPath}`,
                        "--user-agent",
                        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
                        "--ffmpeg-location",
                        ffmpeg,
                        "--skip-download",
                        "--dump-json",
                        `${String(link)}`,
                        '--socket-timeout', parseInt(options.timeout),
        '--retries', '3',
        '-4',
        '-v',
                    ],
                    {
                        maxBuffer: 1024 * 1024 * 20,
                    },
                );
                return { json: JSON.parse(stdout, null, 3) };
            } else if (options.merge === true) {

            /*
      @param {object} options.mergeUrl - respond with  stream url as one
      */
                //start fetch
                var { stdout, stderr } = await execsync(
                    path.join(_dirname, "../binaries/ytdlp"),
                    [
                        "--extractor-args",
                        "youtube:player_client=default,web_embedded",
                        "--js-runtimes",
                        `node:${process.execPath}`,
                        "--user-agent",
                        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
                        "--ffmpeg-location",
                        ffmpeg,
                        "-f",
                        `${String(px)}`,
                        "-g",
                        `${String(link)}`,
                    ],
                );
                return { merged_split: stdout };
            } else {
                var vid_title_path = "/%(title)s.%(ext)s";

                var stdout2 = await execsync(
                    path.join(_dirname, "../binaries/ytdlp"),
                    [
                        "--get-title",
                        "--js-runtimes",
                        `node:${process.execPath}`,
                        "--extractor-args",
                        "youtube:player_client=default,web_embedded",
                        "--user-agent",
                        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
                        "--ffmpeg-location",
                        ffmpeg,
                        String(link),
                        '--socket-timeout', parseInt(options.timeout),
        '--retries', '3',
        '-4',
        '-v'
                    ],
                    {
                        stdio: ["pipe", "pipe", "pipe"],
                    },
                );
                vid_title_path =
                    stdout2?.stdout
                        ?.trim()
                        ?.replaceAll(" ", "_")
                        ?.replaceAll("/", "") + ".mp4";
                var final_media_path = os.homedir() + "/" + vid_title_path;
                //console.log(vid_title_path);
                //return;

                var { stdout, stderr } = await execsync(
                    path.join(_dirname, "../binaries/ytdlp"),
                    [
                        "--extractor-args",
                        "youtube:player_client=default,web_embedded",
                        "--user-agent",
                        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
                        "--ffmpeg-location",
                        ffmpeg,
                        "-f",
                        "bestvideo[height<=1080][tbr<1500][vcodec^=avc]+bestaudio/best[height<=1080][tbr<1500]",
                        "--merge-output-format",
                        "mp4",
                        "--js-runtimes",
                        `node:${process.execPath}`,
                        "-o",
                        path.join(
                            os.homedir(),
                            vid_title_path.replaceAll(" ", ""),
                        ),
                        `${String(link)}`,
                        "--newline",
                        "--no-playlist",
                        '--socket-timeout', parseInt(options.timeout),
        '--retries', '3',
        '-4',
        '-v'
                    ],
                );
                /* return*/
                //console.log(stdout,stderr);
            }
            //console.log(final_media_path);
            // return;

            if (final_media_path) {
                var crypto_identifier = crypto
                    .randomBytes(8)
                    .toString("hex")
                    .toUpperCase();

                var new_final_path =
                    final_media_path?.replace(".mp4", "") +
                    "_" +
                    crypto_identifier?.replaceAll('"', "") +
                    ".mp4";

                var dataArray2 = [];

                var ffmpeg_spawn = await spawn(
                    ffmpeg,
                    [
                        "-i",
                        path.join(final_media_path),
                        "-c:v",
                        "libx264",
                        "-preset",
                        options.rapid === true ? "ultrafast" : "veryfast",
                        "-movflags",
                        "+faststart",
                        "-c:a",
                        "aac",
                        "-tune",
                        "fastdecode",
                        path.join(new_final_path),
                    ],
                    {
                        stdio: ["pipe", "pipe", "pipe"],
                    },
                );
            }
            var promiseData = await new Promise((resolve, reject) => {
                //console.log(options.console);

                ffmpeg_spawn.stderr.on("data", (data) => {
                    dataArray2.push(data);

                    if (options.console === true) {
                        console.log(`\x1b[32m${data.toString("utf8")}\x1b[0m`);
                        //reject(data.toString());
                    }
                });

                ffmpeg_spawn.on("error", (e) => {
                    reject(e.toString());
                });

                ffmpeg_spawn.on("close", (code) => {
                    if (code > 0) {
                        resolve({
                            data: `saved merged format ${JSON.stringify({
                                link,
                            })} to ${final_media_path} directory but ffmpeg worker failed to execute global formatting => { recommended_player_in_this_situation: VLC player }`,
                        });
                    } else {
                        if (options.asBuffer === true) {
                            if (fs.existsSync(new_final_path)) {
                                var bufferData =
                                    fs.readFileSync(new_final_path);
                                fs.unlinkSync(new_final_path);
                                resolve(bufferData);
                              
                                if (fs.existsSync(final_media_path)) {
                                    fs.unlinkSync(final_media_path, {
                                        recursive: true,
                                    });
                                }
                            } else {
                                reject(
                                    Err(
                                        "process failed to return the right file datail but the raw VLC playable was successful, please report on github issues if error persist",
                                    ),
                                );
                            }
                        }

                        var finished_response = {
                            data: `saved merged format ${JSON.stringify({
                                link,
                            })} to ${final_media_path} directory...`,
                        };

                        if (fs.existsSync(final_media_path)) {
                            fs.unlinkSync(final_media_path, {
                                recursive: true,
                            });
                        }

                        resolve(Buffer.concat(dataArray2).toString());
                    }
                });
            });

            return promiseData;
        } catch (err) {
            throw new Error(
                Err(
                    `an error occured executing command ytvid, ${Err(
                        err.stack || err.messsge || err,
                    )}. If error persist, please report at https://github.com/cybercyphers/decifer/issues`,
                ),
            );
        }
    }

    async toSticker(buffer) {
        if (!buffer) {
            throw new Error(
                `expected an image or video buffer by received ${typeof buffer}`,
            );
        }
        var mediaTypeBuffer = mediaType(buffer);

        //ytvid("https://vt.tiktok.com/ZS4Kc2jHg/");
    }

    /*
  @param {string} - the path to the media file
  */

    getMediaType(media_path) {
        try {
            //console.log(media_path);

            if (!media_path) {
                throw new Error(
                    `media path is ${media_path}, perhaps you forgot to include the path to the media file`,
                );
            }
            return media_type(media_path);
        } catch (e) {
            throw new Error(e);
        }
    }

    //to general media playable

    async globalize(media_path, options = {}) {
        try {
            //throw new Error("trial error");

            if (!media_path) {
                return Err(
                    `expected a file or dir path but received ${typeof media_path} `,
                );
            }

            //console.log(media_path instanceof Buffer)

            if (
                !fs.existsSync(String(media_path)) &&
                !(media_path instanceof Buffer)
            ) {
                throw new Error(
                    Err(
                        "expected an mp4 | mkv | avi | other_playables or the buffer but received an unknown or invalid path.",
                    ),
                );
            }
            if (Buffer.isBuffer(media_path)) {
                var type_get = this.getMediaType(media_path);
                //console.log(type_get.media === "video");
                //return;

                if (!type_get) {
                    return Err(
                        "The media file given or buffer given  does not look like or function as valid media file or buffer data",
                    );
                }
                if (type_get?.media !== "video") {
                    throw new Error(
                        Err(
                            "invalid media, this feature only process videos like mp4 | avi and many other more no other media type supported.",
                        ),
                    );
                }
            }

            var temp_path = null;
            var perm_path = path.join(
                `${os.homedir()}/globalized_playable_${crypto
                    .randomBytes(10)
                    .toString("hex")
                    .toUpperCase()}.mp4`,
            );

            //console.log(Buffer.isBuffer(media_path));
            //return;

            if (Buffer.isBuffer(media_path)) {
                temp_path = path.join(
                    `${os.homedir()}/temporary_buffer_${crypto
                        .randomBytes(15)
                        .toString("base64url")
                        .toUpperCase()}_${String(
                        type_get?.type?.split("/")[1],
                    )}`,
                );
            } else {
                temp_path = media_path;
            }

            if (!fs.existsSync(temp_path)) {
                fs.writeFileSync(temp_path, media_path);
            }
            var media_spawn = await spawn(
                ffmpeg,
                [
                    "-i",
                    path.join(temp_path),
                    "-c:v",
                    "libx264",
                    "-preset",
                    options.rapid === true ? "ultrafast" : "veryfast",
                    "-movflags",
                    "+faststart",
                    "-c:a",
                    "aac",
                    "-tune",
                    "fastdecode",
                    path.join(perm_path),
                ],
                { stdio: ["pipe", "pipe", "pipe"] },
            );
            var promiseData = await new Promise((resolve, reject) => {
                media_spawn.stderr.on("data", (data) => {
                    if (options.console === true) {
                        console.log(`\x1b[32m${data.toString("utf8")}`);
                    } else {
                    }
                });
                media_spawn.on("error", (e) => {
                    reject(Err(e));
                });
                media_spawn.on("close", (code) => {
                    if (
                        fs.existsSync(temp_path) &&
                        Buffer.isBuffer(media_path)
                    ) {
                        if (options.console === true) {
                            console.log(
                                `removing temporary buffer files, list : ${temp_path}`,
                            );
                        }
                        fs.unlinkSync(temp_path, { recursive: true });
                    }
                    if (code !== 0) {
                        reject(
                            Err({
                                success: false,
                                reason: "media formatting failed...",
                            }),
                        );
                    } else if (fs.existsSync(perm_path)) {
                        resolve({ success: true, path: String(perm_path) });
                    } else {
                        reject(
                            Err({
                                success: false,
                                reason: "process failed to return compiled media data",
                            }),
                        );
                    }
                });
            });
            if (options.console === true) {
                if (promiseData.success) {
                    if (
                        fs.existsSync(temp_path) &&
                        Buffer.isBuffer(media_path)
                    ) {
                        fs.unlinkSync(temp_path, { recursive: true });
                    }
                    if (options.asBuffer === true) {
                        var bufferData = fs.readFileSync(promiseData.path);
                        fs.unlinkSync(perm_path, { recursive: true });

                        return bufferData;
                    } else {
                        console.log(
                            `\x1b[32mcompilation successful, media saved to ${promiseData.path}`,
                        );
                    }
                } else {
                    reject(
                        Err(
                            promiseData?.reason ||
                                "an unknown error occured...",
                        ),
                    );
                }
            }
        } catch (e) {
            return Err(e.stack);
        }
    };
    


    //install only, for what u prefer
    async yt_fetch_no_decode(url,ffmpeg=path.join(__dir,"../binaries","ffmpeg")){
        var saved_path =    path.join(
                            os.homedir(),
                            String(url).replaceAll(" ","_").replaceAll("/","_")+".mp4"
            );
        
        try{

        var yt_only_spawn = await spawn(
                    path.join(_dirname, "../binaries/ytdlp"),
                    [
                        "--extractor-args",
                        "youtube:player_client=default,web_embedded",
                        "--user-agent",
                        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
                        "--ffmpeg-location",
                        ffmpeg,
                        "-f",
                        "bestvideo[height<=1080][tbr<1500][vcodec^=avc]+bestaudio[ext=m4a]/best[height<=1080][tbr<1500][ext=mp4]",
                        "--merge-output-format",
                        "mp4",
                        "--remux-video","mp4",
                        "--js-runtimes",
                        `node:${process.execPath}`,
                        "-o",
                        saved_path,
                        `${String(url?.trim())}`,
                        "--newline",
                        "--no-playlist",
                        '--socket-timeout', parseInt(options.timeout),
        '--retries', '3',
        '-4',
        '-v'
                    ],
            { stdio: ["ignore","pipe","pipe"] }
        );
                /* return*/
                //console.log(stdout,stderr);
            var promiseData = await new Promise((resolve,reject)=>{

            yt_only_spawn.stderr.on("data",(data)=>{
                //console.log(data.toString("utf8"));
                
            });
                

                
            yt_only_spawn.on("error",(e)=>{
                reject(Err(e.toString()));
               }); 

                yt_only_spawn.on("close",(code)=>{
                      if(Number(code) !== 0){
                          reject(Err({ 
                              success:false,
                              reason : `yt_only failed to complete its work given code:${code}`
                          }));
                      }else{
                          
                          if(fs.existsSync(saved_path)){
                          resolve({
                              success:true,
                              path: String(saved_path)
                          });
                              
                          }
                          else{
                              reject({
                                  success:false,
                                  reason : "ytdlp failed to save the fetched binary"
                              })
                          }
                      }
                })
            });
            return promiseData;
            
        }catch(e){
            throw new Error(Err(e));
        };

    };
    //yt fetch only ends its reign


       binSync(from){
  try{
    if(!from){
      throw new Error(Err("The binary to copy was not given."))
    }
    var fromLower = from.trim().toLowerCase();
    var available_names = ["ffmpeg","ffprobe","ytdlp"];

    if(fromLower !== "ffmpeg" && fromLower !== "ffprobe" && fromLower !== "ytdlp"){
      throw new Error(`invalid binary name, allowed => ${JSON.stringify(available_names)}`);
    };

    var path_to_bin = path.join(_dir,"../binaries",String(from.trim()));

    if(!fs.existsSync(path_to_bin)){
      throw new Error(`the requested binary was not found, please reload the entries fo the fix`);
    }

    var read_bin = fs.readFileSync(path_to_bin);

    if(read_bin){
      return read_bin;
    }else{
      throw new Error("the given file retuned, undefined, reload the entries for a fix");
    };

  }catch(e){
    throw new Error(Err(e));
  }
};


//audio only path begins
    
    async yt_audio_only(url, options = {}){
  try{
    var ytdlp_path = path.join(_dir,"../binaries","ytdlp");

    if(!url){
      throw new Error(`expected a valid youtube url but received, ${typeof url}`);
    };

    const linkTest = /^https?:\/\/(?:www\.|m\.|music\.)?(?:youtube\.com\/(?:watch\?(?:.*&)?v=[\w-]{11}|(?:embed|v|shorts|live)\/[\w-]{11}|playlist\?list=[\w-]+|channel\/UC[\w-]{22}|(?:c\/|user\/)?[\w.-]+|@[\w.-]+)|youtu\.be\/[\w-]{11})(?:[?&]\S*)?$/i

      
    if (linkTest.test(String(url?.trim())) !== true) {
      throw new Error("invalid youtube url given");
    }

    if(!fs.existsSync(ytdlp_path)){
      throw new Error("youtube download binary path has been revoked, reload the entries for a quick fix");
    };

    var path_to_save = path.join(`${os.homedir()}`,`${crypto.randomBytes(16).toString("base64url")}.tmp`);

    var audio_spawn = await spawn(ytdlp_path,
      [
        "-f","ba[ext=m4a]",
        "-x",
        "--audio-format","m4a",
        "-o", path_to_save,
       '--socket-timeout', parseInt(options.timeout),
        '--retries', '3',
        '-4',
        '-v',
        String(url)
      ],
      {
        stdio:["ignore","pipe","pipe"]
      }
    );
    //promise system begins

      var new_path = path_to_save+".m4a";
      
    var promiseData = await new Promise((resolve,reject)=>{
        audio_spawn.stderr.on("data",(data)=>{
            if(options.console === true ){
              console.log(data.toString("utf8"))
            };

          });

        audio_spawn.on("error",(e)=>{
            reject(e.toString("utf8"));
          });

        audio_spawn.on("close",(code)=>{
            if(parseInt(code) !==  0){
              reject(`youtube failed to get `)
            }else{
              if(fs.existsSync(new_path)){
                resolve({
                    success: true,
                    path: new_path
                  });
              }else{
                reject({
                    success: false,
                    reason: "the path retuned by the worker was missing or has been manually revoked"
                  })
              }
            }
            //spawn close ends here

          })
        //promise ends here

      });

    if(options.asBuffer === true){
      if(fs.existsSync(new_path)){
        var buffer_read = fs.readFileSync(new_path);
        fs.unlinkSync(new_path,{ recursive:true });
        return {
          success:true,
          promiseData:buffer_read
        };

      }else{
        return promiseData;
      }
    }else{

      throw new Error("The media path has been automatically or manually revoked");

    };

  }catch(e){
    throw new Error(Err(e));
  }
};
    //audio reign ends



    

    //more func coming with different styles 😊

};



export { pre_matrix as default, media_type };
