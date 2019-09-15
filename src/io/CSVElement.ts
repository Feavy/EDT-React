import {Day} from '../data/Day';

export default class CSVElement {
    private data:Map<string, string> = new Map<string, string>();

    constructor(keys:string[], values:string[]) {
        for(let i = 0; i < keys.length; i++) {
            this.data.set(keys[i], values[i]);
        }
    }

    public get(key:string):string {
        return this.data.get(key) || '???';
    }
}