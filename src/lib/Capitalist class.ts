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
}