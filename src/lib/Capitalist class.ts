import { CapitalistCompany } from './company'
import { EventEmitter } from 'events';
interface CapitalistGoodsAndServices {
    Food: number;
    Luxury: number;
    Health: number;
    Education: number;
}

export class CapitalistClass extends EventEmitter {
    private static instance: CapitalistClass;
    private Company: CapitalistCompany[];
    private Revenue: number;
    private Capitalist: number;
    private goodsAndServices: CapitalistGoodsAndServices;
    private Influence: number;
    private score: number;
    private loan: number;

    private constructor() {
        super();
        this.Company = [];
        this.Revenue = 0;
        this.Capitalist = 120;
        this.goodsAndServices = {
            Food: 0,
            Luxury: 0,
            Health: 0,
            Education: 0,
        };
        this.Influence = 1;
        this.score = 0;
        this.loan = 0;
    }

    public static getInstance(): CapitalistClass {
        if (!CapitalistClass.instance) {
            const saveddata = localStorage.getItem('CapitalistClass');
            if (saveddata) {
                CapitalistClass.instance = new CapitalistClass();
                CapitalistClass.instance.SetCapitalistClass(JSON.parse(saveddata));
            } else {
                CapitalistClass.instance = new CapitalistClass();
            }
        }
        return CapitalistClass.instance;
    }
    SetCapitalistClass(data: CapitalistClass) {
        this.Company = data.Company;
        this.Revenue = data.Revenue;
        this.Capitalist = data.Capitalist;
        this.goodsAndServices = data.goodsAndServices;
        this.Influence = data.Influence;
        this.score = data.score;
        this.loan = data.loan;
    }
    setScore(newScore: number): void {
        this.score = newScore;
    }
    addgoodsAndServices(industry: String, number: number) {
        switch (industry) {
            case 'Acriculture':
                this.goodsAndServices.Food += number;
                break;
            case 'Luxury':
                this.goodsAndServices.Luxury += number;
                break;
            case 'Heathcare':
                this.goodsAndServices.Health += number;
                break;
            case 'Education':
                this.goodsAndServices.Education += number;
                break;
            case 'Media':
                this.Influence += number;
                break;
        }
    }
    getCapitalistInfo() {
        return {
            Score: this.score,
            Company: this.Company,
            Revenue: this.Revenue,
            Capitalist: this.Capitalist,
            goodsAndServices: this.goodsAndServices,
            Influence: this.Influence,
            loan: this.loan,
        };
    }
    Initialization() {
        this.Company = [];
        this.Company.push(CapitalistCompanys.find(CapitalistCompany => CapitalistCompany.name === "UNIVERSITY_basic") as CapitalistCompany);
        this.Company.push(CapitalistCompanys.find(CapitalistCompany => CapitalistCompany.name === "HOSPITAL_basic") as CapitalistCompany);
        this.Company.push(CapitalistCompanys.find(CapitalistCompany => CapitalistCompany.name === "FARM_basic") as CapitalistCompany);
        this.Company.push(CapitalistCompanys.find(CapitalistCompany => CapitalistCompany.name === "FACTORY_basic") as CapitalistCompany);
        this.Revenue = 0;
        this.Capitalist = 120;
        this.goodsAndServices = {
            Food: 0,
            Luxury: 0,
            Health: 0,
            Education: 0,
        };
        this.Influence = 1;
        this.score = 0;
        this.loan = 0;
    }
}
export const CapitalistCompanys: CapitalistCompany[] = [
    {
        name: "TV_STATION_8",
        cost: 8,
        industry: 'Media',
        requiredWorkers: 2,
        skilledworker: 0,
        goodsProduced: 2,
        wages: {
            L1: 20, L2: 15, L3: 10,
            level: 'L2'
        },
        imageUrl: "/CapitalistCompanys/2TvStation.gif",
        machineryBonus: {
            function: false,
            Bonus: 0,
        }
    },
    {
        name: "HOSPITAL_16",
        cost: 16,
        industry: 'Healthcare',
        requiredWorkers: 2,
        skilledworker: 1,
        goodsProduced: 6,
        wages: {
            L1: 30, L2: 20, L3: 10,
            level: 'L2'
        },
        imageUrl: "/CapitalistCompanys/6Hospital.gif",
        machineryBonus: {
            function: false,
            Bonus: 2,
        }
    },
    {
        name: "FARM_8",
        cost: 8,
        industry: 'Agriculture',
        requiredWorkers: 2,
        skilledworker: 0,
        goodsProduced: 3,
        wages: {
            L1: 20, L2: 15, L3: 10,
            level: 'L2'
        },
        imageUrl: "/CapitalistCompanys/3Farm.gif",
        machineryBonus: {
            function: false,
            Bonus: 0,
        }
    },
    {
        name: "TV_STATION_16",
        cost: 16,
        industry: 'Media',
        requiredWorkers: 2,
        skilledworker: 1,
        goodsProduced: 3,
        wages: {
            L1: 30, L2: 20, L3: 15,
            level: 'L2'
        },
        imageUrl: "/CapitalistCompanys/3TvStation(2).gif",
        machineryBonus: {
            function: false,
            Bonus: 0,
        }
    },
    {
        name: "TV_STATION_12",
        cost: 12,
        industry: 'Media',
        requiredWorkers: 3,
        skilledworker: 0,
        goodsProduced: 3,
        wages: {
            L1: 30, L2: 25, L3: 20,
            level: 'L2'
        },
        imageUrl: "/CapitalistCompanys/3TvStation.gif",
        machineryBonus: {
            function: false,
            Bonus: 0,
        }
    },
    {
        name: "FACTORY_8",
        cost: 8,
        industry: 'Luxury',
        requiredWorkers: 2,
        skilledworker: 0,
        goodsProduced: 4,
        wages: {
            L1: 20, L2: 15, L3: 10,
            level: 'L2'
        },
        imageUrl: "/CapitalistCompanys/4Factory.gif",
        machineryBonus: {
            function: false,
            Bonus: 2,
        }
    },
    {
        name: "FARM_16",
        cost: 16,
        industry: 'Agriculture',
        requiredWorkers: 2,
        skilledworker: 1,
        goodsProduced: 4,
        wages: {
            L1: 25, L2: 20, L3: 15,
            level: 'L2'
        },
        imageUrl: "/CapitalistCompanys/4Farm.gif",
        machineryBonus: {
            function: false,
            Bonus: 1,
        }
    },
    {
        name: "TV_STATION_24",
        cost: 24,
        industry: 'Media',
        requiredWorkers: 3,
        skilledworker: 1,
        goodsProduced: 4,
        wages: {
            L1: 40, L2: 30, L3: 20,
            level: 'L2'
        },
        imageUrl: "/CapitalistCompanys/4TvStation.gif",
        machineryBonus: {
            function: false,
            Bonus: 0,
        }
    },
    {
        name: "FARM_15",
        cost: 15,
        industry: 'Agriculture',
        requiredWorkers: 3,
        skilledworker: 0,
        goodsProduced: 5,
        wages: {
            L1: 30, L2: 25, L3: 20,
            level: 'L2'
        },
        imageUrl: "/CapitalistCompanys/5Farm.gif",
        machineryBonus: {
            function: false,
            Bonus: 0,
        }
    },
    {
        name: "FACTORY_16",
        cost: 16,
        industry: 'Luxury',
        requiredWorkers: 2,
        skilledworker: 1,
        goodsProduced: 6,
        wages: {
            L1: 25, L2: 20, L3: 15,
            level: 'L2'
        },
        imageUrl: "/CapitalistCompanys/6Factory.gif",
        machineryBonus: {
            function: false,
            Bonus: 3,
        }
    },
    {
        name: "FARM_20",
        cost: 20,
        industry: 'Agriculture',
        requiredWorkers: 3,
        skilledworker: 1,
        goodsProduced: 6,
        wages: {
            L1: 35, L2: 30, L3: 25,
            level: 'L2'
        },
        imageUrl: "/CapitalistCompanys/6Farm.gif",
        machineryBonus: {
            function: false,
            Bonus: 1,
        }
    },
    {
        name: "FACTORY_basic",
        cost: 16,
        industry: 'Luxury',
        requiredWorkers: 2,
        skilledworker: 1,
        goodsProduced: 6,
        wages: {
            L1: 25, L2: 20, L3: 15,
            level: 'L2'
        },
        imageUrl: "/CapitalistCompanys/Factory_basic.gif",
        machineryBonus: {
            function: false,
            Bonus: 2,
        }
    },
    {
        name: "HOSPITAL_16",
        cost: 16,
        industry: 'Healthcare',
        requiredWorkers: 2,
        skilledworker: 1,
        goodsProduced: 6,
        wages: {
            L1: 30, L2: 20, L3: 10,
            level: 'L2'
        },
        imageUrl: "/CapitalistCompanys/6Hospital.gif",
        machineryBonus: {
            function: false,
            Bonus: 2,
        }
    },
    {
        name: "UNIVERSITY_16",
        cost: 16,
        industry: 'Education',
        requiredWorkers: 2,
        skilledworker: 1,
        goodsProduced: 6,
        wages: {
            L1: 30, L2: 20, L3: 10,
            level: 'L2'
        },
        imageUrl: "/CapitalistCompanys/6University.gif",
        machineryBonus: {
            function: false,
            Bonus: 2,
        }
    },
    {
        name: "FACTORY_15",
        cost: 15,
        industry: 'Luxury',
        requiredWorkers: 3,
        skilledworker: 0,
        goodsProduced: 7,
        wages: {
            L1: 30, L2: 25, L3: 20,
            level: 'L2'
        },
        imageUrl: "/CapitalistCompanys/7Factory.gif",
        machineryBonus: {
            function: false,
            Bonus: 0,
        }
    },
    {
        name: "HOSPITAL_20",
        cost: 20,
        industry: 'Healthcare',
        requiredWorkers: 2,
        skilledworker: 1,
        goodsProduced: 7,
        wages: {
            L1: 30, L2: 20, L3: 10,
            level: 'L2'
        },
        imageUrl: "/CapitalistCompanys/7Hospital.gif",
        machineryBonus: {
            function: false,
            Bonus: 0,
        }
    },
    {
        name: "UNIVERSITY_20",
        cost: 20,
        industry: 'Education',
        requiredWorkers: 2,
        skilledworker: 1,
        goodsProduced: 7,
        wages: {
            L1: 30, L2: 20, L3: 10,
            level: 'L2'
        },
        imageUrl: "/CapitalistCompanys/7University.gif",
        machineryBonus: {
            function: false,
            Bonus: 0,
        }
    },
    {
        name: "HOSPITAL_20",
        cost: 20,
        industry: 'Healthcare',
        requiredWorkers: 3,
        skilledworker: 1,
        goodsProduced: 8,
        wages: {
            L1: 40, L2: 30, L3: 20,
            level: 'L2'
        },
        imageUrl: "/CapitalistCompanys/8Hospital.gif",
        machineryBonus: {
            function: false,
            Bonus: 3,
        }
    },
    {
        name: "UNIVERSITY_20",
        cost: 20,
        industry: 'Education',
        requiredWorkers: 3,
        skilledworker: 1,
        goodsProduced: 8,
        wages: {
            L1: 40, L2: 30, L3: 20,
            level: 'L2'
        },
        imageUrl: "/CapitalistCompanys/8University.gif",
        machineryBonus: {
            function: false,
            Bonus: 3,
        }
    },
    {
        name: "HOSPITAL_24",
        cost: 24,
        industry: 'Healthcare',
        requiredWorkers: 3,
        skilledworker: 1,
        goodsProduced: 9,
        wages: {
            L1: 40, L2: 30, L3: 20,
            level: 'L2'
        },
        imageUrl: "/CapitalistCompanys/9Hospital.gif",
        machineryBonus: {
            function: false,
            Bonus: 2,
        }
    },
    {
        name: "UNIVERSITY_24",
        cost: 24,
        industry: 'Education',
        requiredWorkers: 3,
        skilledworker: 1,
        goodsProduced: 9,
        wages: {
            L1: 40, L2: 30, L3: 20,
            level: 'L2'
        },
        imageUrl: "/CapitalistCompanys/9University.gif",
        machineryBonus: {
            function: false,
            Bonus: 2,
        }
    },
    {
        name: "FACTORY_20",
        cost: 20,
        industry: 'Luxury',
        requiredWorkers: 3,
        skilledworker: 1,
        goodsProduced: 8,
        wages: {
            L1: 35, L2: 30, L3: 25,
            level: 'L2'
        },
        imageUrl: "/CapitalistCompanys/8Factory.gif",
        machineryBonus: {
            function: false,
            Bonus: 3,
        }
    },
    {
        name: "FACTORY_basic",
        cost: 16,
        industry: 'Luxury',
        requiredWorkers: 2,
        skilledworker: 1,
        goodsProduced: 2,
        wages: {
            L1: 25, L2: 20, L3: 15,
            level: 'L2'
        },
        imageUrl: "/CapitalistCompanys/Factory_basic.gif",
        machineryBonus: {
            function: false,
            Bonus: 2,
        }
    },
    {
        name: "FARM_basic",
        cost: 16,
        industry: 'Agriculture',
        requiredWorkers: 2,
        skilledworker: 1,
        goodsProduced: 4,
        wages: {
            L1: 25, L2: 20, L3: 15,
            level: 'L2'
        },
        imageUrl: "/CapitalistCompanys/Farm_basic.gif",
        machineryBonus: {
            function: false,
            Bonus: 1,
        }
    },
    {
        name: "HOSPITAL_basic",
        cost: 16,
        industry: 'Healthcare',
        requiredWorkers: 2,
        skilledworker: 1,
        goodsProduced: 6,
        wages: {
            L1: 30, L2: 20, L3: 10,
            level: 'L2'
        },
        imageUrl: "/CapitalistCompanys/Hospital_basic.gif",
        machineryBonus: {
            function: false,
            Bonus: 2,
        }
    },
    {
        name: "UNIVERSITY_basic",
        cost: 16,
        industry: 'Education',
        requiredWorkers: 2,
        skilledworker: 1,
        goodsProduced: 6,
        wages: {
            L1: 30, L2: 20, L3: 10,
            level: 'L2'
        },
        imageUrl: "/CapitalistCompanys/University_basic.gif",
        machineryBonus: {
            function: false,
            Bonus: 2,
        }
    }
]