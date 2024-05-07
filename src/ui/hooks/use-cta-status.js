import React from 'react';
import useUnmountedRef from 'ui/hooks/use-unmounted-ref';

export default function useCTAStatus(init) {
    const [status, setStatus] = React.useState(init);
    const unmountedRef = useUnmountedRef();

    const disableCTA = (name) => {
        if (!unmountedRef.current) {
            setStatus((st) => ({ ...st, [name]: false }));
        }
    };

    const enableCTA = (name) => {
        if (!unmountedRef.current) {
            setStatus((st) => ({ ...st, [name]: true }));
        }
    };

    const disableAllCTA = () => {
        if (!unmountedRef.current) {
            setStatus((st) => {
                const updater = { ...st };
                Object.keys(st).forEach((key) => {
                    updater[key] = false;
                });
                return updater;
            });
        }
    };

    const enableAllCTA = () => {
        if (!unmountedRef.current) {
            setStatus((st) => {
                const updater = { ...st };
                Object.keys(st).forEach((key) => {
                    updater[key] = true;
                });
                return updater;
            });
        }
    };

    return { disableCTA, enableCTA, disableAllCTA, enableAllCTA, CTAStatus: status };
}
