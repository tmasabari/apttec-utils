/**
 * Copyright (c) 2023 Sabarinathan Arthanari
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */

/** 
 * The list of utility functions to generate the HTML elements dynamically and to load the resources dynamically.
 * These utility functions are available individually as well for tree shaking.
 * @module DynamicControls
 */


/**
 * creates an HTML element and optionally assign the properties
 * 
 * @function createAssignElement
 * @param {string} name of the tag to generate. should be a valid HTML tag name. 
 * @param {object} the object that containes properties to be assigned to the element. The default value is  undefined
 * @returns {Element} - the created control
 */
export function createAssignElement(tag, propObject = undefined) {
    const element = globalThis.document.createElement(tag);
    return (propObject) ? Object.assign(element, propObject) : element;
}

/**
 * creates an HTML element and assign the CSS classes, creates an icon within the element, inserts the text within the element
 * 
 * @function createControl
 * @param {string} tag - HTML tag to be generated
 * @param {string} controlClass  - the CSS clases to be used for the element
 * @param {string} iconClass  - the icnon to be inserted between the element
 * @param {string} label  - the text to be inserted between the element
 * @returns {Element} - the created control
 */
export function createControl(tag, controlClass, iconClass, label) {
    const control = createAssignElement(tag);
    if (controlClass) control.className = controlClass;
    if (iconClass) control.innerHTML = `<i class="${iconClass}"></i>`;
    if (label) control.innerHTML += ` ${label}`;
    return control;
}
    
/**
 * creates an HTML Button and assigns the CSS classes, creates an icon within the element, inserts the text within the Button
 * 
 * @function createButton
 * @param {string} buttonClass - the CSS clases to be used for the button
 * @param {string} iconClass  - the icnon to be inserted between the button
 * @param {string} label  - the text to be inserted between the button
 * @param {function} onClick - the click event handler
 * @returns {Element} - the created button
 */
export function createButton(buttonClass, iconClass, label, onClick) {
    const button = createControl('button', buttonClass, iconClass, label);
    button.addEventListener('click', onClick);
    return button;
}

/**
 * creates an HTML Button within an existing element, and assigns the CSS classes, creates an icon within the element, inserts the text within the Button
 * 
 * @function createButtonAtParent
 * @param {string} id - Element Id
 * @param {string} buttonParent - Parent element css selector
 * @param {string} buttonClass - the CSS clases to be used for the button
 * @param {string} iconClass  - the icnon to be inserted between the button
 * @param {string} buttonText - the text to be inserted between the button
 * @param {string} location - the valid values are 'start' or 'end'. start-prepend the element. end-append the element 
 * @param {object} dataAttributesObject - all the attributes from this object will be applied as the data attributes to be used for the element.
 * @param {string} extraInformation - the extra HTML snippet to be directly applied to the tag
 * @param {boolean} preventDuplicate - if the value is true checks for the existing duplicate button and throws error if already exists
 * @returns {Element} - the created button
 */
export function createButtonAtParent(id, buttonParent, buttonClass, iconClass, buttonText,
    location = 'start', dataAttributesObject = {}, extraInformation = '', preventDuplicate = true) {

    var element = globalThis.document.querySelector(buttonParent) ;
    if (!(element)) throw 'Could not add a button. Please check buttonParent selector';

    const buttonSelector = buttonParent + ' #' + id;
    if (preventDuplicate) {
        const ButtonObject = globalThis.document.querySelector(buttonSelector) ;
        if (ButtonObject) {
            return {
                ButtonObject: ButtonObject,
                AlreadyExists: true     //if button already exists do not add again
            };
        }
    }

    var attributesText = ` id='${id}' ${extraInformation} `;
    dataAttributesObject['parent-selector'] = buttonParent;
    if (dataAttributesObject) {
        for (const [key, value] of Object.entries(dataAttributesObject)) {
            attributesText += ` data-${key}='${value}'`;
        }
    }
    const buttonTagText = `<button ${attributesText}  class='${buttonClass}' type='button' >
                <i class='${iconClass}'></i>${buttonText}</button>`;

    if (location === 'start')
        element.prepend(buttonTagText);
    else
        element.append(buttonTagText);

    const ButtonObject = globalThis.document.querySelector(buttonSelector);
    return {
        ButtonObject: ButtonObject,
        AlreadyExists: false
    };
}

/**
 * creates the downloadable URL from the JsonString
 * 
 * @function createUrlFromJsonString
 * @param {string} jsonString - the string to be converted to the downloadable URL
 * @returns {string} URL string
 */
export function createUrlFromJsonString(jsonString) {
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    return url;
}

/**
 * Generates the downloadable URL from the object
 * 
 * @function createUrlFromObject
 * @param {object} object - the object to be converted to the JSON string, blob and then to the URL
 * @returns {string} URL string
 */
export function createUrlFromObject(object) {
    const jsonString = JSON.stringify(object, null, 2);
    //space (2): A string or number that's used to add whitespace to the output JSON string for formatting purposes.
    return createUrlFromJsonString(jsonString);
}

/**
 * creates an anchor link and initiates the download by calling the click event
 * 
 * @param {string} url - the URL of the resource to download
 * @param {string} filename - the file name is to be used for the download
 */
export function autoDownloadUrl(url, filename = 'data.json') {
    const a = createAssignElement('a', {
        href: url, download : filename
    } );
    a.click();
}

//dynamic loading ===================================================
/**
 * Includes the style sheet object to the head of the document.
 * 
 * @param {string} url - the url to download the style sheet
 */
export function loadStylesheet(url) {
    var link = createAssignElement('link', {
        href: url, rel: 'stylesheet'
    });
    globalThis.document.head.appendChild(link);
}
/**
 * Includes the script object to the head of the document. https://developer.mozilla.org/en-US/docs/Web/API/HTMLScriptElement
 * 
 * @param {string} url - the url to download the script
 * @param {function} callbackOnLoad | call a function after the script is loaded
 * @param {boolean} isDefer | If the async attribute is absent but the defer attribute is present, then the script is executed when the page has finished parsing.
 * @param {boolean} isAsync | If the async attribute is present, then the script will be executed asynchronously as soon as it downloads.
 * The defer attribute may be specified with the async attribute, so legacy browsers that only support defer (and not async) fall back to the defer behavior instead of the default blocking behavior.
 * If neither attribute is present, then the script is fetched and executed immediately, blocking further parsing of the page.
 */
export function loadScript(url, callbackOnLoad = undefined, isDefer = undefined, isAsync = undefined) {
    var script = createAssignElement('script', {
        src: url, type: 'text/javascript', async: isAsync, defer: isDefer, onload : callbackOnLoad
    }); 
    globalThis.document.head.appendChild(script);
} 