export function uzsNumber(str) {
    return Number(str.replace(/[^0-9]/g, ''));
}

//apostrophe changer
export function apostropheChanger(str) {
    if(str.includes(`'`)) {
        return str.replace(/'/g, `’`);
    } else {
        return str;
    }
}