interface Policy {
  Fiscal?: string;
  Labor?: string;
  Taxation?: string;
  Health?: string;
  Education?: string;
  Foreign?: string;
  Immigration?: string;
}

interface PublicServices {
  Health?: number;
  Education?: number;
  Influence?: number;
}

interface BusinessDeal {
  item: string;
  amount: number;
  price: number;
  tax?: { [key: string]: number };
}

interface Export {
  item: string;
  amount: number;
  price: number;
}

interface Import {
  item: string;
  amount: number;
  price: number;
  tax?: { [key: string]: number };
}

class Board {
  private Policy: Policy;
  private StateTreasury: number;
  private PublicServices: PublicServices;
  private BusinessDeal: BusinessDeal[];
  private Export: Export[];
  private Import: Import[];

  constructor(
      Policy: Partial<Policy> = {},
      StateTreasury: number = 120,
      PublicServices: Partial<PublicServices> = {},
      BusinessDeal: BusinessDeal[] = [{ item: 'Luxury', amount: 0, price: 0, tax: { A: 10, B: 5, C: 2 } }],
      Export: Export[] = [{ item: 'Food', amount: 0, price: 0 }],
      Import: Import[] = [
          { item: 'Luxury', amount: 0, price: 0, tax: { A: 15, B: 10, C: 5 } },
          { item: 'Food', amount: 0, price: 0, tax: { A: 10, B: 5, C: 3 } }
      ]
  ) {
      this.Policy = {
          Fiscal: Policy.Fiscal || 'C',
          Labor: Policy.Labor || 'B',
          Taxation: Policy.Taxation || 'A',
          Health: Policy.Health || 'B',
          Education: Policy.Education || 'C',
          Foreign: Policy.Foreign || 'B',
          Immigration: Policy.Immigration || 'B',
      };
      this.StateTreasury = StateTreasury;
      this.PublicServices = {
          Health: PublicServices.Health || 6,
          Education: PublicServices.Education || 6,
          Influence: PublicServices.Influence || 4,
      };
      this.BusinessDeal = BusinessDeal;
      this.Export = Export;
      this.Import = Import;
  }

  getPolicyInfo(): Policy {
      return this.Policy;
  }

  setPolicy(policyType: keyof Policy, policyValue: string): void {
      if (this.Policy.hasOwnProperty(policyType)) {
          this.Policy[policyType] = policyValue;
      } else {
          throw new Error(`Policy type ${policyType} does not exist`);
      }
  }

  getStateTreasury(): number {
      return this.StateTreasury;
  }

  updateStateTreasury(amount: number): void {
      this.StateTreasury += amount;
  }

  getPublicServicesInfo(): PublicServices {
      return this.PublicServices;
  }

  updatePublicService(serviceType: keyof PublicServices, amount: number): void {
      if (this.PublicServices.hasOwnProperty(serviceType)) {
          this.PublicServices[serviceType]! += amount;
      } else {
          throw new Error(`Public service type ${serviceType} does not exist`);
      }
  }

  getBusinessDealInfo(): BusinessDeal[] {
      return this.BusinessDeal;
  }

  addBusinessDeal(item: string, amount: number, price: number): void {
      this.BusinessDeal.push({ item, amount, price });
  }

  getExportInfo(): Export[] {
      return this.Export;
  }

  addExport(item: string, amount: number, price: number): void {
      this.Export.push({ item, amount, price });
  }

  getImportInfo(): Import[] {
      return this.Import;
  }

  addImport(item: string, amount: number, price: number): void {
      this.Import.push({ item, amount, price });
  }

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
