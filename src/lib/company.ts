import { WorkerClass } from "./worker class";
import { CapitalistClass } from "./Capitalist class"

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

class Company {
  name: string;
  cost: number;
  industry: String;
  requiredWorkers: number;
  goodsProduced: number;
  wages: Wages;
  oper: boolean;

  constructor(name: string, cost: number, industry: string, requiredWorkers: number, goodsProduced: number, wages: Partial<Wages>) {
    this.name = name;
    this.cost = cost;
    this.industry = industry;
    this.requiredWorkers = requiredWorkers;
    this.goodsProduced = goodsProduced;
    this.wages = {
      level: wages.level || 'L2',
      L1: wages.L1 || 0,
      L2: wages.L2 || 0,
      L3: wages.L3 || 0,
    };
    this.oper = false;
  }

  product() {

  }
}
export class CapitalistCompany extends Company {

  machineryBonus: MachineryBonus;


  constructor(name: string, cost: number, industry: string, requiredWorkers: number, goodsProduced: number, wages: Partial<Wages>, machineryBonus: Partial<MachineryBonus>) {
    super(name, cost, industry, requiredWorkers, goodsProduced, wages);
    this.machineryBonus = {
      function: machineryBonus.function !== undefined ? machineryBonus.function : true,
      Bonus: machineryBonus.Bonus || 0,
    };
  }
  production(industry: string) {
    if (this.machineryBonus.function) {
      CapitalistClass.getInstance().addgoodsAndServices(industry, this.machineryBonus.Bonus + this.goodsProduced);
    }
    else {
      CapitalistClass.getInstance().addgoodsAndServices(industry, this.goodsProduced);
    }
    WorkerClass.getInstance().addincome(this.wages[this.wages.level]);
  }
}

class StateCompany extends Company {

  constructor(name: string, cost: number, industry: string, requiredWorkers: number, goodsProduced: number, wages: Partial<Wages>) {
    super(name, cost, industry, requiredWorkers, goodsProduced, wages);
  }
  production() {
    Board.getBoard().addPublicService(this.industry, this.goodsProduced)
    WorkerClass.getInstance().addincome(this.wages[this.wages.level]);
  }
}