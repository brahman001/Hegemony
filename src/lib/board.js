class Board {
  constructor(Policy, StateTreasury, PublicServices, BusinessDeal, Export, Import) {
    this.Policy = {
      Fiscal: Policy.Fiscal || 'C',
      Labor: Policy.Labor || 'B',
      Taxation: Policy.Taxation || 'A',
      Health: Policy.Health || 'B',
      Education: Policy.Education || 'C',
      Foreign: Policy.Foreign || 'B',
      Immigration: Policy.Immigration || 'B',
    };
    this.StateTreasury = StateTreasury || 120;
    this.PublicServices = {
      Health: PublicServices?.Health || 6,
      Education: PublicServices?.Education || 6,
      Influence: PublicServices?.Influence || 4,
    };
    this.BusinessDeal = BusinessDeal || [
      { item: 'Luxury', amount: 0, price: 0, tax: { A: 10, B: 5, C: 2 } }
    ];

    this.Export = Export || [
      { item: 'Food', amount: 0, price: 0 }
    ];

    this.Import = Import || [
      { item: 'Luxury', amount: 0, price: 0, tax: { A: 15, B: 10, C: 5 } },
      { item: 'Food', amount: 0, price: 0, tax: { A: 10, B: 5, C: 3 } }
    ];
  }

  getPolicyInfo() {
    return this.Policy;
  }

  // 示例方法：设置政策
  setPolicy(policyType, policyValue) {
    if (this.Policy.hasOwnProperty(policyType)) {
      this.Policy[policyType] = policyValue;
    } else {
      throw new Error(`Policy type ${policyType} does not exist`);
    }
  }

  // 示例方法：获取国家财政
  getStateTreasury() {
    return this.StateTreasury;
  }

  // 示例方法：更新国家财政
  updateStateTreasury(amount) {
    this.StateTreasury += amount;
  }

  // 示例方法：获取公共服务信息
  getPublicServicesInfo() {
    return this.PublicServices;
  }

  // 示例方法：更新公共服务
  updatePublicService(serviceType, amount) {
    if (this.PublicServices.hasOwnProperty(serviceType)) {
      this.PublicServices[serviceType] += amount;
    } else {
      throw new Error(`Public service type ${serviceType} does not exist`);
    }
  }

  // 示例方法：获取商业交易信息
  getBusinessDealInfo() {
    return this.BusinessDeal;
  }

  // 示例方法：添加商业交易
  addBusinessDeal(item, amount, price) {
    this.BusinessDeal.push({ item, amount, price });
  }

  // 示例方法：获取出口交易信息
  getExportInfo() {
    return this.Export;
  }

  // 示例方法：添加出口交易
  addExport(item, amount, price) {
    this.Export.push({ item, amount, price });
  }

  // 示例方法：获取进口交易信息
  getImportInfo() {
    return this.Import;
  }

  // 示例方法：添加进口交易
  addImport(item, amount, price) {
    this.Import.push({ item, amount, price });
  }

  // 示例方法：获取所有信息
  getBoardInfo() {
    return {
      Policy: this.Policy,
      StateTreasury: this.StateTreasury,
      PublicServices: this.PublicServices,
      BusinessDeal: this.BusinessDeal,
      Export: this.Export,
      Import: this.Import,
    };
  }
}

// 使用示例
const board = new Board(
  { Fiscal: 'B', Labor: 'A' },
  150,
  { Health: 8, Education: 7 },
  [{ item: 'Luxury', amount: 5, price: 100 }],
  [{ item: 'Food', amount: 10, price: 50 }],
  [{ item: 'Luxury', amount: 3, price: 80 }]
);

// 获取板信息
console.log(board.getBoardInfo());

// 添加新的商业交易
board.addBusinessDeal('Luxury', 2, 50);
console.log(board.getBusinessDealInfo());

// 添加新的出口交易
board.addExport('Food', 20, 60);
console.log(board.getExportInfo());

// 添加新的进口交易
board.addImport('Luxury', 1, 40);
console.log(board.getImportInfo());
