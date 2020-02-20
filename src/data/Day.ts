export enum Day {
    MONDAY,
    TUESDAY,
    WEDNESDAY,
    THURSDAY,
    FRIDAY 
}

export function dayFromString(value:string):Day {
    switch (value) {
        case 'm': return Day.MONDAY;
        case 'tu': return Day.TUESDAY;
        case 'w': return Day.WEDNESDAY;
        case 'th': return Day.THURSDAY;
        case 'f': return Day.FRIDAY;
        default: return Day.MONDAY;
    }
}

export function dayToString(day:Day):string {
    switch (day) {
        case Day.MONDAY: return 'Lun.';
        case Day.TUESDAY: return 'Mar.';
        case Day.WEDNESDAY: return 'Mer.';
        case Day.THURSDAY: return 'Jeu.';
        case Day.FRIDAY: return 'Ven.';
    }
}