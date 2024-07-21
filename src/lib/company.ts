import { WorkerClass, Worker } from "./worker class";
import { CapitalistClass } from "./Capitalist class"
import { Board } from "./board";

type istateindustry = 'Heathlcare' | 'Education' | 'Media';
type Capitalistindustry = 'Agriculture' | 'Luxury' | 'Heathlcare' | 'Education' | 'Media';
interface Wages {
  level: 'L1' | 'L2' | 'L3';
  L1: number;
  L2: number;
  L3: number;
}

interface MachineryBonus {
  function: boolean;
  Bonus: number;
}
export class Company {
  name: string;
  cost: number;
  industry: String;
  skilledworker: number
  requiredWorkers: number;
  workingworkers: Worker[];
  goodsProduced: number;
  wages: Wages;
  imageUrl: string;

  constructor(name: string, workingworkers: [],
    cost: number, industry: string, requiredWorkers: number, skilledworker: number, goodsProduced: number, wages: Partial<Wages>, imageUrl: string) {
    this.name = name;
    this.cost = cost;
    this.industry = industry;
    this.requiredWorkers = requiredWorkers;
    this.skilledworker = skilledworker;
    this.goodsProduced = goodsProduced;
    this.wages = {
      level: wages.level || 'L2',
      L1: wages.L1 || 0,
      L2: wages.L2 || 0,
      L3: wages.L3 || 0,
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
      workingworkers:[],
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
      workingworkers:[],
      cost: 16,
      industry: 'Heathlcare',
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
      workingworkers:[],
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
      workingworkers:[],
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
      workingworkers:[],
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
      workingworkers:[],
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
      workingworkers:[],
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
      workingworkers:[],
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
      workingworkers:[],
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
      workingworkers:[],
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
      workingworkers:[],
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
      workingworkers:[],
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
      workingworkers:[],
      cost: 16,
      industry: 'Heathlcare',
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
      workingworkers:[],
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
      workingworkers:[],
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
      workingworkers:[],
      cost: 20,
      industry: 'Heathlcare',
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
      workingworkers:[],
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
      workingworkers:[],
      cost: 20,
      industry: 'Heathlcare',
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
      workingworkers:[],
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
      workingworkers:[],
      cost: 24,
      industry: 'Heathlcare',
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
      workingworkers:[],
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
      workingworkers:[],
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
      workingworkers:[],
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
      workingworkers:[],
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
      workingworkers:[],
      cost: 16,
      industry: 'Heathlcare',
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
      workingworkers:[],
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
export const StateCompanies: StateCompany[] = [
  {
      name: "UNIVERSITY_3-4p", workingworkers: [],
      cost: 30, industry: 'Education', requiredWorkers: 3, skilledworker: 1, goodsProduced: 6, wages: { level: "L2", L1: 35, L2: 30, L3: 25 }, imageUrl: "/StateCompanies/University_3-4p.jpg"
  },
  {
      name: "UNIVERSITY_3-2p", workingworkers: [],
      cost: 20, industry: 'Education', requiredWorkers: 2, skilledworker: 1, goodsProduced: 4, wages: { level: "L2", L1: 25, L2: 20, L3: 15 }, imageUrl: "/StateCompanies/University_3-2p.jpg"
  },
  {
      name: "UNIVERSITY_2", workingworkers: [],
      cost: 20, industry: 'Education', requiredWorkers: 2, skilledworker: 1, goodsProduced: 4, wages: { level: "L2", L1: 25, L2: 20, L3: 15 }, imageUrl: "/StateCompanies/University_2.jpg"
  },
  {
      name: "UNIVERSITY_1", workingworkers: [],
      cost: 20, industry: 'Education', requiredWorkers: 2, skilledworker: 1, goodsProduced: 4, wages: { level: "L2", L1: 25, L2: 20, L3: 15 }, imageUrl: "/StateCompanies/University_1.jpg"
  },
  {
      name: "HOSPITAL_3-4p", workingworkers: [],
      cost: 30, industry: 'Heathlcare', requiredWorkers: 3, skilledworker: 1, goodsProduced: 6, wages: { level: "L2", L1: 35, L2: 30, L3: 25 }, imageUrl: "/StateCompanies/Hospital_3-4p.jpg"
  },
  {
      name: "HOSPITAL_3-2p", workingworkers: [],
      cost: 20, industry: 'Heathlcare', requiredWorkers: 2, skilledworker: 1, goodsProduced: 4, wages: { level: "L2", L1: 25, L2: 20, L3: 15 }, imageUrl: "/StateCompanies/Hospital_3-2p.jpg"
  },
  {
      name: "HOSPITAL_2", workingworkers: [],
      cost: 20, industry: 'Heathlcare', requiredWorkers: 2, skilledworker: 1, goodsProduced: 4, wages: { level: "L2", L1: 25, L2: 20, L3: 15 }, imageUrl: "/StateCompanies/Hospital_2.jpg"
  },
  {
      name: "HOSPITAL_1", workingworkers: [],
      cost: 20, industry: 'Heathlcare', requiredWorkers: 2, skilledworker: 1, goodsProduced: 4, wages: { level: "L2", L1: 25, L2: 20, L3: 15 }, imageUrl: "/StateCompanies/Hospital_1.jpg"
  },
  {
      name: "TV STATION_3-4p", workingworkers: [],
      cost: 30, industry: 'Media', requiredWorkers: 3, skilledworker: 1, goodsProduced: 4, wages: { level: "L2", L1: 35, L2: 30, L3: 25 }, imageUrl: "/StateCompanies/TVStation_3-2p.jpg"
  },
  {
      name: "TV STATION_3-2p", workingworkers: [],
      cost: 20, industry: 'Media', requiredWorkers: 2, skilledworker: 1, goodsProduced: 3, wages: { level: "L2", L1: 25, L2: 20, L3: 15 }, imageUrl: "/StateCompanies/TVStation_3-2p.jpg"
  },
  {
      name: "TV STATION_2", workingworkers: [],
      cost: 20, industry: 'Media', requiredWorkers: 2, skilledworker: 1, goodsProduced: 3, wages: { level: "L2", L1: 25, L2: 20, L3: 15 }, imageUrl: "/StateCompanies/TVStation_2.jpg"
  },
  {
      name: "TV STATION_1", workingworkers: [],
      cost: 20, industry: 'Media', requiredWorkers: 2, skilledworker: 1, goodsProduced: 3, wages: { level: "L2", L1: 25, L2: 20, L3: 15 }, imageUrl: "/StateCompanies/TVStation_1.jpg"
  },
];