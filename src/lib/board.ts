import { WorkerClass, Worker } from "./worker class";
import { EventEmitter } from 'events';
import { StateCompany } from './company'
import { Company } from "./company";
import { parse, stringify } from 'flatted';
export interface Policy {
    Fiscal: string;
    Labor: string;
    Taxation: string;
    Health: string;
    Education: string;
    Foreign: string;
    Immigration: string;
}

export interface PublicServices {
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
export class Board extends EventEmitter {
    private player: number;
    private mainaction: Boolean;
    private freeaction: Boolean;
    private static instance: Board;
    private Policy: Policy;
    private StateTreasury: number;
    private PublicServices: PublicServices;
    private BusinessDeal: BusinessDeal;
    private Export: Export[];
    private Import: Import[];
    private unempolyedworker: Worker[] = [];
    private StateCompany: StateCompany[] = [];
    private PolicyVoting: Policy;
    private votingRules: VotingRules;
    private loan: number;
    private unempolyment: Worker[];
    constructor() {
        super();
        this.unempolyment = [];
        this.player = 2;
        this.loan = 0;
        this.mainaction = false;
        this.freeaction = false;
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
            this.PublicServices = {
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
        this.mainaction = data.mainaction;
        this.freeaction = data.freeaction;
        this.Policy = data.Policy;
        this.Export = data.Export;
        this.StateTreasury = data.StateTreasury;
        this.PublicServices = data.PublicServices;
        this.BusinessDeal = data.BusinessDeal;
        this.PolicyVoting = data.PolicyVoting;
        this.setcompany2p();
    }
    Initialization2p() {
        this.loan = 0;
        this.mainaction = false;
        this.freeaction = false;
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
            this.PublicServices = {
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
            case 'Heathcare':
                this.PublicServices.Health += number;
                break;
            case 'Education':
                this.PublicServices.Education += number;
                break;
            case 'Media':
                this.PublicServices.Influence += number;
                break;
            default:
                throw new Error(`Industry type ${industry} does not exist`);
        }
    }
    updatePublicService(serviceType: keyof PublicServices, amount: number): void {
        if (this.PublicServices.hasOwnProperty(serviceType)) {
            this.PublicServices[serviceType]! += amount;
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
    getBoardInfo() {
        return {
            Policy: this.Policy,
            PolicyVoting: this.PolicyVoting,
            StateTreasury: this.StateTreasury,
            PublicServices: this.PublicServices,
            BusinessDeal: this.BusinessDeal,
            Export: this.Export,
            Import: this.Import,
            companys: this.StateCompany,
            loan: this.loan,
            unempolyedworker: this.unempolyedworker
        };
    }
    setBusinessDeal() {
        this.BusinessDeal = BusinessDealcards[Math.floor(Math.random() * BusinessDealcards.length)];
        this.emit('update');
    }
    setcompany2p() {
        switch (this.Policy.Fiscal) {
            case 'A':
                this.StateCompany = [StateCompanies[3], StateCompanies[7], StateCompanies[11]];
            case 'B':
                this.StateCompany = [StateCompanies[2], StateCompanies[6], StateCompanies[10]];
            default:
                this.StateCompany = [StateCompanies[1], StateCompanies[5], StateCompanies[9]];
        }
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
    voting(policy: keyof Policy, votingAim: string, onSuccess: () => void, onError: (message: string) => void) {
        if (this.Policy.hasOwnProperty(policy)) {
            const currentGrade = this.Policy[policy];
            if (this.votingRules[currentGrade] && this.votingRules[currentGrade].includes(votingAim) && !this.PolicyVoting[policy]) {
                this.PolicyVoting[policy] = votingAim;
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
        this.unempolyedworker.push(Worker);
    }

    removeworker(Worker: Worker, location: Company) {
        const index = this.unempolyedworker.indexOf(Worker);
        if (index !== -1) {
            this.unempolyedworker.splice(index, 1);
            location.workingworkers.push(Worker);
        }
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
export const StateCompanies: StateCompany[] = [
    {
        name: "UNIVERSITY_3-4p", workingworkers: [],
        cost: 30, industry: 'Education', requiredWorkers: 3, skilledworker: 1, goodsProduced: 6, wages: { level: "L2", L1: 35, L2: 30, L3: 25 }, imageUrl: "/StateCompanies/University_3-4p.jpg"
    },
    {
        name: "UNIVERSITY_3-2p", workingworkers: [],
        cost: 20, industry: 'Education', requiredWorkers: 2, skilledworker: 1, goodsProduced: 4, wages: { level: "L2", L1: 25, L2: 20, L3: 15 }, imageUrl: "/StateCompanies/University_3-2p.jpg"
    },
    {
        name: "UNIVERSITY_2", workingworkers: [],
        cost: 20, industry: 'Education', requiredWorkers: 2, skilledworker: 1, goodsProduced: 4, wages: { level: "L2", L1: 25, L2: 20, L3: 15 }, imageUrl: "/StateCompanies/University_2.jpg"
    },
    {
        name: "UNIVERSITY_1", workingworkers: [],
        cost: 20, industry: 'Education', requiredWorkers: 2, skilledworker: 1, goodsProduced: 4, wages: { level: "L2", L1: 25, L2: 20, L3: 15 }, imageUrl: "/StateCompanies/University_1.jpg"
    },
    {
        name: "HOSPITAL_3-4p", workingworkers: [],
        cost: 30, industry: 'Healthcare', requiredWorkers: 3, skilledworker: 1, goodsProduced: 6, wages: { level: "L2", L1: 35, L2: 30, L3: 25 }, imageUrl: "/StateCompanies/Hospital_3-4p.jpg"
    },
    {
        name: "HOSPITAL_3-2p", workingworkers: [],
        cost: 20, industry: 'Healthcare', requiredWorkers: 2, skilledworker: 1, goodsProduced: 4, wages: { level: "L2", L1: 25, L2: 20, L3: 15 }, imageUrl: "/StateCompanies/Hospital_3-2p.jpg"
    },
    {
        name: "HOSPITAL_2", workingworkers: [],
        cost: 20, industry: 'Healthcare', requiredWorkers: 2, skilledworker: 1, goodsProduced: 4, wages: { level: "L2", L1: 25, L2: 20, L3: 15 }, imageUrl: "/StateCompanies/Hospital_2.jpg"
    },
    {
        name: "HOSPITAL_1", workingworkers: [],
        cost: 20, industry: 'Healthcare', requiredWorkers: 2, skilledworker: 1, goodsProduced: 4, wages: { level: "L2", L1: 25, L2: 20, L3: 15 }, imageUrl: "/StateCompanies/Hospital_1.jpg"
    },
    {
        name: "TV STATION_3-4p", workingworkers: [],
        cost: 30, industry: 'Media', requiredWorkers: 3, skilledworker: 1, goodsProduced: 4, wages: { level: "L2", L1: 35, L2: 30, L3: 25 }, imageUrl: "/StateCompanies/TVStation_3-2p.jpg"
    },
    {
        name: "TV STATION_3-2p", workingworkers: [],
        cost: 20, industry: 'Media', requiredWorkers: 2, skilledworker: 1, goodsProduced: 3, wages: { level: "L2", L1: 25, L2: 20, L3: 15 }, imageUrl: "/StateCompanies/TVStation_3-2p.jpg"
    },
    {
        name: "TV STATION_2", workingworkers: [],
        cost: 20, industry: 'Media', requiredWorkers: 2, skilledworker: 1, goodsProduced: 3, wages: { level: "L2", L1: 25, L2: 20, L3: 15 }, imageUrl: "/StateCompanies/TVStation_2.jpg"
    },
    {
        name: "TV STATION_1", workingworkers: [],
        cost: 20, industry: 'Media', requiredWorkers: 2, skilledworker: 1, goodsProduced: 3, wages: { level: "L2", L1: 25, L2: 20, L3: 15 }, imageUrl: "/StateCompanies/TVStation_1.jpg"
    },
];

