import React from 'react';
import clsx from 'clsx';
import Popover from 'ui/popover';

function findItemByValue(items, value) {
    if (value === undefined) {
        return null;
    }
    return items.find((it) => it.value === value);
}

function Select(props) {
    const { options, placeholder, style, className, defaultValue, onChange } = props;
    const popoverRef = React.useRef(null);
    const [selected, setSelected] = React.useState(findItemByValue(options, defaultValue));
    const mainRef = React.useRef(null);

    const handleClick = (e) => {
        popoverRef.current?.toggle(e);
    };

    const handleOpen = () => {
        mainRef.current?.classList.add('--open');
    };

    const handleClose = () => {
        mainRef.current?.classList.remove('--open');
    };

    const handleSelect = (item) => {
        setSelected(item);
        onChange?.(item.value);
        popoverRef.current?.close();
    };

    return (
        <>
            <div
                style={style}
                ref={mainRef}
                className={clsx('mpp-select', className)}
                onClick={handleClick}>
                {selected ? (
                    selected.label
                ) : (
                    <span className="mpp-select__placeholder">{placeholder}</span>
                )}
                <div className="mpp-select__indicator">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                        <path d="M13.25 10 6.109 2.58a.697.697 0 0 1 0-.979.68.68 0 0 1 .969 0l7.83 7.908a.697.697 0 0 1 0 .979l-7.83 7.908a.68.68 0 0 1-.969 0 .697.697 0 0 1 0-.979L13.25 10z"></path>
                    </svg>
                </div>
            </div>
            <Popover
                className="mpp-select__popover"
                ref={popoverRef}
                onDismiss={handleClose}
                onOpen={handleOpen}
                mode="top-bottom"
                offsetY={5}>
                {options.map((item, key) => (
                    <div
                        className={clsx(
                            'mpp-select__option',
                            selected?.value === item.value && '--selected'
                        )}
                        key={key}
                        onClick={() => handleSelect(item)}>
                        {item.label}
                        {selected?.value === item.value && (
                            <div className="mpp-select__selected-indicator">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 30 30"
                                    width="24px"
                                    height="24px">
                                    <path d="M 26.980469 5.9902344 A 1.0001 1.0001 0 0 0 26.292969 6.2929688 L 11 21.585938 L 4.7070312 15.292969 A 1.0001 1.0001 0 1 0 3.2929688 16.707031 L 10.292969 23.707031 A 1.0001 1.0001 0 0 0 11.707031 23.707031 L 27.707031 7.7070312 A 1.0001 1.0001 0 0 0 26.980469 5.9902344 z" />
                                </svg>
                            </div>
                        )}
                    </div>
                ))}
            </Popover>
        </>
    );
}

export default Select;
