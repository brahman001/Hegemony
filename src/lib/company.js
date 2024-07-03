class Company {
    constructor(name, cost, industry, requiredWorkers, goodsProduced, wages) {
      this.name = name; // 公司名称
      this.cost = cost; // 公司成本
      this.industry = industry; // 行业类型（农业、奢侈品、医疗、教育、媒体）
      this.requiredWorkers = requiredWorkers;
      this.goodsProduced = goodsProduced; // 生产的商品和服务
      this.wages = {
       level : wages.level || L2,
       L1 : wages.L1 || 0 ,
       L2 : wages.L2 || 0 ,
       L3 : wages.L3 || 0 ,
      }; // 不同级别的工资
      this.Bonus = Bonus;
      this.oper = false;
    }
  }
  
  class CapitalistCompany extends Company {
    constructor(name, cost, industry, requiredWorkers, goodsProduced, wages, machineryBonus) {
      super(name, cost, industry, requiredWorkers, goodsProduced, wages);
      this.machineryBonus = {
        function : true,
        Bonus : machineryBonus.Bonus || 0,
      }
    }
  }
  class StateCompany extends Company{
    constructor(Belong, name, cost, industry, requiredWorkers, goodsProduced, wages){
    super(name, cost, industry, requiredWorkers, goodsProduced, wages);
    }
  }