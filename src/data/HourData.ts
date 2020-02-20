import CaseData, { EMPTY } from "./CaseData";

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
        if(promo == "APSIO")
            promo = "INFO2";
        if(!this._data.has(promo))
            this._data.set(promo, new Map());

        if(group == "LP"){
            this._data.get(promo)!.set("4B", caseData);
        }else if(group == "CE") {
            const groups = ["1A", "1B", "2A", "2B", "3A", "3B", "4A"];
            if(promo == "INFO1")
                groups.push("4B");
            for(let gr of groups) {
                this._data.get(promo)!.set(gr, new CaseData(caseData.unitName, caseData.teacherName, caseData.roomName, caseData.bgColor, caseData.txtColor));
            }
        } else if(group.length == 2) {
            this._data.get(promo)!.set(group, caseData);
        } else {
            let grs = group.split("");
            for(let gr of grs) {
                this._data.get(promo)!.set(gr+"A", new CaseData(caseData.unitName, caseData.teacherName, caseData.roomName, caseData.bgColor, caseData.txtColor));
                if(!(promo === "INFO2" && gr === "4"))
                    this._data.get(promo)!.set(gr+"B", new CaseData(caseData.unitName, caseData.teacherName, caseData.roomName, caseData.bgColor, caseData.txtColor));
            }
        }
    }

    public get data():Map<string, Map<string, CaseData>> {
        return this._data;
    }

    public getCaseData(promo:string, group:string):CaseData {
        if(!this._data.has(promo))
            return EMPTY;

        if(!this._data.get(promo)!.get(group))
            this._data.get(promo)!.set(group, new CaseData("", "", "", "", ""));
        
        return this._data.get(promo)!.get(group)!;
    }
}