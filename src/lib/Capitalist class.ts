import { CapitalistCompany, CapitalistCompanys } from './company'
import { EventEmitter } from 'events';
import { parse, stringify } from 'flatted';
export interface CapitalistGoodsAndServices {
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
    private goodsPrices: { [key in keyof CapitalistGoodsAndServices]: number };

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
        this.goodsPrices = {
            Food: 12,
            Luxury: 8,
            Health: 8,
            Education: 8,
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
                CapitalistClass.instance.SetCapitalistClass(parse(saveddata));
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
            case 'Agriculture':
                this.goodsAndServices.Food += number;
                break;
            case 'Luxury':
                this.goodsAndServices.Luxury += number;
                break;
            case 'Heathlcare':
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
    getinfo() {
        return {
            goodsPrices:this.goodsPrices,
            Score: this.score,
            companys: this.Company,
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
    AdjustPrices(item: keyof CapitalistGoodsAndServices, price: number) {
        if (price >= 0) {
            this.goodsPrices[item] = price;
            this.emit('priceChange', { item, price });
        }
    }
}

