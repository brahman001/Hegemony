import { WorkerClass, Worker, GoodsAndServices } from "./worker class";
import { EventEmitter } from 'events';
import { StateCompany, StateCompanies } from './company'
import { Company } from "./company";
import { parse, stringify } from 'flatted';
import { CapitalistClass } from "./Capitalist class";
export interface Policy {
    Fiscal: string;
    Labor: string;
    Taxation: string;
    Health: string;
    Education: string;
    Foreign: string;
    Immigration: string;
}
interface PolicyMap {
    A: number;
    B: number;
    C: number;
}
export interface StategoodsAndServices {
    Health: number;
    Education: number;
    Influence: number;
}
export interface BusinessDeal {
    item: string;
    amount: number;
    price: number;
    tax: { [key: string]: number };
    imageUrl: string;
}
export interface Export {
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
interface VotingRules {
    [key: string]: string[];
}
interface Votingbag {
    Workerclass: number;
    Capitalistclass: number;
}
export class Board extends EventEmitter {
    private Votingbag: Votingbag;
    private Votingresult: Votingbag;
    private static instance: Board;
    private Policy: Policy;
    private StateTreasury: number;
    private goodsAndServices: StategoodsAndServices;
    private BusinessDeal: BusinessDeal;
    private Export: Export[];
    private Import: Import[];
    private StateCompany: StateCompany[];
    private PolicyVoting: Policy;
    private policyVotingone: keyof Policy;
    private votingRules: VotingRules;
    private loan: number;
    private unempolyment: Worker[];
    constructor() {
        super();
        this.policyVotingone = "Fiscal"!;
        this.Votingresult = {
            Workerclass: 0,
            Capitalistclass: 0,
        }
        this.StateCompany = [];
        this.Votingbag = {
            Workerclass: 0,
            Capitalistclass: 0,
        };
        this.unempolyment = [];
        this.loan = 0;
        this.Policy = {
            Fiscal: 'C',
            Labor: 'B',
            Taxation: 'A',
            Health: 'B',
            Education: 'C',
            Foreign: 'B',
            Immigration: 'B',
        };
        this.Export = [{ item: 'Food', amount: 0, price: 0 }],
            this.Import = [
                { item: 'Luxury', amount: 0, price: 0, tax: { A: 15, B: 10, C: 5 } },
                { item: 'Food', amount: 0, price: 0, tax: { A: 10, B: 5, C: 3 } }
            ]
        this.StateTreasury = 120,
            this.goodsAndServices = {
                Health: 6,
                Education: 6,
                Influence: 4,
            };
        this.BusinessDeal = BusinessDealcards[Math.floor(Math.random() * BusinessDealcards.length)];
        this.PolicyVoting = {
            Fiscal: '',
            Labor: '',
            Taxation: '',
            Health: '',
            Education: '',
            Foreign: '',
            Immigration: '',
        };
        this.votingRules = {
            A: ['B'],
            B: ['A', 'C'],
            C: ['B'],
        };
        this.Initialization2p();
        this.setcompany2p();
    }
    static getInstance() {
        if (!Board.instance) {
            const saveddata = localStorage.getItem('Board');
            if (saveddata) {
                Board.instance = new Board();
                Board.instance.setBoard(parse(saveddata));
            } else {
                Board.instance = new Board();
            }
        }
        return Board.instance;
    }
    setBoard(data: Board) {
        this.loan = data.loan;
        this.Policy = data.Policy;
        this.Export = data.Export;
        this.StateTreasury = data.StateTreasury;
        this.goodsAndServices = data.goodsAndServices;
        this.BusinessDeal = data.BusinessDeal;
        this.PolicyVoting = data.PolicyVoting;
        this.StateCompany = data.StateCompany;
    }
    Initialization2p() {
        this.Votingresult = {
            Workerclass: 0,
            Capitalistclass: 0,
        }
        this.unempolyment = [];
        this.loan = 0;
        this.Votingbag = {
            Workerclass: 5,
            Capitalistclass: 5,
        }
        this.Policy = {
            Fiscal: 'C',
            Labor: 'B',
            Taxation: 'A',
            Health: 'B',
            Education: 'C',
            Foreign: 'B',
            Immigration: 'B',
        };
        this.Export = [{ item: 'Food', amount: 0, price: 0 }],
            this.Import = [
                { item: 'Luxury', amount: 0, price: 0, tax: { A: 15, B: 10, C: 5 } },
                { item: 'Food', amount: 0, price: 0, tax: { A: 10, B: 5, C: 3 } }
            ]
        this.StateTreasury = 120,
            this.goodsAndServices = {
                Health: 6,
                Education: 6,
                Influence: 4,
            };
        this.BusinessDeal = BusinessDealcards[Math.floor(Math.random() * BusinessDealcards.length)];
        this.PolicyVoting = {
            Fiscal: '',
            Labor: '',
            Taxation: '',
            Health: '',
            Education: '',
            Foreign: '',
            Immigration: '',
        };
        this.StateCompany = [];
        this.setcompany2p();
    };
    setPolicy(policyType: keyof Policy, policyValue: string): void {
        if (this.Policy.hasOwnProperty(policyType)) {
            this.Policy[policyType] = policyValue;
        } else {
            throw new Error(`Policy type ${policyType} does not exist`);
        }
    }
    updateStateTreasury(amount: number): void {
        this.StateTreasury += amount;
    }
    addPublicService(industry: String, number: number) {
        switch (industry) {
            case 'Heathlcare':
                this.goodsAndServices.Health += number;
                break;
            case 'Education':
                this.goodsAndServices.Education += number;
                break;
            case 'Media':
                this.goodsAndServices.Influence += number;
                break;
            default:
                throw new Error(`Industry type ${industry} does not exist`);
        }
    }
    updatePublicService(serviceType: keyof StategoodsAndServices, amount: number): void {
        if (this.goodsAndServices.hasOwnProperty(serviceType)) {
            this.goodsAndServices[serviceType]! += amount;
        } else {
            throw new Error(`Public service type ${serviceType} does not exist`);
        }
    }
    addExport(item: string, amount: number, price: number): void {
        this.Export.push({ item, amount, price });
        this.emit('update');
    }
    addImport(item: string, amount: number, price: number): void {
        this.Import.push({ item, amount, price });
        this.emit('update', `Export added: ${item}, Amount: ${amount}, Price: $${price}`);
    }
    getinfo() {
        return {
            Votingresult: this.Votingresult,
            Votingbag: this.Votingbag,
            Policy: this.Policy,
            PolicyVoting: this.PolicyVoting,
            StateTreasury: this.StateTreasury,
            goodsAndServices: this.goodsAndServices,
            BusinessDeal: this.BusinessDeal,
            Export: this.Export,
            Import: this.Import,
            companys: this.StateCompany,
            loan: this.loan,
            unempolyment: this.unempolyment
        };
    }
    setBusinessDeal() {
        this.BusinessDeal = BusinessDealcards[Math.floor(Math.random() * BusinessDealcards.length)];
        this.emit('update');
    }
    setcompany2p() {
        let targetCompanies = [];
        switch (this.Policy.Fiscal) {
            case 'C':
                targetCompanies = [StateCompanies[1], StateCompanies[5], StateCompanies[9]];
                break;
            case 'B':
                targetCompanies = [StateCompanies[2], StateCompanies[6], StateCompanies[10], StateCompanies[1], StateCompanies[5], StateCompanies[9]];
                break;
            default:
                targetCompanies = [StateCompanies[1], StateCompanies[5], StateCompanies[9], StateCompanies[2],
                StateCompanies[6], StateCompanies[10], StateCompanies[3], StateCompanies[7], StateCompanies[11]];
        }


        this.StateCompany = this.StateCompany.filter(company => targetCompanies.includes(company));


        targetCompanies.forEach(company => {
            if (!this.StateCompany.includes(company)) {
                this.StateCompany.push(company);
            }
        });
        this.emit('update');
    }
    setcompany4p() {
        switch (this.Policy.Fiscal) {
            case 'A':
                this.StateCompany = [StateCompanies[3], StateCompanies[7], StateCompanies[11]];
            case 'B':
                this.StateCompany = [StateCompanies[2], StateCompanies[6], StateCompanies[10]];
            default:
                this.StateCompany = [StateCompanies[0], StateCompanies[4], StateCompanies[8]];
        }
        this.emit('update');
    }
    votingabill(policy: keyof Policy, votingAim: string, onSuccess: () => void, onError: (message: string) => void) {
        if (this.Policy.hasOwnProperty(policy)) {
            const currentGrade = this.Policy[policy];
            if (this.votingRules[currentGrade] && this.votingRules[currentGrade].includes(votingAim) && !this.PolicyVoting[policy]) {
                this.PolicyVoting[policy] = votingAim;
                this.policyVotingone = policy;
                this.emit('update');
                onSuccess();
            } else {
                const errorMessage = `Invalid voting aim or policy already voted: ${policy}`;
                this.emit('update', errorMessage);
                onError(errorMessage);
            }
        } else {
            const errorMessage = `Invalid policy: ${policy}`;
            this.emit('voteError', errorMessage);
            onError(errorMessage);
        }
    }
    addworker(Worker: Worker) {
        this.unempolyment.push(Worker);
    }
    removeworker(Worker: Worker, location: Company) {
        const index = this.unempolyment.indexOf(Worker);
        if (index !== -1) {
            this.unempolyment.splice(index, 1);
            location.workingworkers.push(Worker);
        }
    }
    swapworker(Worker: Worker, location: Company, onSuccess: () => void, onError: (message: string) => void) {

        const index1 = this.unempolyment.findIndex(w => w.skill === 'unskill');

        if (index1 === -1) {
            onError('No unskilled workers are unemployed');
            return;
        }

        // Add the unskilled worker to the company
        const unskilledWorker = this.unempolyment[index1];
        location.workingworkers.push(unskilledWorker);
        this.unempolyment.splice(index1, 1);

        // Remove the specified worker from the company
        const index2 = location.workingworkers.findIndex(w => w === Worker);

        if (index2 !== -1) {
            location.workingworkers.splice(index2, 1);
        } else {
            onError('Worker not found in the company');
            return;
        }
        this.addworker(Worker);
        this.emit('update');
        onSuccess();
    }
    Votingrapidly(policy: keyof Policy, votingAim: string, onSuccess: () => void, onError: (message: string) => void) {
        if (this.Policy.hasOwnProperty(policy)) {
            const currentGrade = this.Policy[policy];
            if (this.votingRules[currentGrade] && this.votingRules[currentGrade].includes(votingAim)
                && (!this.PolicyVoting[policy] || this.PolicyVoting[policy] === votingAim)) {
                this.PolicyVoting[policy] = votingAim;
                this.policyVotingone = policy;
                this.Votingforbag();
                onSuccess();
                this.emit('update');
            } else {
                const errorMessage = `Invalid voting aim or policy already voted: ${policy}`;
                this.emit('update', errorMessage);
                onError(errorMessage);
            }
        } else {
            const errorMessage = `Invalid policy: ${policy}`;
            this.emit('voteError', errorMessage);
            onError(errorMessage);
        }
    }
    fillvotingbag() {
        this.Votingbag.Workerclass += WorkerClass.getInstance().getinfo().population.population_level;
        this.Votingbag.Capitalistclass += Math.ceil(CapitalistClass.getInstance().getinfo().companys.length / 2);
    }
    Votingforbag() {
        let totalBalls = this.Votingbag.Capitalistclass + this.Votingbag.Workerclass
        if (totalBalls < 5) {
            this.fillvotingbag();
        }
        for (let i = 0; i < 5; i++) {
            totalBalls = this.Votingbag.Capitalistclass + this.Votingbag.Workerclass;
            const randomIndex = Math.floor(Math.random() * totalBalls);
            if (randomIndex < this.Votingbag.Workerclass) {
                this.Votingbag.Workerclass--;
                this.Votingresult.Workerclass++;
            } else if (randomIndex < this.Votingbag.Capitalistclass + this.Votingbag.Workerclass) {
                this.Votingbag.Capitalistclass--;
                this.Votingresult.Capitalistclass++;
            }
        }
    }
    Voting2(inputValue: number) {
        if ((inputValue + this.Votingresult.Workerclass) >= this.Votingresult.Capitalistclass) {
            this.Policy[this.policyVotingone] = this.PolicyVoting[this.policyVotingone];
            this.PolicyVoting[this.policyVotingone] = '';
            this.Votingbag.Capitalistclass += this.Votingresult.Capitalistclass;
            switch (this.policyVotingone) {
                case "Fiscal":
                    Board.getInstance().setcompany2p();
                    break;
                case "Labor":
                    const mapping: PolicyMap = {
                        'A': 3,
                        'B': 2,
                        'C': 1
                    };
                    for (let i = 0; i < Board.getInstance().getinfo().companys.length; i++) {
                        const policy = this.Policy[this.policyVotingone];
                        if (mapping[policy as keyof PolicyMap] < Board.getInstance().getinfo().companys[i].wages.level) {
                            Board.getInstance().getinfo().companys[i].wages.level = mapping[policy as keyof PolicyMap];
                        }
                    }
                    for (let i = 0; i < CapitalistClass.getInstance().getinfo().companys.length; i++) {
                        const policy = this.Policy[this.policyVotingone];
                        if (mapping[policy as keyof PolicyMap] < Board.getInstance().getinfo().companys[i].wages.level) {
                            Board.getInstance().getinfo().companys[i].wages.level = mapping[policy as keyof PolicyMap];
                        }
                    }
                    break;
                case "Taxation":
                case "Health":
                case "Education":
                case "Foreign":
                case "Immigration":
            }

            WorkerClass.getInstance().setScore(WorkerClass.getInstance().getinfo().score + 3);
        } else {
            this.Votingbag.Workerclass += this.Votingresult.Workerclass;
            this.PolicyVoting[this.policyVotingone] = '';
            console.log(this.PolicyVoting[this.policyVotingone]);
        }
        this.Votingresult.Capitalistclass = 0;
        this.Votingresult.Workerclass = 0;
        this.emit("updata");
    }
    goodsPrices(item: keyof StategoodsAndServices): number {
        if (item === 'Health') {
            if (this.Policy.Health === 'A') {
                return 0;
            } else if (this.Policy.Health === 'B') {
                return 5;
            } else {
                return 10;
            }
        }
        if (item === 'Education') {
            if (this.Policy.Education === 'A') {
                return 0;
            } else if (this.Policy.Education === 'B') {
                return 5;
            } else {
                return 10;
            }
        }
        if (item === 'Influence') {
            return 10;
        }
        return 10;
    }
}


const BusinessDealcards: BusinessDeal[] = [
    { item: "Food", amount: 6, price: 40, tax: { "A": 12, "B": 6, "C": 0 }, imageUrl: "/6food.jpg" },
    { item: "Food", amount: 7, price: 50, tax: { "A": 14, "B": 7, "C": 0 }, imageUrl: "/7food.jpg" },
    { item: "Food", amount: 8, price: 55, tax: { "A": 16, "B": 8, "C": 0 }, imageUrl: "/8food.jpg" },
    { item: "Luxury", amount: 8, price: 30, tax: { "A": 16, "B": 8, "C": 0 }, imageUrl: "/8Luxury.jpg" },
    { item: "Luxury", amount: 10, price: 40, tax: { "A": 20, "B": 10, "C": 0 }, imageUrl: "/10Luxury.jpg" },
    { item: "Luxury", amount: 12, price: 50, tax: { "A": 24, "B": 12, "C": 0 }, imageUrl: "/12Luxury.jpg" },
];


