import DayData from "./DayData";
import {Day} from "./Day";
import CaseData from "./CaseData";

export default class SceduleData {
    private daysData:DayData[] = [new DayData(), new DayData(), new DayData(), new DayData(), new DayData()];
    constructor() {
        
    }

    set(day:Day, startTime:number, promo:string, group:string, caseData:CaseData) {
        this.daysData[day].set(startTime, promo, group, caseData);
    }
}