class Capitalistclass{
    constructor(Company,Revenue,Capitalist,goodsAndServices,Influence){
        if (workerclass.instance) {
            return workerclass.instance;
        }
        this.Company = Array.isArray(Company) ? Company.slice(0, 12) : [];
        this.Revenue = Revenue || 0 ;
        this.Capitalist = Capitalist || 120 ;
        this.goodsAndServices = {
            Food: goodsAndServices.food || 0,
            Luxury: goodsAndServices.water || 0,
            Health: goodsAndServices.clothing || 0,
            Education: goodsAndServices.Education || 0,
        };
        this.Influence  = Influence ||1;
    }
    getScore(){
        return this.score;
    }
    setScore(newScore) {
        this.score = newScore;
    }
}