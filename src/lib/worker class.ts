interface Population {
    Acriculture: number;
    Luxury: number;
    Heathcare: number;
    Education: number;
    Media: number;
    worker: Worker[];
    population_level: number;
}

interface Worker {
    skill: string;
    location: string;
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
import { workerData } from 'worker_threads';
export class WorkerClass extends EventEmitter {
    private static instance: WorkerClass;
    private score: number;
    private population: Population;
    private tradeUnions: TradeUnions;
    private income: number;
    private prosperity: number;
    private cooperativefarm: number;
    private goodsAndServices: GoodsAndServices;
    private loan: number;

    private constructor() {
        super();
        this.loan = 0;
        this.score = 0;
        this.population = {
            Acriculture: 0,
            Luxury: 0,
            Heathcare: 0,
            Education: 0,
            Media: 0,
            worker: [],
            population_level: 3,
        };
        this.tradeUnions = {
            Acriculture: false,
            Luxury: false,
            Heathcare: false,
            Education: false,
            Media: false,
        };
        this.income = 0;
        this.prosperity = 0;
        this.cooperativefarm = 0;
        this.goodsAndServices = {
            Food: 0,
            Luxury: 0,
            Health: 0,
            Education: 0,
            Influence: 0,
        };
    }

    public static getInstance(): WorkerClass {
        if (!WorkerClass.instance) {
            const saveddata = localStorage.getItem('WorkerClass');
            if (saveddata) {
                WorkerClass.instance = new WorkerClass();
                WorkerClass.instance.SetWorkerClass(JSON.parse(saveddata));
            } else {
                WorkerClass.instance = new WorkerClass();
            }
        }
        return WorkerClass.instance;
    }

    SetWorkerClass(data: WorkerClass) {
        this.loan = data.loan;
        this.score = data.score;
        this.population = data.population;
        this.tradeUnions = data.tradeUnions;
        this.income = data.income;
        this.prosperity = data.prosperity;
        this.cooperativefarm = data.cooperativefarm;
        this.goodsAndServices = data.goodsAndServices;
    }




    addWorker(skill: string, location: string) {
        this.population.worker.push({ skill, location });
        this.emit('update');
    }

    setScore(newScore: number): void {
        this.score += newScore;
        this.emit('update');
    }
    addincome(number: number) {
        this.income += number;
        this.emit('update');
    }
    getworkingclassInfo() {
        return {
            population: this.population,
            goodsAndServices: this.goodsAndServices,
            tradeUnions: this.tradeUnions,
            income: this.income,
            score: this.score,
            loan: this.loan,
        };
    }
}

