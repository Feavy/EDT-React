import ScheduleData from '../data/ScheduleData';
import CaseData from '../data/CaseData';
import CSVElement from './CSVElement';
import {Day, dayFromString} from '../data/Day';
import NewsData from '../data/NewsData';

export default class FlOpDataFetcher {
    public static fetch(week:number, year:number, callback:(data:ScheduleData, rawData?:string)=>void) {
        fetch("https://edt-relai.yo.fr/fetch.php?infos=1&year="+year+"&week="+week).then(data => data.text().then(txt => {
            callback(FlOpDataFetcher.parseData(txt), txt);
        }));
    }

    public static parseData(data:string):ScheduleData {
        const scheduleData:ScheduleData = new ScheduleData();

        let i = 0;

        let keys:string[];

        var lines = data.split("\r\n");

        keys = lines[i++].split(',');
        
        let line = lines[i];
        while(line && !line.includes("id")) {
            line = lines[i++];
            const elem:CSVElement = new CSVElement(keys, line.split(','));

            const caseData = new CaseData(elem.get('module'), elem.get('prof_name'), elem.get('room'), elem.get('room_type'), elem.get('coursetype'), elem.get('color_bg'), elem.get('color_txt'));

            if(elem.get('start_time') !== '???')
                scheduleData.set(dayFromString(elem.get('day')), Number.parseInt(elem.get('start_time')), elem.get('gpe_promo'), elem.get('gpe_name'), caseData);
        }

        keys = line.split(',');
        line = lines[i];
        while(line) {
            const elem:CSVElement = new CSVElement(keys, line.split(','));
            const index:number = Math.floor(Number.parseFloat(elem.get("x_beg")));
            const y:number = elem.get("y") == "???" ? 0 : Math.floor(Number.parseFloat(elem.get("y")));
            if(!scheduleData.newsData[index])
            scheduleData.newsData[index] = new NewsData();
            
            scheduleData.newsData[index].setLine(elem.get("txt"), elem.get("strk_color"), elem.get("fill_color"), y, elem.get("is_linked") || undefined);

            line = lines[i++];
        }

        //console.table(scheduleData.newsData);
    
        return scheduleData;
    }
}