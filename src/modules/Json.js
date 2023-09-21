/**
 * Copyright (c) 2023 Sabarinathan Arthanari
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */

/** 
 * The list of utility functions to generate and manipulate the Json data.
 * These utility functions are available individually as well for tree shaking.
 * @module Json
 */
export { mergeExistingProperties, firstNCharacters, getKendoSortedData };

/**
 * Deep copies/clones the target object and merges the properties from the source object to the target 
 *  only if the property already exists in the target object.
 * @param {object} target the destination object to merge the properties and values
 * @param {object} source the source object to get the list of properties and values
 * @returns the new merged object
 */
function mergeExistingProperties(target, source) {
    let result = JSON.parse(JSON.stringify(target));  //deep copy
    for (const key in source) {
        if ( Object.prototype.hasOwnProperty.call(result, key) ) {
            result[key] = source[key];
        }
    }
    return result;
}

/**
 * iterates through each object in an array and takes first n number of characters in a particular property 
 * @param {Array} jsonArray the source JSON array to process
 * @param {string} propertyToModify the name of the property to trim
 * @param {number} n the initial number of characters to trim. integer
 * @returns the modified array
 */
function firstNCharacters(jsonArray, propertyToModify, n) {
    jsonArray.forEach(item => {
        if ( (item[propertyToModify]) && item[propertyToModify].length > n) {
            item[propertyToModify] = item[propertyToModify].substring(0, n);
        }
    });
    return jsonArray;
}

//Kendo ===================================================
/**
 * Get the unpaginated (full) sorted data from the kendo grid
 * @param {string} gridSelector the HTML element selector of the kendo grid
 * @returns the json array
 */
function getKendoSortedData(gridSelector) {
    var element = globalThis.document.querySelector(gridSelector);
    if (!(element)) return null;  //if it is not a valid element in the document return empty 
    // https://www.telerik.com/forums/get-sorted-items-without-paging
    var grid = element.data('kendoGrid');
    if (!(grid))
        return null;  //if it is not a kendo grid return empty 

    var result = null;
    var dataSource = grid.dataSource;
    var data = dataSource.data();
    var sort = dataSource.sort();
    if (data.length > 0 && sort) {  //sort throws error in case data length =0
        var query = new window.kendo.data.Query(data);
        var sortedData = query.sort(sort).data;
        result = sortedData;
    }
    else {
        result = data;
    }
    return result;
}