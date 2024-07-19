import { WorkerClass, Worker } from "./worker class";
import { CapitalistClass } from "./Capitalist class"
import { Board } from "./board";

type istateindustry = 'Heathcare' | 'Education' | 'Media';
type Capitalistindustry = 'Acriculture' | 'Luxury' | 'Heathcare' | 'Education' | 'Media';
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