import { Color } from "csstype";

export default class CaseData {
    unitName:string = "???";
    teacherName:string = "???";
    roomName:string = "???";
    bgColor:Color = "0x000000";
    txtColor:Color = "0x000000";

    constructor(unitName:string, teacherName:string, roomName:string, bgColor:Color, txtColor:Color) {
        this.unitName = unitName;
        this.teacherName = teacherName;
        this.roomName = roomName;
        this.bgColor = bgColor;
        this.txtColor = txtColor;
    }
}