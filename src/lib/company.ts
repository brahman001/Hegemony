import { WorkerClass, Worker } from "./worker class";
import { CapitalistClass } from "./Capitalist class"
import { Board } from "./board";

type istateindustry = 'Heathlcare' | 'Education' | 'Media';
type Capitalistindustry = 'Agriculture' | 'Luxury' | 'Heathlcare' | 'Education' | 'Media';
interface Wages {
    level: number;
    1: number;
    2: number;
    3: number;
}

interface MachineryBonus {
    function: boolean;
    Bonus: number;
}
export class Company {
    Commit: boolean;
    name: string;
    cost: number;
    industry: String;
    skilledworker: number
    requiredWorkers: number;
    workingworkers: Worker[];
    goodsProduced: number;
    wages: Wages;
    imageUrl: string;
    Strike: Boolean;
    constructor(name: string, workingworkers: [],
        cost: number, industry: string, requiredWorkers: number, skilledworker: number, goodsProduced: number, wages: Partial<Wages>, imageUrl: string) {
        this.Commit= false;
        this.name = name;
        this.cost = cost;
        this.industry = industry;
        this.requiredWorkers = requiredWorkers;
        this.skilledworker = skilledworker;
        this.goodsProduced = goodsProduced;
        this.Strike = false;
        this.wages = {
            level: wages.level || 2,
            1: wages[1] ?? 0,       // 确保有一个默认值，例如 0
            2: wages[2] ?? 0,       // 确保有一个默认值，例如 0
            3: wages[3] ?? 0        // 确保有一个默认值，例如 0
        };
        this.imageUrl = imageUrl;
        this.workingworkers = workingworkers;
    }
}
export class CapitalistCompany extends Company {

    machineryBonus: MachineryBonus;
    constructor(name: string, workingworkers: [],
        cost: number, industry: string, requiredWorkers: number, skilledworker: number, goodsProduced: number, wages: Partial<Wages>, machineryBonus: Partial<MachineryBonus>, imageUrl: string) {
        super(name, workingworkers, cost, industry, requiredWorkers, skilledworker, goodsProduced, wages, imageUrl);
        this.machineryBonus = {
            function: machineryBonus.function || false,
            Bonus: machineryBonus.Bonus || 0,
        };
    }
}

