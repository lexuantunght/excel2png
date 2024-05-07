import React from 'react';

export default function useUnmountedRef() {
    const ref = React.useRef(false);

    React.useEffect(() => {
        return () => {
            ref.current = true;
        };
    }, []);

    return ref;
}
