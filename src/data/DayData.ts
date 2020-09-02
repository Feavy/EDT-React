import CaseData from "./CaseData";
import HourData from "./HourData";

export default class DayData {
    private _hoursData = new Map<number, HourData>();

    constructor() {
        [495, 585, 675, 765, 855, 945, 1035].forEach(startTime => {
            this._hoursData.set(startTime, new HourData(startTime, startTime+90));
        });
    }

    set(startTime:number, promo:string, group:string, caseData:CaseData) {
        if(!this._hoursData.has(startTime))
            this._hoursData.set(startTime, new HourData(startTime, startTime+90));
        
        this._hoursData.get(startTime)!.set(promo, group, caseData);
    }

    public get hoursData():HourData[] {
        return Array.from(this._hoursData.values()).sort((a, b) => a.startTime - b.startTime);
    }
}