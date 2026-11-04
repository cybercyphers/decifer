import fs from "node:fs";
import path, { dirname } from "node:path";
var __dirname = dirname(fileURLToPath(import.meta.url));
import system_arch from "./arch_request.js";
import { Err } from "../Error.js";
import { fileURLToPath } from "node:url";
import { spawn } from "node:child_process";
import { sleep } from "../ESMFunc.js";

const X86_64_bit =
    "https://johnvansickle.com/ffmpeg/releases/ffmpeg-release-amd64-static.tar.xz";
const x86_64_tar = "release-amd64-static.tar.xz";

const X86_32_bit =
    "https://johnvansickle.com/ffmpeg/releases/ffmpeg-release-i686-static.tar.xz";
const x86_32_tar = "release-i686-static.tar.xz";

const arm64_64_bit =
    "https://johnvansickle.com/ffmpeg/releases/ffmpeg-release-arm64-static.tar.xz";
const arm64_64_tar = "release-arm64-static.tar.xz";
const ffmpeg_path = path.join(__dirname, "../../binaries/", "ffmpeg");
const ffprobe_path = path.join(__dirname, "../../binaries/", "ffprobe");

async function x86_64_agreed_setup() {
    //throw new Error("hello");

    if (!fs.existsSync(ffmpeg_path) || !fs.existsSync(ffprobe_path)) {
        try {
            var x64_arch_fetch = await fetch(X86_64_bit, {
                method: "GET",
                header: {
                    "Content-Type": "application/octet-stream",
                },
            });
            if (!x64_arch_fetch.ok) {
                return Err(
                    "could not reslove an ip for johnvansickle's web or the given web address",
                );
            }
            var x64_arch_res = await x64_arch_fetch.arrayBuffer();
            if (!x64_arch_res) {
                return Err(
                    "could not reslove the data for johnvansickle's web or the given web address",
                );
            } else if (
                x64_arch_res &&
                Number(x64_arch_res?.byteLength) < 40000
            ) {
                return Err(
                    "the file received has an invalid buffer length aborting...",
                );
            }

            var tar_xz_path = path.join(__dirname, "./", x86_64_tar);
            fs.writeFileSync(tar_xz_path, Buffer.from(x64_arch_res));
            if (fs.existsSync(tar_xz_path)) {
                var spawn_ff = x86_64_tar.split(".")[0];

                var extract_spwan = await spawn(
                    "tar",
                    [
                        "-xvf",
                        tar_xz_path,
                        "-C",
                        path.join(__dirname, "../../binaries/"),
                        "--strip-components=1",
                        "--wildcards",
                        `*/ffmpeg`,
                        `*/ffprobe`,
                    ],
                    { stdio: "ignore", shell: true },
                );
            }

            
            var promiseData = await new Promise((resolve,reject)=>{

                extract_spawn.on("error",(e)=>{
                    reject(Err(e));
                });
                extract_spawn.on("close",(code)=>{
                    if(code !== 0){
                        reject(Err(`ffmpeg process returned code ${code}`));
                    }else{

if (fs.existsSync(ffmpeg_path) && !fs.existsSync(ffprobe_path)) {
                 resolve({ success: true, spam_tar: String(tar_xz_path) });
            }
                        
                    };
                    
                })
                
            });

          return promiseData;  
        } catch (e) {
            throw new Error(Err(e.stack));
        }
    } else {
        return { success: false, message: "FFMPEG & FFMPROBE already exists" };
    }
}

