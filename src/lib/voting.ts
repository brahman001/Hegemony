import { EventEmitter } from 'events';

interface Policy {
    Fiscal?: string;
    Labor?: string;
    Taxation?: string;
    Health?: string;
    Education?: string;
    Foreign?: string;
    Immigration?: string;
}

interface VotingRules {
    [key: string]: string[];
}

export  class Voting extends EventEmitter {
    private static instance: Voting;
    private Policy: Policy;
    private PolicyVoting: Policy;
    private votingRules: VotingRules;

    constructor() {
        super();
        this.Policy = {
            Fiscal: 'C',
            Labor: 'B',
            Taxation: 'A',
            Health: 'B',
            Education: 'C',
            Foreign: 'B',
            Immigration: 'B',
        };
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
            A: ['B'],  // 当评级为A时，只能投B
            B: ['A', 'C'],  // 当评级为B时，可以投A或C
            C: ['B']  // 当评级为C时，只能投B
        };
    }
    public static getInstance(): Voting {
        if (!Voting.instance) {
            Voting.instance = new Voting();
        }
        return Voting.instance;
    }
    voting(policy: keyof Policy, votingAim: string) {
        if (this.Policy.hasOwnProperty(policy)) {
            const currentGrade = this.Policy[policy];
            if (this.votingRules[currentGrade] && this.votingRules[currentGrade].includes(votingAim)) {
                this.PolicyVoting[policy] = votingAim;
                this.emit('voteSuccess', `Vote on ${policy} successfully updated to ${votingAim}`);
            } else {
                this.emit('voteError', `Invalid vote aim: ${votingAim} for current grade: ${currentGrade}. Allowed votes: ${this.votingRules[currentGrade].join(', ')}`);
            }
        } else {
            this.emit('voteError', `Invalid policy: ${policy}`);
        }
    }
}
