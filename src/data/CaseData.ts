import { Color } from "csstype";

export default class CaseData {
    private _unitName:string = "???";
    private _teacherName:string = "???";
    private _roomName:string = "???";
    private _bgColor:Color = "0x000000";
    private _txtColor:Color = "0x000000";

    public visible:boolean = true;
    public width:number = 1;

    constructor(unitName:string, teacherName:string, roomName:string, bgColor:Color, txtColor:Color) {
        this._unitName = unitName;
        this._teacherName = teacherName;
        this._roomName = roomName;
        this._bgColor = bgColor;
        this._txtColor = txtColor;
    }

    public get unitName():string { return this._unitName; }
    public get teacherName():string { return this._teacherName; }
    public get roomName():string { return this._roomName; }
    public get bgColor():Color { return this._bgColor; }
    public get txtColor():Color { return this._txtColor; }
}