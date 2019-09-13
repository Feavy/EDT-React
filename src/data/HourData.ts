import CaseData from "./CaseData";

export default class HourData {
    _startTime:number = 0;
    _endTime:number = 0;

    data:Map<string, Map<string, CaseData>> = new Map();

    constructor(startTime:number, endTime:number) {
        this._startTime = startTime;
        this._endTime = endTime;
    }

    get startTime():number {
        return this.startTime;
    }

    get endTime():number {
        return this.endTime;
    }

    set(promo:string, group:string, caseData:CaseData) {
        if(!this.data.has(promo))
            this.data.set(promo, new Map());

        this.data.get(promo)!.set(group, caseData);
    }
}