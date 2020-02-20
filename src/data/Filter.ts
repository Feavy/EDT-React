export default class Filter {
    private _unvisibleGroups = {"INFO1": Array<String>(), "INFO2": Array<String>()};

    public _teacher:string|undefined;
    public _room:string|undefined;
    public _unit:string|undefined;

    private hideAll() {
        this._unvisibleGroups.INFO1 = ["1A", "1B", "2A", "2B", "3A", "3B", "4A", "4B"];
        this._unvisibleGroups.INFO2 = ["1A", "1B", "2A", "2B", "3A", "3B", "4A", "4B"];
        this._unit = undefined;
        this._room = undefined;
        this._teacher = undefined;
    }

    public hideGroup(promo:string, group:string) {
        if(promo === "INFO1" || promo === "INFO2") {
            if(!this._unvisibleGroups[promo].includes(group))
                this._unvisibleGroups[promo].push(group);
        }
    }

    public showGroup(promo:string, group:string) {
        if(promo === "INFO1" || promo === "INFO2") {
            const index:number = this._unvisibleGroups[promo].indexOf(group);
            if(index >= 0)
                this._unvisibleGroups[promo].splice(index, 1);
        }
        this._teacher = undefined;
        this._room = undefined;
        this._unit = undefined;
    }

    public isGroupVisible(promo:string, group:string):boolean {
        if(promo === "INFO1" || promo === "INFO2") {
            return !this._unvisibleGroups[promo].includes(group);
        }
        return false;
    }

    public isCaseVisible(current: import("./CaseData").default) {
        if(!this._teacher && !this._unit && !this._room)
            return false;
        if(this._teacher)
            return this._teacher == current.teacherName;
        if(this._unit)
            return this._unit == current.unitName;
        if(this._room)
            return this._room == current.roomName;
        return false;
    }

    public isPromoVisible(promo: string) {
        if(promo === "INFO1" || promo === "INFO2")
            return this._unvisibleGroups[promo].length !== 8;
        return false;
    }

    public hiddenGroupsAmount(promo: string) : number {
        if(promo === "INFO1" || promo === "INFO2")
            return this._unvisibleGroups[promo].length;
        return 0;
    }

    public set teacher(teacher:string|undefined) {
        this.hideAll();
        this._teacher = teacher;
    }

    public set room(room:string|undefined) {
        this.hideAll();
        this._room = room;
    }

    public set unit(unit:string|undefined) {
        this.hideAll();
        this._unit = unit;
    }

    public get unit():string|undefined {
        return this._unit;
    }

    public get teacher():string|undefined {
        return this._teacher;
    }

    public get room():string|undefined {
        return this._room;
    }
}