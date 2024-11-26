import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { useState, type BaseSyntheticEvent } from "react";
import { krc, lrc, lrcx, nrc, qrc } from "smart-lyric";
import LyricTable from "./LyricTable";
import { ScrollArea } from "./ui/scroll-area";
import Player from "./Player";
import path from "path";
import { parse } from "@/util/lrc-parse";
import type { IKaraOKLyric, IRegularLyric } from "smart-lyric/typing/lyric/declare";

/** 纯文本歌词 */
export let lyricText: string = "";
/** 歌词数据对象 */
export let lyricData: IKaraOKLyric | IRegularLyric = null;

export default function Main() {
    const [lyric, setLyric] = useState<string>("");
    const [data, setData] = useState<IKaraOKLyric | IRegularLyric>(null);

    const [showPlayer, setShowPlayer] = useState(true);

    async function onInputFile(event: BaseSyntheticEvent) {
        console.log(event);
        let fileList: FileList = event.target.files;
        for (let index = 0; index < fileList.length; index++) {
            console.log(fileList[index]);
            console.log("文件扩展名: " + path.extname(fileList[index].name));
            let extname = path.extname(fileList[index].name);
            let arrBuffer = Buffer.from(await fileList[index].arrayBuffer());

            // 酷狗歌词
            if (extname == ".krc") {
                lyricText = krc.decrypt(arrBuffer);
                lyricData = krc.parse(lyricText);
            }
            // QQ音乐歌词
            else if (extname == ".qrc") {
                lyricText = qrc.decrypt(arrBuffer);
                lyricData = qrc.parse(lyricText);
            }
            // 酷我歌词
            else if (extname == ".lrcx") {
                lyricText = lrcx.decrypt(arrBuffer);
                lyricData = lrcx.parse(lyricText);
            }
            // 网易云歌词
            else if (extname == ".nrc") {
                lyricText = await fileList[index].text();
                lyricData = nrc.parse(lyricText);
            }
            else if (extname == ".lrc") {
                lyricText = await fileList[index].text();
                lyricData = parse(lyricText);
            }
            else {
                console.warn("不支持的文件扩展名，请重新确认文件！");
            }
            console.log(lyricText);
            console.log(lyricData);
            
            setLyric(lyricText);
            setData(lyricData);
        }
    }

    function switchPlayer () {
        console.log("switch!!!");
        setShowPlayer(!showPlayer);
    }

    return (
        <>
            <div className="container mx-auto my-2 px-4 grid grid-row-3 grid-flow-col gap-5 content-center h-screen">
                <Card className="my-2 mx-auto w-[300px] row-span-1">
                    {/* <CardHeader>
                        <CardTitle>Lyric Transformer</CardTitle>
                        <CardDescription>歌词转换器</CardDescription>
                    </CardHeader> */}
                    <CardContent>
                        <div className="items-center justify-center">
                            <Label >导入歌词文件</Label>
                            <Input id="lyric" type="file" accept='.qrc, .trc, .krc, .lrcx, .lrc, nrc' onChange={onInputFile}/>
                        </div>
                    </CardContent>
                </Card>

                <Card className="row-start-2 row-span-1 w-60 mx-auto">
                    <CardContent className="grid grid-cols-1 gap-2 mt-5">
                        <Label> 导出歌词文件 </Label>
                        <Button>普通歌词（.lrc）</Button>
                        <Button>QQ音乐歌词（.qrc）</Button>
                        <Button>酷我歌词（.lrcx）</Button>
                        <Button>酷狗歌词（.krc）</Button>
                        <Button>网易云歌词（.nrc）</Button>
                    </CardContent>
                </Card>

                <div className="row-end-1 row-span-1 grid grid-cols-1 gap-1 mx-auto my-auto">
                    <Label> 导入歌词 </Label>
                    <Label> =====&gt; </Label>
                </div>

                <div className="row-end-3 row-span-1 grid grid-cols-1 gap-1 mx-auto my-auto">
                    <Label> 导出歌词 </Label>
                    <Label> &lt;===== </Label>
                </div>

                <ScrollArea className="my-2 h-[500px] w-[600px] rounded-md border p-10 row-span-3">
                    <Label className="absolute left-3 top-2 font-bold text-lg">歌词预览</Label>
                    <LyricTable lyricText={lyric} lyricData={data} />
                </ScrollArea>

                {/* <Button className="mx-auto" onClick={switchPlayer}>打开播放器</Button> */}

                { showPlayer ? (<Player />) : (<></>) }
                
            </div>
        </>
    );
}