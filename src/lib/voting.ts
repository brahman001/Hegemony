type Party = 'A' | 'B' | 'C';

class VotingModule {
  private static instance: VotingModule;
  private parties: Party[];
  private bag: Party[];
  private votes: Record<Party, number>;

  private constructor(parties: Party[]) {
    this.parties = parties;
    this.bag = this.initializeBag();
    this.votes = { 'A': 0, 'B': 0, 'C': 0 };
  }

  public static getInstance(parties: Party[]): VotingModule {
    if (!VotingModule.instance) {
      VotingModule.instance = new VotingModule(parties);
    }
    return VotingModule.instance;
  }

  private initializeBag(): Party[] {
    // 初始化袋子，假设每种指示物都有一定的数量
    const bag: Party[] = [];
    for (const party of this.parties) {
      for (let i = 0; i < 10; i++) {
        bag.push(party);
      }
    }
    return this.shuffle(bag);
  }

  private shuffle(array: any[]): any[] {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  public drawIndicators(num: number = 5): Party[] {
    const drawn: Party[] = [];
    for (let i = 0; i < num; i++) {
      const indicator = this.bag.pop();
      if (indicator) {
        drawn.push(indicator);
        this.votes[indicator]++;
      }
    }
    return drawn;
  }

  public influenceVote(party: Party, influence: number): void {
    this.votes[party] += influence;
  }

  public getVoteCounts(): Record<Party, number> {
    return this.votes;
  }

  public printVotes(): void {
    console.log(`Current votes: ${JSON.stringify(this.getVoteCounts())}`);
  }
}

// 使用示例
const parties: Party[] = ['A', 'B', 'C'];
const votingModule = VotingModule.getInstance(parties);

// 从袋子中抽出5个指示物
const drawnIndicators = votingModule.drawIndicators();
console.log(`Drawn indicators: ${drawnIndicators}`);

// 每个人使用影响力增加指示物
votingModule.influenceVote('A', 2);  // 第一个人增加2个指示物到A
votingModule.influenceVote('B', 1);  // 第二个人增加1个指示物到B

// 打印当前投票情况
votingModule.printVotes();
