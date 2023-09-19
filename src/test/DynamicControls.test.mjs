import { describe, it } from 'mocha';
import { expect } from 'chai';
import { createControl, createButtonAtParent } from '../modules/DynamicControls.js'; 

// https://sparkbox.com/foundry/improve_unit_testing_with_mocha_chai_jsdom
// https://github.com/jsdom/jsdom
// https://github.com/jsdom/jsdom/wiki/Don't-stuff-jsdom-globals-onto-the-Node-global
import { JSDOM } from 'jsdom';  //, createButton, createUrlFromObject 

//My rule of thumb is this: If you are testing anything that is dependent on the DOM structure, then you are doing it wrong. 
//In summary:Try to test data manipulations and logical operations only.

//opinion 2 : DOM manipulation is a critical part of the web User Experience. If we can't test that, then we aren't good at what we do. DOM testing has been disregarded because there doesn't seem to be a good way to test it.

//Most often a component is more than just its class. Component combines an HTML template and a JavaScript/TypeScript class. That's why you should test that the template and the class work together as intended. The class-only tests can tell you about class behavior. But they cannot tell you if the component is going to render properly and respond to user input.

//jsdom is a JavaScript based headless browser that can be used to create a realistic testing environment.
//jsdom is a pure-JavaScript implementation of many web standards, notably the WHATWG DOM and HTML Standards, for use with Node.js. In general, the goal of the project is to emulate enough of a subset of a web browser to be useful for testing and scraping real-world web applications.
//By default, jsdom will not load any subresources such as scripts, stylesheets, images, or iframes
//jsdom does not have the capability to render visual content, and will act like a headless browser by default. It provides hints to web pages through APIs such as document.hidden that their content is not visible.
//jsdom includes support for using the canvas package to extend any <canvas> elements with the canvas API.


describe('DynamicControls', () => {

    // Arrange Create the necessary data & mocks for all test cases
    //Normally we would want to start off by mocking out everything in the ‘Arrange’ section of our tests, but since I know we will need to use the DOM for each of our tests we are going to use a beforeEach hook, one of my best friends when it comes to testing.
    beforeEach(() => {
        //load from file https://stackoverflow.com/questions/49875878/appending-a-html-file-to-jsdom-in-mocha-test-file
        const dom = new JSDOM(
            `<!DOCTYPE html><html><head></head>
            <body></body></html>`, {
                url: 'http://localhost/',    
                //defaults to "about:blank". sets the value returned by window.location, document.URL, and document.documentURI
                referrer: 'http://localhost/',   //affects the value read from document.referrer
                contentType: 'text/html',
                includeNodeLocations: true,
                //defaults to false. ensures that line numbers reported in exception stack traces for code running inside <script> elements are correct
                storageQuota: 10000000,
                //maximum size in code units for the separate storage areas used by localStorage and sessionStorage
                runScripts: 'dangerously'
                //jsdom's most powerful ability is that it can execute scripts inside the jsdom. To enable executing scripts inside the page, you can use the runScripts: "dangerously" option However, this is also highly dangerous when dealing with untrusted content. The jsdom sandbox is not foolproof
            }
        );
        globalThis.window = dom.window;
        globalThis.document = dom.window.document;
    });

    describe('createControl', () => {
        it('should return generated control', () => {
            // Arrange Create the necessary data & mocks

            // Act-call the target method
            const result = createControl('div', 'class1 class2', '', 'DivTest', null);

            // Assert - check the results
            expect(result.classList.contains('class1')).to.be.true;
            expect(result.outerHTML.includes('DivTest')).to.be.true;
            expect(result.outerHTML.includes('</div>')).to.be.true;
            //expect(result.fileLength).to.equal(10000);
        });
    });

    // describe('createButtonAtParent', () => {
    //     it('should return generated button', () => {
    //         // Arrange Create the necessary data & mocks
    //         const buttonid = 'btnTest', buttonParent = 'body', buttonClass='btn btn-success', 
    //             iconClass = 'fa fa-print', buttonText = 'Daily Totals',
    //             location = 'start', attributesObject = { 'report-id': 'reportIdTEST' }, extraInformation = 'disabled',
    //             actions = () => { return 'clicked'; }, preventDuplicate = true;
    //         // Act-call the target method
    //         const result = new createButtonAtParent(buttonid, buttonParent, buttonClass, iconClass, buttonText,
    //             location, attributesObject, extraInformation, actions, preventDuplicate);

    //         // Assert - check the results
    //         expect(result.classList.contains('btn-success')).to.be.true;
    //         const a = result.click();
    //         console.log(a);
    //         expect(result.outerHTML.includes('disabled')).to.be.true;
    //         expect(result.outerHTML.includes('fa-print')).to.be.true;
    //         //expect(result.fileLength).to.equal(10000);
    //     });
    // });
});