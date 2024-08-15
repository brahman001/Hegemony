import { WorkerClass, Worker, GoodsAndServices } from "./workerclass";
import { EventEmitter } from 'events';
import { StateCompany, StateCompanies } from './company'
import { Company } from "./company";
import { parse, stringify } from 'flatted';
import { CapitalistClass, CapitalistGoodsAndServices } from "./Capitalistclass";
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
export type ExportKeys = 'Food1' | 'Food2' | 'health1' | 'health2' | 'Luxury1' | 'Luxury2' | 'Education1' | 'Education2';
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
    Food1: Item;
    Food2: Item;
    health1: Item;
    health2: Item;
    Luxury1: Item;
    Luxury2: Item;
    Education1: Item;
    Education2: Item;
    imageUrl: string;
}
export interface Item {
    item: keyof CapitalistGoodsAndServices;
    amount: number;
    price: number;
}
interface VotingRules {
    [key: string]: string[];
}
interface Votingbag {
    Workerclass: number;
    Capitalistclass: number;
    agree: (WorkerClass | CapitalistClass)[];
    disagree: (WorkerClass | CapitalistClass)[];
}
export class Board extends EventEmitter {
    private Votingbag: Votingbag;
    private Votingresult: Votingbag;
    private static instance: Board;
    private Policy: Policy;
    private StateTreasury: number;
    private goodsAndServices: StategoodsAndServices;
    private BusinessDeal: BusinessDeal[];
    private Export: Export;
    private StateCompany: StateCompany[];
    private PolicyVoting: Policy;
    private policyVotingone: keyof Policy;
    private votingRules: VotingRules;
    private loan: number;
    private unempolyment: Worker[];
    private DemonStration: boolean;
    constructor() {
        super();
        this.DemonStration = false;
        this.policyVotingone = "Fiscal"!;
        this.Votingresult = {
            Workerclass: 0,
            Capitalistclass: 0,
            agree: [],
            disagree: [],
        }
        this.StateCompany = [];
        this.Votingbag = {
            Workerclass: 0,
            Capitalistclass: 0,
            agree: [],
            disagree: [],
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
        this.Export = Exportcards[Math.floor(Math.random() * Exportcards.length)],
            this.StateTreasury = 120,
            this.goodsAndServices = {
                Health: 6,
                Education: 6,
                Influence: 4,
            };
        this.BusinessDeal = [];
        this.BusinessDeal.push(BusinessDealcards[Math.floor(Math.random() * BusinessDealcards.length)]);
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
            if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
                const saveddata = localStorage.getItem('Board');
                if (saveddata) {
                    Board.instance = new Board();
                    Board.instance.setBoard(parse(saveddata));
                } else {
                    Board.instance = new Board();
                }
            }
        }
        return Board.instance;
    }
    setBoard(data: Board) {
        this.DemonStration = data.DemonStration;
        this.loan = data.loan;
        this.Policy = data.Policy;
        this.Export = data.Export;
        this.StateTreasury = data.StateTreasury;
        this.goodsAndServices = data.goodsAndServices;
        this.BusinessDeal = data.BusinessDeal;
        this.PolicyVoting = data.PolicyVoting;
        this.StateCompany = data.StateCompany;
        this.Votingbag = data.Votingbag;
        this.unempolyment = data.unempolyment;
        this.Votingresult = data.Votingresult;
    }
    Initialization2p() {
        this.Votingresult = {
            Workerclass: 0,
            Capitalistclass: 0,
            agree: [],
            disagree: [],
        }
        this.BusinessDeal = [];
        this.BusinessDeal.push(BusinessDealcards[Math.floor(Math.random() * BusinessDealcards.length)]);
        this.DemonStration = false;
        this.unempolyment.length = 0;
        this.loan = 0;
        this.Votingbag = {
            Workerclass: 5,
            Capitalistclass: 5,
            agree: [],
            disagree: [],
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
        this.Export = Exportcards[Math.floor(Math.random() * Exportcards.length)],
            this.StateTreasury = 120,
            this.goodsAndServices = {
                Health: 6,
                Education: 6,
                Influence: 4,
            };
        this.setBusinessDeal;
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
    updateStateTreasury(amount: number): void {
        this.StateTreasury += amount;
    }
    addPublicService(industry: String, number: number) {
        switch (industry) {
            case 'Healthcare':
            case 'Health':
                this.goodsAndServices.Health += number;
                break;
            case 'Education':
                this.goodsAndServices.Education += number;
                break;
            case 'Media':
            case 'Influence':
                this.goodsAndServices.Influence += number;
                break;
            default:
        }
    }
    reflashExport(): void {
        this.Export = Exportcards[Math.floor(Math.random() * Exportcards.length)],
            this.emit('update');
    }
    getinfo() {
        return {
            DemonStration: this.DemonStration,
            Votingresult: this.Votingresult,
            Votingbag: this.Votingbag,
            Policy: this.Policy,
            PolicyVoting: this.PolicyVoting,
            StateTreasury: this.StateTreasury,
            goodsAndServices: this.goodsAndServices,
            BusinessDeal: this.BusinessDeal,
            Export: this.Export,
            companys: this.StateCompany,
            loan: this.loan,
            unempolyment: this.unempolyment
        };
    }
    setBusinessDeal() {
        this.BusinessDeal = [];
        if (this.Policy.Foreign === 'A') {
        }
        if (this.Policy.Foreign === 'B') {
            let deal;
            do {
                deal = BusinessDealcards[Math.floor(Math.random() * BusinessDealcards.length)];
            } while (this.BusinessDeal.includes(deal));
            this.BusinessDeal.push(deal);
        }
        if (this.Policy.Foreign === 'C') {
            let deal1, deal2;
            do {
                deal1 = BusinessDealcards[Math.floor(Math.random() * BusinessDealcards.length)];
            } while (this.BusinessDeal.includes(deal1));
            this.BusinessDeal.push(deal1);

            do {
                deal2 = BusinessDealcards[Math.floor(Math.random() * BusinessDealcards.length)];
            } while (this.BusinessDeal.includes(deal2));
            this.BusinessDeal.push(deal2);
        }

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
    addworker(Worker: Worker) {
        this.unempolyment.push(Worker);
    }
    removeworker(Worker: Worker) {
        const index = this.unempolyment.indexOf(Worker);
        if (index !== -1) {
            this.unempolyment.splice(index, 1);
        }
    }
    swapworker(Worker: Worker, location: Company, onSuccess: () => void, onError: (message: string) => void) {
        // 查找第一个失业的 unskilled 工人
        const index1 = this.unempolyment.findIndex(w => w.skill === 'unskill');

        if (index1 === -1) {
            onError('No unskilled workers are unemployed');
            return;
        }

        // 获取 unskilled 工人并将其添加到公司
        const unskilledWorker = this.unempolyment[index1];
        location.workingworkers.push(unskilledWorker);
        this.unempolyment.splice(index1, 1);

        // 将目标工人从公司移除
        const index2 = location.workingworkers.findIndex(w => w === Worker);

        if (index2 !== -1) {
            location.workingworkers.splice(index2, 1);

            // 确保目标工人的 location 更新为 null 表示失业
            Worker.location = null;

            // 将目标工人添加到失业列表中
            this.addworker(Worker);

            // 更新新添加的 unskilled 工人的 location 为新公司
            unskilledWorker.location = location;

            this.emit('update');
            onSuccess();
        } else {
            // 如果目标工人不在公司中，回滚之前的操作
            location.workingworkers.pop(); // 移除刚添加的 unskilled 工人
            this.unempolyment.push(unskilledWorker); // 将 unskilled 工人放回失业列表
            onError('Worker not found in the company');
        }
    }

    votingabill(policy: keyof Policy, votingAim: string, classname: WorkerClass | CapitalistClass, onSuccess: () => void, onError: (message: string) => void) {
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
    Votingrapidly(policy: keyof Policy, classname: WorkerClass | CapitalistClass, votingAim: string, onSuccess: () => void, onError: (message: string) => void) {
        if (this.Policy.hasOwnProperty(policy)) {
            const currentGrade = this.Policy[policy];
            if (this.votingRules[currentGrade] && this.votingRules[currentGrade].includes(votingAim)
                && (!this.PolicyVoting[policy] || this.PolicyVoting[policy] === votingAim)) {
                this.PolicyVoting[policy] = votingAim;
                this.policyVotingone = policy;
                this.Votingbag.agree.push(classname);
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
    Voting2(workerInfluence: number, capitalistInfluence: number) {
        let totalAgreeInfluence = 0;
        let totalDisagreeInfluence = 0;
        if (this.Votingbag.agree.filter(member => member instanceof WorkerClass).length > 0) {
            totalAgreeInfluence += workerInfluence + this.Votingresult.Workerclass;
        } else {
            totalDisagreeInfluence += workerInfluence + this.Votingresult.Workerclass;
        }

        if (this.Votingbag.agree.filter(member => member instanceof CapitalistClass).length > 0) {
            totalAgreeInfluence += capitalistInfluence + this.Votingresult.Capitalistclass;
        } else {
            totalDisagreeInfluence += capitalistInfluence + this.Votingresult.Capitalistclass;
        }

        if (totalAgreeInfluence >= totalDisagreeInfluence) {
            this.Policy[this.policyVotingone] = this.PolicyVoting[this.policyVotingone];
            this.PolicyVoting[this.policyVotingone] = '';
            this.Votingbag.Capitalistclass += this.Votingresult.Capitalistclass;
            switch (this.policyVotingone) {
                case 'Fiscal':
                    Board.getInstance().setcompany2p();
                    break;
                case 'Labor':
                    const policy = this.Policy[this.policyVotingone];
                    const mapping: PolicyMap = {
                        'A': 3,
                        'B': 2,
                        'C': 1
                    };
                    Board.getInstance().getinfo().companys.forEach(company => {
                        if (!company.Commit && mapping[policy as keyof PolicyMap] > company.wages.level) {
                            company.wages.level = mapping[policy as keyof PolicyMap];
                        }
                    });

                    CapitalistClass.getInstance().getinfo().companys.forEach(company => {
                        if (!company.Commit && mapping[policy as keyof PolicyMap] > company.wages.level) {
                            company.wages.level = mapping[policy as keyof PolicyMap];
                        }
                    });

                    this.emit("update");
                    break;
                case 'Taxation':
                case 'Health':
                case 'Education':
                case 'Foreign':
                case 'Immigration':
                    break;
            }

            if (this.Votingbag.agree.length > 0) {
                if (this.Votingbag.agree[0] instanceof WorkerClass) {
                    WorkerClass.getInstance().setScore(WorkerClass.getInstance().getinfo().score + 3);
                    if (this.Votingbag.agree.length > 1) {
                        CapitalistClass.getInstance().setScore(CapitalistClass.getInstance().getinfo().Score + 1);
                    }
                } else {
                    CapitalistClass.getInstance().setScore(CapitalistClass.getInstance().getinfo().Score + 3);
                    if (this.Votingbag.agree.length > 1) {
                        WorkerClass.getInstance().setScore(WorkerClass.getInstance().getinfo().score + 1);
                    }
                }
            }

            this.Votingbag.disagree.forEach(member => {
                if (member instanceof WorkerClass) {
                    this.Votingbag.Workerclass++;
                } else if (member instanceof CapitalistClass) {
                    this.Votingbag.Capitalistclass++;
                }
            });

        } else {
            this.Votingbag.Workerclass += this.Votingresult.Workerclass;
            this.PolicyVoting[this.policyVotingone] = '';
            console.log(this.PolicyVoting[this.policyVotingone]);
            this.Votingbag.agree.forEach(member => {
                if (member instanceof WorkerClass) {
                    this.Votingbag.Workerclass++;
                } else if (member instanceof CapitalistClass) {
                    this.Votingbag.Capitalistclass++;
                }
            });
        }

        this.Votingbag.agree = [];
        this.Votingbag.disagree = [];
        this.Votingresult.Capitalistclass = 0;
        this.Votingresult.Workerclass = 0;
        this.emit("update");
    }
    Voting3(workerInfluence: number, capitalistInfluence: number, votingname: String) {
        let totalAgreeInfluence = 0;
        let totalDisagreeInfluence = 0;
        this.policyVotingone = votingname as keyof Policy;
        if (this.Votingbag.agree.filter(member => member instanceof WorkerClass).length > 0) {
            totalAgreeInfluence += workerInfluence + this.Votingresult.Workerclass;
        } else {
            totalDisagreeInfluence += workerInfluence + this.Votingresult.Workerclass;
        }

        if (this.Votingbag.agree.filter(member => member instanceof CapitalistClass).length > 0) {
            totalAgreeInfluence += capitalistInfluence + this.Votingresult.Capitalistclass;
        } else {
            totalDisagreeInfluence += capitalistInfluence + this.Votingresult.Capitalistclass;
        }

        if (totalAgreeInfluence >= totalDisagreeInfluence) {
            this.Policy[this.policyVotingone] = this.PolicyVoting[this.policyVotingone];
            this.PolicyVoting[this.policyVotingone] = '';
            this.Votingbag.Capitalistclass += this.Votingresult.Capitalistclass;
            switch (this.policyVotingone) {
                case 'Fiscal':
                    Board.getInstance().setcompany2p();
                    break;
                case 'Labor':
                    const policy = this.Policy[this.policyVotingone];
                    const mapping: PolicyMap = {
                        'A': 3,
                        'B': 2,
                        'C': 1
                    };
                    Board.getInstance().getinfo().companys.forEach(company => {
                        if (!company.Commit && mapping[policy as keyof PolicyMap] > company.wages.level) {
                            company.wages.level = mapping[policy as keyof PolicyMap];
                        }
                    });

                    CapitalistClass.getInstance().getinfo().companys.forEach(company => {
                        if (!company.Commit && mapping[policy as keyof PolicyMap] > company.wages.level) {
                            company.wages.level = mapping[policy as keyof PolicyMap];
                        }
                    });

                    this.emit("update");
                    break;
                case 'Taxation':
                case 'Health':
                case 'Education':
                case 'Foreign':
                case 'Immigration':
                    break;
            }

            if (this.Votingbag.agree.length > 0) {
                if (this.Votingbag.agree[0] instanceof WorkerClass) {
                    WorkerClass.getInstance().setScore(WorkerClass.getInstance().getinfo().score + 3);
                    if (this.Votingbag.agree.length > 1) {
                        CapitalistClass.getInstance().setScore(CapitalistClass.getInstance().getinfo().Score + 1);
                    }
                } else {
                    CapitalistClass.getInstance().setScore(CapitalistClass.getInstance().getinfo().Score + 3);
                    if (this.Votingbag.agree.length > 1) {
                        WorkerClass.getInstance().setScore(WorkerClass.getInstance().getinfo().score + 1);
                    }
                }
            }

            this.Votingbag.disagree.forEach(member => {
                if (member instanceof WorkerClass) {
                    this.Votingbag.Workerclass++;
                } else if (member instanceof CapitalistClass) {
                    this.Votingbag.Capitalistclass++;
                }
            });

        } else {
            this.Votingbag.Workerclass += this.Votingresult.Workerclass;
            this.PolicyVoting[this.policyVotingone] = '';
            console.log(this.PolicyVoting[this.policyVotingone]);
            this.Votingbag.agree.forEach(member => {
                if (member instanceof WorkerClass) {
                    this.Votingbag.Workerclass++;
                } else if (member instanceof CapitalistClass) {
                    this.Votingbag.Capitalistclass++;
                }
            });
        }

        this.Votingbag.agree = [];
        this.Votingbag.disagree = [];
        this.Votingresult.Capitalistclass = 0;
        this.Votingresult.Workerclass = 0;
        this.emit("update");
    }
    addVotingbag(number: number, classname: WorkerClass | CapitalistClass): any {
        if (classname instanceof WorkerClass) {
            this.Votingbag.Workerclass += number;
        }
        this.Votingbag.Capitalistclass += number;
    }
    checkAgree(classname: WorkerClass | CapitalistClass): string {
        if (this.Votingbag.agree.some(member => member === classname)) {
            return "agree";
        }
        if (this.Votingbag.disagree.some(member => member === classname)) {
            return "disagree";
        }
        return "no";
    }
    setAgree(classname: WorkerClass | CapitalistClass, agree: boolean) {
        if (agree) {
            this.Votingbag.agree.push(classname);
        }
        else {
            this.Votingbag.disagree.push(classname);
        }
        this.emit("update")
    }
    setDemonStration(is: boolean) {
        this.DemonStration = is;
        this.emit("update");
    }
    goodsPrices(item: String): number {
        if (item === 'Food') {
            console.log("111");
            if (this.Policy.Foreign === 'A') {
                return 10;
            } else if (this.Policy.Foreign === 'B') {
                return 5;
            } else {
                return 0;
            }
        }
        if (item === 'Luxury') {
            if (this.Policy.Foreign === 'A') {
                return 6;
            } else if (this.Policy.Foreign === 'B') {
                return 3;
            } else {
                return 0;
            }
        }
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
        return 0;
    }
    Production() {
        if (this.DemonStration === true) {
            let sum = 0;
            Board.getInstance().getinfo().companys.map((company: Company, index: React.Key | null | undefined) => (
                sum += company.requiredWorkers,
                sum -= company.workingworkers.length
            ))
            CapitalistClass.getInstance().getinfo().companys.map((company: Company, index: React.Key | null | undefined) => (
                sum += company.requiredWorkers,
                sum -= company.workingworkers.length
            ))
            if (sum + 2 > this.unempolyment.length) {
                this.DemonStration = false;
            }
            else {
                CapitalistClass.getInstance().setScore(CapitalistClass.getInstance().getinfo().Score - this.unempolyment.length + sum - WorkerClass.getInstance().getUnion())
                if (CapitalistClass.getInstance().getinfo().Score < 0) {
                    CapitalistClass.getInstance().setScore(0);
                }
            }
        }
        this.StateCompany.map((company) => {
            if (company.Strike) {
                if (company.wages.level === 3) {
                    company.Strike = false;
                }
            }
            if (!company.Strike && working(company)) {
                Board.getInstance().addPublicService(company.industry, company.goodsProduced);
                const wageLevelValue = company.wages[company.wages.level as 1 | 2 | 3];
                if (this.StateTreasury >= wageLevelValue) {
                    Board.getInstance().updateStateTreasury(-wageLevelValue);
                    WorkerClass.getInstance().addincome(wageLevelValue);
                }
                else {
                    this.loan++;
                    Board.getInstance().updateStateTreasury(50);
                    Board.getInstance().updateStateTreasury(-wageLevelValue);
                    WorkerClass.getInstance().addincome(wageLevelValue);
                }
                console.log(company.name, wageLevelValue);
            }
            if (company.Strike) {
                company.Strike = false;
                WorkerClass.getInstance().Buying(1, 'Influence');
            }
        });
    }
    checkIMF() {
        if (this.Policy.Fiscal === 'A') {
            if (this.loan > 1) {
                this.PolicyVoting = {
                    Fiscal: 'C',
                    Labor: 'C',
                    Taxation: 'A',
                    Health: 'B',
                    Education: 'C',
                    Foreign: 'B',
                    Immigration: 'B',
                }
                this.setcompany2p();
                Board.getInstance().getinfo().companys.forEach(company => {
                    if (!company.Commit) {
                        company.wages.level = 1;
                    }
                });

                CapitalistClass.getInstance().getinfo().companys.forEach(company => {
                    if (!company.Commit) {
                        company.wages.level = 1;
                    }
                });
            }
        }
        else {
            if (this.loan > 2) {
                this.PolicyVoting = {
                    Fiscal: 'C',
                    Labor: 'C',
                    Taxation: 'A',
                    Health: 'B',
                    Education: 'C',
                    Foreign: 'B',
                    Immigration: 'B',
                }
                this.setcompany2p();
                Board.getInstance().getinfo().companys.forEach(company => {
                    if (!company.Commit) {
                        company.wages.level = 1;
                    }
                });

                CapitalistClass.getInstance().getinfo().companys.forEach(company => {
                    if (!company.Commit) {
                        company.wages.level = 1;
                    }
                });
            }
        }
    }
    perparation() {
        this.StateCompany.map((company) => { company.Commit = false });
        this.StateTreasury -= (this.loan * 5);
        this.setBusinessDeal;
        this.Export = this.Export = Exportcards[Math.floor(Math.random() * Exportcards.length)];
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

const Exportcards: Export[] = [
    {
        Food1: { item: "Food", amount: 2, price: 25 },
        Food2: { item: "Food", amount: 6, price: 65 },
        health1: { item: "Health", amount: 3, price: 20 },
        health2: { item: "Health", amount: 7, price: 40 },
        Luxury1: { item: "Luxury", amount: 4, price: 20 },
        Luxury2: { item: "Luxury", amount: 7, price: 35 },
        Education1: { item: "Education", amount: 3, price: 25 },
        Education2: { item: "Education", amount: 6, price: 45 },
        imageUrl: "/export/export1_01.gif",
    },

    {
        Food1: { item: "Food", amount: 2, price: 15 },
        Food2: { item: "Food", amount: 6, price: 50 },
        health1: { item: "Health", amount: 4, price: 25 },
        health2: { item: "Health", amount: 8, price: 45 },
        Luxury1: { item: "Luxury", amount: 3, price: 25 },
        Luxury2: { item: "Luxury", amount: 5, price: 40 },
        Education1: { item: "Education", amount: 3, price: 15 },
        Education2: { item: "Education", amount: 7, price: 35 },
        imageUrl: "/export/export1_02.gif",
    },

    {
        Food1: { item: "Food", amount: 2, price: 15 },
        Food2: { item: "Food", amount: 6, price: 50 },
        health1: { item: "Health", amount: 4, price: 30 },
        health2: { item: "Health", amount: 7, price: 50 },
        Luxury1: { item: "Luxury", amount: 3, price: 15 },
        Luxury2: { item: "Luxury", amount: 7, price: 35 },
        Education1: { item: "Education", amount: 3, price: 20 },
        Education2: { item: "Education", amount: 5, price: 35 },
        imageUrl: "/export/export1_03.gif",
    },

    {
        Food1: { item: "Food", amount: 2, price: 15 },
        Food2: { item: "Food", amount: 6, price: 45 },
        health1: { item: "Health", amount: 3, price: 20 },
        health2: { item: "Health", amount: 5, price: 30 },
        Luxury1: { item: "Luxury", amount: 3, price: 20 },
        Luxury2: { item: "Luxury", amount: 7, price: 50 },
        Education1: { item: "Education", amount: 4, price: 25 },
        Education2: { item: "Education", amount: 8, price: 45 },
        imageUrl: "/export/export1_04.gif",
    },

    {
        Food1: { item: "Food", amount: 4, price: 40 },
        Food2: { item: "Food", amount: 7, price: 70 },
        health1: { item: "Health", amount: 2, price: 15 },
        health2: { item: "Health", amount: 7, price: 50 },
        Luxury1: { item: "Luxury", amount: 3, price: 25 },
        Luxury2: { item: "Luxury", amount: 6, price: 50 },
        Education1: { item: "Education", amount: 3, price: 20 },
        Education2: { item: "Education", amount: 5, price: 30 },
        imageUrl: "/export/export1_05.gif",
    },

    {
        Food1: { item: "Food", amount: 3, price: 30 },
        Food2: { item: "Food", amount: 7, price: 70 },
        health1: { item: "Health", amount: 3, price: 20 },
        health2: { item: "Health", amount: 5, price: 35 },
        Luxury1: { item: "Luxury", amount: 4, price: 30 },
        Luxury2: { item: "Luxury", amount: 6, price: 40 },
        Education1: { item: "Education", amount: 2, price: 15 },
        Education2: { item: "Education", amount: 6, price: 35 },
        imageUrl: "/export/export1_06.gif",
    },
    {
        Food1: { item: "Food", amount: 4, price: 50 },
        Food2: { item: "Food", amount: 8, price: 95 },
        health1: { item: "Health", amount: 3, price: 15 },
        health2: { item: "Health", amount: 7, price: 35 },
        Luxury1: { item: "Luxury", amount: 3, price: 20 },
        Luxury2: { item: "Luxury", amount: 5, price: 30 },
        Education1: { item: "Education", amount: 2, price: 15 },
        Education2: { item: "Education", amount: 6, price: 40 },
        imageUrl: "/export/export1_07.gif",
    },

    {
        Food1: { item: "Food", amount: 3, price: 30 },
        Food2: { item: "Food", amount: 5, price: 50 },
        health1: { item: "Health", amount: 3, price: 25 },
        health2: { item: "Health", amount: 7, price: 55 },
        Luxury1: { item: "Luxury", amount: 2, price: 10 },
        Luxury2: { item: "Luxury", amount: 6, price: 35 },
        Education1: { item: "Education", amount: 4, price: 25 },
        Education2: { item: "Education", amount: 8, price: 45 },
        imageUrl: "/export/export1_08.gif",
    },

    {
        Food1: { item: "Food", amount: 3, price: 35 },
        Food2: { item: "Food", amount: 7, price: 75 },
        health1: { item: "Health", amount: 3, price: 20 },
        health2: { item: "Health", amount: 5, price: 35 },
        Luxury1: { item: "Luxury", amount: 2, price: 10 },
        Luxury2: { item: "Luxury", amount: 6, price: 35 },
        Education1: { item: "Education", amount: 4, price: 25 },
        Education2: { item: "Education", amount: 7, price: 40 },
        imageUrl: "/export/export1_09.gif",
    },

    {
        Food1: { item: "Food", amount: 4, price: 45 },
        Food2: { item: "Food", amount: 8, price: 85 },
        health1: { item: "Health", amount: 3, price: 15 },
        health2: { item: "Health", amount: 5, price: 25 },
        Luxury1: { item: "Luxury", amount: 2, price: 15 },
        Luxury2: { item: "Luxury", amount: 6, price: 40 },
        Education1: { item: "Education", amount: 3, price: 15 },
        Education2: { item: "Education", amount: 7, price: 35 },
        imageUrl: "/export/export1_10.gif",
    },

    {
        Food1: { item: "Food", amount: 3, price: 30 },
        Food2: { item: "Food", amount: 5, price: 50 },
        health1: { item: "Health", amount: 3, price: 20 },
        health2: { item: "Health", amount: 6, price: 50 },
        Luxury1: { item: "Luxury", amount: 3, price: 25 },
        Luxury2: { item: "Luxury", amount: 7, price: 55 },
        Education1: { item: "Education", amount: 3, price: 20 },
        Education2: { item: "Education", amount: 7, price: 50 },
        imageUrl: "/export/export1_11.gif",
    },

    {
        Food1: { item: "Food", amount: 4, price: 45 },
        Food2: { item: "Food", amount: 7, price: 80 },
        health1: { item: "Health", amount: 2, price: 15 },
        health2: { item: "Health", amount: 6, price: 40 },
        Luxury1: { item: "Luxury", amount: 3, price: 20 },
        Luxury2: { item: "Luxury", amount: 5, price: 30 },
        Education1: { item: "Education", amount: 3, price: 20 },
        Education2: { item: "Education", amount: 7, price: 50 },
        imageUrl: "/export/export1_12.gif",
    },
    {
        Food1: { item: "Food", amount: 3, price: 25 },
        Food2: { item: "Food", amount: 7, price: 55 },
        health1: { item: "Health", amount: 2, price: 10 },
        health2: { item: "Health", amount: 6, price: 35 },
        Luxury1: { item: "Luxury", amount: 4, price: 25 },
        Luxury2: { item: "Luxury", amount: 8, price: 45 },
        Education1: { item: "Education", amount: 3, price: 20 },
        Education2: { item: "Education", amount: 5, price: 35 },
        imageUrl: "/export/export1_13.gif",
    },
    {
        Food1: { item: "Food", amount: 3, price: 25 },
        Food2: { item: "Food", amount: 6, price: 50 },
        health1: { item: "Health", amount: 3, price: 20 },
        health2: { item: "Health", amount: 7, price: 40 },
        Luxury1: { item: "Luxury", amount: 3, price: 20 },
        Luxury2: { item: "Luxury", amount: 7, price: 50 },
        Education1: { item: "Education", amount: 2, price: 15 },
        Education2: { item: "Education", amount: 7, price: 55 },
        imageUrl: "/export/export1_14.gif"
    },
    {
        Food1: { item: "Food", amount: 2, price: 20 },
        Food2: { item: "Food", amount: 6, price: 55 },
        health1: { item: "Health", amount: 3, price: 25 },
        health2: { item: "Health", amount: 5, price: 40 },
        Luxury1: { item: "Luxury", amount: 4, price: 30 },
        Luxury2: { item: "Luxury", amount: 8, price: 55 },
        Education1: { item: "Education", amount: 3, price: 15 },
        Education2: { item: "Education", amount: 7, price: 35 },
        imageUrl: "/export/export1_15.gif",
    },
    {
        Food1: { item: "Food", amount: 2, price: 20 },
        Food2: { item: "Food", amount: 6, price: 55 },
        health1: { item: "Health", amount: 3, price: 25 },
        health2: { item: "Health", amount: 5, price: 40 },
        Luxury1: { item: "Luxury", amount: 4, price: 30 },
        Luxury2: { item: "Luxury", amount: 8, price: 55 },
        Education1: { item: "Education", amount: 3, price: 15 },
        Education2: { item: "Education", amount: 7, price: 35 },
        imageUrl: "/export/export1_16.gif",
    },

]

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