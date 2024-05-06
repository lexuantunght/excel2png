class FunctionalError {
    /**
     *
     * @param {string} message
     * @param {number} code
     */
    constructor(message, code) {
        this.error = Error(message);
        this.code = code;
    }
}

export default FunctionalError;
