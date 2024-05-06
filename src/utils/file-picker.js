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

    showWebInputDialog() {
        return new Promise((resolve, reject) => {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = this.config.accepts.map((type) => `.${type}`).join(', ');
            input.multiple = this.config.multi;

            const handleChange = async () => {
                if (input.files && input.files.length) {
                    const errorCode = await this.handleValidateFiles(input.files);
                    if (errorCode !== null) {
                        reject(errorCode);
                    } else {
                        const result = [];
                        for (let i = 0; i < input.files.length; i++) {
                            const file = input.files[i];
                            result.push(file);
                        }
                        resolve(result);
                    }
                } else {
                    reject(ImagePickerErrorCode.CANCELLED);
                }
                input.remove();
            };
            const handleError = () => {
                reject(ImagePickerErrorCode.UNKNOWN_ERROR);
                input.remove();
            };
            input.addEventListener('change', handleChange, { once: true });
            input.addEventListener('error', handleError, { once: true });

            input.click();
        });
    }
}

export default FilePicker;
