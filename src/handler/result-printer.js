import { toBlob } from 'html-to-image';

class Printer {
    async createImage(res) {
        const { rowCount, columnCount, html } = res;
        const parser = new DOMParser();
        const table = parser.parseFromString(html, 'text/html').getElementById('data-view');
        document.body.appendChild(table);
        const blob = await toBlob(table, { backgroundColor: 'white' });
        return blob;
    }
}
const Drawer = new Printer();
export default Drawer;
