import React from 'react';
import Drawer from 'result-printer';
import Select from 'ui/select';
import FilePicker from 'utils/file-picker';

const App = () => {
    const [selectFile, setSelectFile] = React.useState('');
    const selectFileRef = React.useRef(null);
    const [out, setOut] = React.useState('');
    const picker = React.useMemo(() => {
        return new FilePicker({ multi: false, accepts: ['xls', 'xlsx'] });
    }, []);

    const handlePickInput = async () => {
        const [data] = await picker.showWebInputDialog();
        selectFileRef.current = data;
        setSelectFile(data.path);
    };

    const handlePickOutput = async () => {
        const dir = await showDirectoryPicker();
        setOut(dir.name);
    };

    const handleConvert = () => {
        const res = hehe.excelToPng(selectFileRef.current.path);
        console.log(res);
        Drawer.createBuffer(res);
    };

    return (
        <div className="app">
            <div className="picker">
                <div>1. Select input file</div>
                <div className="picked">
                    <button onClick={handlePickInput}>Select</button>
                    <span>{selectFile}</span>
                </div>
            </div>
            <div className="picker">
                <div>2. Select your sheet</div>
                <Select options={[]} placeholder="Select sheet" className="sheet-sel" />
            </div>
            <div className="picker">
                <div>3. Select directory to save</div>
                <div className="picked">
                    <button onClick={handlePickOutput}>Select</button>
                    <span>{out}</span>
                </div>
            </div>
            <button className="btn" onClick={handleConvert}>
                Convert to PNG
            </button>
        </div>
    );
};

export default App;
