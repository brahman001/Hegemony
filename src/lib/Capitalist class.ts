import { CapitalistCompany, CapitalistCompanys, Company } from './company'
import { EventEmitter } from 'events';
import { parse, stringify } from 'flatted';
import { Board, Item } from './board';
import { copyFile } from 'fs';
import { WorkerClass } from './worker class';
export interface CapitalistGoodsAndServices {
    Food: number;
    Luxury: number;
    Health: number;
    Education: number;
    Influence: number;
}
export interface CapitalistGoodsAndServicesLimits extends CapitalistGoodsAndServices {
    FoodLimit: number;
    LuxuryLimit: number;
    HealthLimit: number;
    EducationLimit: number;
}
export class CapitalistClass extends EventEmitter {

    private static instance: CapitalistClass;
    private Company: CapitalistCompany[];
    private Revenue: number;
    private Capitalist: number;
    private goodsAndServices: CapitalistGoodsAndServicesLimits;
    private score: number;
    private loan: number;
    private goodsPrices: { [key in keyof CapitalistGoodsAndServices]: number };
    private Market: CapitalistCompany[];

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
            Influence: 1,
            FoodLimit: 8,
            LuxuryLimit: 12,
            HealthLimit: 12,
            EducationLimit: 12,
        };
        this.goodsPrices = {
            Food: 12,
            Luxury: 8,
            Health: 8,
            Education: 8,
            Influence: 0,
        };
        this.score = 0;
        this.loan = 0;
        this.Market = [];
        let i = 0;
        while (i < 5) {
            const randomIndex = Math.floor(Math.random() * CapitalistCompanys.length);
            if (this.Market.filter(Company => Company === CapitalistCompanys[randomIndex]).length === 0 && this.Company.filter(Company => Company === CapitalistCompanys[randomIndex]).length === 0) {
                this.Market.push(CapitalistCompanys[randomIndex]);
                i++;
            }
        }
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
        this.score = data.score;
        this.loan = data.loan;
        this.Market = data.Market;
    }
    setScore(newScore: number): void {
        this.score = newScore;
    }
    addgoodsAndServices(industry: String, number: number) {
        switch (industry) {
            case 'Agriculture':
            case 'Food':
                if (this.goodsAndServices.Food + number <= this.goodsAndServices.FoodLimit) {
                    this.goodsAndServices.Food += number;
                }else{
                   this.goodsAndServices.Food = this.goodsAndServices.FoodLimit; 
                }
                break;
            case 'Luxury':
                if (this.goodsAndServices.Luxury + number <= this.goodsAndServices.LuxuryLimit) {
                    this.goodsAndServices.Luxury += number;
                }
                else {
                    this.goodsAndServices.Luxury = this.goodsAndServices.LuxuryLimit;
                }
                break;
            case 'Healthcare':
            case 'Health':
                if (this.goodsAndServices.Health + number <= this.goodsAndServices.HealthLimit) {
                    this.goodsAndServices.Health += number;
                }
                else {
                    this.goodsAndServices.Health = this.goodsAndServices.HealthLimit;
                }
                break;
            case 'Education':
                if (this.goodsAndServices.Education + number <= this.goodsAndServices.EducationLimit) {
                    this.goodsAndServices.Education += number;
                }
                else {
                    this.goodsAndServices.Education = this.goodsAndServices.EducationLimit;
                }
                break;
            case 'Media':
            case 'Influence':
                this.goodsAndServices.Influence += number;
                break;
            default:
                throw new Error(`Industry type ${industry} does not exist`);
        }

    }
    getinfo() {
        return {
            Market: this.Market,
            goodsPrices: this.goodsPrices,
            Score: this.score,
            companys: this.Company,
            Revenue: this.Revenue,
            Capitalist: this.Capitalist,
            goodsAndServices: this.goodsAndServices,
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
            Food: 10,
            Luxury: 20,
            Health: 10,
            Education: 10,
            Influence: 1,
            FoodLimit: 8,
            LuxuryLimit: 12,
            HealthLimit: 12,
            EducationLimit: 12,
        };
        this.goodsPrices = {
            Food: 12,
            Luxury: 8,
            Health: 8,
            Education: 8,
            Influence: 0,
        };
        this.score = 0;
        this.loan = 0;
        this.Market = [];
        let i = 0;
        while (i < 5) {
            const randomIndex = Math.floor(Math.random() * CapitalistCompanys.length);
            if (this.Market.filter(Company => Company === CapitalistCompanys[randomIndex]).length === 0 && this.Company.filter(Company => Company === CapitalistCompanys[randomIndex])) {
                this.Market.push(CapitalistCompanys[randomIndex]);
                i++;
            }
        }
    }
    AdjustPrices(item: keyof CapitalistGoodsAndServices, price: number) {
        if (price >= 0) {
            this.goodsPrices[item] = price;
            this.emit('priceChange', { item, price });
        }
    }
    Adjustwages(thiscompany: CapitalistCompany, price: number) {
        if (price > this.Company.filter(company => company === thiscompany)[0].wages.level) {
            this.Company.filter(company => company === thiscompany)[0].Commit = true;
        }
        this.Company.filter(company => company === thiscompany)[0].wages.level = price;
        this.emit("update");
    }
    AddRevenue(income: number) {
        this.Revenue += income;
    }
    BuildCompany(company: Company) {
        if (this.Revenue > company.cost) {
            this.Revenue -= company.cost;
        }
        else {
            this.Capitalist = this.Capitalist + this.Revenue - company.cost;
            this.Revenue = 0;
        }
        this.Company.push(company as CapitalistCompany);
        const companyIndex = this.Market.findIndex(marketCompany => marketCompany === company);
        if (companyIndex > -1) {
            this.Market.splice(companyIndex, 1);
        }
        if (Board.getInstance().getinfo().unempolyment.length >= company.requiredWorkers) {
            if (company.skilledworker >= 1) {
                if (Board.getInstance().getinfo().unempolyment.filter(Worker => Worker.skill === company.industry).length > 0) {
                    company.Commit = true;
                    company.workingworkers.push(Board.getInstance().getinfo().unempolyment.filter(Worker => Worker.skill === company.industry)[0]);
                    Board.getInstance().getinfo().unempolyment.filter(Worker => Worker.skill === company.industry)[0].location = company;
                    Board.getInstance().removeworker(Board.getInstance().getinfo().unempolyment.filter(Worker => Worker.skill === company.industry)[0]);
                    for (let i = 0; i < company.requiredWorkers - company.skilledworker; i++) {
                        company.workingworkers.push(Board.getInstance().getinfo().unempolyment[0]);
                        Board.getInstance().getinfo().unempolyment[0].location = company;
                        Board.getInstance().removeworker(Board.getInstance().getinfo().unempolyment[0]);
                    }
                }
            }
            else {
                for (let i = 0; i < company.requiredWorkers; i++) {
                    company.Commit = true;
                    company.workingworkers.push(Board.getInstance().getinfo().unempolyment[0]);
                    Board.getInstance().getinfo().unempolyment[0].location = company;
                    Board.getInstance().removeworker(Board.getInstance().getinfo().unempolyment[0]);
                }
            }
        }
        this.emit("update");
    }
    SellCompay(company: Company) {
        for (let i = 0; i < company.workingworkers.length; i++) {
            company.workingworkers[0].location = null;
            company.workingworkers.splice(0);
            Board.getInstance().addworker(company.workingworkers[0]);
        }
        const companyIndex = this.Company.findIndex(Company => Company === company);
        if (companyIndex > -1) {
            this.Company.splice(companyIndex, 1);
        }
        this.Revenue += company.cost;
        this.emit("update");
    }
    makebussinesduel(number: number) {
        if (this.Revenue >= Board.getInstance().getinfo().BusinessDeal[number].price +
            Board.getInstance().getinfo().BusinessDeal[number].tax[Board.getInstance().getinfo().Policy.Foreign]) {
            this.Revenue -= (Board.getInstance().getinfo().BusinessDeal[number].price +
                Board.getInstance().getinfo().BusinessDeal[number].tax[Board.getInstance().getinfo().Policy.Foreign]);
        }
        else {
            this.Revenue = 0;
            this.Capitalist -= (Board.getInstance().getinfo().BusinessDeal[number].price +
                Board.getInstance().getinfo().BusinessDeal[number].tax[Board.getInstance().getinfo().Policy.Foreign] - this.Revenue)
        }
        Board.getInstance().updateStateTreasury(Board.getInstance().getinfo().BusinessDeal[number].tax[Board.getInstance().getinfo().Policy.Foreign]);
        this.goodsAndServices[Board.getInstance().getinfo().BusinessDeal[number].item as keyof CapitalistGoodsAndServices] += Board.getInstance().getinfo().BusinessDeal[number].amount;
        Board.getInstance().getinfo().BusinessDeal.splice(number);
        this.emit("upodate");
    }
    Lobby() {
        if (this.Revenue >= 30) {
            this.Revenue -= 30;
            this.goodsAndServices.Influence += 3;
        }
        else {
            this.Capitalist -= (30 - this.Revenue);
            this.goodsAndServices.Influence += 3;
        }
        this.emit("update");
    }
    selltoForeignMarket(item: Item) {
        this.goodsAndServices[item.item] -= item.amount;
        this.Revenue += item.price;
        this.emit("update");
    }
    GiveBonus(thiscompany: CapitalistCompany) {
        this.Company.filter(company => company === thiscompany)[0].Commit = true;
        if (this.Revenue > 5) {
            this.Revenue -= 5;
            WorkerClass.getInstance().addincome(5);
        }
        else {
            this.Capitalist -= (5 - this.Revenue);
            this.Revenue = 0;
            WorkerClass.getInstance().addincome(5);
        }
        this.emit("update");
    }
    BuyStorage(item: keyof CapitalistGoodsAndServices) {
        if (item === 'Food') {
            this.goodsAndServices.FoodLimit += 8;
        }
        else if (item === 'Education') {
            this.goodsAndServices.EducationLimit += 12;
        }
        else if (item === 'Health') {
            this.goodsAndServices.HealthLimit += 12;
        }
        else if (item === 'Luxury') {
            this.goodsAndServices.LuxuryLimit += 12;
        }
        this.emit("update");
    }
    Producrion() {
        this.Company.map((company) => {
            if (company.Commit) {
                if (company.wages.level === 3) {
                    company.Commit = false;
                }
            }
            if (!company.Commit && working(company)) {
                Board.getInstance().addPublicService(company.industry, company.goodsProduced);
                const wageLevelValue = company.wages[company.wages.level as 1 | 2 | 3];
                if (this.Revenue >= wageLevelValue) {
                    this.Revenue -= wageLevelValue;
                    WorkerClass.getInstance().addincome(wageLevelValue);
                }
                else if (this.Revenue + this.Capitalist >= wageLevelValue) {
                    this.Capitalist -= (wageLevelValue - this.Revenue);
                    this.Revenue = 0;
                    WorkerClass.getInstance().addincome(wageLevelValue);
                }
                else {
                    this.loan++;
                    this.Capitalist += 50;
                    this.Capitalist -= (wageLevelValue - this.Revenue);
                    this.Revenue = 0;
                    WorkerClass.getInstance().addincome(wageLevelValue);
                }
                console.log(company.name,wageLevelValue);
            }
            if (company.Commit) {
                company.Commit = false;
                WorkerClass.getInstance().Buying(1, 'Influence');
            }
        }
        );
    }
}
function working(company: Company): boolean {
    const workers = company.workingworkers;
    let Workers = 0, skilledWorker = 0;
    for (let i = 0; i < workers.length; i++) {
        if (workers[i].skill === company.industry) {
            skilledWorker++;
        }
    }
    return company.workingworkers.length === company.requiredWorkers && skilledWorker >= company.skilledworker;
}
