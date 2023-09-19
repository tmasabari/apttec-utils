/**
 * Copyright (c) 2023 Sabarinathan Arthanari
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
//https://stackoverflow.com/questions/35665759/es6-how-can-you-export-an-imported-module-in-a-single-line

import { Downloader } from './modules/Downloader.js';
import * as DynamicControls from './modules/DynamicControls.js';
export * from './modules/Downloader.js';
export * from './modules/DynamicControls.js';


globalThis.AptTec = globalThis.AptTec || {};
globalThis.AptTec.Downloader = Downloader;
globalThis.AptTec.DynamicControls = DynamicControls;



// if (typeof module !== 'undefined') { //&& module.exports
//     // Node.js environment
//     // module.exports = {
//     //     function1: require('./utils/function1'),
//     //     function2: require('./utils/function2'),
//     //     Downloader: Downloader
//     // };
// } else { // Browser environment Your browser-specific code here 
// }