async function x86_32_agreed_setup() {
    if (!fs.existsSync(ffmpeg_path) || !fs.existsSync(ffprobe_path)) {
        try {
            //throw new Error("hello");

            var x86_32_arch_fetch = await fetch(X86_32_bit, {
                method: "GET",
                header: {
                    "Content-Type": "application/octet-stream",
                },
            });

            if (!x86_32_arch_fetch.ok) {
                return Err(
                    "could not reslove an ip for johnvansickle's web or the given web address",
                );
            }
            var x86_32_arch_res = await x86_32_arch_fetch.arrayBuffer();

            if (!x86_32_arch_res) {
                return Err(
                    "could not reslove the data for johnvansickle's web or the given web address",
                );
            } else if (
                x86_32_arch_res &&
                Number(x86_32_arch_res?.byteLength) < 40000
            ) {
                return Err(
                    "the file received has an invalid buffer length aborting...",
                );
            }

            var tar_xz_path = path.join(__dirname, "./", x86_32_tar);
            fs.writeFileSync(tar_xz_path, Buffer.from(x86_32_arch_res));
            if (fs.existsSync(tar_xz_path)) {
                var spawn_ff = x86_32_tar.split(".")[0];

                var extract_spwan = await spawn(
                    "tar",
                    [
                        "-xvf",
                        tar_xz_path,
                        "-C",
                        path.join(__dirname, "../../binaries/"),
                        "--strip-components=1",
                        "--wildcards",
                        `*/ffmpeg`,
                        `*/ffprobe`,
                    ],
                    { stdio: "ignore", shell: true },
                );
            }

            
            var promiseData = await new Promise((resolve,reject)=>{

                extract_spawn.on("error",(e)=>{
                    reject(Err(e));
                });
                extract_spawn.on("close",(code)=>{
                    if(code !== 0){
                        reject(Err(`ffmpeg process returned code ${code}`));
                    }else{

if (fs.existsSync(ffmpeg_path) && !fs.existsSync(ffprobe_path)) {
                 resolve({ success: true, spam_tar: String(tar_xz_path) });
            }
                        
                    };
                    
                })
                
            });

          return promiseData;  
        } catch (e) {
            throw new Error(Err(e.stack));
        }
    } else {
        return { success: false, message: "FFMPEG & FFMPROBE already exists" };
    }
}






async function arm64_64_agreed_setup() {
    if (!fs.existsSync(ffmpeg_path) || !fs.existsSync(ffprobe_path)) {
        try {
            //throw new Error("hello");

            var arm64_64_arch_fetch = await fetch(arm64_64_bit, {
                method: "GET",
                header: {
                    "Content-Type": "application/octet-stream",
                },
            });

            if (!arm64_64_arch_fetch.ok) {
                return Err(
                    "could not reslove an ip for johnvansickle's web or the given web address",
                );
            }
            var arm64_64_arch_res = await arm64_64_arch_fetch.arrayBuffer();

            if (!arm64_64_arch_res) {
                return Err(
                    "could not reslove the data for johnvansickle's web or the given web address",
                );
            } else if (
                arm64_64_arch_res &&
                Number(arm64_64_arch_res?.byteLength) < 40000
            ) {
                return Err(
                    "the file received has an invalid buffer length aborting...",
                );
            }

            var tar_xz_path = path.join(__dirname, "./", arm64_64_tar);
            fs.writeFileSync(tar_xz_path, Buffer.from(arm64_64_arch_res));
            if (fs.existsSync(tar_xz_path)) {
                var spawn_ff = arm64_64_tar.split(".")[0];

                var extract_spawn = await spawn(
                    "tar",
                    [
                        "-xvf",
                        tar_xz_path,
                        "-C",
                        path.join(__dirname, "../../binaries/"),
                        "--strip-components=1",
                        "--wildcards",
                        `*/ffmpeg`,
                        `*/ffprobe`,
                    ],
                    { stdio: ["pipe","pipe","pip"], shell: true },
                );
            }

            var promiseData = await new Promise((resolve,reject)=>{

                extract_spawn.on("error",(e)=>{
                    reject(Err(e));
                });
                extract_spawn.on("close",(code)=>{
                    if(code !== 0){
                        reject(Err(`ffmpeg process returned code ${code}`));
                    }else{

if (fs.existsSync(ffmpeg_path) && !fs.existsSync(ffprobe_path)) {
                 resolve({ success: true, spam_tar: String(tar_xz_path) });
            }
                        
                    };
                    
                })
                
            });

          return promiseData;  
        } catch (e) {
            throw new Error(Err(e.stack));
        }
    } else {
        return { success: false, message: "FFMPEG & FFMPROBE already exists" };
    }
}

export default async function automatically_detect_setup() {
    try {
        var arch = system_arch().arch;
        if (String(arch)?.trim()?.toLowerCase() === "ia32") {
            return await x86_32_agreed_setup();
        } else if (String(arch)?.trim()?.toLowerCase() === "x64") {
            return await x86_64_agreed_setup();
        } else if (String(arch)?.trim()?.toLowerCase() === "arm64") {
            return await arm64_64_agreed_setup();
        } else {
            return null;
        }
    } catch (e) {
        return Err(e?.stack || e.message || e);
    }
}
