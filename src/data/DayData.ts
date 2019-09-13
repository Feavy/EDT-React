import CaseData from "./CaseData";
import HourData from "./HourData";

export default class DayData {
    hoursData = new Map();

    set(startTime:number, promo:string, group:string, caseData:CaseData) {
        if(!this.hoursData.has(startTime))
            this.hoursData.set(startTime, new HourData(startTime, startTime+90));
        
        this.hoursData.get(startTime).set(promo, group, caseData);
    }


}