/**
 * Copyright (c) 2023 Sabarinathan Arthanari
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */

/** 
 * The list of utility functions to manage the graphics operations.
 * These utility functions are available individually as well for tree shaking.
 * @module Graphics
 */


/**
 * Identifies the DPI of the screen. Generally the horizontal and vertical DPI will be same for display.
 * @returns the screen DPI
 */
export function getDeviceDPI()
{
    const dpiDiv = document.createElement('div');
    dpiDiv.style.width = '1in';
    document.body.appendChild(dpiDiv);
    const dpi = dpiDiv.offsetWidth;
    document.body.removeChild(dpiDiv);
    return dpi;
}