import DayData from "./DayData";
import {Day} from "./Day";
import CaseData from "./CaseData";
import NewsData from "./NewsData";

export default class ScheduleData {
    private _teachersName:string[] = [];
    private _unitsName:string[] = [];
    private _roomsName:string[] = [];
   
    private _daysData:DayData[] = [new DayData(), new DayData(), new DayData(), new DayData(), new DayData()];
    public newsData:NewsData[] = [];

    public set(day:Day, startTime:number, promo:string, group:string, caseData:CaseData) {
        this._daysData[day].set(startTime, promo, group, caseData);
        if(!this._teachersName.includes(caseData.teacherName))
            this._teachersName.push(caseData.teacherName);
        if(!this._unitsName.includes(caseData.unitName))
            this._unitsName.push(caseData.unitName);
        if(!this._roomsName.includes(caseData.roomName))
            this._roomsName.push(caseData.roomName);
    }

    public get newsLineAmount():number {
        return Math.max(...this.newsData.map(news => news.lines.length));
    }

    public get daysData():DayData[] {
        return this._daysData;
    }

    public get teachersName():string[] {
        return this._teachersName;
    }

    public get unitsName():string[] {
        return this._unitsName;
    }

    public get roomsName():string[] {
        return this._roomsName;
    }
}