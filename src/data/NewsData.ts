import CaseData, { EMPTY } from "./CaseData";
import { Color } from "csstype";

type NewsLine = {
    content:string;
    txtColor:Color
    bgColor:Color;
    url?:string;
}

export default class NewsData {
    public readonly lines:NewsLine[] = [];

    public setLine(line:string, txtColor:Color, bgColor:Color, index:number = 0, url?:string) {
        const theLine:NewsLine = {
            content: line,
            url: url,
            txtColor: txtColor,
            bgColor: bgColor
        }
        this.lines[index] = theLine;
    }
}