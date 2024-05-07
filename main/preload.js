const fs = require('fs');
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('hehe', {
    saveFile: (data, name, ext) => {
        return new Promise((resolve, reject) => {
            ipcRenderer.send('save-dialog', name, ext);
            ipcRenderer.once('save-dialog', async (_, savePath) => {
                try {
                    const arrayBuffer = await data.arrayBuffer();
                    fs.writeFileSync(savePath, Buffer.from(arrayBuffer));
                    resolve(savePath);
                } catch (e) {
                    reject(e);
                }
            });
            ipcRenderer.once('save-dialog-error', (_, e) => {
                reject(e);
            });
        });
    },
    openToFile: (path) => {
        ipcRenderer.send('open-to-file', path);
    },
});
