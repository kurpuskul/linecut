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
    
        return variants.map(v => ({items : v, len : v.reduce((a,b) => a + b.size + this.saw, -this.saw)}));
    }

    getBestSchema(line){
        let best = (this.getAllChains(line).reverse().sort((a,b) => b.len - a.len))[0];
        let curDet = null;
        let schema = {usages: []};
        best.items.forEach(putToSchema);
        function putToSchema(d, i, arr){
            if(d != curDet){
                schema.usages.push({detail: d, num: 1});
                curDet = d;
            } else {
                schema.usages.find(u => u.detail == d).num++;
            }
        }
        schema.totLen = line;
        schema.usedLen = best.len;
        return schema;
    }

    getLongSchema(line){
        let longest = this.longest(line);
        longest.take(1);
        let best = this.getBestSchema(line - longest.size - this.saw);
        longest.turn(1);
        best.totLen += longest.size + this.saw;
        best.usedLen += longest.size + this.saw;
        best.usages[0].detail == longest ? best.usages[0].num++ :best.usages.push({detail : longest, num : 1});
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

let cut = new LineCut([[400,2],[300,4], [200,20], [600,1]], 2700, 0);

console.log(cut.getLongSchema(1200).usages);