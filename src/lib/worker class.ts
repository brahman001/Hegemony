import { EventEmitter } from 'events';
import { CapitalistCompany, Company, StateCompany } from '@/lib/company'
import { CapitalistCompanys } from "@/lib/Capitalist class"
import { StateCompanies } from './board';
interface Worker {
    skill: string;
    location: Company | null;
}

interface Population {
    Natureofposition: {
        Acriculture: number;
        Luxury: number;
        Heathcare: number;
        Education: number;
        Media: number;
    };
    worker: Worker[];
    population_level: number;
}
interface TradeUnions {
    Acriculture: boolean;
    Luxury: boolean;
    Heathcare: boolean;
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
                Acriculture: 0,
                Luxury: 0,
                Heathcare: 0,
                Education:0,
                Media: 0,
            },
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
    Initialization2P() {
        this.loan = 0;
        this.score = 0;
        this.population = {
            Natureofposition: {
                Acriculture: 0,
                Luxury: 0,
                Heathcare: 0,
                Education: 0,
                Media: 0,
            },
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
        this.addWorker("unskill", CapitalistCompanys.find(CapitalistCompany => CapitalistCompany.name === "FARM_basic") as CapitalistCompany);
        this.addWorker("Acriculture", CapitalistCompanys.find(CapitalistCompany => CapitalistCompany.name === "FARM_basic") as CapitalistCompany);
        this.addWorker("unskill", CapitalistCompanys.find(CapitalistCompany => CapitalistCompany.name === "FACTORY_basic") as CapitalistCompany);
        this.addWorker("Luxury", CapitalistCompanys.find(CapitalistCompany => CapitalistCompany.name === "FACTORY_basic") as CapitalistCompany);
        this.addWorker("unskill", StateCompanies.find(StateCompany => StateCompany.name === "UNIVERSITY_3-2p") as StateCompany);
        this.addWorker("Education", StateCompanies.find(StateCompany => StateCompany.name === "UNIVERSITY_3-2p") as StateCompany);
        this.addWorker("unskill", StateCompanies.find(StateCompany => StateCompany.name === "HOSPITAL_3-2p") as StateCompany);
        this.addWorker("Heathcare", StateCompanies.find(StateCompany => StateCompany.name === "HOSPITAL_3-2p") as StateCompany);
        this.addWorker("unskill", null);
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
        this.population.worker.forEach(worker => {
            if (worker.location) {
                switch (worker.location.industry) {
                    case 'Agriculture':
                        this.population.Acriculture++;
                        break;
                    case 'Luxury':
                        this.population.Luxury++;
                        break;
                    case 'Healthcare':
                        this.population.Heathcare++;
                        break;
                    case 'Education':
                        this.population.Education++;
                        break;
                    case 'Media':
                        this.population.Media++;
                        break;
                }
            }
        });
    }
    addWorker(skill: string, location: Company | null) {
        this.population.worker.push({ skill, location });
        this.calculatePopulationLevel();
        if (location) {
            const industry = location.industry as keyof Population["Natureofposition"];
            this.population.Natureofposition[industry] += 1;
        }
        this.emit('update');
    }
    upgrade() {
        for (let i = 0; i < this.population.worker.length; i++) {
            const worker = this.population.worker[i];
            if (worker.skill === 'unskilled' && worker.location === null) {
                worker.skill = 'skilled';
                console.log(`Worker at index ${i} has been upgraded.`);
                return;
            }
        }
        console.log('No worker was eligible for upgrade.');

    }
    using(item: keyof GoodsAndServices, onSuccess: () => void, onError: (message: string) => void) {
        switch (item) {
            case "Food":
                this.goodsAndServices.Food -= this.population.population_level;
                break;
            case 'Education':
                if (this.goodsAndServices.Health - this.population.population_level >= 0) {
                    this.goodsAndServices.Health -= this.population.population_level;
                    this.addWorker('unskill', null);
                }
                else {
                    const errorMessage = `Invalid voting aim or policy already voted: ${item}`;
                    this.emit('update', errorMessage);
                    onError(errorMessage);
                }
                break;
            case 'Health':
                if (this.goodsAndServices.Health - this.population.population_level >= 0) {
                    this.goodsAndServices.Health -= this.population.population_level;
                    this.addWorker('unskill', null);
                    this.score += 2;
                    this.setProsperity(this.prosperity + 1);
                }
                else {
                    const errorMessage = `Invalid voting aim or policy already voted: ${item}`;
                    this.emit('update', errorMessage);
                    onError(errorMessage);
                }
                break;
            case "Luxury":
                if (this.goodsAndServices.Luxury - this.population.population_level >= 0) {
                    this.goodsAndServices.Luxury -= this.population.population_level;
                    this.setProsperity(this.prosperity + 1);
                }
                else {
                    const errorMessage = `Invalid voting aim or policy already voted: ${item}`;
                    this.emit('update', errorMessage);
                    onError(errorMessage);
                }
                break;
        }
    }
    payoffloan() {
        this.income -= 50;
        this.loan--;
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

