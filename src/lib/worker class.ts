interface Population {
    Acriculture: number;
    Luxury: number;
    Heathcare: number;
    Education: number;
    Media: number;
    worker: Worker[];
}

interface TradeUnions {
    Acriculture: boolean;
    Luxury: boolean;
    Heathcare: boolean;
    Education: boolean;
    Media: boolean;
}

interface GoodsAndServices {
    Food: number;
    Luxury: number;
    Health: number;
    Education: number;
    Influence: number;
}
import { EventEmitter } from 'events';
export class WorkerClass extends EventEmitter {
    private static instance: WorkerClass;
    private score: number;
    private population: Population;
    private population_level: number;
    private tradeUnions: TradeUnions;
    private income: number;
    private prosperity: number;
    private cooperativefarm: number;
    private goodsAndServices: GoodsAndServices;

    private constructor(score: number = 0, population: Partial<Population> = {}, population_level: number = 0, income: number = 0, prosperity: number = 0, cooperativefarm: number = 0, goodsAndServices: Partial<GoodsAndServices> = {}) {
        super();
        this.score = score;
        this.population = {
            Acriculture: population.Acriculture || 0,
            Luxury: population.Luxury || 0,
            Heathcare: population.Heathcare || 0,
            Education: population.Education || 0,
            Media: population.Media || 0,
            worker: [],
        };
        this.population_level = population_level;
        this.tradeUnions = {
            Acriculture: false,
            Luxury: false,
            Heathcare: false,
            Education: false,
            Media: false,
        };
        this.income = income;
        this.prosperity = prosperity;
        this.cooperativefarm = cooperativefarm;
        this.goodsAndServices = {
            Food: goodsAndServices.Food || 0,
            Luxury: goodsAndServices.Luxury || 0,
            Health: goodsAndServices.Health || 0,
            Education: goodsAndServices.Education || 0,
            Influence: goodsAndServices.Influence || 0,
        };
    }

    public static getInstance(): WorkerClass {
        if (!WorkerClass.instance) {
            WorkerClass.instance = new WorkerClass();
        }
        return WorkerClass.instance;
    }



    setScore(newScore: number): void {
        this.score += newScore;
        this.emit('update');
    }
    addincome(number: number) {
        this.income += number;
        this.emit('update');
    }
    mainaction() {

    }
    getincome() {
        return this.income;
    }
    getScore() {
        return this.score;
    }
}

