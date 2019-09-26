import DayData from "./DayData";
import {Day} from "./Day";
import CaseData from "./CaseData";

export default class ScheduleData {
    private _daysData:DayData[] = [new DayData(), new DayData(), new DayData(), new DayData(), new DayData()];
    constructor() {
        
    }

    set(day:Day, startTime:number, promo:string, group:string, caseData:CaseData) {
        this._daysData[day].set(startTime, promo, group, caseData);
    }

    public get daysData():DayData[] {
        return this._daysData;
    }
}