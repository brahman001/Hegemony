
import { CapitalistCompany, CapitalistCompanys, Company } from './company'
import { EventEmitter } from 'events';
import { parse, stringify } from 'flatted';
import { Board, Item } from './board';
import { copyFile } from 'fs';
import { WorkerClass } from './workerclass';
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
const levels = [
    { min: 0, max: 10, level: 1 },
    { min: 11, max: 25, level: 2 },
    { min: 26, max: 50, level: 3 },
    { min: 31, max: 40, level: 4 },
    { min: 41, max: 50, level: 5 },
    { min: 51, max: 60, level: 6 },
    { min: 61, max: 70, level: 7 },
    { min: 71, max: 80, level: 8 },
    { min: 81, max: 90, level: 9 },
    { min: 91, max: 100, level: 10 },
    { min: 101, max: 110, level: 11 },
    { min: 111, max: 120, level: 12 },
    { min: 121, max: 130, level: 13 },
    { min: 131, max: 140, level: 14 },
    { min: 141, max: 150, level: 15 },
];
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
    private highestCapitalist: number;

    private constructor() {
        super();
        this.highestCapitalist = 0;
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
            if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
                const saveddata = localStorage.getItem('CapitalistClass');
                if (saveddata) {
                    CapitalistClass.instance = new CapitalistClass();
                    CapitalistClass.instance.SetCapitalistClass(parse(saveddata));
                } else {
                    CapitalistClass.instance = new CapitalistClass();
                }
            }
        }
        return CapitalistClass.instance;
    }
    SetCapitalistClass(data: CapitalistClass) {
        this.highestCapitalist = data.highestCapitalist;
        this.Company = data.Company;
        this.Revenue = data.Revenue;
        this.Capitalist = data.Capitalist;
        this.goodsAndServices = data.goodsAndServices;
        this.score = data.score;
        this.loan = data.loan;
        this.goodsPrices = data.goodsPrices;
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
                } else {
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
        this.highestCapitalist = 0;
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
        this.emit("update");
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
    Production() {
        this.Company.map((company) => {
            if (company.Strike) {
                if (company.wages.level === 3) {
                    company.Strike = false;
                }
            }
            if (!company.Strike && working(company)) {
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
                console.log(company.name, wageLevelValue);
            }
            if (company.Strike) {
                company.Strike = false;
                WorkerClass.getInstance().Buying(1, 'Influence');
            }
        }
        );
    }
    tax() {
        let tax = 1;
        let count = 0;

        for (let i = 0; i < this.Company.length; i++) {
            if (working(this.Company[i])) {
                count++;
            }
        }
        if (Board.getInstance().getinfo().Policy.Taxation === 'A') {
            tax = 3;
            if (Board.getInstance().getinfo().Policy.Health === 'A') {
                tax += 4;
            }
            else if (Board.getInstance().getinfo().Policy.Health === 'B') {
                tax += 2;
            }
            if (Board.getInstance().getinfo().Policy.Education === 'A') {
                tax += 4;
            }
            else if (Board.getInstance().getinfo().Policy.Education === 'B') {
                tax += 2;
            }
        }
        else if (Board.getInstance().getinfo().Policy.Taxation === 'B') {
            tax = 2;
            if (Board.getInstance().getinfo().Policy.Health === 'A') {
                tax += 2;
            }
            else if (Board.getInstance().getinfo().Policy.Health === 'B') {
                tax += 1;
            }
            if (Board.getInstance().getinfo().Policy.Education === 'A') {
                tax += 2;
            }
            else if (Board.getInstance().getinfo().Policy.Education === 'B') {
                tax += 1;
            }
        }
        else if (Board.getInstance().getinfo().Policy.Taxation === 'C') {
            tax = 1;
        }
        console.log(Company.length, count);
        if (this.Revenue >= tax * count) {
            this.Revenue -= tax * count;
            Board.getInstance().updateStateTreasury(tax * count);
        }
        else if (this.Revenue + this.Capitalist >= tax * count) {
            this.Capitalist -= (tax * count - this.Revenue);
            Board.getInstance().updateStateTreasury(tax * count);
        }
        else if (this.Revenue + this.Capitalist < tax * count) {
            this.loan += ((this.Revenue + this.Capitalist - tax * count) % 50 + 1);
            this.Capitalist += ((this.Revenue + this.Capitalist - tax * count) % 50 + 1) * 50;
            this.Capitalist -= (tax * count - this.Revenue);
            Board.getInstance().updateStateTreasury(tax * count);
        }

        if (this.Revenue < 5) {

        }
        else if (this.Revenue <= 9) {
            if (Board.getInstance().getinfo().Policy.Taxation === 'A') {
                this.Revenue -= 1
                Board.getInstance().updateStateTreasury(1);
            }
            else if (Board.getInstance().getinfo().Policy.Taxation === 'B') {
                this.Revenue -= 2
                Board.getInstance().updateStateTreasury(2);
            }
            else if (Board.getInstance().getinfo().Policy.Taxation === 'C') {
                this.Revenue -= 2
                Board.getInstance().updateStateTreasury(2);
            }
        }
        else if (this.Revenue <= 24) {
            if (Board.getInstance().getinfo().Policy.Taxation === 'A') {
                this.Revenue -= 5;
                Board.getInstance().updateStateTreasury(5);
            }
            else if (Board.getInstance().getinfo().Policy.Taxation === 'B') {
                this.Revenue -= 5;
                Board.getInstance().updateStateTreasury(5);
            }
            else if (Board.getInstance().getinfo().Policy.Taxation === 'C') {
                this.Revenue -= 4;
                Board.getInstance().updateStateTreasury(4);
            }
        } else if (this.Revenue <= 49) {
            if (Board.getInstance().getinfo().Policy.Taxation === 'A') {
                this.Revenue -= 12;
                Board.getInstance().updateStateTreasury(12);
            }
            else if (Board.getInstance().getinfo().Policy.Taxation === 'B') {
                this.Revenue -= 10;
                Board.getInstance().updateStateTreasury(10);
            }
            else if (Board.getInstance().getinfo().Policy.Taxation === 'C') {
                this.Revenue -= 7;
                Board.getInstance().updateStateTreasury(7);
            }
        }
        else if (this.Revenue <= 99) {
            if (Board.getInstance().getinfo().Policy.Taxation === 'A') {
                this.Revenue -= 24;
                Board.getInstance().updateStateTreasury(24);
            }
            else if (Board.getInstance().getinfo().Policy.Taxation === 'B') {
                this.Revenue -= 15;
                Board.getInstance().updateStateTreasury(15);
            }
            else if (Board.getInstance().getinfo().Policy.Taxation === 'C') {
                this.Revenue -= 10;
                Board.getInstance().updateStateTreasury(10);
            }
        }
        else if (this.Revenue <= 199) {
            if (Board.getInstance().getinfo().Policy.Taxation === 'A') {
                this.Revenue -= 40;
                Board.getInstance().updateStateTreasury(40);
            }
            else if (Board.getInstance().getinfo().Policy.Taxation === 'B') {
                this.Revenue -= 30;
                Board.getInstance().updateStateTreasury(30);
            }
            else if (Board.getInstance().getinfo().Policy.Taxation === 'C') {
                this.Revenue -= 20;
                Board.getInstance().updateStateTreasury(20);
            }
        }
        else if (this.Revenue <= 299) {
            if (Board.getInstance().getinfo().Policy.Taxation === 'A') {
                this.Revenue -= 100;
                Board.getInstance().updateStateTreasury(100);
            }
            else if (Board.getInstance().getinfo().Policy.Taxation === 'B') {
                this.Revenue -= 100;
                Board.getInstance().updateStateTreasury(100);
            }
            else if (Board.getInstance().getinfo().Policy.Taxation === 'C') {
                this.Revenue -= 100;
                Board.getInstance().updateStateTreasury(100);
            }
        } else if (this.Revenue >= 300) {
            if (Board.getInstance().getinfo().Policy.Taxation === 'A') {
                this.Revenue -= 160;
                Board.getInstance().updateStateTreasury(160);
            }
            else if (Board.getInstance().getinfo().Policy.Taxation === 'B') {
                this.Revenue -= 120;
                Board.getInstance().updateStateTreasury(120);
            }
            else if (Board.getInstance().getinfo().Policy.Taxation === 'C') {
                this.Revenue -= 60;
                Board.getInstance().updateStateTreasury(60);
            }

        }
    }
    payoffloan() {
        this.Capitalist -= 50;
        this.loan--;
        this.emit("update")
    }
    scroingPhase() {
        this.Capitalist += this.Revenue;
        this.Revenue = 0;
        let level = 0;
        for (let i = 0; i < levels.length; i++) {
            if (this.Capitalist >= levels[i].min && this.Capitalist <= levels[i].max) {
                level = levels[i].level;
            }
        }
        if (level > this.highestCapitalist) {
            this.score += (level - this.highestCapitalist) * 3;
            this.score += level;
            this.highestCapitalist = level;
        }
        else {
            this.score += level;
        }
    }
    perparation() {
        this.Company.map((company) => { company.Commit = false });
        this.Capitalist -= (this.loan * 5);
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
    EndPhase() {
        const policy = Board.getInstance().getinfo().Policy;
        const policyKeys: (keyof typeof policy)[] = ['Fiscal', 'Labor', 'Taxation', 'Health', 'Education'];
        let count = 0;
    
        // 计算有多少个政策为 'C'
        for (const key of policyKeys) {
            if (policy[key] === 'C') {
                count++;
            }
        }
    
        // 根据 count 调整 score
        const scoreMap = [0, 1, 4, 8, 12, 18];
        this.score += scoreMap[count];
    
        // 增加 goodsAndServices 的分数
        this.score += Math.floor(this.goodsAndServices.Food / 2);
        this.score += Math.floor(this.goodsAndServices.Education / 3);
        this.score += Math.floor(this.goodsAndServices.Health / 3);
        this.score += Math.floor(this.goodsAndServices.Luxury / 3);
    
        // 处理贷款偿还
        while (this.loan > 0) {
            if (this.Capitalist >= 50) {
                this.Capitalist -= 50;
                this.loan--;
            } else {
                break;
            }
        }

        // 贷款扣分
        this.score -= this.loan * 5;
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
