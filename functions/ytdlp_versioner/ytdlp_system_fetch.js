import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
import path, { dirname } from "node:path";
import fs from "node:fs";
var __dirname = dirname(fileURLToPath(import.meta.url));

var ytdlp_path = path.join(__dirname, "../../binaries", "ytdlp");

export async function yt_sys_fetch() {
    var yt_url_main =
        "https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp";

    if (!fs.existsSync(ytdlp_path)) {
        try {
            var yt_fetch = await fetch(yt_url_main, {
                method: "GET",
                headers: {
                    "Content-Type": "application/octet-stream",
                },
            });
            if (!yt_fetch?.ok) {
                return Err({
                    success: false,
                    message: `yt_dlp web fetch returned code ${yt_fetch?.statusCode}`,
                });
            }
            var yt_response = await yt_fetch.arrayBuffer();
            //console.log(yt_res);
            if (!yt_response) {
                return Err({
                    success: false,
                    message: "failed to fetch yt_dlp using Ip reslove...",
                });
            } else if (yt_fetch && Number(yt_fetch?.byteLength) > 30000) {
                return Err({
                    success: false,
                    medssge:
                        "invalid byte length, the file received is not a valid file => length to small...",
                });
            }
            var buffer_final = Buffer.from(yt_response);
            /*console.log(yt_response instanceof ArrayBuffer, buffer_final instanceof Buffer);*/
            //console.log(buffer_final.length/(1024*1024))

            if (!fs.existsSync(ytdlp_path) && buffer_final) {
                fs.writeFileSync(ytdlp_path, buffer_final);
                return {
                    success: true,
                    message: "successfully saved ytdlp binary...",
                };
            } else {
                return Err({
                    success: false,
                    message: "failed to save buffer, might be undefined...",
                });
            }
        } catch (err) {
            Err(
                `Failed to get data with request, ${JSON.stringify({
                    requestUrl: link,
                })}`,
            );
        }
    } else {
        return {
            success: false,
            reason: `ytdlp already exists in ${ytdlp_path}`,
        };
    }
}
