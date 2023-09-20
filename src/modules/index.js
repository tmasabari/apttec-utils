/**
 * Copyright (c) 2023 Sabarinathan Arthanari
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * Loads the globalThis.AptTec.Downloader with Downloader class
 * Loads the globalThis.AptTec.DynamicControls with the utility functions
 * These utility functions are available individually as well for tree shaking.
 */
//https://stackoverflow.com/questions/35665759/es6-how-can-you-export-an-imported-module-in-a-single-line
import { Downloader } from './Downloader.js';
import * as DynamicControls from './DynamicControls.js';
import * as Json from './Json.js';
import * as Graphics from './Graphics.js';

export * from './Downloader.js';
export * from './DynamicControls.js';
export * from './Json.js';
export * from './Graphics.js';

globalThis.AptTec = globalThis.AptTec || {};
globalThis.AptTec.Downloader = Downloader;
globalThis.AptTec.DynamicControls = DynamicControls;
globalThis.AptTec.Json = Json;
globalThis.AptTec.Graphics = Graphics;

// if (typeof module !== 'undefined') { //&& module.exports
//     // Node.js environment
//     // module.exports = {
//     //     function1: require('./utils/function1'),
//     //     function2: require('./utils/function2'),
//     //     Downloader: Downloader
//     // };
// } else { // Browser environment Your browser-specific code here 
// }