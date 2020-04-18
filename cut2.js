const LineCut = class {

    constructor(details, basis, saw, ends, stores = [], bfirst = false){
        this.details = this.getDetails(details);
        this.basis = basis;
        this.saw = saw;
        this.ends = ends;
        this.stores = stores;
        this.bfirst = bfirst;
        this.schemas = [];
    }
    
    getAllChains(line){
        let variants = [];
    
        let getChains = (details, sum, lastIndex, chain) => {
            if(chain.length > 0){
                variants.push(chain);
            } else if(sum == 0){
                variants.push(chain);
                return;
            }
    
            for(let i = lastIndex; i < details.length; i++){
                if(details[i].size > sum || details[i].curNum == 0) break;
                details[i].curNum--;
                let curChain = [...chain];
                curChain.push(details[i]);
                getChains(details, sum - details[i].size - this.saw, i, curChain);
                details[i].curNum++;
            }
        }
    
        getChains(this.fit(line), line, 0, []);
    
        return variants.map(v => {return {items : v, len : v.reduce((a,b) => a + b.size + this.saw, -this.saw)}});
    }

    getBestChain(line){
        let best = (this.getAllChains(line).sort((a,b) => b.len - a.len))[0];
        let curId = -1;
        let curNum = 0;
        let schema = {usages: []};
        best.items.forEach(putToSchema);
        function putToSchema(d , i, arr){
            if(d.id != curId){
                if(curNum > 0){
                    schema.usages.push({detailId : curId, detailNum : curNum});  
                }
                curId = d.id;
                curNum = 1;
            } else {
                curNum++;
            }

            if(i == arr.length -1){
                schema.usages.push({detailId : curId, detailNum : curNum});
            }
        }
        schema.totLen = line;
        schema.usedLen = best.len;
        return schema;
    }

    getLongSchema(line){
        let longest = this.longest(line);
        let best = this.getBestChain(line - longest.size - this.saw);
        best.totLen += longest.size + this.saw;
        best.usedLen += longest.size + this.saw;
        best.usages[best.usages.length-1].detailId == longest.id ? best.usages[best.usages.length-1].detailNum++ :best.usages.push({detailId : longest.id, detailNum : 1});
        return best;
    }
    
    
    
    detailClass = class {
        constructor(size, num, id){
            this.size = size;
            this.initNum = num;
            this.curNum = num;
            this.id = id;
        }
    
        take(num){
            if(this.curNum - num >= 0){
                this.curNum -= num;
            } else {
                console.log(`Can't take so much`);
                return false;
            }
        }
    
        turn(num){
            if(this.curNum + num <= this.initNum){
                this.curNum += num;
            } else {
                console.log(`Can't turn so much`);
                return false;
            }
        }
    }

    getDetails(detailsArr){
        return detailsArr.map((d, i) => new this.detailClass(d[0], d[1], i)).sort((a,b) => a.size - b.size);
    }

    fit(line){
        return this.details.filter(d => d.size <= line && d.curNum > 0);
    }

    longest(line){
        return this.fit(line).sort((a,b) => b.size - a.size)[0];
    }




}

let cut = new LineCut([[400,40],[300,50], [280,20]], 2700, 4);

console.log(cut.getLongSchema(2800));

