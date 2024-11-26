import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { useState } from "react";
import { krc } from "smart-lyric";
import { Label } from "./ui/label";
import type { IKaraokeWord, IKaraOKLyric, ILyricLine, IRegularLyric } from "smart-lyric/typing/lyric/declare";
import { Input } from "./ui/input";
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from "./ui/context-menu";

export function convertMillisToCustomFormat(millis: number): string {
    const date = new Date(millis);
    let second = millis;
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    millis -= date.getMinutes() * 60 * 1000;
    // const seconds = date.getSeconds().toString().padStart(2, '0');
    const seconds = (millis / 1000).toFixed(2).toString().padStart(5, '0');

    return `${minutes}:${seconds}`;
}

function TableParse({ lyricData }: { lyricData: IKaraOKLyric | IRegularLyric }) {
    console.log("table parse!!!!", lyricData);
    if (!lyricData) return <></>
    if (lyricData.type == 1) {
        return (<>{
            lyricData.content.map((contents, index) => (
                <TableRow key={index}>
                    <TableCell>{convertMillisToCustomFormat(contents.start)}</TableCell>
                    <TableCell>{(contents.duration / 1000).toFixed(2)} 秒</TableCell>
                    <TableCell className="font-medium">{parseContent(contents)}</TableCell>
                </TableRow>
            ))}</>);
    }
    else if (lyricData.type == 0) {
        return (<>{lyricData.content.map((contents, index) => (
            <TableRow key={index}>
                <TableCell>{convertMillisToCustomFormat(contents.start)}</TableCell>
                <TableCell> -- 秒</TableCell>
                <TableCell className="font-medium">
                    <Input
                        defaultValue={contents.content}
                        type="text"
                    ></Input>
                </TableCell>
            </TableRow>
        ))}</>);
    }
}

function parseContent(contents: ILyricLine<IKaraokeWord[]>) {
    let lyricLine = "";
    contents.content.forEach(content => {
        lyricLine += content.content;
    });

    return lyricLine;
}

export default function LyricTable({ lyricText, lyricData }: { lyricText: string, lyricData: IKaraOKLyric | IRegularLyric }) {


    return (
        <>
            <Table className="w-auto mx-auto">
                <TableCaption>歌词表格</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[100px]">开始时间</TableHead>
                        <TableHead className="w-[100px]">持续时间</TableHead>
                        <TableHead>歌词</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    <TableParse lyricData={lyricData} />
                </TableBody>
            </Table>
        </>
    );
}