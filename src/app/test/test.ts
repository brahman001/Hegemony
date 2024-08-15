import { Board } from '../../lib/board';
import { WorkerClass, skillkind } from '../../lib/workerclass';
import { CapitalistClass } from '../../lib/Capitalistclass';
import { Company } from '@/lib/company';

describe('Board Class', () => {
    let board: Board;

    beforeEach(() => {
        board = Board.getInstance();
        board.Initialization2p();
    });

    test('should initialize Board correctly', () => {
        const info = board.getinfo();
        expect(info.Policy.Fiscal).toBe('C');
        expect(info.StateTreasury).toBe(120);
        expect(info.goodsAndServices.Health).toBe(6);
    });

    test('should update State Treasury correctly', () => {
        board.updateStateTreasury(50);
        expect(board.getinfo().StateTreasury).toBe(170);
        board.updateStateTreasury(-20);
        expect(board.getinfo().StateTreasury).toBe(150);
    });

    test('should handle voting process correctly', () => {
        const workerClass = WorkerClass.getInstance();
        board.votingabill('Fiscal', 'B', workerClass, () => { }, () => { });
        expect(board.getinfo().PolicyVoting.Fiscal).toBe('B');
        board.Votingrapidly('Fiscal', workerClass, 'B', () => { }, () => { });
        expect(board.getinfo().Votingbag.agree.length).toBeGreaterThan(0);
    });

    test('should correctly calculate influence in voting', () => {
        const workerClass = WorkerClass.getInstance();
        const capitalistClass = CapitalistClass.getInstance();
        board.votingabill('Fiscal', 'B', workerClass, () => { }, () => { });
        board.Votingrapidly('Fiscal', workerClass, 'B', () => { }, () => { });
        board.Voting2(5, 0);
        expect(board.getinfo().Policy.Fiscal).toBe('B');
    });

    test('should add a worker to unemployment', () => {
        const worker = { skill: 'Agriculture' as skillkind, location: null };
        board.addworker(worker);
        expect(board.getinfo().unempolyment).toContain(worker);
    });
});

describe('WorkerClass', () => {
    Board.getInstance().Initialization2p();
    CapitalistClass.getInstance().Initialization();

    let workerClass: WorkerClass;

    beforeEach(() => {
        workerClass = WorkerClass.getInstance();
        workerClass.Initialization2P();
    });

    test('should initialize WorkerClass correctly', () => {
        const info = workerClass.getinfo();
        expect(info.population.population_level).toBe(3);
        expect(info.income).toBe(30);
    });

    test('should add worker correctly', () => {
        const initialWorkerCount = workerClass.getinfo().population.worker.length;
        workerClass.addWorker('Agriculture', null);
        const newWorkerCount = workerClass.getinfo().population.worker.length;
        expect(newWorkerCount).toBe(initialWorkerCount + 1);
    });

    test('should correctly use goods and services', () => {
        workerClass.addincome(50);
        workerClass.Buying(10, 'Food');
        workerClass.using('Food');
        expect(workerClass.getinfo().goodsAndServices.Food).toBe(7);
    });

    test('should handle loan payoff correctly', () => {
        workerClass.payoffloan(() => { }, () => { });
        expect(workerClass.getinfo().loan).toBe(-1);
    });

    test('should calculate prosperity correctly', () => {
        workerClass.setProsperity(5);
        expect(workerClass.getinfo().prosperity).toBe(5);
    });
});

describe('CapitalistClass', () => {
    let capitalistClass: CapitalistClass;

    beforeEach(() => {
        capitalistClass = CapitalistClass.getInstance();
        capitalistClass.Initialization();
    });

    test('should initialize CapitalistClass correctly', () => {
        const info = capitalistClass.getinfo();
        expect(info.Score).toBe(0);
    });

    test('should correctly update score', () => {
        capitalistClass.setScore(10);
        expect(capitalistClass.getinfo().Score).toBe(10);
    });

    test('should correctly handle company management', () => {
        const companyInfo = capitalistClass.getinfo().companys;
        expect(companyInfo.length).toBeGreaterThan(0);
    });
});
