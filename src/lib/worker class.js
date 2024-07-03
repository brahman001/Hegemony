class workerclass {
    constructor(score, population, population_level, income, prosperity, cooperativefarm, goodsAndServices) {
        if (workerclass.instance) {
            return workerclass.instance;
        }
        this.score = score || 0;
        this.population = {
            engineer: population.engineer || 0,
            teacher: population.teacher || 0,
            doctor: population.doctor || 0,
            artist: population.artist || 0,
            lawyer: population.lawyer || 0,
        };
        this.population_level = population_level || 0;
        this.tradeUnions = {
            engineer: false,
            teacher: false,
            doctor: false,
            artist: false,
            lawyer: false
        };
        this.income = income || 0;
        this.prosperity = prosperity || 0;
        this.cooperativefarm = cooperativefarm || 0;
        this.goodsAndServices = {
            Food: goodsAndServices.food || 0,
            Luxury: goodsAndServices.water || 0,
            Health: goodsAndServices.clothing || 0,
            Education: goodsAndServices.Education || 0,
            Influence: goodsAndServices.Influence || 0,
        };
    }
    
    static getInstance() {
        if (!workerclass.instance) {
            workerclass.instance = new workerclass({});
        }
        return workerclass.instance;
    }
    getScore(){
        return this.score;
    }
    setScore(newScore) {
        this.score = newScore;
    }
    
}