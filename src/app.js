import React from 'react';
import Drawer from 'handler/result-printer';
import Select from 'ui/select';
import FilePicker from 'utils/file-picker';
import useCTAStatus from 'ui/hooks/use-cta-status';
import Workbook from 'handler/workbook';

const getFileName = (name = '') => {
    return name.substring(0, name.lastIndexOf('.'));
};

const App = () => {
    const [selectFile, setSelectFile] = React.useState('');
    const [sheets, setSheets] = React.useState([]);
    const [selectedSheet, setSelectedSheet] = React.useState();
    const selectFileRef = React.useRef(null);
    const [successPath, setSuccessPath] = React.useState('');
    const { disableAllCTA, enableAllCTA, disableCTA, enableCTA, CTAStatus } = useCTAStatus({
        inp: true,
        sheet: true,
        convert: true,
    });
    const picker = React.useMemo(() => {
        return new FilePicker({ multi: false, accepts: ['xls', 'xlsx'] });
    }, []);

    const handlePickInput = async () => {
        disableCTA('inp');
        try {
            const [data] = await picker.showWebInputDialog();
            selectFileRef.current = data;
            setSelectFile(data.name);
            const sheetData = (await Workbook.getAllSheetNames(data)).map((data) => ({
                label: data.name,
                value: data.id,
            }));
            setSheets(sheetData);
            setSelectedSheet(sheetData[0]?.value);
            setSuccessPath('');
        } catch (e) {
            console.error(e);
        }
        enableCTA('inp');
    };

    const handlePickOutput = async () => {
        try {
            await handleConvert();
        } catch (e) {
            console.error(e);
        }
    };

    const handleConvert = async () => {
        disableAllCTA();
        const res = await Workbook.process(selectFileRef.current, selectedSheet);
        console.log(res);
        const blob = await Drawer.createImage(res);
        const p = await hehe.saveFile(blob, getFileName(selectFile) + '.png', 'png');
        setSuccessPath(p);
        enableAllCTA();
    };

    const openResult = (e) => {
        e.preventDefault();
        hehe.openToFile(successPath);
    };

    return (
        <div className="app">
            <div className="picker">
                <div>1. Select input file</div>
                <div className="picked">
                    <button disabled={!CTAStatus.inp} onClick={handlePickInput}>
                        Select
                    </button>
                    <span>{selectFile}</span>
                </div>
            </div>
            <div className="picker">
                <div>2. Select your sheet</div>
                <Select
                    key={sheets.length}
                    disabled={!CTAStatus.sheet}
                    options={sheets}
                    placeholder="Select sheet"
                    className="sheet-sel"
                    defaultValue={sheets[0]?.value}
                    onChange={(value) => setSelectedSheet(value)}
                />
            </div>
            <div className="picker">
                <div>3. Select directory to save</div>
                <div className="picked">
                    <button
                        disabled={!CTAStatus.convert || !selectFile || !selectedSheet}
                        onClick={handlePickOutput}>
                        Select and save
                    </button>
                    {!!successPath && (
                        <span className="ok">
                            Convert successfully! <a onClick={openResult}>View now</a>
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
};

export default App;
