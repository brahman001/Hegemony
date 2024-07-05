interface CapitalistGoodsAndServices {
    Food: number;
    Luxury: number;
    Health: number;
    Education: number;
}

class CapitalistClass {
    private static instance: CapitalistClass;
    private Company: CapitalistCompany[];
    private Revenue: number;
    private Capitalist: number;
    private goodsAndServices: CapitalistGoodsAndServices;
    private Influence: number;
    private score: number;

    private constructor(score: number = 0, Company: CapitalistCompany[] = [], Revenue: number = 0, Capitalist: number = 120, goodsAndServices: Partial<CapitalistGoodsAndServices> = {}, Influence: number = 1) {
        this.Company = Company.slice(0, 12);
        this.Revenue = Revenue;
        this.Capitalist = Capitalist;
        this.goodsAndServices = {
            Food: goodsAndServices.Food || 0,
            Luxury: goodsAndServices.Luxury || 0,
            Health: goodsAndServices.Health || 0,
            Education: goodsAndServices.Education || 0,
        };
        this.Influence = Influence;
        this.score = score;

        CapitalistClass.instance = this;
    }

    static getInstance(): CapitalistClass {
        if (!CapitalistClass.instance) {
            CapitalistClass.instance = new CapitalistClass();
        }
        return CapitalistClass.instance;
    }

    getScore(): number {
        return this.score;
    }

    setScore(newScore: number): void {
        this.score = newScore;
    }
}