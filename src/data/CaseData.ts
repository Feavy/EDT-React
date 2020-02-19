import { Color } from "csstype";

export default class CaseData {
    private _unitName: string = "???";
    private _teacherName: string = "???";
    private _roomName: string = "???";
    private _bgColor: Color = "0x000000";
    private _txtColor: Color = "0x000000";
    private _darkerBgColor: Color = "0x000000";
    private _lighterBgColor: Color = "0x000000";

    public width: number = 1;

    constructor(unitName: string, teacherName: string, roomName: string, bgColor: Color, txtColor: Color) {
        this._unitName = unitName;
        this._teacherName = teacherName;
        this._roomName = roomName;
        this._bgColor = bgColor;
        this._txtColor = txtColor;

        this._lighterBgColor = CaseData.lighter(this._bgColor, 25);
        this._darkerBgColor = CaseData.lighter(this._bgColor, -25);
    }

    public get unitName(): string { return this._unitName; }
    public get teacherName(): string { return this._teacherName; }
    public get roomName(): string { return this._roomName; }
    public get bgColor(): Color { return this._bgColor; }
    public get txtColor(): Color { return this._txtColor; }
    
    public get darkerBgColor(): Color {return this._darkerBgColor; }
    public get lighterBgColor(): Color {return this._lighterBgColor; }

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

export const EMPTY: CaseData = new CaseData("", "", "", "", "");