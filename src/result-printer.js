class Printer {
    createBuffer(res) {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const { rowCount, columnCount, data } = res;
    }
}
const Drawer = new Printer();
export default Drawer;
