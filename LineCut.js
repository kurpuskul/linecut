const LineCut = class {

    constructor(details, base, saw, store = [], prim = false){
        this.details = this.getDetails(details);
        this.base = base;
        this.saw = saw;
        this.store = store;
        this.prim = prim;
    }
    
    getAllChains(max){
        let variants = [];
    
        let getChains = (details, sum, last, chain) => {
            if(chain.length > 0){
                variants.push(chain);
            } else if(sum == 0){
                variants.push(chain);
                return;
            }
    
            for(let i = last; i < details.length; i++){
                if(details[i].len > sum || details[i].left == 0) break;
                details[i].left--;
                let curChain = [...chain];
                curChain.push(details[i]);
                getChains(details, sum - details[i].len - this.saw, i, curChain);
                details[i].left++;
            }
        }
    
        getChains(this.details, max, 0, []);
    
        return variants.map(v => {return {items : v, len : v.reduce((a,b) => a + b.len + this.saw, -this.saw)}});
    }

    getBestChain(max){
        return (this.getAllChains(max).sort((a,b) => b.len - a.len))[0];
    }
    
    
    
    detailClass = class {
        constructor(len, num){
            this.len = len;
            this.num = num;
            this.left = num;
        }
    
        take(num){
            if(this.left - num >= 0){
                this.left -= num;
            } else {
                console.log(`Can't take so much`);
                return false;
            }
        }
    
        turn(num){
            if(this.left + num <= this.num){
                this.left += num;
            } else {
                console.log(`Can't turn so much`);
                return false;
            }
        }
    }

    getDetails(detailsArr){
        return detailsArr.map(d => new this.detailClass(d[0], d[1])).sort((a,b) => a.len - b.len);
    }




}

let cut = new LineCut([[400,40],[300,50]], 2700, 4);

console.log(cut.getBestChain(cut.base));