export class StateCompany extends Company {
    constructor(
        name: string,
        workingworkers: [],
        Strike: false,Commit:false,
        cost: number,
        industry: string,
        requiredWorkers: number,
        skilledworker: number,
        goodsProduced: number,
        wages: Wages,
        imageUrl: string
    ) {
        super(name, workingworkers, cost, industry, requiredWorkers, skilledworker, goodsProduced, wages, imageUrl);
    }

}
export const CapitalistCompanys: CapitalistCompany[] = [
    {
        name: "TV_STATION_8",
        workingworkers: [], Strike: false,Commit:false,
        cost: 8,
        industry: 'Media',
        requiredWorkers: 2,
        skilledworker: 0,
        goodsProduced: 2,
        wages: {
            1: 20, 2: 15, 3: 10,
            level: 2
        },
        imageUrl: "/CapitalistCompanys/2TvStation.gif",
        machineryBonus: {
            function: false,
            Bonus: 0,
        },

    },
    {
        name: "HOSPITAL_16",
        workingworkers: [], Strike: false,Commit:false,
        cost: 16,
        industry: 'Heathlcare',
        requiredWorkers: 2,
        skilledworker: 1,
        goodsProduced: 6,
        wages: {
            1: 30, 2: 20, 3: 10,
            level: 2
        },
        imageUrl: "/CapitalistCompanys/6Hospital.gif",
        machineryBonus: {
            function: false,
            Bonus: 2,
        }
    },
    {
        name: "FARM_8",
        workingworkers: [], Strike: false,Commit:false,
        cost: 8,
        industry: 'Agriculture',
        requiredWorkers: 2,
        skilledworker: 0,
        goodsProduced: 3,
        wages: {
            1: 20, 2: 15, 3: 10,
            level: 2
        },
        imageUrl: "/CapitalistCompanys/3Farm.gif",
        machineryBonus: {
            function: false,
            Bonus: 0,
        }
    },
    {
        name: "TV_STATION_16",
        workingworkers: [], Strike: false,Commit:false,
        cost: 16,
        industry: 'Media',
        requiredWorkers: 2,
        skilledworker: 1,
        goodsProduced: 3,
        wages: {
            1: 30, 2: 20, 3: 15,
            level: 2
        },
        imageUrl: "/CapitalistCompanys/3TvStation(2).gif",
        machineryBonus: {
            function: false,
            Bonus: 0,
        }
    },
    {
        name: "TV_STATION_12",
        workingworkers: [], Strike: false,Commit:false,
        cost: 12,
        industry: 'Media',
        requiredWorkers: 3,
        skilledworker: 0,
        goodsProduced: 3,
        wages: {
            1: 30, 2: 25, 3: 20,
            level: 2
        },
        imageUrl: "/CapitalistCompanys/3TvStation.gif",
        machineryBonus: {
            function: false,
            Bonus: 0,
        }
    },
    {
        name: "FACTORY_8",
        workingworkers: [], Strike: false,Commit:false,
        cost: 8,
        industry: 'Luxury',
        requiredWorkers: 2,
        skilledworker: 0,
        goodsProduced: 4,
        wages: {
            1: 20, 2: 15, 3: 10,
            level: 2
        },
        imageUrl: "/CapitalistCompanys/4Factory.gif",
        machineryBonus: {
            function: false,
            Bonus: 2,
        }
    },
    {
        name: "FARM_16",
        workingworkers: [], Strike: false,Commit:false,
        cost: 16,
        industry: 'Agriculture',
        requiredWorkers: 2,
        skilledworker: 1,
        goodsProduced: 4,
        wages: {
            1: 25, 2: 20, 3: 15,
            level: 2
        },
        imageUrl: "/CapitalistCompanys/4Farm.gif",
        machineryBonus: {
            function: false,
            Bonus: 1,
        }
    },
    {
        name: "TV_STATION_24",
        workingworkers: [], Strike: false,Commit:false,
        cost: 24,
        industry: 'Media',
        requiredWorkers: 3,
        skilledworker: 1,
        goodsProduced: 4,
        wages: {
            1: 40, 2: 30, 3: 20,
            level: 2
        },
        imageUrl: "/CapitalistCompanys/4TvStation.gif",
        machineryBonus: {
            function: false,
            Bonus: 0,
        }
    },
    {
        name: "FARM_15",
        workingworkers: [], Strike: false,Commit:false,
        cost: 15,
        industry: 'Agriculture',
        requiredWorkers: 3,
        skilledworker: 0,
        goodsProduced: 5,
        wages: {
            1: 30, 2: 25, 3: 20,
            level: 2
        },
        imageUrl: "/CapitalistCompanys/5Farm.gif",
        machineryBonus: {
            function: false,
            Bonus: 0,
        }
    },
    {
        name: "FACTORY_16",
        workingworkers: [], Strike: false,Commit:false,
        cost: 16,
        industry: 'Luxury',
        requiredWorkers: 2,
        skilledworker: 1,
        goodsProduced: 6,
        wages: {
            1: 25, 2: 20, 3: 15,
            level: 2
        },
        imageUrl: "/CapitalistCompanys/6Factory.gif",
        machineryBonus: {
            function: false,
            Bonus: 3,
        }
    },
    {
        name: "FARM_20",
        workingworkers: [], Strike: false,Commit:false,
        cost: 20,
        industry: 'Agriculture',
        requiredWorkers: 3,
        skilledworker: 1,
        goodsProduced: 6,
        wages: {
            1: 35, 2: 30, 3: 25,
            level: 2
        },
        imageUrl: "/CapitalistCompanys/6Farm.gif",
        machineryBonus: {
            function: false,
            Bonus: 1,
        }
    },
    {
        name: "FACTORY_basic",
        workingworkers: [], Strike: false,Commit:false,
        cost: 16,
        industry: 'Luxury',
        requiredWorkers: 2,
        skilledworker: 1,
        goodsProduced: 6,
        wages: {
            1: 25, 2: 20, 3: 15,
            level: 2
        },
        imageUrl: "/CapitalistCompanys/Factory_basic.gif",
        machineryBonus: {
            function: false,
            Bonus: 2,
        }
    },
    {
        name: "HOSPITAL_16",
        workingworkers: [], Strike: false,Commit:false,
        cost: 16,
        industry: 'Heathlcare',
        requiredWorkers: 2,
        skilledworker: 1,
        goodsProduced: 6,
        wages: {
            1: 30, 2: 20, 3: 10,
            level: 2
        },
        imageUrl: "/CapitalistCompanys/6Hospital.gif",
        machineryBonus: {
            function: false,
            Bonus: 2,
        }
    },
    {
        name: "UNIVERSITY_16",
        workingworkers: [], Strike: false,Commit:false,
        cost: 16,
        industry: 'Education',
        requiredWorkers: 2,
        skilledworker: 1,
        goodsProduced: 6,
        wages: {
            1: 30, 2: 20, 3: 10,
            level: 2
        },
        imageUrl: "/CapitalistCompanys/6University.gif",
        machineryBonus: {
            function: false,
            Bonus: 2,
        }
    },
    {
        name: "FACTORY_15",
        workingworkers: [], Strike: false,Commit:false,
        cost: 15,
        industry: 'Luxury',
        requiredWorkers: 3,
        skilledworker: 0,
        goodsProduced: 7,
        wages: {
            1: 30, 2: 25, 3: 20,
            level: 2
        },
        imageUrl: "/CapitalistCompanys/7Factory.gif",
        machineryBonus: {
            function: false,
            Bonus: 0,
        }
    },
    {
        name: "HOSPITAL_20",
        workingworkers: [], Strike: false,Commit:false,
        cost: 20,
        industry: 'Heathlcare',
        requiredWorkers: 2,
        skilledworker: 1,
        goodsProduced: 7,
        wages: {
            1: 30, 2: 20, 3: 10,
            level: 2
        },
        imageUrl: "/CapitalistCompanys/7Hospital.gif",
        machineryBonus: {
            function: false,
            Bonus: 0,
        }
    },
    {
        name: "UNIVERSITY_20",
        workingworkers: [], Strike: false,Commit:false,
        cost: 20,
        industry: 'Education',
        requiredWorkers: 2,
        skilledworker: 1,
        goodsProduced: 7,
        wages: {
            1: 30, 2: 20, 3: 10,
            level: 2
        },
        imageUrl: "/CapitalistCompanys/7University.gif",
        machineryBonus: {
            function: false,
            Bonus: 0,
        }
    },
    {
        name: "HOSPITAL_20",
        workingworkers: [], Strike: false,Commit:false,
        cost: 20,
        industry: 'Heathlcare',
        requiredWorkers: 3,
        skilledworker: 1,
        goodsProduced: 8,
        wages: {
            1: 40, 2: 30, 3: 20,
            level: 2
        },
        imageUrl: "/CapitalistCompanys/8Hospital.gif",
        machineryBonus: {
            function: false,
            Bonus: 3,
        }
    },
    {
        name: "UNIVERSITY_20",
        workingworkers: [], Strike: false,Commit:false,
        cost: 20,
        industry: 'Education',
        requiredWorkers: 3,
        skilledworker: 1,
        goodsProduced: 8,
        wages: {
            1: 40, 2: 30, 3: 20,
            level: 2
        },
        imageUrl: "/CapitalistCompanys/8University.gif",
        machineryBonus: {
            function: false,
            Bonus: 3,
        }
    },
    {
        name: "HOSPITAL_24",
        workingworkers: [], Strike: false,Commit:false,
        cost: 24,
        industry: 'Heathlcare',
        requiredWorkers: 3,
        skilledworker: 1,
        goodsProduced: 9,
        wages: {
            1: 40, 2: 30, 3: 20,
            level: 2
        },
        imageUrl: "/CapitalistCompanys/9Hospital.gif",
        machineryBonus: {
            function: false,
            Bonus: 2,
        }
    },
    {
        name: "UNIVERSITY_24",
        workingworkers: [], Strike: false,Commit:false,
        cost: 24,
        industry: 'Education',
        requiredWorkers: 3,
        skilledworker: 1,
        goodsProduced: 9,
        wages: {
            1: 40, 2: 30, 3: 20,
            level: 2
        },
        imageUrl: "/CapitalistCompanys/9University.gif",
        machineryBonus: {
            function: false,
            Bonus: 2,
        }
    },
    {
        name: "FACTORY_20",
        workingworkers: [], Strike: false,Commit:false,
        cost: 20,
        industry: 'Luxury',
        requiredWorkers: 3,
        skilledworker: 1,
        goodsProduced: 8,
        wages: {
            1: 35, 2: 30, 3: 25,
            level: 2
        },
        imageUrl: "/CapitalistCompanys/8Factory.gif",
        machineryBonus: {
            function: false,
            Bonus: 3,
        }
    },
    {
        name: "FACTORY_basic",
        workingworkers: [], Strike: false,Commit:false,
        cost: 16,
        industry: 'Luxury',
        requiredWorkers: 2,
        skilledworker: 1,
        goodsProduced: 2,
        wages: {
            1: 25, 2: 20, 3: 15,
            level: 2
        },
        imageUrl: "/CapitalistCompanys/Factory_basic.gif",
        machineryBonus: {
            function: false,
            Bonus: 2,
        }
    },
    {
        name: "FARM_basic",
        workingworkers: [], Strike: false,Commit:false,
        cost: 16,
        industry: 'Agriculture',
        requiredWorkers: 2,
        skilledworker: 1,
        goodsProduced: 4,
        wages: {
            1: 25, 2: 20, 3: 15,
            level: 2
        },
        imageUrl: "/CapitalistCompanys/Farm_basic.gif",
        machineryBonus: {
            function: false,
            Bonus: 1,
        }
    },
    {
        name: "HOSPITAL_basic",
        workingworkers: [], Strike: false,Commit:false,
        cost: 16,
        industry: 'Heathlcare',
        requiredWorkers: 2,
        skilledworker: 1,
        goodsProduced: 6,
        wages: {
            1: 30, 2: 20, 3: 10,
            level: 2
        },
        imageUrl: "/CapitalistCompanys/Hospital_basic.gif",
        machineryBonus: {
            function: false,
            Bonus: 2,
        }
    },
    {
        name: "UNIVERSITY_basic",
        workingworkers: [], Strike: false,Commit:false,
        cost: 16,
        industry: 'Education',
        requiredWorkers: 2,
        skilledworker: 1,
        goodsProduced: 6,
        wages: {
            1: 30, 2: 20, 3: 10,
            level: 2
        },
        imageUrl: "/CapitalistCompanys/University_basic.gif",
        machineryBonus: {
            function: false,
            Bonus: 2,
        }
    }
]
export const StateCompanies: StateCompany[] = [
    {
        name: "UNIVERSITY_3-4p", workingworkers: [], Strike: false,Commit:false,
        cost: 30, industry: 'Education', requiredWorkers: 3, skilledworker: 1, goodsProduced: 6, wages: { level: 2, 1: 35, 2: 30, 3: 25 }, imageUrl: "/StateCompanies/University_3-4p.jpg"
    },
    {
        name: "UNIVERSITY_3-2p", workingworkers: [], Strike: false,Commit:false,
        cost: 20, industry: 'Education', requiredWorkers: 2, skilledworker: 1, goodsProduced: 4, wages: { level: 2, 1: 25, 2: 20, 3: 15 }, imageUrl: "/StateCompanies/University_3-2p.jpg"
    },
    {
        name: "UNIVERSITY_2", workingworkers: [], Strike: false,Commit:false,
        cost: 20, industry: 'Education', requiredWorkers: 2, skilledworker: 1, goodsProduced: 4, wages: { level: 2, 1: 25, 2: 20, 3: 15 }, imageUrl: "/StateCompanies/University_2.jpg"
    },
    {
        name: "UNIVERSITY_1", workingworkers: [], Strike: false,Commit:false,
        cost: 20, industry: 'Education', requiredWorkers: 2, skilledworker: 1, goodsProduced: 4, wages: { level: 2, 1: 25, 2: 20, 3: 15 }, imageUrl: "/StateCompanies/University_1.jpg"
    },
    {
        name: "HOSPITAL_3-4p", workingworkers: [], Strike: false,Commit:false,
        cost: 30, industry: 'Heathlcare', requiredWorkers: 3, skilledworker: 1, goodsProduced: 6, wages: { level: 2, 1: 35, 2: 30, 3: 25 }, imageUrl: "/StateCompanies/Hospital_3-4p.jpg"
    },
    {
        name: "HOSPITAL_3-2p", workingworkers: [], Strike: false,Commit:false,
        cost: 20, industry: 'Heathlcare', requiredWorkers: 2, skilledworker: 1, goodsProduced: 4, wages: { level: 2, 1: 25, 2: 20, 3: 15 }, imageUrl: "/StateCompanies/Hospital_3-2p.jpg"
    },
    {
        name: "HOSPITAL_2", workingworkers: [], Strike: false,Commit:false,
        cost: 20, industry: 'Heathlcare', requiredWorkers: 2, skilledworker: 1, goodsProduced: 4, wages: { level: 2, 1: 25, 2: 20, 3: 15 }, imageUrl: "/StateCompanies/Hospital_2.jpg"
    },
    {
        name: "HOSPITAL_1", workingworkers: [], Strike: false,Commit:false,
        cost: 20, industry: 'Heathlcare', requiredWorkers: 2, skilledworker: 1, goodsProduced: 4, wages: { level: 2, 1: 25, 2: 20, 3: 15 }, imageUrl: "/StateCompanies/Hospital_1.jpg"
    },
    {
        name: "TV STATION_3-4p", workingworkers: [], Strike: false,Commit:false,
        cost: 30, industry: 'Media', requiredWorkers: 3, skilledworker: 1, goodsProduced: 4, wages: { level: 2, 1: 35, 2: 30, 3: 25 }, imageUrl: "/StateCompanies/TVStation_3-2p.jpg"
    },
    {
        name: "TV STATION_3-2p", workingworkers: [], Strike: false,Commit:false,
        cost: 20, industry: 'Media', requiredWorkers: 2, skilledworker: 1, goodsProduced: 3, wages: { level: 2, 1: 25, 2: 20, 3: 15 }, imageUrl: "/StateCompanies/TVStation_3-2p.jpg"
    },
    {
        name: "TV STATION_2", workingworkers: [], Strike: false,Commit:false,
        cost: 20, industry: 'Media', requiredWorkers: 2, skilledworker: 1, goodsProduced: 3, wages: { level: 2, 1: 25, 2: 20, 3: 15 }, imageUrl: "/StateCompanies/TVStation_2.jpg"
    },
    {
        name: "TV STATION_1", workingworkers: [], Strike: false,Commit:false,
        cost: 20, industry: 'Media', requiredWorkers: 2, skilledworker: 1, goodsProduced: 3, wages: { level: 2, 1: 25, 2: 20, 3: 15 }, imageUrl: "/StateCompanies/TVStation_1.jpg"
    },
];