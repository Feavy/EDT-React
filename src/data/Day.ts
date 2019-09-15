export enum Day {
    MONDAY,
    TUESDAY,
    WEDNESDAY,
    THURSDAY,
    FRIDAY 
}

var m:Map<string, Day> = new Map<string, Day>([
    ['m', Day.MONDAY],
    ['tu', Day.TUESDAY],
    ['w', Day.WEDNESDAY],
    ['th', Day.THURSDAY],
    ['fr', Day.FRIDAY]
]);

export function dayFromString(value:string):Day {
    return m.get(value) || Day.MONDAY;
}