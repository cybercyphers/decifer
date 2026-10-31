import path,{ dirname } from "node:path";
import fd from "node:fs";
import { fileURLToPath } from "node:url";
var __dirname = dirname(fileURLToPath(import.meta.url));
import matrix ,{ media_type }  from "../functions/systemFuncs.js";
import versioner, { 
    pre_check_update,
                   ytdlp_up_todate
} from "../functions/versioner.js";
