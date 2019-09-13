enum Day {
    MONDAY = 'm',
    TUESDAY = 'tu',
    WEDNESDAY = 'w',
    THURSDAY = 'th',
    FRIDAY = 'f'
}

function dayFromString(value:string):Day {
    for(let d:Day in Day) {
        if(d == value)
            return d;
    }

}

export default Day;