//modules import 

import { dirname } from 'path'
import { fileURLToPath } from 'url'

/*
 _dirname also refered as __dirname but since javascript is case-sensitive, we can use it again.
*/


/*
 this expression is made to prevent the errors caused when build with tsup or esbuild since in commonJS, import.meta.url is not available, this finc will switch between ESM AND CJS smoothly..
*/







const _dirname =typeof __dirname !== 'undefined' ? __dirname : dirname(fileURLToPath(import.meta.url));






export { _dirname }
