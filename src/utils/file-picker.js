export const ImagePickerErrorCode = {
    CANCELLED: 'CANCELLED',
    EXCEEDED_LIMIT_ITEMS: 'EXCEEDED_LIMIT_ITEMS',
    INVALID_TYPE: 'INVALID_TYPE',
    EXCEEDED_SIZE: 'EXCEEDED_SIZE',
    UNKNOWN_ERROR: 'UNKNOWN_ERROR',
};

class FilePicker {
    config;
    constructor(props) {
        const {
            accepts = ['*'],
            multi = true,
            maxFileSize = 10 * 1000 * 1000,
            maxItems = 10,
        } = props;
        this.config = {
            accepts,
            multi,
            maxFileSize,
            maxItems,
        };
    }

    getFileExtension(fName) {
        const idx = fName.lastIndexOf('.');
        if (idx >= 0) {
            return fName.slice(fName.lastIndexOf('.') + 1);
        }
        return null;
    }

    isValidType(files) {
        const whiteListTypes = new Set(this.config.accepts);
        for (let i = 0; i < files.length; i++) {
            const fType = this.getFileExtension(files[i].name);
            if (!fType || !whiteListTypes.has(fType)) {
                return false;
            }
        }
        return true;
    }

    isValidFileSize(files) {
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            if (file.size > this.config.maxFileSize) {
                return false;
            }
        }
        return true;
    }

    async handleValidateFiles(files) {
        if (this.config.maxItems && files.length > this.config.maxItems) {
            return ImagePickerErrorCode.EXCEEDED_LIMIT_ITEMS;
        }
        if (!this.isValidType(files)) {
            return ImagePickerErrorCode.INVALID_TYPE;
        }
        if (!this.isValidFileSize(files)) {
            return ImagePickerErrorCode.EXCEEDED_SIZE;
        }
        return null;
    }

    async showWebInputDialog() {
        const fHandlers = await showOpenFilePicker({
            types: [
                {
                    description: 'Files',
                    accept: {
                        'file/*': this.config.accepts.map((type) => `.${type}`),
                    },
                },
            ],
            excludeAcceptAllOption: true,
            multiple: this.config.multi,
        });
        const files = await Promise.all(fHandlers.map((handler) => handler.getFile()));

        if (files && files.length) {
            const errorCode = await this.handleValidateFiles(files);
            if (errorCode !== null) {
                throw errorCode;
            } else {
                const result = [];
                for (let i = 0; i < files.length; i++) {
                    const file = files[i];
                    result.push(file);
                }
                return result;
            }
        } else {
            throw ImagePickerErrorCode.CANCELLED;
        }
    }
}

export default FilePicker;
