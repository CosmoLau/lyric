
export function parse(lyricText) {
    //结果
    const result = { type: 0, content: [] };
    //逐行处理
    lyricText.split(/\r?\n/).forEach(line => {
        line = line.trim();
        //匹配歌词时间
        const startTimes = [];
        while (true) {
            //匹配歌词时间
            const match = line.match(/^\[(\d+):(\d+)(\.(\d+))?\]/);
            if (match) {
                //取得时间
                const min = parseInt(match[1]);
                const sec = parseInt(match[2]);
                let sec100 = match[4] ? parseInt(match[4]) : 0;
                if (isNaN(min) || isNaN(sec))
                    return;
                if (isNaN(sec100))
                    sec100 = 0;
                const startTime = (min * 60 * 1000) + (sec * 1000) + (sec100 * 10);
                //保存时间继续处理
                if (!startTimes.includes(startTime))
                    startTimes.push(startTime);
                line = line.substring(match[0].length).trim();
            }
            //没有匹配到
            else
                break;
        }
        if (!line)
            return;
        //如果匹配到时间
        if (startTimes.length)
            result.content.push(...startTimes.map(start => ({ start, content: line })));
        //没有匹配到歌词
        else
            parseLyricTag(result, line);
    });
    //排序一下吧
    result.content = result.content.sort((a, b) => a.start - b.start);
    return result;
}

/**
 * 将给定的值处理为整数或undefined
 * @param v 要处理的值
 */
function toInt(v) {
    if (typeof v == 'string')
        v = parseInt(v);
    if (typeof v != 'number')
        return undefined;
    if (isNaN(v))
        return undefined;
    return parseInt(v.toString());
}
/**
 * 解析歌词标签
 * @param lyric 歌词对象
 * @param line 歌词行
 */
function parseLyricTag(lyric, line) {
    const match = line.match(/^\[([a-zA-Z#][a-zA-Z0-9_]*):(.*)\]$/);
    if (!match)
        return false;
    switch (match[1]) {
        case 'ti':
            lyric.ti = match[2].trim();
            break;
        case 'ar':
            lyric.ar = match[2].trim();
            break;
        case 'al':
            lyric.al = match[2].trim();
            break;
        case 'by':
            lyric.by = match[2].trim();
            break;
        case 'offset':
            lyric.offset = toInt(match[2].trim());
            break;
        default:
            lyric.ext ??= {};
            lyric.ext[match[1]] = match[2].trim();
    }
    return !!match?.[1];
}