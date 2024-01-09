import type GetActiveElement from './types';

const getActiveElement: GetActiveElement = () => null;

const addCSS = () => null;

const getAutofilledInputStyle = () => null;

const requestAnimationFrame = (callback: () => void) => {
    if (!callback) {
        return;
    }

    callback();
};

export default {
    addCSS,
    getAutofilledInputStyle,
    getActiveElement,
    requestAnimationFrame,
};
