import React from 'react';
import clsx from 'clsx';
import ReactDOM from 'react-dom';
import AnimatedFade from 'ui/animation/animated-fade';

const Popover = (props, ref) => {
    const {
        canDismiss = true,
        className,
        onDismiss,
        onOpen,
        mode = 'dynamic',
        offsetX = 0,
        offsetY = 0,
    } = props;
    const [position, setPosition] = React.useState(null);
    const containerRef = React.useRef(null);

    React.useImperativeHandle(
        ref,
        () => ({
            toggle: (e) => {
                e.stopPropagation();
                const el = e.currentTarget;
                const x = el.offsetLeft + offsetX;
                const y = el.offsetTop + el.clientHeight + offsetY;
                const isOpened = !!position;
                setPosition({ x, y });
                if (!isOpened) {
                    onOpen?.();
                }
            },
            close: handleClose,
        }),
        [position, mode, offsetX, offsetY, onOpen]
    );

    React.useEffect(() => {
        const handleDismiss = (e) => {
            if (containerRef.current && !containerRef.current.contains(e.target)) {
                handleClose();
            }
        };
        let isListened = false;
        if (position && canDismiss) {
            isListened = true;
            document.addEventListener('click', handleDismiss);
        }
        return () => {
            if (isListened) {
                document.removeEventListener('click', handleDismiss);
            }
        };
    }, [position, canDismiss]);

    const handleClose = () => {
        setPosition(null);
        onDismiss?.();
    };

    return ReactDOM.createPortal(
        <AnimatedFade
            unmountOnExit
            delay={200}
            in={!!position}
            style={{ top: position?.y, left: position?.x }}
            ref={containerRef}
            className={clsx('mpp-popover', className)}>
            {props.children}
        </AnimatedFade>,
        document.body
    );
};

export default React.forwardRef(Popover);
