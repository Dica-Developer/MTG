const MTG_TXT_LINE_REGEX = /(\d+).*?(\S.*)/g;

/*@ngInject*/
export default class ImportService  {

    parseMtgFile(lines) {
        var sideboard = false;
        return lines.reduce((accumulator, line) => {
            if(line.trim() === '') {
                // empty line marks begin of sideboard
                sideboard = true;
            } else {
                MTG_TXT_LINE_REGEX.exec(line);
                MTG_TXT_LINE_REGEX.lastIndex = 0;
                accumulator.push({
                    count: RegExp.$1,
                    name: RegExp.$2,
                    sideboard: sideboard
                });
            }
            return accumulator;
        }, []);
    }
};
