import fs from "node:fs";
import { execFile, spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";
import path, { dirname } from "node:path";
var __dirname = dirname(fileURLToPath(import.meta.url));
import {
    pre_check_update,
    versioner_ytdlp,
} from "./ytdlp_versioner/yt_update_system.js";
import { sleep } from "./ESMFunc.js";
import automatically_detect_setup from "./ffmpeg_versioner/ffmpeg_fetch_arch_stable.js";

import { yt_sys_fetch } from "./ytdlp_versioner/ytdlp_system_fetch.js";

var ytdlp = path.join(__dirname, "../binaries", "ytdlp");
var ffmpeg = path.join(__dirname, "../binaries", "ffmpeg");
var ffprobe = path.join(__dirname, "../binaries", "ffprobe");

export async function ytdlp_up_todate() {
    try {
        var ytdlp_web_version = await versioner_ytdlp();
        var ytldlp_inner_version = await pre_check_update();

        var new_web_version = ytdlp_web_version?.web_version;
        var old_system_version = ytldlp_inner_version.system_version;
        return old_system_version === new_web_version;
    } catch (e) {
        return Err(e?.stack || e?.message || e);
    }
}

export default async function check_up_secure_system() {
    try {
        if (!fs.existsSync(ytdlp)) {
            var yt_set = await yt_sys_fetch();
            //console.log(yt_set);
        }

        if (!fs.existsSync(ffmpeg) || !fs.existsSync(ffprobe)) {
            var ffmpeg_set = await automatically_detect_setup();
            //console.log(ffmpeg_set);

            if (
                ffmpeg_set.success &&
                typeof ffmpeg_set?.spam_tar === "string"
            ) {
                await slep(3000);

                fs.unlinkSync(ffmpeg_set.spam_tar),
                    {
                        recursive: true,
                    };
            } else {
                throw new Error(
                    Err({
                        success: false,
                        reason: "ffmpeg fetch and automatic set up failed due to an error, level => anonymous",
                    }),
                );
            }
        } else {
            return null;
        }
    } catch (e) {
        return Error(e?.stack || e?.message || e);
    }
}
