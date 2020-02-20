export default class Filter {
    private _unvisibleGroups = {"INFO1": Array<String>(), "INFO2": Array<String>()};

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
    }

    public isGroupVisible(promo:string, group:string):boolean {
        if(promo === "INFO1" || promo === "INFO2") {
            return !this._unvisibleGroups[promo].includes(group);
        }
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
}