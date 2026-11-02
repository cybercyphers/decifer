import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

/*
@param { parameter | null | undefined } errMessage - message to be returned or logged to console it an error occures.

@return { string } the message that is safe to be logged
*/

var fallback_message =
    "wowdi, you caught a stubborn bug, report at https://github.com/cybercyphers/decifer/issues for it to be dealt with...";

const Err = (errMessage) => {
    //console.log(errMessage)

    var secureErr = errMessage ?? fallback_message;

    /*console.log(typeof secureErr);
    return;
 */
    var secureErrValidation =
        typeof secureErr === "object"
            ? JSON.stringify(secureErr, null, 3) || secureErr
            : String(secureErr);

    // console.log(typeof secureErr)

    if (
        !secureErr ||
        (typeof secureErr === "object" && Object.keys(secureErr).length === 0)
    ) {
        console.trace(`\n\x1b[31m${secureErr}\n\x1b[0m`);
    }
    console.trace(`\n\x1b[31m${secureErrValidation}\n\x1b[0m`);
};

export { Err };
