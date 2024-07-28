import { EventEmitter } from 'events';
import { CapitalistCompany, Company, StateCompany } from '@/lib/company'
import { CapitalistClass } from './Capitalist class';
import { Board } from './board';
import { parse, stringify } from 'flatted';
type skillkind = 'Agriculture' | 'Luxury' | 'Heathlcare' | 'Education' | 'Media' | 'unskill';
export interface Worker {
    skill: skillkind;
    location: Company | null | keyof TradeUnions;
}
export interface Population {
    Natureofposition: {
        Agriculture: number;
        Luxury: number;
        Heathlcare: number;
        Education: number;
        Media: number;
    };
    worker: Worker[];
    population_level: number;
}

interface TradeUnions {
    Agriculture: boolean;
    Luxury: boolean;
    Heathlcare: boolean;
    Education: boolean;
    Media: boolean;
}

export interface GoodsAndServices {
    Food: number;
    Luxury: number;
    Health: number;
    Education: number;
    Influence: number;
}

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
            Natureofposition: {
                Agriculture: 0,
                Luxury: 0,
                Heathlcare: 0,
                Education: 0,
                Media: 0,
            },
            worker: [],
            population_level: 3,
        };
        this.tradeUnions = {
            Agriculture: false,
            Luxury: false,
            Heathlcare: false,
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
            const savedData = localStorage.getItem('WorkerClass');
            if (savedData) {
                // Use flatted.parse instead of JSON.parse
                WorkerClass.instance = new WorkerClass();
                WorkerClass.instance.setWorkerClass(parse(savedData));
            } else {
                WorkerClass.instance = new WorkerClass();
            }
        }
        return WorkerClass.instance;
    }
    setWorkerClass(data: any): void {
        Object.assign(this, data);
    }
    Initialization2P() {
        this.loan = 0;
        this.score = 0;
        this.population = {
            Natureofposition: {
                Agriculture: 0,
                Luxury: 0,
                Heathlcare: 0,
                Education: 0,
                Media: 0,
            },
            worker: [],
            population_level: 3,
        };
        this.tradeUnions = {
            Agriculture: false,
            Luxury: false,
            Heathlcare: false,
            Education: false,
            Media: false,
        };
        this.income = 20;
        this.prosperity = 0;
        this.cooperativefarm = 0;
        this.goodsAndServices = {
            Food: 6,
            Luxury: 6,
            Health: 10,
            Education: 6,
            Influence: 10,
        };
        this.addWorker("unskill", CapitalistClass.getInstance().getinfo().companys.find(CapitalistCompany => CapitalistCompany.name === "FARM_basic") as CapitalistCompany);
        this.addWorker("Agriculture", CapitalistClass.getInstance().getinfo().companys.find(CapitalistCompany => CapitalistCompany.name === "FARM_basic") as CapitalistCompany);
        this.addWorker("unskill", CapitalistClass.getInstance().getinfo().companys.find(CapitalistCompany => CapitalistCompany.name === "FACTORY_basic") as CapitalistCompany);
        this.addWorker("Luxury", CapitalistClass.getInstance().getinfo().companys.find(CapitalistCompany => CapitalistCompany.name === "FACTORY_basic") as CapitalistCompany);
        this.addWorker("unskill", Board.getInstance().getinfo().companys.find(StateCompany => StateCompany.name === "UNIVERSITY_3-2p") as StateCompany);
        this.addWorker("Education", Board.getInstance().getinfo().companys.find(StateCompany => StateCompany.name === "UNIVERSITY_3-2p") as StateCompany);
        this.addWorker("unskill", Board.getInstance().getinfo().companys.find(StateCompany => StateCompany.name === "HOSPITAL_3-2p") as StateCompany);
        this.addWorker("Heathlcare", Board.getInstance().getinfo().companys.find(StateCompany => StateCompany.name === "HOSPITAL_3-2p") as StateCompany);
        if (Board.getInstance().getinfo().unempolyment.length === 0) {
            this.addWorker("unskill", null);
        }
        this.emit('update');
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
    setProsperity(number: number) {
        if (number > this.prosperity) {
            this.prosperity = Math.min(number, 10);
            this.score += this.prosperity;
        } else if (number < this.prosperity) {
            this.prosperity = number;
        }
    }
    calculatePopulationLevel() {
        const population = this.population.worker.length;
        if (population <= 11) {
            this.population.population_level = 3;
        } else if (population >= 30) {
            this.population.population_level = 10;
        } else {
            this.population.population_level = 4 + Math.floor((population - 12) / 3);
        }
    }
    addWorker(skill: skillkind, location: Company | null) {
        const worker = { skill, location };
        if (location !== null && location.workingworkers.length < location.requiredWorkers) {
            location.workingworkers.push(worker);
            const industry = location.industry as keyof Population["Natureofposition"];
            this.population.Natureofposition[industry] += 1;
            this.population.worker.push(worker);
            this.calculatePopulationLevel();
        }
        else if (location === null) {
            Board.getInstance().getinfo().unempolyment.push(worker);
            this.population.worker.push(worker);
            this.calculatePopulationLevel();
        }
        else {

        }
        this.emit('update');
    }
    upgrade(worker: Worker, aim: skillkind) {
        if (worker.skill === 'unskill') {
            worker.skill = aim;
            this.emit('update');
        }
    }
    using(item: keyof GoodsAndServices) {
        const populationLevel = this.population.population_level;
        const goods = this.goodsAndServices;
        let errorMessage: string | null = null;

        switch (item) {
            case "Food":
                if (goods.Food >= populationLevel) {
                    goods.Food -= populationLevel;
                    this.emit('update');
                } else {
                    errorMessage = `没有足够的 Food`;
                }
                break;

            case 'Education':
                if (goods.Health >= populationLevel) {
                    goods.Health -= populationLevel;
                    this.addWorker('unskill', null);
                  
                    this.emit('update');
                } else {
                    errorMessage = `没有足够的 Health`;
                }
                break;

            case 'Health':
                if (goods.Health >= populationLevel) {
                    goods.Health -= populationLevel;
                    this.addWorker('unskill', null);
                    this.score += 2;
                    this.setProsperity(this.prosperity + 1);
                
                    this.emit('update');
                } else {
                    errorMessage = `没有足够的 Health`;
                }
                break;

            case "Luxury":
                if (goods.Luxury >= populationLevel) {
                    goods.Luxury -= populationLevel;
                    this.setProsperity(this.prosperity + 1);
             
                    this.emit('update');
                } else {
                    errorMessage = `没有足够的 Luxury`;
                }
                break;

            default:
                errorMessage = `未知的资源: ${item}`;
                break;
        }

        if (errorMessage) {
            this.emit('update', errorMessage);
        }
    }
    payoffloan(onSuccess: () => void, onError: (message: string) => void) {
        this.income -= 50;
        this.loan--;
        onSuccess();
        this.emit("update")
    }
    setScore(newScore: number): void {
        this.score += newScore;
        this.emit('update');
    }
    addincome(number: number) {
        this.income += number;
        this.emit('update');
    }
    getinfo() {
        return {
            population: this.population,
            goodsAndServices: this.goodsAndServices,
            tradeUnions: this.tradeUnions,
            income: this.income,
            score: this.score,
            loan: this.loan,
        };
    }
    Buying(inputValue: number, Usingitem: keyof GoodsAndServices) {
        this.goodsAndServices[Usingitem] += inputValue;
        this.emit("update");
    }
    addunion(union: keyof Population["Natureofposition"]) {
        this.tradeUnions[union as keyof TradeUnions] = true;
        this.emit('update');
    }
    updateWorker(worker: Worker, newLocation: Company) {
        if (worker.location && typeof worker.location === 'object' && 'workingworkers' in worker.location) {
            const currentCompany = worker.location as Company;
            const index = currentCompany.workingworkers.indexOf(worker);
            if (index !== -1) {
                currentCompany.workingworkers.splice(index, 1);
            }
        }
        else {
            Board.getInstance().removeworker(worker);
        }
        worker.location = newLocation;
        newLocation.workingworkers.push(worker);
        this.emit('update');
    }
}

