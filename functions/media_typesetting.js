import fs from "node:fs";
import { Err } from "./Error.js";
import { fileURLToPath } from "node:url";
import path, { dirname } from "node:path";
var __dirname = dirname(fileURLToPath(import.meta.url));

export default function media_type(content_path) {
    try {
        var to_buffer = null;

        to_buffer = Buffer.isBuffer(content_path)
            ? content_path
            : fs.existsSync(content_path)
            ? fs.readFileSync(content_path)
            : null;

        if (!to_buffer) {
            throw new Error(
                Err(
                    "The data received does not look or function like a media file nor does it function like a readable content...",
                ),
            );
        }

        const hex = to_buffer.toString("hex", 0, 64).toUpperCase();

        //console.log(hex)

        if (hex.startsWith("89504E47")) return "image/png";
        if (hex.startsWith("FFD8FF")) return "image/jpeg";
        if (hex.startsWith("47494638")) return "image/gif";
        if (hex.startsWith("424D")) return "image/bmp";
        if (hex.startsWith("49492A00") || hex.startsWith("4D4D002A"))
            return "image/tiff";
        if (hex.startsWith("38425053")) return "image/vnd.adobe.photoshop";
        if (hex.startsWith("00000100")) return "image/x-icon";

        if (hex.startsWith("52494646")) {
            const type = hex.slice(16, 24);
            if (type === "57454250") return "image/webp";
            if (type === "41564920") return "video/x-msvideo";
            if (type === "57415645") return "audio/x-wav";
        }

        if (hex.slice(8, 16) === "66747970") {
            const brand = hex.slice(16, 24);
            const map = {
                "6D703431": "video/mp4",
                "6D703432": "video/mp4",
                "69736F6D": "video/mp4",
                61766331: "video/mp4",
                "4D345620": "video/mp4",
                "6B646469": "video/mp4",
                64617368: "video/mp4",
                "6D703731": "video/mp4",
                "49534F32": "video/mp4",
                71742020: "video/quicktime",
                33677034: "video/3gpp",
                33677035: "video/3gpp",
                33677036: "video/3gpp",
                "66326D31": "video/3gpp",
                68656963: "image/heic",
                68656973: "image/heic",
                "6D736631": "image/heic",
                68656978: "image/heic",
                "6865696D": "image/heic",
                "6D6D7031": "image/heic",
                61766966: "image/avif",
                61766973: "image/avif",
                "4D344120": "audio/mp4",
                "4D344220": "audio/mp4",
                "4D345020": "audio/mp4",
                61636331: "audio/mp4",
            };
            return {
                media: "video",
                type: map[brand] || "video/mp4",
            };

            if (hex.startsWith("1A45DFA3")) {
                return hex.includes("7765626D")
                    ? "video/webm"
                    : "video/x-matroska";
            }

            if (hex.startsWith("3026B2758E66CF11"))
                return { media: "video", type: "video/x-ms-wmv" };

            if (hex.startsWith("464C5601"))
                return { media: "video", type: "video/x-flv" };

            if (hex.startsWith("000001BA") || hex.startsWith("000001B3"))
                return { media: "video", type: "video/mpeg" };

            if (
                hex.startsWith("494433") ||
                hex.startsWith("FFFB") ||
                hex.startsWith("FFF3") ||
                hex.startsWith("FFF2")
            )
                return "audio/mpeg";
            if (hex.startsWith("4F676753")) return "audio/ogg";
            if (hex.startsWith("664C6143")) return "audio/x-flac";
            if (hex.startsWith("2321414D52")) return "audio/amr";
            if (hex.startsWith("4D546864")) return "audio/midi";

            if (hex.startsWith("25504456") || hex.startsWith("25504446"))
                return "application/pdf";
            if (hex.startsWith("504B0304")) return "application/zip";
            if (hex.startsWith("526172211A07"))
                return "application/x-rar-compressed";
            if (hex.startsWith("377ABCAF271C"))
                return "application/x-7z-compressed";
            if (hex.startsWith("1F8B08")) return "application/gzip";
            if (hex.startsWith("425A68")) return "application/x-bzip2";
            if (hex.startsWith("FD377A585A00")) return "application/x-xz";

            if (hex.startsWith("D0CF11E0A1B11AE1")) return "application/msword";
            if (hex.startsWith("4D5A")) return "application/x-msdownload";
            if (hex.startsWith("7F454C46")) return "application/x-elf";

            return null;
        }
    } catch (e) {
        throw new Error(Err(e));
    }
}
