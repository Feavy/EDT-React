import CaseData from "./CaseData";

export default class HourData {
    _startTime:number = 0;
    _endTime:number = 0;

    _data:Map<string, Map<string, CaseData>> = new Map();

    constructor(startTime:number, endTime:number) {
        this._startTime = startTime;
        this._endTime = endTime;
    }

    get startTime():number {
        return this._startTime;
    }

    get endTime():number {
        return this._endTime;
    }

    set(promo:string, group:string, caseData:CaseData) {
        if(!this._data.has(promo))
            this._data.set(promo, new Map());
        if(group.length == 1) {
            this._data.get(promo)!.set(group+"A", caseData);
            this._data.get(promo)!.set(group+"B", new CaseData(caseData.unitName, caseData.teacherName, caseData.roomName, caseData.bgColor, caseData.txtColor));
        }else if(group == "CE"){
            for(let gr of ["1A", "1B", "2A", "2B", "3A", "3B", "4A", "4B"]) {
                this._data.get(promo)!.set(gr, new CaseData(caseData.unitName, caseData.teacherName, caseData.roomName, caseData.bgColor, caseData.txtColor));
            }
        }else
            this._data.get(promo)!.set(group, caseData);
    }

    public get data():Map<string, Map<string, CaseData>> {
        return this._data;
    }

    public getCaseData(promo:string, group:string):CaseData|undefined {
        if(!this._data.has(promo))
            return undefined;
        return this._data.get(promo)!.get(group);
    }
}