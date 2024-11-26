import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Slider } from "./ui/slider";
import { convertMillisToCustomFormat } from "./LyricTable";

export default function Player() {

    const [totalTime, setTotalTime] = useState(2 * 60 * 1000);
    const [nowTime, setNowTime] = useState(0);

    /**
     * 滑动条拖动事件
     * @param param0 改变的值
     */
    function onSliderChange ([value]) {
        setNowTime(totalTime * value / 100);
    }

    return (
        <>
            <div className="fixed bottom-0 left-0 w-full bg-blue-400 border-t border-t-gray-400 py-2">
                <Slider defaultValue={[(nowTime / totalTime) * 100]} value={[(nowTime / totalTime) * 100]} max={100} step={0.1} className="mx-3 my-2 w-auto" onValueChange={onSliderChange}/>
                <div className="my-2 grid grid-cols-3 gap-4">
                    <div className="flex ml-2">
                        <Avatar className="ml-2 animate-spin hidden sm:block">
                            <AvatarImage src="https://github.com/shadcn.png" />
                            <AvatarFallback>Music</AvatarFallback>
                        </Avatar>
                        <Label className="mx-3 my-auto justify-center text-justify">{convertMillisToCustomFormat(nowTime)} / {convertMillisToCustomFormat(totalTime)}</Label>
                    </div>
                    <div className="mx-auto">
                        <Button className="mr-2" onClick={() => setNowTime(nowTime > 1000 ? nowTime - 1000 : 0)}>←</Button>
                        <Button className="">暂停</Button>
                        <Button className="ml-2" onClick={() => setNowTime(nowTime < totalTime - 1000 ? nowTime + 1000 : totalTime)}>→</Button>
                    </div>
                </div>
            </div>
        </>
    );
}