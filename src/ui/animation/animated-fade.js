import React from 'react';
import CSSTransition from 'react-transition-group/CSSTransition';

const AnimatedFade = (props, ref) => {
    return (
        <CSSTransition
            in={props.in}
            classNames="mpp-anim-fade"
            unmountOnExit={props.unmountOnExit}
            timeout={props.delay}>
            <div className={props.className} ref={ref} style={props.style}>
                {props.children}
            </div>
        </CSSTransition>
    );
};

export default React.forwardRef(AnimatedFade);
