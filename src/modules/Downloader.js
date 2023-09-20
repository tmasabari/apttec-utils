/**
 * Copyright (c) 2023 Sabarinathan Arthanari
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */

/**
 * Download the file using multiple chunks in parallel to increase the download the speed
 * The server must support accept-ranges header.
 * 
 */
export class Downloader {
    /**
     * Download the file using multiple chunks in parallel to increase the download the speed
     * The server must support accept-ranges header.
     * if file length is lesser than the minFileSize in bytes, the simple download will be used
     * 
     * @param {string} url - The URL to download from.
     * @param {number} minFileSize - the minimum file length in bytes to initiate chunked download. Default value is 1 MB.
     * @param {number} maxRetries - the number of retries will be used in case of a network failure. Default value is 9
     * @param {number} retryDelay - the number of milli seconds to wait in case of a netowrk failure. Default value is 3 seconds.
     * @param {number} splits - the number of chunks to be used at a same time. Default value is 10.
     */
    constructor(url, minFileSize = 1024 * 1024, maxRetries = 9, retryDelay = 3000, splits=10) {
        this.url = url;
        this.minFileSize = minFileSize;
        this.splits = splits;
        this.maxRetries = maxRetries;
        this.retryDelay = retryDelay;
        this.chunkCompleted = new Event('chunkCompleted');

        this.chunkSize = -1;
        this.fileLength = -1;
    }

    /**
     * start the download asynchronously
     * 
     * @returns {Promise<Blob>} - The data from the URL.
     */
    async download() {
        try {
            // Check if the server supports byte-range requests and get file length.
            const { supportsChunked, fileLength } = await this.#checkChunkedSupport();
            this.fileLength = fileLength;
            if (supportsChunked && fileLength >= this.minFileSize) {
                this.chunkSize = Math.ceil(fileLength / this.splits);
                // If the server supports chunked responses and file length is sufficient, use chunked download.
                const blob = await this.#downloadChunked();
                console.log('Chunked download completed.');
                return blob;
            } else {
                // If not, use a simple download method.
                const blob = await this.downloadSimple();
                console.log('Simple download completed.');
                return blob;
            }
        } catch (error) {
            console.error('An error occurred:', error);
            throw error;
        }
    }

    /**
     * initiates the unparallel download asynchronously
     * 
     * @returns {Promise<Blob>} - The data from the URL.
     */
    async downloadSimple() {
        const buffer = await this.#downloadChunk(-1, -1);
        return new Blob([buffer] );
    }

    async #checkChunkedSupport() {
        try {
            const response = await fetch(this.url, { method: 'HEAD' });
            const acceptRanges = response.headers.get('accept-ranges');
            const contentLength = parseInt(response.headers.get('content-length'));

            return {
                supportsChunked: acceptRanges === 'bytes',
                fileLength: contentLength,
            };
        } catch (error) {
            console.error('Error checking chunked support:', error);
            return {
                supportsChunked: false,
                fileLength: 0,
            };
        }
    }

    async #downloadChunked() {
        const chunks = [];
        let startByte = 0;
        var downloadedSize=0;
        const promises = [];
        const totalSize = this.fileLength;
        while (startByte < totalSize) {
            const endByte = Math.min(startByte + this.chunkSize - 1, totalSize - 1);
            const closureBlock = () => { //create a closure function to maintain the start and end variables
                const start = startByte, end = endByte;
                const promise = this.#downloadChunk(start, end)
                    .then((chunk) => {
                        chunks.push({ start, chunk });

                        // Calculate and dispatch the download progress.
                        downloadedSize += end - start  + 1;
                        const progress = (downloadedSize / totalSize) * 100;
                        this.chunkCompleted.detail = {
                            downloadedSize,
                            totalSize,
                            progress,
                        };
                        document.dispatchEvent(this.chunkCompleted);

                        // You can update a progress bar or display the progress to the user here.
                    })
                    .catch((error) => {
                        // Handle download error, including retries.
                        return this.#handleDownloadError(error, start, end);
                    });
                promises.push(promise);
            };
            closureBlock();
            startByte = endByte + 1;
        }

        // Wait for all chunk promises to complete.
        await Promise.all(promises);

        // Sort the chunks by their startByte to ensure they are in the correct order.
        chunks.sort((a, b) => a.start - b.start);

        // Concatenate the chunks in order to create the final Blob.
        const blob = new Blob(chunks.map((chunkData) => chunkData.chunk));
        return blob;
    }

    async #downloadChunk(startByte, endByte) {
        const response = startByte < 0 
            ? await fetch(this.url) 
            :  await fetch(this.url, {
                headers: { Range: `bytes=${startByte}-${endByte}` },
            });

        if (!response.ok) {
            throw new Error(`Chunk download failed with status code: ${response.status}`);
        }
        // const body = await response.body;
        // const readResult = await body.getReader().read();
        // const { value, done } = readResult;

        // if (done) {
        //     throw new Error('Unexpected end of chunk.');
        // }

        const value = await response.arrayBuffer();
        return value;
    }

    async #handleDownloadError(error, startByte, endByte) {
        console.error('Chunk download error:', error);

        if (this.maxRetries > 0) {
            // Retry the chunk download with exponential backoff.
            await new Promise((resolve) => setTimeout(resolve, this.retryDelay));
            console.log('Retrying chunk download...');
            this.maxRetries--;
            return this.#handleDownloadError(
                await this.#downloadChunk(startByte, endByte), startByte, endByte );
        } else {
            throw error; // Max retries reached, propagate the error.
        }
    }
}