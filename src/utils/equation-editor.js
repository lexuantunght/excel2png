import React from 'react';
import clsx from 'clsx';
import { EditableMathField, addStyles } from 'react-mathquill';

addStyles();

const EquationEditor = (props) => {
    const [latex, setLatex] = React.useState(props.value ? props.value + '' : '');

    return (
        <EditableMathField
            {...props}
            latex={latex}
            onChange={(mathField) => {
                setLatex(mathField.latex());
                props.onChange?.(mathField.text());
            }}
        />
    );
};

export default EquationEditor;
