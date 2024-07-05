interface Wages {
  level: string;
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
  industry: string;
  requiredWorkers: number;
  goodsProduced: string;
  wages: Wages;
  Bonus: number;
  oper: boolean;

  constructor(name: string, cost: number, industry: string, requiredWorkers: number, goodsProduced: string, wages: Partial<Wages>, Bonus: number) {
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
      this.Bonus = Bonus;
      this.oper = false;
  }
}

class CapitalistCompany extends Company {
  
  machineryBonus: MachineryBonus;

  constructor(name: string, cost: number, industry: string, requiredWorkers: number, goodsProduced: string, wages: Partial<Wages>, machineryBonus: Partial<MachineryBonus>) {
      super(name, cost, industry, requiredWorkers, goodsProduced, wages, 0);
      this.machineryBonus = {
          function: machineryBonus.function !== undefined ? machineryBonus.function : true,
          Bonus: machineryBonus.Bonus || 0,
      };
  }
}

class StateCompany extends Company {
  Belong: string;

  constructor(Belong: string, name: string, cost: number, industry: string, requiredWorkers: number, goodsProduced: string, wages: Partial<Wages>) {
      super(name, cost, industry, requiredWorkers, goodsProduced, wages, 0);
      this.Belong = Belong;
  }
}