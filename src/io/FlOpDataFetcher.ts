import ScheduleData from '../data/ScheduleData';
import CaseData from '../data/CaseData';
import CSVElement from './CSVElement';
import {Day, dayFromString} from '../data/Day';

export default class FlOpDataFetcher {
    public static fetch(week:number, year:number, callback:(data:ScheduleData)=>void) {
        fetch("https://edt-relai.yo.fr/fetch.php?infos=1&year="+year+"&week="+week).then(data => data.text().then(txt => {
            callback(FlOpDataFetcher.parseData(txt));
        }));
    }

    private static parseData(data:string):ScheduleData {
        const scheduleData:ScheduleData = new ScheduleData();

        let i = 0;

        let keys:string[];

        var lines = data.split("\r\n");

        keys = lines[i++].split(',');
        
        let line = lines[i];
        while(line) {
            line = lines[i++];
            const elem:CSVElement = new CSVElement(keys, line.split(','));

            const caseData = new CaseData(elem.get('module'), elem.get('prof_name'), elem.get('room'), elem.get('color_bg'), elem.get('color_txt'));

            if(elem.get('start_time') !== '???')
                scheduleData.set(dayFromString(elem.get('day')), Number.parseInt(elem.get('start_time')), elem.get('gpe_promo'), elem.get('gpe_name'), caseData);
        }
    
        return scheduleData;
    }
}