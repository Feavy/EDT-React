import { Color } from "csstype";

export default class CaseData {
    public readonly unitName: string = "???";
    public readonly teacherName: string = "???";
    public readonly roomName: string = "???";
    public readonly coursetype: string = "???";
    public readonly roomType: string = "???";
    public readonly bgColor: Color = "0x000000";
    public readonly txtColor: Color = "0x000000";
    public readonly darkerBgColor: Color = "0x000000";
    public readonly lighterBgColor: Color = "0x000000";


    public width: number = 1;

    constructor(unitName: string, teacherName: string, roomName: string, coursetype:string, roomType:string, bgColor: Color, txtColor: Color) {
        this.unitName = unitName;
        this.teacherName = teacherName;
        this.roomName = roomName;
        this.bgColor = bgColor;
        this.txtColor = txtColor;
        this.coursetype = coursetype;
        this.roomType = roomType;

        this.lighterBgColor = CaseData.lighter(this.bgColor, 25);
        this.darkerBgColor = CaseData.lighter(this.bgColor, -25);
    }

    public clone():CaseData {
        return new CaseData(this.unitName, this.teacherName, this.roomName, this.coursetype, this.roomType, this.bgColor, this.txtColor);
    }
 
    private static lighter(color: Color, diff: number): Color {
        var usePound = false;

        if (color[0] == "#") {
            color = color.slice(1);
            usePound = true;
        }

        var num = parseInt(color, 16);

        var r = (num >> 16) + diff;

        if (r > 255) r = 255;
        else if (r < 0) r = 0;

        var b = ((num >> 8) & 0x00FF) + diff;

        if (b > 255) b = 255;
        else if (b < 0) b = 0;

        var g = (num & 0x0000FF) + diff;

        if (g > 255) g = 255;
        else if (g < 0) g = 0;

        return "rgb("+r+","+b+","+g+")";
    }
}

export const EMPTY: CaseData = new CaseData("", "", "", "", "", "", "");