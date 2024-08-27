'use client';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import React, { useState, useEffect } from 'react';
import { WorkerClass, GoodsAndServices, Worker, Population } from '../../lib/workerclass';
import { CapitalistClass, CapitalistGoodsAndServices } from '@/lib/Capitalistclass';
import { Board, Policy, StategoodsAndServices, Item } from '@/lib/board';
import Image from 'next/image'
import { Company, CapitalistCompany } from '@/lib/company';
import { stringify } from 'flatted';

interface GameState {
  nowclass: WorkerClass | CapitalistClass;
  currentTurn: number;
  currentRound: number;
  phase: 'Action' | 'Production' | 'Preparation Phase' | 'End Phase';
  maxRounds: number;
  maxTurns: number;
};
interface Action {
  label: string;
  databstarget?: string;
  onClick?: () => void;
  subActions?: Action[];
  visibleFor: ('WorkerClass' | 'CapitalistClass')[];
};
interface Actions {
  basic: Action[];
  free: Action[];
};
interface ActionToggleProps {
  nowclass: WorkerClass | CapitalistClass;
  onActionComplete: () => void;
  usedBasicActions: boolean;
  usedfreeActions: boolean;
  setBasicAction: () => void;
  setfreeAction: () => void;
};

export const GameRun: React.FC = () => {
  const [first, setfirst] = useState(false);
  const [gameState, setGameState] = useState<GameState>({
    nowclass: WorkerClass.getInstance(),
    currentTurn: 1,
    currentRound: 1,
    phase: 'Action',
    maxRounds: 5,
    maxTurns: 5,
  });
  const [showInitializationModal, setInitializationModal] = useState(false);
  const [showEatingModal, setEatingModal] = useState(false);
  const [showVotingModal, setVotingmodel] = useState<number>(0);
  const [showEndModal, setEndmodel] = useState(false);
  const [usedBasicActions, setUsedBasicActions] = useState(false);
  const [usedfreeActions, setUsedFreeActions] = useState(false);
  const [inputValue, setInputValue] = useState<number | undefined>(undefined);
  const [workerInfluence, setWorkerInfluence] = useState<number | null>(null);
  const [capitalistInfluence, setCapitalistInfluence] = useState<number | null>(null);
  const [votingName, setVotingName] = useState<String | undefined>(undefined);
  const [winer, setwiner] = useState<string>();
  useEffect(() => {
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      try {
        const savedState = localStorage.getItem('gameState');
        if (savedState) {
          const parsedState = JSON.parse(savedState);
          setGameState(parsedState);
        }
      } catch (e) {
        console.error('Error parsing game state from localStorage', e);
      }
    }
  }, []);
  useEffect(() => {
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      const savedBoard = localStorage.getItem('Board');
      const savedWorkerClass = localStorage.getItem('WorkerClass');
      const savedCapitalistClass = localStorage.getItem('CapitalistClass');
      if (savedBoard) {
        try {
          Board.getInstance();
        } catch (e) {
          console.error('Error parsing board state from localStorage', e);
        }
      }

      if (savedWorkerClass) {
        try {
          WorkerClass.getInstance();

          if (WorkerClass.getInstance().getinfo().population.worker.length < 10) {
            setfirst(true);
          }
        } catch (e) {
          console.error('Error parsing worker class state from localStorage', e);
        }
      }

      if (savedCapitalistClass) {
        try {

          CapitalistClass.getInstance();

        } catch (e) {
          console.error('Error parsing capitalist class state from localStorage', e);
        }
      }
    }
  }, []);

  useEffect(() => {
    if (gameState.currentRound > gameState.maxRounds && gameState.phase === 'Action') {
      setGameState(prev => ({ ...prev, phase: 'Production' }));
    }
  }, [gameState.currentRound, gameState.maxRounds, gameState.phase]);

  useEffect(() => {
    if (gameState.currentTurn > gameState.maxTurns) {
      alert('Game Over');
    }
  }, [gameState.currentTurn, gameState.maxTurns]);

  useEffect(() => {
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      localStorage.setItem('gameState', stringify(gameState));
      const board = Board.getInstance();
      localStorage.setItem('Board', stringify(board)); // 使用 flatted 的 stringify 方法 
      const workerClass = WorkerClass.getInstance();
      localStorage.setItem('WorkerClass', stringify(workerClass)); // 使用 flatted 的 stringify 方法 
      const capitalistClass = CapitalistClass.getInstance();
      localStorage.setItem('CapitalistClass', stringify(capitalistClass)); // 使用 flatted 的 stringify 方法
    }
  }, [gameState]);

  const [data, setData] = useState({
    workerclass: WorkerClass.getInstance(),
    capitalistclass: CapitalistClass.getInstance(),
    board: Board.getInstance(),
  });
  useEffect(() => {
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      const workerInstance = WorkerClass.getInstance();
      const capitalistInstance = CapitalistClass.getInstance();
      const boardInstance = Board.getInstance();
      const updateData = () => {
        setData({
          workerclass: workerInstance,
          capitalistclass: capitalistInstance,
          board: boardInstance,
        });
      };
      workerInstance.on('update', updateData);
      capitalistInstance.on('update', updateData);
      boardInstance.on('update', updateData);

      return () => {
        console.log('Unregistering event listeners');
        workerInstance.off('update', updateData);
        capitalistInstance.off('update', updateData);
        boardInstance.off('update', updateData);
      };
    }
  }, []);
  const handleNextRound = () => {
    if (gameState.currentRound === 5 && gameState.currentTurn < 5 && gameState.nowclass instanceof CapitalistClass) {
      setGameState(prev => ({
        ...prev,
        phase: 'Production'
      }));
    }
    else if (gameState.currentRound === 5 && gameState.currentTurn === 5 && gameState.nowclass instanceof CapitalistClass) {
      setGameState(prev => ({
        ...prev,
        phase: 'End Phase'
      }));
      EndPhase();
      console.log("jieshu")
    } else {
      setUsedFreeActions(false);
      setUsedBasicActions(false);
      setGameState(prev => {
        const nextClass = toggleNowclass(prev.nowclass);
        const isCapitalistToWorker = prev.nowclass instanceof CapitalistClass && nextClass instanceof WorkerClass;
        return {
          ...prev,
          nowclass: nextClass,
          currentRound: isCapitalistToWorker ? prev.currentRound + 1 : prev.currentRound,
        };
      }
      );
    }
  };
  const EndPhase = () => {
    CapitalistClass.getInstance().EndPhase();
    WorkerClass.getInstance().EndPhase();
    setEndmodel(true);
    if (CapitalistClass.getInstance().getinfo().Score > WorkerClass.getInstance().getinfo().score) {
      setwiner("CapitalistClass");
    }
    else if (CapitalistClass.getInstance().getinfo().Score < WorkerClass.getInstance().getinfo().score) {
      setwiner("WorkerClass");
    }
    else {
      const policy = Board.getInstance().getinfo().Policy;
      const policyKeys: (keyof typeof policy)[] = ['Fiscal', 'Labor', 'Taxation', 'Health', 'Education'];
      let count = 0;

      for (const key of policyKeys) {
        if (policy[key] === 'C') {
          count++;
        }
        if (policy[key] === 'A') {
          count--;
        }
      }
      if (count > 0) {
        setwiner("CapitalistClass");
      }
      else if (count < 0) {
        setwiner("WorkerClass");
      }
      else {
        setwiner("both");
      }
    }
  }
  const toggleNowclass = (current: WorkerClass | CapitalistClass): WorkerClass | CapitalistClass => {
    return current instanceof WorkerClass ? CapitalistClass.getInstance() : WorkerClass.getInstance();
  };
  const handleInitialization = () => {

    const board = Board.getInstance();
    board.Initialization2p();
    const capitalistClass = CapitalistClass.getInstance();
    capitalistClass.Initialization();
    const workerClass = WorkerClass.getInstance();
    workerClass.Initialization2P();
    setEatingModal(false);
    setEndmodel(false);
    setEatingModal(false);
    setVotingmodel(0);
    setwiner('');
    setGameState(prevState => ({
      ...prevState,
      nowclass: WorkerClass.getInstance(),
      currentTurn: 1,
      currentRound: 1,
      phase: 'Action'
    }));
    setfirst(false);
    setInitializationModal(true);
    setUsedBasicActions(false);
    setUsedFreeActions(false)
  }
  const handleCloseModal = () => {
    setInitializationModal(false);
    setGameState(prevState => ({
      ...prevState,
      currentTurn: 1,
      currentRound: 1,
      phase: 'Action'
    }));
  };
  const updateData = () => {
    console.log('Updating data', {
      workerclass: WorkerClass.getInstance(),
      capitalistclass: CapitalistClass.getInstance(),
      board: Board.getInstance(),
    });
  }
  const Production1 = () => {
    Board.getInstance().Production();
    CapitalistClass.getInstance().Production();
    setEatingModal(true);
  }
  const Production2 = () => {
    Board.getInstance().checkIMF();
    CapitalistClass.getInstance().tax();
    WorkerClass.getInstance().tax();
    RenderVotingOptions();

  }
  const perparation = () => {
    Board.getInstance().perparation();
    CapitalistClass.getInstance().perparation();
    WorkerClass.getInstance().perparation();
    setGameState(prev => ({
      ...prev,
      nowclass: WorkerClass.getInstance(),
      phase: 'Action',
      currentRound: 1,
      currentTurn: prev.currentTurn + 1, // Corrected this line
    }));
    setUsedFreeActions(false);
    setUsedBasicActions(false);
  }
  const scroingPhase = () => {
    CapitalistClass.getInstance().scroingPhase();
    WorkerClass.getInstance().scroingPhase();
    perparation();
  }
  const RenderVotingOptions = () => {
    const policyVoting = Board.getInstance().getinfo().PolicyVoting;
    const firstNonEmptyPolicyEntry = Object.entries(policyVoting).find(([key, value]) => value !== '');
    console.log(firstNonEmptyPolicyEntry);
    let thisVotingName;
    if (firstNonEmptyPolicyEntry !== undefined) {
      thisVotingName = firstNonEmptyPolicyEntry[0];
    }
    else {
      thisVotingName = undefined;
    }
    console.log(thisVotingName);
    if (thisVotingName && thisVotingName !== votingName) {
      setVotingName(thisVotingName);
      setVotingmodel(1);
    } else if (thisVotingName === undefined) {
      setVotingName(undefined);
      setVotingmodel(0);
      scroingPhase();
    }

    return (
      <div>
      </div>
    );
  };
  const renderBuyingOptions = () => {
    return (
      <div>
        CapitalistClass
        <input
          type="text"
          className="form-control"
          aria-label="Input number"
          value={inputValue}
          onChange={(event) => handleInputChange(event, 'CapitalistClass')}
        />
        <button
          onClick={(event) => handleBuyingSubmit(event, 'CapitalistClass')}
          className="btn btn-primary"
          type="button"
          data-bs-dismiss="modal"
          disabled={WorkerClass.getInstance().getinfo().goodsAndServices.Food + (inputValue as number) > WorkerClass.getInstance().getinfo().population.population_level}
        >
          Submit
        </button>
        Import
        <input
          type="text"
          className="form-control"
          aria-label="Input number"
          value={inputValue}
          onChange={(event) => handleInputChange(event, 'Import')}
        />
        <button
          onClick={(event) => handleBuyingSubmit(event, 'Import')}
          className="btn btn-primary"
          type="button"
          data-bs-dismiss="modal"
          disabled={WorkerClass.getInstance().getinfo().goodsAndServices.Food + (inputValue as number) > WorkerClass.getInstance().getinfo().population.population_level}
        >
          Submit
        </button>
      </div>
    );
  }
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>, key: string) => {
    const value = event.target.value;
    const numberValue = parseFloat(value);
    let isValid = true;

    const workerInfo = WorkerClass.getInstance().getinfo();
    const capitalistInfo = CapitalistClass.getInstance().getinfo();
    const boardInfo = Board.getInstance().getinfo();
    console.log("workerInfo:", workerInfo);
    console.log("capitalistInfo:", capitalistInfo);
    console.log("boardInfo:", boardInfo);
    console.log("numberValue:", numberValue);
    if (key === 'Influence-WorkerClass') {
      isValid = !isNaN(numberValue) && numberValue >= 0 && numberValue <= workerInfo.goodsAndServices.Influence;
    }
    else if (key === 'Influence-Capitalistclass') {
      isValid = !isNaN(numberValue) && numberValue >= 0 && numberValue <= capitalistInfo.goodsAndServices.Influence;
    }
    if (key === 'Import') {
      const itemPrice = Board.getInstance().goodsPrices('Food');
      isValid = !isNaN(numberValue) && numberValue > 0 && numberValue <= workerInfo.population.population_level &&
        workerInfo.income >= (10 + itemPrice) * numberValue;
      console.log("ok" + isValid + itemPrice + numberValue);
    } else if (key === 'CapitalistClass') {
      const itemPrice = capitalistInfo.goodsPrices['Food'];
      isValid = !isNaN(numberValue) && numberValue > 0 && numberValue <= workerInfo.population.population_level &&
        numberValue <= capitalistInfo.goodsAndServices['Food'] &&
        workerInfo.income >= itemPrice * numberValue;
    }
    if (isValid || value === '') {
      if (key === 'Influence-WorkerClass') {
        setWorkerInfluence(numberValue);
      } else if (key === 'Influence-Capitalistclass') {
        setCapitalistInfluence(numberValue);
      }
      setInputValue(numberValue);
      console.log("set" + { numberValue });
    }
  };
  const handleBuyingSubmit = (event: React.MouseEvent<HTMLButtonElement>, source: string) => {
    if (typeof inputValue === 'number') {
      if (source === 'CapitalistClass') {
        WorkerClass.getInstance().addincome(-CapitalistClass.getInstance().getinfo().goodsPrices.Food * inputValue);
        CapitalistClass.getInstance().AddRevenue(CapitalistClass.getInstance().getinfo().goodsPrices.Food * inputValue);
        CapitalistClass.getInstance().addgoodsAndServices('Food', -inputValue);
      }
      else {
        WorkerClass.getInstance().addincome((Board.getInstance().goodsPrices('Food') + 8) * inputValue);
        Board.getInstance().updateStateTreasury((Board.getInstance().goodsPrices('Food')) * inputValue);
      }
      console.log('Submitted value:', inputValue);
      WorkerClass.getInstance().Buying(inputValue, 'Food');
    }
  };
  return (<>
    <>{first && handleInitialization()}</>
    <div className="d-flex">
      <div className="p-2 flex-fill">Phase: {gameState.phase}</div>
      <div className="p-2 flex-fill">Turn: {gameState.currentTurn}</div>
      <div className="p-2 flex-fill">Round: {gameState.currentRound}</div>
      <div className="p-2 flex-fill">player: {gameState.nowclass instanceof WorkerClass ? <div>WorkerClass</div> : <div>CapitalistClass</div>}</div>
      <button onClick={handleInitialization}>initialization</button>
      <button onClick={updateData}>information</button>
    </div>
    {DataTable(data)}
    {gameState.phase === 'Action' && <ActionToggle
      nowclass={gameState.nowclass}
      onActionComplete={() => handleNextRound()}
      usedBasicActions={usedBasicActions}
      usedfreeActions={usedfreeActions}
      setBasicAction={() => setUsedBasicActions(true)}
      setfreeAction={() => setUsedFreeActions(true)}
    />}
    {gameState.phase === 'Production' && <button type="button" className="btn btn-secondary" onClick={Production1}>Production</button>}
    {showInitializationModal && (
      <div className="modal fade show" style={{ display: 'block' }} aria-modal="true" role="dialog">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Game Initialized</h5>
            </div>
            <div className="modal-body">
              <p>The game is ready to play!</p>
              <button type="button" className="btn btn-secondary" onClick={() => { WorkerClass.getInstance().addWorker("Agriculture", null); handleCloseModal(); }}>Agriculture</button>
              <button type="button" className="btn btn-secondary" onClick={() => { WorkerClass.getInstance().addWorker("Luxury", null); handleCloseModal(); }}>Luxury</button>
              <button type="button" className="btn btn-secondary" onClick={() => { WorkerClass.getInstance().addWorker("Healthcare", null); handleCloseModal(); }}>Healthcare</button>
              <button type="button" className="btn btn-secondary" onClick={() => { WorkerClass.getInstance().addWorker("Education", null); handleCloseModal(); }}>Education</button>
              <button type="button" className="btn btn-secondary" onClick={() => { WorkerClass.getInstance().addWorker("Media", null); handleCloseModal(); }}>Media</button>
            </div>
            <div className="modal-footer">
            </div>
          </div>
        </div>
      </div>)}
    {showEatingModal && (
      <div className="modal fade show" style={{ display: 'block' }} aria-modal="true" role="dialog">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">fininsh worker</h5>
            </div>
            <div className="modal-body">
              <p>The game is ready to play!</p>
              {renderBuyingOptions()}
              <button type="button" className="btn btn-secondary" onClick={() => { WorkerClass.getInstance().using('Food'); setEatingModal(false); Production2(); }}
                disabled={WorkerClass.getInstance().getinfo().goodsAndServices.Food < WorkerClass.getInstance().getinfo().population.population_level}>
                Using </button>
            </div>
            <div className="modal-footer">
            </div>
          </div>
        </div>
      </div>)}
    {showVotingModal === 1 && (
      <div className="modal fade show " style={{ display: 'block' }} data-bs-backdrop="static" data-bs-keyboard="false" tabIndex={-1} aria-hidden="true" >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Voting</h5>
            </div>
            <div className="modal-body">
              <p>The game is ready to play!</p>
              {RenderVotingOptions()}
              {votingName ? (
                <h3>
                  {votingName}
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => { setVotingmodel(2) }}
                  >
                    Using
                  </button>
                </h3>
              ) : (
                <button>No voting options available.</button>
              )}
              <button className="btn btn-primary" type="button" onClick={() => { setVotingmodel(2) }}
              >
                Using </button>
            </div>
            <div className="modal-footer">
            </div>
          </div>
        </div>
      </div >)
    }
    {showVotingModal === 2 && (
      <div className="modal fade show " style={{ display: 'block' }} data-bs-backdrop="static" data-bs-keyboard="false" tabIndex={-1} aria-hidden="true" >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">voting + {votingName}</h5>
            </div>
            <div className="modal-body">
              <div>the workerclass has {Board.getInstance().checkAgree(WorkerClass.getInstance())}</div>
              <div>the Capitalistclass has {Board.getInstance().checkAgree(CapitalistClass.getInstance())}</div>
              <div className="input-group mb-3">
                {Board.getInstance().checkAgree(WorkerClass.getInstance()) === "no" && <div>WorkerClass
                  <button className="btn btn-primary" onClick={() => Board.getInstance().setAgree(WorkerClass.getInstance(), true)}
                  >
                    agree</button>
                  <button className="btn btn-primary" onClick={() => Board.getInstance().setAgree(WorkerClass.getInstance(), false)}
                  >
                    disagree</button></div>}
                {Board.getInstance().checkAgree(CapitalistClass.getInstance()) === "no" && <div>CapitalistClass
                  <button className="btn btn-primary" onClick={() => Board.getInstance().setAgree(CapitalistClass.getInstance(), true)}
                  >
                    agree</button>
                  <button className="btn btn-primary" onClick={() => Board.getInstance().setAgree(CapitalistClass.getInstance(), false)}>
                    disagree</button></div>}
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal"
                  onClick={() => { setVotingmodel(3), Board.getInstance().Votingforbag() }}>
                  Close</button>
              </div>
            </div>
          </div>
        </div>
      </div>)}
    {showVotingModal === 3 && (
      <div className="modal fade show " style={{ display: 'block' }} data-bs-backdrop="static" data-bs-keyboard="false" tabIndex={-1} aria-hidden="true"  >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">voting + {votingName}</h5>
            </div>
            <div className="modal-body">
              <div>the worker has {Board.getInstance().getinfo().Votingresult.Workerclass}</div>
              <div>the Capitalistclass has {Board.getInstance().getinfo().Votingresult.Capitalistclass}</div>
              <div className="input-group mb-3">
                <span className="input-group-text" id="basic-addon1">Number</span>
                <input
                  type="text"
                  className="form-control"
                  aria-label="Input number"
                  value={inputValue}
                  onChange={(event) => handleInputChange(event, 'Influence-WorkerClass')}
                />
              </div>
              <button className="btn btn-primary" type="button"
                onClick={() => { setVotingmodel(4) }}>Submit</button>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            </div>
          </div>
        </div>
      </div>)}
    {showVotingModal === 4 && (
      <div className="modal fade show " style={{ display: 'block' }} data-bs-backdrop="static" data-bs-keyboard="false" tabIndex={-1} aria-hidden="true"  >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">voting + {votingName}</h5>
            </div>
            <div className="modal-body">
              <div>the worker has {Board.getInstance().getinfo().Votingresult.Workerclass}</div>
              <div>the Capitalistclass has {Board.getInstance().getinfo().Votingresult.Capitalistclass}</div>
              <div className="input-group mb-3">
                <span className="input-group-text" id="basic-addon1">Number</span>
                <input
                  type="text"
                  className="form-control"
                  aria-label="Input number"
                  value={inputValue}
                  onChange={(event) => handleInputChange(event, 'Influence-Capitalistclass')}
                />
              </div>
              <div>wewewewe</div>
              <button onClick={() => (Board.getInstance().Voting3(workerInfluence!, capitalistInfluence!, votingName!), RenderVotingOptions())} >Submit</button>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            </div>
          </div>
        </div>
      </div>)}
    {showEndModal === true && (
      <div className="modal fade show " style={{ display: 'block' }} data-bs-backdrop="static" data-bs-keyboard="false" tabIndex={-1} aria-hidden="true" >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">gameend</h5>
            </div>
            <div className="modal-body">
              <div>Workerclass get {WorkerClass.getInstance().getinfo().score}</div>
              <div>CapitalistClass get {CapitalistClass.getInstance().getinfo().Score}</div>
              <h1>the winer is {winer}</h1>
            </div>
            <button onClick={handleInitialization}>initialization</button>
            <div className="modal-footer">
            </div>
          </div>
        </div>
      </div >)
    }
  </>);
};
const ActionToggle: React.FC<ActionToggleProps> = ({ nowclass, onActionComplete, usedBasicActions, usedfreeActions, setBasicAction, setfreeAction }) => {
  const [activePath, setActivePath] = useState<number[]>([]);
  const [votingName, setVotingName] = useState<keyof Policy>('Fiscal');
  const [Usingitem, setUsingitem] = useState<keyof GoodsAndServices>('Health');
  const [usingworker, setusingworker] = useState<Worker>();
  const [usingcompany, setusingcompany] = useState<Company>();
  const [votingrapidly, setvotingrapidly] = useState(false);
  const [inputValue, setInputValue] = useState<number | string>('');
  const [submitcondition, setsubmitcondition] = useState(false);
  const [buyingtime, setbuyingtime] = useState(0);
  const [Assigntime, setAssigntime] = useState(0);
  const [Striketime, setStriketime] = useState(0);
  const [workerInfluence, setWorkerInfluence] = useState<number | null>(null);
  const [capitalistInfluence, setCapitalistInfluence] = useState<number | null>(null);
  const [clickedButtons, setClickedButtons] = useState({ 'Food1': false, 'Food2': false, 'health1': false, 'health2': false, 'Luxury1': false, 'Luxury2': false, 'Education1': false, 'Education2': false });
  const info = nowclass instanceof WorkerClass
    ? WorkerClass.getInstance().getinfo()
    : CapitalistClass.getInstance().getinfo();
  const openModalWithVoting = (name: keyof Policy) => {
    setVotingName(name);
  };
  const actions: Actions = {
    basic: [
      {
        label: 'Propose Bill',
        visibleFor: ['WorkerClass', 'CapitalistClass'],
        subActions: [
          {
            label: 'Fiscal',
            databstarget: 'Votingbill',
            visibleFor: ['WorkerClass', 'CapitalistClass'],
            onClick: () => openModalWithVoting('Fiscal'),
          },
          {
            label: 'Labor',
            databstarget: 'Votingbill',
            visibleFor: ['WorkerClass', 'CapitalistClass'],
            onClick: () => openModalWithVoting('Labor')
          },
          {
            label: 'Taxation',
            databstarget: 'Votingbill',
            visibleFor: ['WorkerClass', 'CapitalistClass'],
            onClick: () => openModalWithVoting('Taxation')
          },
          {
            label: 'Health',
            databstarget: 'Votingbill',
            visibleFor: ['WorkerClass', 'CapitalistClass'],
            onClick: () => openModalWithVoting('Health')
          },
          {
            label: 'Education',
            databstarget: 'Votingbill',
            visibleFor: ['WorkerClass', 'CapitalistClass'],
            onClick: () => openModalWithVoting('Education')
          },
          {
            label: 'Foreign',
            databstarget: 'Votingbill',
            visibleFor: ['WorkerClass', 'CapitalistClass'],
            onClick: () => openModalWithVoting('Foreign')
          },
          {
            label: 'Immigration',
            databstarget: 'Votingbill',
            visibleFor: ['WorkerClass', 'CapitalistClass'],
            onClick: () => openModalWithVoting('Immigration')
          }
        ]
      },
      {
        label: 'Assign Worker',
        databstarget: 'AssignWorker',
        visibleFor: ['WorkerClass']
      },
      {
        label: 'Build Company',
        databstarget: 'BuildCompany',
        visibleFor: ['CapitalistClass']
      },
      {
        label: 'Sell Company',
        databstarget: 'SellCompany',
        visibleFor: ['CapitalistClass']
      },
      {
        label: 'Sell To The Foreign Market',
        databstarget: 'ForeignMarket',
        visibleFor: ['CapitalistClass']
      },
      {
        label: 'Make Business Deal',
        databstarget: 'BusinessDeal',
        visibleFor: ['CapitalistClass']
      },
      {
        label: 'Lobby',
        onClick: () => handleLobby(),
        visibleFor: ['CapitalistClass']
      },
      {
        label: 'Buy Goods&Services',
        visibleFor: ['WorkerClass'],
        subActions: [
          {
            label: 'Food',
            databstarget: 'Buying',
            visibleFor: ['WorkerClass'],
            onClick: () => setUsingitem('Food'),
          },
          {
            label: 'Education',
            databstarget: 'Buying',
            visibleFor: ['WorkerClass'],
            onClick: () => setUsingitem('Education'),
          },
          {
            label: 'Health',
            databstarget: 'Buying',
            visibleFor: ['WorkerClass'],
            onClick: () => setUsingitem('Health'),
          },
          {
            label: 'Luxury',
            databstarget: 'Buying',
            visibleFor: ['WorkerClass'],
            onClick: () => setUsingitem('Luxury'),
          },
          {
            label: 'Influence',
            databstarget: 'Buying',
            visibleFor: ['WorkerClass'],
            onClick: () => setUsingitem('Influence'),
          },
        ]
      },
      {
        label: 'Strike',
        databstarget: 'Strike',
        visibleFor: ['WorkerClass']
      },
      {
        label: 'DemonStration',
        databstarget: 'DemonStration',
        visibleFor: ['WorkerClass']
      },
      {
        label: 'Apply Political Pressure',
        onClick: () => PoliticalPressure(),
        visibleFor: ['WorkerClass', 'CapitalistClass'],
      }
    ],
    free: [
      { label: 'UseHealthcare', databstarget: 'Using', onClick: () => setUsingitem('Health'), visibleFor: ['WorkerClass'] },
      { label: 'Use Education', databstarget: 'Using', onClick: () => setUsingitem('Education'), visibleFor: ['WorkerClass'] },
      { label: 'Use Luxury', databstarget: 'Using', onClick: () => setUsingitem('Luxury'), visibleFor: ['WorkerClass'] },
      { label: 'Swap workers', databstarget: 'SwapWorker', visibleFor: ['WorkerClass'] },
      { label: 'Adjust Wages', databstarget: 'AdjustWages', visibleFor: ['CapitalistClass'] }, {
        label: 'Adjust Prices', databstarget: 'Adjust Prices', visibleFor: ['CapitalistClass'], subActions: [
          {
            label: 'Food',
            databstarget: 'AdjustPrices',
            visibleFor: ['CapitalistClass'],
            onClick: () => setUsingitem('Food'),
          },
          {
            label: 'Education',
            databstarget: 'AdjustPrices',
            visibleFor: ['CapitalistClass'],
            onClick: () => setUsingitem('Education'),
          },
          {
            label: 'Health',
            databstarget: 'AdjustPrices',
            visibleFor: ['CapitalistClass'],
            onClick: () => setUsingitem('Health'),
          },
          {
            label: 'Luxury',
            databstarget: 'AdjustPrices',
            visibleFor: ['CapitalistClass'],
            onClick: () => setUsingitem('Luxury'),
          },
        ]
      },

      { label: 'Give Bonus', databstarget: 'GiveBonus', visibleFor: ['CapitalistClass'] },
      {
        label: 'Buy Storage', databstarget: 'Buy Storage', visibleFor: ['CapitalistClass'], subActions: [
          { label: 'Food', onClick: () => (CapitalistClass.getInstance().BuyStorage('Food'), setfreeAction()), visibleFor: ['CapitalistClass'], },
          { label: 'Health', onClick: () => (CapitalistClass.getInstance().BuyStorage('Health'), setfreeAction()), visibleFor: ['CapitalistClass'], },
          { label: 'Luxury', onClick: () => (CapitalistClass.getInstance().BuyStorage('Luxury'), setfreeAction()), visibleFor: ['CapitalistClass'], },
          { label: 'Education', onClick: () => (CapitalistClass.getInstance().BuyStorage('Education'), setfreeAction()), visibleFor: ['CapitalistClass'], },
        ]
      },
      { label: 'pay the loan', databstarget: 'loan', visibleFor: ['WorkerClass', 'CapitalistClass'] },
    ]
  };
  const handleActionClick = (path: number[], action: Action) => {
    console.log("Current Path:", path);
    console.log("Active Path Before:", activePath);

    if (action.onClick) {
      action.onClick();
    }

    if (action.subActions) {
      if (arraysEqual(activePath, path)) {
        // Close the sub-menu if it is already open
        setActivePath([]);
      } else {
        // Open the sub-menu
        setActivePath([...path]);
      }
    } else {
      // Reset the active path if there are no sub-actions
      setActivePath([]);
    }

    console.log("Active Path After:", path);
  };
  const renderActions = (actionList: Action[], path: number[], keyPrefix: string) => {
    const className = nowclass instanceof WorkerClass ? 'WorkerClass' : 'CapitalistClass';

    if (keyPrefix === 'basic' && usedBasicActions) {
      if (buyingtime === 1) {
        const buyingAction = actionList.find(action => action.label === 'Buy Goods&Services' && action.visibleFor.includes(className));
        if (buyingAction && buyingAction.subActions) {
          return buyingAction.subActions.filter(subAction => subAction.visibleFor.includes(className)).map((subAction, index) => {
            const currentPath = [...path, index];
            const isActive = arraysEqual(activePath, currentPath);
            console.log("Buying Action Path:", activePath, currentPath);
            return (
              <div key={index} style={{ padding: '10px' }}>
                <button type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target={"#" + subAction.databstarget} onClick={() => handleActionClick(currentPath, subAction)}>{subAction.label}</button>
                {isActive && subAction.subActions && (
                  <div style={{ marginLeft: '20px' }}>
                    {renderActions(subAction.subActions, currentPath, keyPrefix)}
                  </div>
                )}
              </div>
            );
          });
        }
        return <div key="completed">No Buying Actions Available</div>;
      }

      if (0 < Assigntime && Assigntime < 4) {
        const assignWorkerAction = actionList.find(action => action.label === 'Assign Worker' && action.visibleFor.includes(className));
        if (assignWorkerAction) {
          const currentPath = [...path];
          const isActive = arraysEqual(activePath, currentPath);
          console.log("Assign Worker Path:", activePath, currentPath);
          return (
            <div key="assign-worker" style={{ padding: '10px' }}>
              <button type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target={"#" + assignWorkerAction.databstarget} onClick={() => handleActionClick(currentPath, assignWorkerAction)}>
                {assignWorkerAction.label}
              </button>
              {isActive && assignWorkerAction.subActions && (
                <div style={{ marginLeft: '20px' }}>
                  {renderActions(assignWorkerAction.subActions, currentPath, keyPrefix)}
                </div>
              )}
            </div>
          );
        }
        return <div key="completed">No Assign Worker Actions Available</div>;
      }

      if (Striketime === 1) {
        const strikeAction = actionList.find(action => action.label === 'Strike' && action.visibleFor.includes(className));
        if (strikeAction) {
          const currentPath = [...path];
          const isActive = arraysEqual(activePath, currentPath);
          console.log("Strike Action Path:", activePath, currentPath);
          return (
            <div key="strike" style={{ padding: '10px' }}>
              <button type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target={"#" + strikeAction.databstarget} onClick={() => handleActionClick(currentPath, strikeAction)}>
                {strikeAction.label}
              </button>
              {isActive && strikeAction.subActions && (
                <div style={{ marginLeft: '20px' }}>
                  {renderActions(strikeAction.subActions, currentPath, keyPrefix)}
                </div>
              )}
            </div>
          );
        }
        return <div key="completed">No Strike Actions Available</div>;
      }

      return <div key="completed">已完成</div>;
    }

    if (keyPrefix === 'free' && usedfreeActions) {
      return <div key="completed">已完成</div>;
    }

    return actionList.filter(action => action.visibleFor.includes(className)).map((action, index) => {
      const currentPath = [...path, index];
      const isActive = arraysEqual(activePath, currentPath);
      if (action.subActions && action.subActions.length > 0) {
        console.log("Other Action Path:", "activepath", activePath, currentPath, index, path);
        return (
          <div key={index} style={{ padding: '10px' }}>
            <button onClick={() => handleActionClick(currentPath, action)} className="btn btn-primary">{action.label}</button>
            {isActive && (
              <div style={{ marginLeft: '20px' }}>
                {renderActions(action.subActions, currentPath, keyPrefix)}
              </div>
            )}
          </div>
        );
      } else {
        return (
          <div key={index} style={{ padding: '10px' }}>
            <button type="button" className="btn btn-primary"
              {...(action.databstarget ? { 'data-bs-target': `#${action.databstarget}`, 'data-bs-toggle': "modal" } : {})} onClick={() => handleActionClick(currentPath, action)}>{action.label}</button>
          </div>
        );
      }
    });
  };
  const renderBuyingOptions = (item: keyof GoodsAndServices) => {
    const sources = {
      'Food': [
        { source: 'CapitalistClass' },
        { source: 'Import', getInstance: () => null }
      ],
      'Luxury': [
        { source: 'CapitalistClass' },
        { source: 'Import' }
      ],
      'Health': [
        { source: 'CapitalistClass' },
        { source: 'State' },
      ],
      'Education': [
        { source: 'CapitalistClass' },
        { source: 'State' },
      ],
      'Influence': [
        { source: 'State' },
      ]
    };

    return sources[item].map(({ source }) => (
      <div key={source}>
        <div>
          {`from ${source}`}
          <input
            type="text"
            className="form-control"
            aria-label="Input number"
            value={inputValue}
            onChange={(event) => handleInputChange(event, source)}
          />
          <button
            onClick={(event) => handleBuyingSubmit(event, source)}
            className="btn btn-primary"
            type="button"
            data-bs-dismiss="modal"
            disabled={source === 'CapitalistClass' && submitcondition}
          >
            Submit
          </button>
        </div>
      </div>
    ));
  }
  const handleVote = (option: string) => {
    if (votingrapidly) {
      Board.getInstance().Votingrapidly(
        votingName,
        nowclass,
        option,
        () => {
          if (nowclass instanceof WorkerClass) {
            WorkerClass.getInstance().getinfo().goodsAndServices.Influence--;
          }
          else {
            CapitalistClass.getInstance().getinfo().goodsAndServices.Influence--;
          }
          setBasicAction();
        },
        (error) => {
          alert(error);
        }
      );
    }
    else {
      Board.getInstance().votingabill(
        votingName,
        option,
        nowclass,
        () => {
          setBasicAction();
        },
        (error) => {
          alert(error);
        }
      );
    }
  };
  const handleUsing = () => {
    WorkerClass.getInstance().using(
      Usingitem,
    );
    setfreeAction();
  };
  const handleloan = () => {
    WorkerClass.getInstance().payoffloan(
      () => {
        setfreeAction();
        return (<div data-bs-dismiss="modal" />)
      },
      (error) => {
        alert(error);
      }
    );
  };
  const handleNextRound = () => {
    setStriketime(0);
    setbuyingtime(0);
    setAssigntime(0);
    onActionComplete();
  }
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>, key: String) => {
    const value = event.target.value;
    const numberValue = parseFloat(value);
    let isValid = true;

    const workerInfo = WorkerClass.getInstance().getinfo();
    const capitalistInfo = CapitalistClass.getInstance().getinfo();
    const boardInfo = Board.getInstance().getinfo();
    console.log("workerInfo:", workerInfo);
    console.log("capitalistInfo:", capitalistInfo);
    console.log("boardInfo:", boardInfo);
    console.log("numberValue:", numberValue);

    if (key === 'Influence-WorkerClass') {
      isValid = !isNaN(numberValue) && numberValue >= 0 && numberValue <= workerInfo.goodsAndServices.Influence;
    }
    else if (key === 'Influence-Capitalistclass') {
      isValid = !isNaN(numberValue) && numberValue >= 0 && numberValue <= capitalistInfo.goodsAndServices.Influence;
    }
    else if (key === 'CapitalistClass') {
      const itemPrice = capitalistInfo.goodsPrices[Usingitem as keyof CapitalistGoodsAndServices];
      isValid = !isNaN(numberValue) && numberValue > 0 && numberValue <= workerInfo.population.population_level && numberValue <= capitalistInfo.goodsAndServices[Usingitem as keyof CapitalistGoodsAndServices] &&
        workerInfo.income >= itemPrice * numberValue;
    } else if (key === 'State') {
      const itemPrice = Board.getInstance().goodsPrices(Usingitem as keyof StategoodsAndServices);
      console.log("itemPrice (State):", itemPrice, Usingitem);
      if (Usingitem === 'Health' || Usingitem === 'Education') {
        isValid = !isNaN(numberValue) && numberValue > 0 && numberValue <= workerInfo.population.population_level && numberValue <= boardInfo.goodsAndServices[Usingitem as keyof StategoodsAndServices] &&
          workerInfo.income >= itemPrice * numberValue;
      }
      if (Usingitem === 'Influence') {
        isValid = !isNaN(numberValue) && numberValue > 0 && numberValue <= workerInfo.population.population_level && numberValue <= boardInfo.goodsAndServices[Usingitem as keyof StategoodsAndServices] &&
          workerInfo.income >= itemPrice * numberValue;
      }
      console.log(itemPrice * numberValue);
    } else if (key === 'Import') {
      const itemPrice = Board.getInstance().goodsPrices(Usingitem as keyof StategoodsAndServices);

      if (Usingitem === 'Food') {
        isValid = !isNaN(numberValue) && numberValue > 0 && numberValue <= workerInfo.population.population_level &&
          workerInfo.income >= (10 + itemPrice) * numberValue;
        console.log("ok" + isValid + itemPrice + numberValue)
      }
      if (Usingitem === 'Luxury') {
        isValid = !isNaN(numberValue) && numberValue > 0 && numberValue <= workerInfo.population.population_level &&
          workerInfo.income >= (8 + itemPrice) * numberValue;
      }
    } else {
      const itemPrice = boardInfo.goodsAndServices[Usingitem as keyof StategoodsAndServices];
      isValid = !isNaN(numberValue) && numberValue > 0 && numberValue <= workerInfo.population.population_level && numberValue <= boardInfo.goodsAndServices[Usingitem as keyof StategoodsAndServices] &&
        workerInfo.income >= itemPrice * numberValue;
    }

    if (isValid || value === '') {
      if (key === 'Influence-WorkerClass') {
        setWorkerInfluence(numberValue);
      } else if (key === 'Influence-Capitalistclass') {
        setCapitalistInfluence(numberValue);
      }

      setInputValue(numberValue);


      console.log("set" + { numberValue })
    }
    setsubmitcondition(isValid);
  };
  const handleVotingSubmit = () => {
    console.log('Submitted value:', inputValue);
    Board.getInstance().Voting2(workerInfluence!, capitalistInfluence!);
  };
  const handleBuyingSubmit = (event: React.MouseEvent<HTMLButtonElement>, source: string) => {
    if (typeof inputValue === 'number') {
      if (source === 'CapitalistClass') {
        WorkerClass.getInstance().addincome(-CapitalistClass.getInstance().getinfo().goodsPrices[Usingitem as keyof CapitalistGoodsAndServices] * inputValue);
        CapitalistClass.getInstance().AddRevenue(CapitalistClass.getInstance().getinfo().goodsPrices[Usingitem as keyof CapitalistGoodsAndServices] * inputValue);
        CapitalistClass.getInstance().addgoodsAndServices(Usingitem, -inputValue);
      }
      else if (source === 'State') {
        console.log("State" + Board.getInstance().goodsPrices(Usingitem as keyof StategoodsAndServices) + inputValue)
        WorkerClass.getInstance().addincome(-Board.getInstance().goodsPrices(Usingitem as keyof StategoodsAndServices) * inputValue);
        Board.getInstance().updateStateTreasury(Board.getInstance().goodsPrices(Usingitem as keyof StategoodsAndServices) * inputValue);
        Board.getInstance().addPublicService(Usingitem, -inputValue);
      }
      else {
        if (Usingitem === 'Health') {
          WorkerClass.getInstance().addincome(Board.getInstance().goodsPrices(Usingitem as keyof StategoodsAndServices + 10) * inputValue);
          Board.getInstance().updateStateTreasury(Board.getInstance().goodsPrices(Usingitem as keyof StategoodsAndServices) * inputValue);
        }
        else {
          WorkerClass.getInstance().addincome(Board.getInstance().goodsPrices(Usingitem as keyof StategoodsAndServices + 8) * inputValue);
          Board.getInstance().updateStateTreasury(Board.getInstance().goodsPrices(Usingitem as keyof StategoodsAndServices) * inputValue);
        }

      }
      console.log('Submitted value:', inputValue);

      WorkerClass.getInstance().Buying(inputValue, Usingitem);
      setBasicAction();
      setbuyingtime(prev => (prev === 0 ? 1 : 0));
    }
  };
  const PoliticalPressure = () => {
    Board.getInstance().addVotingbag(3, nowclass);
    setBasicAction();
  }
  const AssignWorker = (location: Company) => {
    WorkerClass.getInstance().updateWorker(usingworker!, location);
    setBasicAction();
    setAssigntime(prev => (prev === 2 ? 0 : prev + 1));
  }
  const AssignWorkerunion = (location: keyof Population["Natureofposition"]) => {
    WorkerClass.getInstance().addunion(location);
    Board.getInstance().removeworker(usingworker!);
    setBasicAction();
    setAssigntime(prev => (prev === 2 ? 0 : prev + 1));
  }
  const handleStrike = (company: Company) => {
    company.Strike = true;
    setStriketime(prev => (prev === 0 ? 1 : 0));
    setBasicAction();
  }
  const calculateRemainingPositions = () => {
    let sum = 0;
    Board.getInstance().getinfo().companys.map((company: Company, index: React.Key | null | undefined) => (
      sum += company.requiredWorkers,
      sum -= company.workingworkers.length
    ))
    CapitalistClass.getInstance().getinfo().companys.map((company: Company, index: React.Key | null | undefined) => (
      sum += company.requiredWorkers,
      sum -= company.workingworkers.length
    ))
    return sum;
  }
  const handleDemonStration = () => {
    Board.getInstance().setDemonStration(true);
    setBasicAction();
  }
  const handleBuildCompany = (company: Company) => {
    const capitalistInstance = CapitalistClass.getInstance();
    const capitalistInfo = capitalistInstance.getinfo();
    const totalFunds = capitalistInfo.Revenue + capitalistInfo.Capitalist;

    if (totalFunds > company.cost) {
      try {
        capitalistInstance.BuildCompany(company);
        setBasicAction();
      } catch (error) {
        alert(error);
      }
    } else {
      alert('Insufficient funds to build the company');
    }
  }
  const handleSellCompany = (company: Company) => {
    CapitalistClass.getInstance().SellCompay(company);
    setBasicAction();
  }
  const handleAdjustPrices = (price: number) => {
    CapitalistClass.getInstance().AdjustPrices(Usingitem, price);
    setfreeAction();
  }
  const handleAdjustWages = (price: number) => {
    CapitalistClass.getInstance().Adjustwages(usingcompany as CapitalistCompany, price);
    setfreeAction();
  }
  const handleBusinessDeal = (BusinessDeal: number) => {
    if (CapitalistClass.getInstance().getinfo().Revenue + CapitalistClass.getInstance().getinfo().Capitalist >= Board.getInstance().getinfo().BusinessDeal[BusinessDeal].price +
      Board.getInstance().getinfo().BusinessDeal[BusinessDeal].tax[Board.getInstance().getinfo().Policy.Foreign]) {
      CapitalistClass.getInstance().makebussinesduel(BusinessDeal);
      setBasicAction();
    } else {
      alert('Insufficient funds to buy items');
    }
  }
  const handleLobby = () => {
    if (CapitalistClass.getInstance().getinfo().Revenue + CapitalistClass.getInstance().getinfo().Capitalist >= 30) {
      CapitalistClass.getInstance().Lobby();
      setBasicAction();
    }
    else {
      alert('Insufficient funds to Lobby');
    }
  }
  const handleForeignMarket = (key: string, exportItem: Item) => {
    CapitalistClass.getInstance().selltoForeignMarket(exportItem);
    setClickedButtons((prev) => ({ ...prev, [key]: true }));
    setBasicAction();
  };
  const handleGiveBonus = (company: Company) => {
    CapitalistClass.getInstance().GiveBonus(company as CapitalistCompany);
    setfreeAction();
  }
  return (
    <div className="container">
      <div className="d-flex justify-content-center" id="menu">
        {Object.entries(actions).map(([key, actionList]) => (
          <div className="pp-2 flex-fill" key={key}>
            <div className="text-center">
              <h3>{key.charAt(0).toUpperCase() + key.slice(1)} Actions</h3>
              {renderActions(actionList, [], key)}
            </div></div>
        ))}</div>
      {usedBasicActions && <button className="btn btn-primary" onClick={handleNextRound}>Next Round</button>}
      <div className="modal fade" id="Votingbill" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex={-1} aria-labelledby="staticBackdropLabel" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="staticBackdropLabel">{votingName}</h1>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div>{votingName}`s 当前政策{Board.getInstance().getinfo().Policy[votingName]}{votingrapidly ? <p>ok</p> : <p>not</p>}
            </div>
            <div className="modal-body">
              <div className="d-flex justify-content-center" >
                <div>
                  <button type="button" style={{ margin: '10px' }} className="btn btn-primary pp-2 flex-fill" onClick={() => setvotingrapidly(true)}
                    disabled={!(!votingrapidly && info.goodsAndServices.Influence > 0)}>Voting rapidly</button>
                  <button type="button" style={{ margin: '10px' }} className="btn btn-primary pp-2 flex-fill" onClick={() => setvotingrapidly(false)}
                    disabled={!votingrapidly}>Voting after Production</button>
                </div>
                <div>
                  <button type="button" style={{ margin: '10px' }} className="btn btn-primary pp-2 flex-fill" onClick={() => handleVote('A')}
                    data-bs-toggle={votingrapidly ? "modal" : undefined}
                    data-bs-target={votingrapidly ? "#Votingwithagree1" : undefined}
                    disabled={usedBasicActions}>A</button>
                  <button type="button" style={{ margin: '10px' }} className="btn btn-primary pp-2 flex-fill" onClick={() => handleVote('B')}
                    data-bs-toggle={votingrapidly ? "modal" : undefined}
                    data-bs-target={votingrapidly ? "#Votingwithagree1" : undefined}
                    disabled={usedBasicActions}>B</button>
                  <button type="button" style={{ margin: '10px' }} className="btn btn-primary pp-2 flex-fill" onClick={() => handleVote('C')}
                    data-bs-toggle={votingrapidly ? "modal" : undefined}
                    data-bs-target={votingrapidly ? "#Votingwithagree1" : undefined}
                    disabled={usedBasicActions}>C</button>
                </div>
              </div>
              <label data-bs-dismiss="modal" aria-label="Close" />
            </div>
            {usedBasicActions && <p>action done</p>}
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            </div>
          </div>
        </div>
      </div>
      <div className="modal fade " id="Votingwithagree1" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex={-1} aria-labelledby="staticBackdropLabel" aria-hidden="true" >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">voting + {votingName}</h5>
            </div>
            <div className="modal-body">
              <div>the workerclass has {Board.getInstance().checkAgree(WorkerClass.getInstance())}</div>
              <div>the Capitalistclass has {Board.getInstance().checkAgree(CapitalistClass.getInstance())}</div>
              <div className="input-group mb-3">
                {Board.getInstance().checkAgree(WorkerClass.getInstance()) === "no" && <div>WorkerClass
                  <button data-bs-dismiss="modal" data-bs-toggle="modal" className="btn btn-primary" onClick={() => Board.getInstance().setAgree(WorkerClass.getInstance(), true)}
                    data-bs-target={(Board.getInstance().checkAgree(WorkerClass.getInstance()) !== "no" && Board.getInstance().checkAgree(CapitalistClass.getInstance()) !== "no") ? "#Voting_WorkerClass" : "#Votingwithagree2"}>
                    agree</button>
                  <button data-bs-dismiss="modal" data-bs-toggle="modal" className="btn btn-primary" onClick={() => Board.getInstance().setAgree(WorkerClass.getInstance(), false)}
                    data-bs-target={(Board.getInstance().checkAgree(WorkerClass.getInstance()) !== "no" && Board.getInstance().checkAgree(CapitalistClass.getInstance()) !== "no") ? "#Voting_WorkerClass" : "#Votingwithagree2"}>
                    disagree</button></div>}
                {Board.getInstance().checkAgree(CapitalistClass.getInstance()) === "no" && <div>CapitalistClass
                  <button data-bs-dismiss="modal" data-bs-toggle="modal" className="btn btn-primary" onClick={() => Board.getInstance().setAgree(CapitalistClass.getInstance(), true)}
                    data-bs-target={(Board.getInstance().checkAgree(WorkerClass.getInstance()) !== "no" && Board.getInstance().checkAgree(CapitalistClass.getInstance()) !== "no") ? "#Voting_WorkerClass" : "#Votingwithagree2"}>
                    agree</button>
                  <button data-bs-dismiss="modal" data-bs-toggle="modal" className="btn btn-primary" onClick={() => Board.getInstance().setAgree(CapitalistClass.getInstance(), false)}
                    data-bs-target={(Board.getInstance().checkAgree(WorkerClass.getInstance()) !== "no" && Board.getInstance().checkAgree(CapitalistClass.getInstance()) !== "no") ? "#Voting_WorkerClass" : "#Votingwithagree2"}>
                    disagree</button></div>}
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal"
                  data-bs-toggle="modal"
                  data-bs-target={(Board.getInstance().checkAgree(WorkerClass.getInstance()) !== "no" && Board.getInstance().checkAgree(CapitalistClass.getInstance()) !== "no") ? "#Voting_WorkerClass" : "#Votingwithagree2"}>
                  Close</button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="modal fade " id="Votingwithagree2" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex={-1} aria-labelledby="staticBackdropLabel" aria-hidden="true" >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">voting + {votingName}</h5>
            </div>
            <div className="modal-body">
              <div>the workerclass has {Board.getInstance().checkAgree(WorkerClass.getInstance())}</div>
              <div>the Capitalistclass has {Board.getInstance().checkAgree(CapitalistClass.getInstance())}</div>
              <div className="input-group mb-3">
                {Board.getInstance().checkAgree(WorkerClass.getInstance()) === "no" && <div>WorkerClass
                  <button data-bs-dismiss="modal" data-bs-toggle="modal" className="btn btn-primary" onClick={() => Board.getInstance().setAgree(WorkerClass.getInstance(), true)}
                    data-bs-target={(Board.getInstance().checkAgree(WorkerClass.getInstance()) !== "no" && Board.getInstance().checkAgree(CapitalistClass.getInstance()) !== "no") ? "#Voting_WorkerClass" : "#Votingwithagree1"}>
                    agree</button>
                  <button data-bs-dismiss="modal" data-bs-toggle="modal" className="btn btn-primary" onClick={() => Board.getInstance().setAgree(WorkerClass.getInstance(), false)}
                    data-bs-target={(Board.getInstance().checkAgree(WorkerClass.getInstance()) !== "no" && Board.getInstance().checkAgree(CapitalistClass.getInstance()) !== "no") ? "#Voting_WorkerClass" : "#Votingwithagree1"}>
                    disagree</button></div>}
                {Board.getInstance().checkAgree(CapitalistClass.getInstance()) === "no" && <div>CapitalistClass
                  <button data-bs-dismiss="modal" data-bs-toggle="modal" className="btn btn-primary" onClick={() => Board.getInstance().setAgree(CapitalistClass.getInstance(), true)}
                    data-bs-target={(Board.getInstance().checkAgree(WorkerClass.getInstance()) !== "no" && Board.getInstance().checkAgree(CapitalistClass.getInstance()) !== "no") ? "#Voting_WorkerClass" : "#Votingwithagree1"}>
                    agree</button>
                  <button data-bs-dismiss="modal" data-bs-toggle="modal" className="btn btn-primary" onClick={() => Board.getInstance().setAgree(CapitalistClass.getInstance(), false)}
                    data-bs-target={(Board.getInstance().checkAgree(WorkerClass.getInstance()) !== "no" && Board.getInstance().checkAgree(CapitalistClass.getInstance()) !== "no") ? "#Voting_WorkerClass" : "#Votingwithagree1"}>
                    disagree</button></div>}
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal"
                  data-bs-toggle="modal"
                  data-bs-target={(Board.getInstance().checkAgree(WorkerClass.getInstance()) !== "no" && Board.getInstance().checkAgree(CapitalistClass.getInstance()) !== "no") ? "#Voting_WorkerClass" : "#Votingwithagree1"}>
                  Close</button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="modal fade " id="Voting_WorkerClass" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex={-1} aria-labelledby="staticBackdropLabel" aria-hidden="true" >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">voting + {votingName}</h5>
            </div>
            <div className="modal-body">
              <div>the worker has {Board.getInstance().getinfo().Votingresult.Workerclass}</div>
              <div>the Capitalistclass has {Board.getInstance().getinfo().Votingresult.Capitalistclass}</div>
              <div className="input-group mb-3">
                <span className="input-group-text" id="basic-addon1">Number</span>
                <input
                  type="text"
                  className="form-control"
                  aria-label="Input number"
                  value={inputValue}
                  onChange={(event) => handleInputChange(event, 'Influence-WorkerClass')}
                />
              </div>
              <button className="btn btn-primary" type="button"
                data-bs-toggle="modal"
                data-bs-target="#Voting_Capitalistclass">Submit</button>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            </div>
          </div>
        </div>
      </div>
      <div className="modal fade " id="Voting_Capitalistclass" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex={-1} aria-labelledby="staticBackdropLabel" aria-hidden="true" >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">voting + {votingName}</h5>
            </div>
            <div className="modal-body">
              <div>the worker has {Board.getInstance().getinfo().Votingresult.Workerclass}</div>
              <div>the Capitalistclass has {Board.getInstance().getinfo().Votingresult.Capitalistclass}</div>
              <div className="input-group mb-3">
                <span className="input-group-text" id="basic-addon1">Number</span>
                <input
                  type="text"
                  className="form-control"
                  aria-label="Input number"
                  value={inputValue}
                  onChange={(event) => handleInputChange(event, 'Influence-Capitalistclass')}
                />
              </div>
              <div>wewewewe</div>
              <button onClick={handleVotingSubmit} className="btn btn-primary" type="button"
                data-bs-dismiss="modal">Submit</button>

            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            </div>
          </div>
        </div>
      </div>
      <div className="modal fade" id="Using" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex={-1} aria-labelledby="staticBackdropLabel" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="staticBackdropLabel">{Usingitem}</h1>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div>{Usingitem} have {WorkerClass.getInstance().getinfo().goodsAndServices[Usingitem]}</div>
            <div>{Usingitem === 'Education' as keyof GoodsAndServices && <p> havingunskill worker{WorkerClass.getInstance().getinfo().population.worker.filter(worker => worker.skill === "unskill").length}</p>}</div>
            <div className="modal-body">
              {WorkerClass.getInstance().getinfo().goodsAndServices[Usingitem] >= WorkerClass.getInstance().getinfo().population.population_level ?
                Usingitem === 'Education' as keyof GoodsAndServices ?
                  <button className="btn btn-primary" data-bs-target="#UsingEducation" data-bs-toggle="modal" disabled={usedfreeActions}>using</button> :
                  <button className="btn btn-primary" onClick={() => handleUsing()} disabled={usedfreeActions} data-bs-dismiss="modal">using</button> :
                <button className="btn btn-primary" onClick={() => handleUsing()} disabled={usedfreeActions}>not enough</button>
              }
            </div>
            {usedfreeActions && <p>action done</p>}
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            </div>
          </div>
        </div>
      </div>
      <div className="modal fade" id="loan" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex={-1} aria-labelledby="staticBackdropLabel" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="staticBackdropLabel">loan</h1>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div>s 当前{info.loan}</div>
            <div className="modal-body">
              {nowclass instanceof WorkerClass &&
                WorkerClass.getInstance().getinfo().loan !== 0 ?
                WorkerClass.getInstance().getinfo().income >= 50 ?
                  <button onClick={() => handleloan()} data-bs-dismiss="modal" >A</button> :
                  <div>no money</div>
                :
                <div>no loan</div>
              }
              {nowclass instanceof CapitalistClass &&
                CapitalistClass.getInstance().getinfo().loan !== 0 ?
                (CapitalistClass.getInstance().getinfo().Revenue + CapitalistClass.getInstance().getinfo().Capitalist) >= 50 ?
                  <button onClick={() => handleloan()} data-bs-dismiss="modal" >A</button> :
                  <div>no money</div>
                :
                <div>no loan</div>
              }
              {usedfreeActions && <p>action done</p>}
            </div>

            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>

            </div>
          </div>
        </div>
      </div>
      <div className="modal fade" id="UsingEducation" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex={-1} aria-labelledby="staticBackdropLabel" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="staticBackdropLabel">UsingEducation</h1>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div> having{WorkerClass.getInstance().getinfo().population.worker.filter(worker => worker.skill === "unskill").length}</div>
            <div className="modal-body">
              <div className="d-flex">
                <ul className="p-2 flex-fill">
                  <div>state</div>
                  {Board.getInstance().getinfo().companys.map((company: Company, index: React.Key | null | undefined) => (
                    <div key={index} style={{ margin: '50px' }}>
                      {company.workingworkers.filter(worker => worker.skill === "unskill").length > 0 && <Image src={company.imageUrl} alt={`Image of ${company.name}`} width={100} height={100} />}
                      {company.workingworkers.filter(worker => worker.skill === "unskill").length > 0 && company.workingworkers.map((worker: Worker, index2: React.Key | null | undefined) => (
                        <div key={index2}>{worker.skill === "unskill" && <button onClick={() => setusingworker(worker)} className="btn btn-primary" data-bs-target="#upgrade" data-bs-toggle="modal" >Train Worker</button>}</div>))}
                    </div>))}</ul>
                <ul className="p-2 flex-fill">
                  <div>CapitalistClass</div>
                  {CapitalistClass.getInstance().getinfo().companys.map((company: Company, index: React.Key | null | undefined) => (
                    <div key={index} style={{ margin: '50px' }}>
                      {company.workingworkers.filter(worker => worker.skill === "unskill").length > 0 && <Image src={company.imageUrl} alt={`Image of ${company.name}`} width={100} height={100} />}
                      {company.workingworkers.filter(worker => worker.skill === "unskill").length > 0 && company.workingworkers.map((worker: Worker, index2: React.Key | null | undefined) => (
                        <div key={index2}>{worker.skill === "unskill" && <button onClick={() => setusingworker(worker)} className="btn btn-primary" data-bs-target="#upgrade" data-bs-toggle="modal" >Train Worker</button>}</div>))}
                    </div>))}</ul>
                <ul className="p-2 flex-fill">
                  <div>unempolyment</div>
                  {Board.getInstance().getinfo().unempolyment.map((worker: Worker, index: React.Key | null | undefined) => (
                    <div key={index}>
                      {worker.skill === "unskill" && <button onClick={() => setusingworker(worker)} className="btn btn-primary" data-bs-target="#upgrade" data-bs-toggle="modal" >Train Worker</button>}
                    </div>))}
                </ul>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="modal fade" id="upgrade" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex={-1} aria-labelledby="staticBackdropLabel" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="staticBackdropLabel">upgrade</h1>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div> having{WorkerClass.getInstance().getinfo().population.worker.filter(worker => worker.skill === "unskill").length}</div>
            <div className="modal-body">
              <button type="button" className="btn btn-primary" data-bs-dismiss="modal" onClick={() => (setfreeAction(), WorkerClass.getInstance().upgrade(usingworker as Worker, 'Agriculture'))}>Agriculture</button>
              <button type="button" className="btn btn-primary" data-bs-dismiss="modal" onClick={() => (setfreeAction(), WorkerClass.getInstance().upgrade(usingworker as Worker, 'Luxury'))}>Luxury</button>
              <button type="button" className="btn btn-primary" data-bs-dismiss="modal" onClick={() => (setfreeAction(), WorkerClass.getInstance().upgrade(usingworker as Worker, 'Healthcare'))}>Healthcare</button>
              <button type="button" className="btn btn-primary" data-bs-dismiss="modal" onClick={() => (setfreeAction(), WorkerClass.getInstance().upgrade(usingworker as Worker, 'Education'))}>Education</button>
              <button type="button" className="btn btn-primary" data-bs-dismiss="modal" onClick={() => (setfreeAction(), WorkerClass.getInstance().upgrade(usingworker as Worker, 'Media'))}>Media</button>
              {usedfreeActions && <p>action done</p>}
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            </div>
          </div>
        </div>
      </div>
      <div className="modal fade" id="SwapWorker" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex={-1} aria-labelledby="staticBackdropLabel" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="staticBackdropLabel">SwapWorker</h1>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div> having{Board.getInstance().getinfo().unempolyment.filter(worker => worker.skill === 'unskill').length}</div>
            <div className="modal-body">
              <div className="d-flex">
                <ul className="p-2 flex-fill">
                  <div>state</div>
                  {Board.getInstance().getinfo().companys.map((company: Company, index: React.Key | null | undefined) => (
                    <div key={index} style={{ margin: '50px' }}>
                      {company.workingworkers.filter(worker => worker.skill === company.industry).length >= company.skilledworker && company.workingworkers.filter(worker => worker.skill !== "unskill").length > company.skilledworker
                        && <Image src={company.imageUrl} alt={`Image of ${company.name}`} width={100} height={100} />}
                      {company.workingworkers.filter(worker => worker.skill === company.industry).length >= company.skilledworker && company.workingworkers.filter(worker => worker.skill !== "unskill").length > company.skilledworker
                        && company.workingworkers.map((worker: Worker, index2: React.Key | null | undefined) => (
                          <div key={index2}>{worker.skill !== "unskill" && <button onClick={() => Board.getInstance().swapworker(worker, company,
                            () => { setfreeAction(); },
                            (error) => {
                              alert(error);
                            })} className="btn btn-primary" data-bs-dismiss="modal">Swap Worker{worker.skill}</button>}</div>))}
                    </div>))}</ul>
                <ul className="p-2 flex-fill">
                  <div>CapitalistClass</div>
                  {CapitalistClass.getInstance().getinfo().companys.map((company: Company, index: React.Key | null | undefined) => (
                    <div key={index} style={{ margin: '50px' }}>
                      {company.workingworkers.filter(worker => worker.skill === company.industry).length >= company.skilledworker && company.workingworkers.filter(worker => worker.skill !== "unskill").length > company.skilledworker
                        && <Image src={company.imageUrl} alt={`Image of ${company.name}`} width={100} height={100} />}
                      {company.workingworkers.filter(worker => worker.skill === company.industry).length >= company.skilledworker && company.workingworkers.filter(worker => worker.skill !== "unskill").length > company.skilledworker
                        && company.workingworkers.map((worker: Worker, index2: React.Key | null | undefined) => (
                          <div key={index2}>{worker.skill !== "unskill" && <button onClick={() => Board.getInstance().swapworker(worker, company,
                            () => { setfreeAction(); },
                            (error) => {
                              alert(error);
                            })} className="btn btn-primary" data-bs-dismiss="modal">Swap Worker{worker.skill}</button>}</div>))}
                    </div>))}</ul>
              </div>
              {usedfreeActions && <p>action done</p>}
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            </div>
          </div>
        </div>
      </div>
      <div className="modal fade" id="Buying" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex={-1} aria-labelledby="staticBackdropLabel" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="staticBackdropLabel">Buying</h1>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div>{Usingitem} have {WorkerClass.getInstance().getinfo().goodsAndServices[Usingitem]}</div>
            <div>{Usingitem === 'Education' as keyof GoodsAndServices && <p> havingunskill worker{WorkerClass.getInstance().getinfo().population.worker.filter(worker => worker.skill === "unskill").length}</p>}</div>
            <div className="modal-body">
              {renderBuyingOptions(Usingitem)}
            </div>
            {usedfreeActions && <p>action done</p>}
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            </div>
          </div>
        </div>
      </div>
      <div className="modal fade" id="AssignWorker" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex={-1} aria-labelledby="staticBackdropLabel" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="staticBackdropLabel">Assign Worker</h1>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div>{Usingitem} have {WorkerClass.getInstance().getinfo().goodsAndServices[Usingitem]}</div>
            <div>{Usingitem === 'Education' as keyof GoodsAndServices && <p> havingunskill worker
              {WorkerClass.getInstance().getinfo().population.worker.filter(worker => worker.skill === "unskill").length}</p>}</div>
            <div className="modal-body">
              <ul className="p-2 flex-fill">
                <div>State unempolyment</div>
                {Board.getInstance().getinfo().unempolyment.map((worker: Worker, index2: React.Key | null | undefined) => (
                  <div key={index2}>
                    <button
                      data-bs-toggle="modal"
                      data-bs-target="#AssignWorker2"
                      className="btn btn-primary"
                      data-bs-dismiss="modal"
                      onClick={() => setusingworker(worker)}
                    >
                      Assign Worker {worker.skill}
                    </button>
                  </div>))}
              </ul>
              <ul className="p-2 flex-fill">
                <div>State</div>
                {Board.getInstance().getinfo().companys.map((company: Company, index: React.Key | null | undefined) => (
                  company.workingworkers.length > 0 && !company.Commit && (
                    <div key={index} style={{ margin: '50px' }}>
                      <Image src={company.imageUrl} alt={`Image of ${company.name}`} width={100} height={100} />
                      {company.workingworkers.map((worker: Worker, index2: React.Key | null | undefined) => (
                        <div key={index2}>
                          <button
                            data-bs-toggle="modal"
                            data-bs-target="#AssignWorker2"
                            className="btn btn-primary"
                            data-bs-dismiss="modal"
                            onClick={() => setusingworker(worker)}
                          >
                            Assign Worker {worker.skill}
                          </button>
                        </div>
                      ))}
                    </div>
                  )
                ))}
              </ul>
              <ul className="p-2 flex-fill">
                <div>CapitalistClass</div>
                {CapitalistClass.getInstance().getinfo().companys.map((company: Company, index: React.Key | null | undefined) => (
                  company.workingworkers.length > 0 && !company.Commit && (
                    <div key={index} style={{ margin: '50px' }}>
                      <Image src={company.imageUrl} alt={`Image of ${company.name}`} width={100} height={100} />
                      {company.workingworkers.map((worker: Worker, index2: React.Key | null | undefined) => (
                        <div key={index2}>
                          <button
                            data-bs-toggle="modal"
                            data-bs-target="#AssignWorker2"
                            className="btn btn-primary"
                            data-bs-dismiss="modal"
                            onClick={() => setusingworker(worker)}
                          >
                            Assign Worker {worker.skill}
                          </button>
                        </div>
                      ))}
                    </div>
                  )
                ))}
              </ul>

            </div>
            {usedfreeActions && <p>action done</p>}
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            </div>
          </div>
        </div>
      </div>
      <div className="modal fade" id="AssignWorker2" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex={-1} aria-labelledby="staticBackdropLabel" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="staticBackdropLabel">Assign Worker</h1>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div>{Usingitem} have {WorkerClass.getInstance().getinfo().goodsAndServices[Usingitem]}</div>
            <div>{Usingitem === 'Education' && <p> havingunskill worker {WorkerClass.getInstance().getinfo().population.worker.filter(worker => worker.skill === "unskill").length}</p>}</div>
            <div className="modal-body">
              <ul className="p-2 flex-fill">
                <div>TradeUnions</div>
                {WorkerClass.getInstance().getinfo().population.Natureofposition.Agriculture >= 1 && usingworker?.skill === "Agriculture" &&
                  <div>
                    <button
                      onClick={() => AssignWorkerunion("Agriculture")}
                      className="btn btn-primary"
                      data-bs-dismiss="modal"
                    >
                      Agriculture
                    </button>
                  </div>
                }
                {WorkerClass.getInstance().getinfo().population.Natureofposition.Luxury >= 1 && usingworker?.skill === "Luxury" &&
                  <div>
                    <button
                      onClick={() => AssignWorkerunion("Luxury")}
                      className="btn btn-primary"
                      data-bs-dismiss="modal"
                    >
                      Luxury
                    </button>
                  </div>
                }
                {WorkerClass.getInstance().getinfo().population.Natureofposition.Healthcare >= 4 && usingworker?.skill === "Healthcare" &&
                  <div>
                    <button
                      onClick={() => AssignWorkerunion("Healthcare")}
                      className="btn btn-primary"
                      data-bs-dismiss="modal"
                    >
                     Healthcare
                    </button>
                  </div>
                }
                {WorkerClass.getInstance().getinfo().population.Natureofposition.Education >= 4 && usingworker?.skill === "Education" &&
                  <div>
                    <button
                      onClick={() => AssignWorkerunion("Education")}
                      className="btn btn-primary"
                      data-bs-dismiss="modal"
                    >
                      Education
                    </button>
                  </div>
                }
                {WorkerClass.getInstance().getinfo().population.Natureofposition.Media >= 4 && usingworker?.skill === "Media" &&
                  <div>
                    <button
                      onClick={() => AssignWorkerunion("Media")}
                      className="btn btn-primary"
                      data-bs-dismiss="modal"
                    >
                      Media
                    </button>
                  </div>
                }
              </ul>
              <ul className="p-2 flex-fill">
                <div>State</div>
                {Board.getInstance().getinfo().companys.filter(company => company.workingworkers.length < company.requiredWorkers).map((company: Company, index: React.Key | null | undefined) => (
                  <div key={index} style={{ margin: '50px' }}>
                    <Image src={company.imageUrl} alt={`Image of ${company.name}`} width={100} height={100} />
                    <button
                      onClick={() => AssignWorker(company)}
                      className="btn btn-primary"
                      data-bs-dismiss="modal"
                    >
                      Worker {company.name}
                    </button>
                  </div>
                ))}
              </ul>
              <ul className="p-2 flex-fill">
                <div>CapitalistClass</div>
                {CapitalistClass.getInstance().getinfo().companys.filter(company => company.workingworkers.length < company.requiredWorkers).map((company: Company, index: React.Key | null | undefined) => (
                  <div key={index} style={{ margin: '50px' }}>
                    <Image src={company.imageUrl} alt={`Image of ${company.name}`} width={100} height={100} />
                    <button
                      onClick={() => AssignWorker(company)}
                      className="btn btn-primary"
                      data-bs-dismiss="modal"
                    >
                      Worker {company.name}
                    </button>
                  </div>
                ))}
              </ul>
            </div>
            {usedfreeActions && <p>这段话仅在 usedfreeActions 为 true 时显示。</p>}
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            </div>
          </div>
        </div>
      </div>
      <div className="modal fade" id="Strike" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex={-1} aria-labelledby="staticBackdropLabel" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="staticBackdropLabel">Strike</h1>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <ul className="p-2 flex-fill">
                <div>State</div>
                {Board.getInstance().getinfo().companys.map((company: Company, index: React.Key | null | undefined) => (
                  !company.Strike && !(company.wages.level === 3) && !company.Commit && (
                    <div key={index} style={{ margin: '50px' }}>
                      <button
                        onClick={() => handleStrike(company)}
                        className="btn btn-primary"
                        data-bs-dismiss="modal"
                      >
                        <Image src={company.imageUrl} alt={`Image of ${company.name}`} width={100} height={100} />
                      </button>
                    </div>
                  )
                ))}
              </ul>
              <ul className="p-2 flex-fill">
                <div>CapitalistClass</div>
                {CapitalistClass.getInstance().getinfo().companys.map((company: Company, index: React.Key | null | undefined) => (
                  !company.Strike && !(company.wages.level === 3) && !company.Commit && (
                    <div key={index} style={{ margin: '50px' }}>
                      <button
                        onClick={() => handleStrike(company)}
                        className="btn btn-primary"
                        data-bs-dismiss="modal"
                      >
                        <Image src={company.imageUrl} alt={`Image of ${company.name}`} width={100} height={100} />
                      </button>
                    </div>
                  )
                ))}
              </ul>

            </div>
            {usedfreeActions && <p>action done</p>}
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            </div>
          </div>
        </div>
      </div>
      <div className="modal fade" id="DemonStration" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex={-1} aria-labelledby="staticBackdropLabel" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="staticBackdropLabel">DemonStration</h1>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div>{Board.getInstance().getinfo().unempolyment.length}
              there are {calculateRemainingPositions()} in this company
            </div>
            <div className="modal-body">
              {Board.getInstance().getinfo().unempolyment.length > calculateRemainingPositions() + 1
                && <button className="btn btn-primary"
                  onClick={() => handleDemonStration()}
                  data-bs-dismiss="modal"> DemonStration</button>}

              <label data-bs-dismiss="modal" aria-label="Close" />
            </div>
            {usedBasicActions && <p>action done</p>}
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            </div>
          </div>
        </div>
      </div>
      <div className="modal fade" id="BuildCompany" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex={-1} aria-labelledby="staticBackdropLabel" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="staticBackdropLabel">Company Market</h1>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <ul className="p-2 flex-fill">
                <div>CapitalistClass</div>
                {CapitalistClass.getInstance().getinfo().Market.map((company: Company, index: React.Key | null | undefined) => (
                  <div key={index} style={{ margin: '50px' }}>
                    <button
                      onClick={() => handleBuildCompany(company)}
                      className="btn btn-primary"
                      data-bs-dismiss="modal"
                    >
                      <Image src={company.imageUrl} alt={`Image of ${company.name}`} width={100} height={100} />
                    </button>
                  </div>
                )
                )}
              </ul>

            </div>
            {usedfreeActions && <p>action done</p>}
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            </div>
          </div>
        </div>
      </div>
      <div className="modal fade" id="SellCompany" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex={-1} aria-labelledby="staticBackdropLabel" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="staticBackdropLabel">SellCompany</h1>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <ul className="p-2 flex-fill">
                <div>CapitalistClass</div>
                {CapitalistClass.getInstance().getinfo().companys.map((company: Company, index: React.Key | null | undefined) => (
                  !company.Strike && !(company.wages.level === 3) && !company.Commit && (
                    <div key={index} style={{ margin: '50px' }}>
                      <button
                        onClick={() => handleSellCompany(company)}
                        className="btn btn-primary"
                        data-bs-dismiss="modal"
                      >
                        <Image src={company.imageUrl} alt={`Image of ${company.name}`} width={100} height={100} />
                      </button>
                    </div>
                  )
                ))}
              </ul>

            </div>
            {usedfreeActions && <p>action done</p>}
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            </div>
          </div>
        </div>
      </div>
      <div className="modal fade" id="ForeignMarket" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex={-1} aria-labelledby="staticBackdropLabel" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="staticBackdropLabel">ForeignMarket</h1>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <Image src={Board.getInstance().getinfo().Export.imageUrl} alt="Export" width={200} height={100} />
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => handleForeignMarket('Food1', Board.getInstance().getinfo().Export.Food1)}
                disabled={(clickedButtons.Food1 || CapitalistClass.getInstance().getinfo().goodsAndServices[Board.getInstance().getinfo().Export.Food1.item as keyof CapitalistGoodsAndServices] < Board.getInstance().getinfo().Export.Food1.amount)}
              >
                Sell {Board.getInstance().getinfo().Export.Food1.item} with {Board.getInstance().getinfo().Export.Food1.amount} to get {Board.getInstance().getinfo().Export.Food1.price}
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => handleForeignMarket('Food2', Board.getInstance().getinfo().Export.Food2)}
                disabled={(clickedButtons.Food2 || CapitalistClass.getInstance().getinfo().goodsAndServices[Board.getInstance().getinfo().Export.Food2.item as keyof CapitalistGoodsAndServices] < Board.getInstance().getinfo().Export.Food2.amount)}
              >
                Sell {Board.getInstance().getinfo().Export.Food2.item} with {Board.getInstance().getinfo().Export.Food2.amount} to get {Board.getInstance().getinfo().Export.Food2.price}
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => handleForeignMarket('health1', Board.getInstance().getinfo().Export.health1)}
                disabled={(clickedButtons.health1 || CapitalistClass.getInstance().getinfo().goodsAndServices[Board.getInstance().getinfo().Export.health1.item as keyof CapitalistGoodsAndServices] < Board.getInstance().getinfo().Export.health1.amount)}
              >
                Sell {Board.getInstance().getinfo().Export.health1.item} with {Board.getInstance().getinfo().Export.health1.amount} to get {Board.getInstance().getinfo().Export.health1.price}
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => handleForeignMarket('health2', Board.getInstance().getinfo().Export.health2)}
                disabled={(clickedButtons.health2 || CapitalistClass.getInstance().getinfo().goodsAndServices[Board.getInstance().getinfo().Export.health2.item as keyof CapitalistGoodsAndServices] < Board.getInstance().getinfo().Export.health2.amount)}
              >
                Sell {Board.getInstance().getinfo().Export.health2.item} with {Board.getInstance().getinfo().Export.health2.amount} to get {Board.getInstance().getinfo().Export.health2.price}
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => handleForeignMarket('Luxury1', Board.getInstance().getinfo().Export.Luxury1)}
                disabled={(clickedButtons.Luxury1 || CapitalistClass.getInstance().getinfo().goodsAndServices[Board.getInstance().getinfo().Export.Luxury1.item as keyof CapitalistGoodsAndServices] < Board.getInstance().getinfo().Export.Luxury1.amount)}
              >
                Sell {Board.getInstance().getinfo().Export.Luxury1.item} with {Board.getInstance().getinfo().Export.Luxury1.amount} to get {Board.getInstance().getinfo().Export.Luxury1.price}
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => handleForeignMarket('Luxury2', Board.getInstance().getinfo().Export.Luxury2)}
                disabled={(clickedButtons.Luxury2 || CapitalistClass.getInstance().getinfo().goodsAndServices[Board.getInstance().getinfo().Export.Luxury2.item as keyof CapitalistGoodsAndServices] < Board.getInstance().getinfo().Export.Luxury2.amount)}
              >
                Sell {Board.getInstance().getinfo().Export.Luxury2.item} with {Board.getInstance().getinfo().Export.Luxury2.amount} to get {Board.getInstance().getinfo().Export.Luxury2.price}
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => handleForeignMarket('Education1', Board.getInstance().getinfo().Export.Education1)}
                disabled={(clickedButtons.Education1 || CapitalistClass.getInstance().getinfo().goodsAndServices[Board.getInstance().getinfo().Export.Education1.item as keyof CapitalistGoodsAndServices] < Board.getInstance().getinfo().Export.Education1.amount)}
              >
                Sell {Board.getInstance().getinfo().Export.Education1.item} with {Board.getInstance().getinfo().Export.Education1.amount} to get {Board.getInstance().getinfo().Export.Education1.price}
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => handleForeignMarket('Education2', Board.getInstance().getinfo().Export.Education2)}
                disabled={(clickedButtons.Education2 || CapitalistClass.getInstance().getinfo().goodsAndServices[Board.getInstance().getinfo().Export.Education2.item as keyof CapitalistGoodsAndServices] < Board.getInstance().getinfo().Export.Education2.amount)}
              >
                Sell {Board.getInstance().getinfo().Export.Education2.item} with {Board.getInstance().getinfo().Export.Education2.amount} to get {Board.getInstance().getinfo().Export.Education2.price}
              </button>

            </div>
            {usedfreeActions && <p>action done</p>}
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            </div>
          </div>
        </div>
      </div>
      <div className="modal fade" id="BusinessDeal" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex={-1} aria-labelledby="staticBackdropLabel" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="staticBackdropLabel">BusinessDeal</h1>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">

              {Board.getInstance().getinfo().BusinessDeal[0] &&
                <button onClick={() => handleBusinessDeal(0)} data-bs-dismiss="modal">
                  <Image src={Board.getInstance().getinfo().BusinessDeal[0].imageUrl} alt='BusinessDeal-1' width={100} height={100} />
                </button>}
              {Board.getInstance().getinfo().BusinessDeal[1] && <button onClick={() => handleBusinessDeal(1)} data-bs-dismiss="modal">
                <Image src={Board.getInstance().getinfo().BusinessDeal[1].imageUrl} alt='BusinessDeal-1' width={100} height={100} />
              </button>}
            </div>
            {usedfreeActions && <p>action done</p>}
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            </div>
          </div>
        </div>
      </div>
      <div className="modal fade" id="AdjustPrices" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex={-1} aria-labelledby="staticBackdropLabel" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="staticBackdropLabel">AdjustPrices {Usingitem}</h1>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div>{Usingitem}{CapitalistClass.getInstance().getinfo().goodsPrices[Usingitem]}</div>
            <div className="modal-body">
              {
                Usingitem === "Food" ? <div>
                  <button style={{ margin: '10px' }} className="btn btn-primary" onClick={() => handleAdjustPrices(9)} disabled={usedfreeActions} data-bs-dismiss="modal" >9</button>
                  <button style={{ margin: '10px' }} className="btn btn-primary" onClick={() => handleAdjustPrices(12)} disabled={usedfreeActions} data-bs-dismiss="modal" >12</button>
                  <button style={{ margin: '10px' }} className="btn btn-primary" onClick={() => handleAdjustPrices(15)} disabled={usedfreeActions} data-bs-dismiss="modal" >15</button></div> :
                  <div><button style={{ margin: '10px' }} className="btn btn-primary" onClick={() => handleAdjustPrices(5)} disabled={usedfreeActions} data-bs-dismiss="modal" >5</button>
                    <button style={{ margin: '10px' }} className="btn btn-primary" onClick={() => handleAdjustPrices(8)} disabled={usedfreeActions} data-bs-dismiss="modal" >8</button>
                    <button style={{ margin: '10px' }} className="btn btn-primary" onClick={() => handleAdjustPrices(10)} disabled={usedfreeActions} data-bs-dismiss="modal" >10</button></div>
              }
            </div>
            {usedfreeActions && <p>action done</p>}
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            </div>
          </div>
        </div>
      </div>
      <div className="modal fade" id="AdjustWages" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex={-1} aria-labelledby="staticBackdropLabel" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="staticBackdropLabel">Adjust Wages</h1>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              {CapitalistClass.getInstance().getinfo().companys.map((company: Company, index: React.Key | null | undefined) => (
                !company.Strike && !(company.wages.level === 3) && !company.Commit && (
                  <div key={index} style={{ margin: '50px' }}>
                    <button
                      onClick={() => setusingcompany(company)}
                      className="btn btn-primary"
                      data-bs-dismiss="modal"
                      data-bs-toggle="modal"
                      data-bs-target="#AdjustWages2"
                    >
                      <Image src={company.imageUrl} alt={`Image of ${company.name}`} width={100} height={100} />
                    </button>
                  </div>
                )
              ))}

            </div>
            {usedfreeActions && <p>action done</p>}
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            </div>
          </div>
        </div>
      </div>
      <div className="modal fade" id="AdjustWages2" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex={-1} aria-labelledby="staticBackdropLabel" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="staticBackdropLabel">Adjust Wages</h1>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            {usingcompany && <Image src={usingcompany!.imageUrl} height={100} width={100} alt='picture of usingcomany' />}
            the wage level is{usingcompany?.wages.level}
            <div className="modal-body">

              {Board.getInstance().getinfo().Policy.Labor === 'A' &&
                <button style={{ margin: '10px' }} className="btn btn-primary" onClick={() => handleAdjustWages(3)} disabled={usedfreeActions || usingcompany?.wages.level === 3} data-bs-dismiss="modal" >3</button>
              }
              {Board.getInstance().getinfo().Policy.Labor === 'B' &&
                <div><button style={{ margin: '10px' }} className="btn btn-primary" onClick={() => handleAdjustWages(2)} disabled={usedfreeActions || usingcompany?.wages.level === 2} data-bs-dismiss="modal" >2</button>
                  <button style={{ margin: '10px' }} className="btn btn-primary" onClick={() => handleAdjustWages(3)} disabled={usedfreeActions || usingcompany?.wages.level === 3} data-bs-dismiss="modal" >3</button></div>
              }
              {Board.getInstance().getinfo().Policy.Labor === 'C' && <div>
                <button style={{ margin: '10px' }} className="btn btn-primary" onClick={() => handleAdjustWages(1)} disabled={usedfreeActions || usingcompany?.wages.level === 1} data-bs-dismiss="modal">1</button>
                <button style={{ margin: '10px' }} className="btn btn-primary" onClick={() => handleAdjustWages(2)} disabled={usedfreeActions || usingcompany?.wages.level === 2} data-bs-dismiss="modal" >2</button>
                <button style={{ margin: '10px' }} className="btn btn-primary" onClick={() => handleAdjustWages(3)} disabled={usedfreeActions || usingcompany?.wages.level === 3} data-bs-dismiss="modal" >3</button>
              </div>
              }

            </div>
            {usedfreeActions && <p>action done</p>}
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            </div>
          </div>
        </div>
      </div>
      <div className="modal fade" id="GiveBonus" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex={-1} aria-labelledby="staticBackdropLabel" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="staticBackdropLabel">Give Bonus</h1>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              {CapitalistClass.getInstance().getinfo().companys.map((company: Company, index: React.Key | null | undefined) => (
                !company.Strike && !company.Commit && (
                  <div key={index} style={{ margin: '50px' }}>
                    <button
                      onClick={() => (handleGiveBonus(company))}
                      className="btn btn-primary"
                      data-bs-dismiss="modal"
                    >
                      <Image src={company.imageUrl} alt={`Image of ${company.name}`} width={100} height={100} />
                    </button>
                  </div>
                )
              ))}

            </div>
            {usedfreeActions && <p>action done</p>}
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            </div>
          </div>
        </div>
      </div>
    </div >
  );
};
function DataTable(data: { workerclass: WorkerClass; capitalistclass: CapitalistClass; board: Board; }) {
  return (
    <>

      <h3 className="container text-center">Worker class</h3>
      <table className="table table-striped table-bordered" id="wokerclass information">
        <thead>
          <tr className="container text-center">
            <th>population</th>
            <th>population-level</th>
            <th>Income</th>
            <th>Score</th>
            <th>food</th>
            <th>Luxury</th>
            <th>Education</th>
            <th>Health</th>
            <th>Influence</th>
            <th>Agriculture-Trade unions</th>
            <th >Luxury-Trade unions</th>
            <th >Healthcare-Trade unions</th>
            <th >Education-Trade unions</th>
            <th >Media-Trade unions</th>
            <th >loan</th>
          </tr>
        </thead>
        <tbody>
          <tr className="container text-center">
            <td className="col">{data.workerclass.getinfo().population.worker.length}</td>
            <td className="col">{data.workerclass.getinfo().population.population_level}</td>
            <td className="col">{data.workerclass.getinfo().income}</td>
            <td className="col">{data.workerclass.getinfo().score}</td>
            <td className="col">{data.workerclass.getinfo().goodsAndServices.Food}</td>
            <td className="col">{data.workerclass.getinfo().goodsAndServices.Luxury}</td>
            <td className="col">{data.workerclass.getinfo().goodsAndServices.Education}</td>
            <td className="col">{data.workerclass.getinfo().goodsAndServices.Health}</td>
            <td className="col">{data.workerclass.getinfo().goodsAndServices.Influence}</td>
            <td className="col">{data.workerclass.getinfo().tradeUnions.Agriculture ? 'existence' : 'null'}</td>
            <td className="col">{data.workerclass.getinfo().tradeUnions.Luxury ? 'existence' : 'null'}</td>
            <td className="col">{data.workerclass.getinfo().tradeUnions.Healthcare ? 'existence' : 'null'}</td>
            <td className="col">{data.workerclass.getinfo().tradeUnions.Education ? 'existence' : 'null'}</td>
            <td className="col">{data.workerclass.getinfo().tradeUnions.Media ? 'existence' : 'null'}</td>
            <td className="col">{data.workerclass.getinfo().loan}</td>
          </tr>
        </tbody>
      </table>
      <h3 className="container text-center">State</h3>
      <table className="table table-striped table-bordered" id="state information">
        <thead>
          <tr>
            <th scope="col">Deal</th>
            <th scope="col">Export</th>
            <th scope="col">StateTreasury</th>
            <th scope="col">Heath</th>
            <th scope="col">education</th>
            <th scope="col">influence</th>
            <th scope="col">Demonstration</th>
            <th scope="col">Unemployment</th>
            <th >loan</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td rowSpan={3}>{Board.getInstance().getinfo().BusinessDeal[0] && <Image src={Board.getInstance().getinfo().BusinessDeal[0].imageUrl} alt="Description of Image 1" width={100} height={100} />}
              {Board.getInstance().getinfo().BusinessDeal[1] && <Image src={Board.getInstance().getinfo().BusinessDeal[1].imageUrl} alt="Description of Image 1" width={100} height={100} />}
            </td>
            <td><Image src={Board.getInstance().getinfo().Export.imageUrl} alt="Export" width={200} height={100} /></td>
            <td>{data.board.getinfo().StateTreasury}</td>
            <td>{data.board.getinfo().goodsAndServices.Health}</td>
            <td>{data.board.getinfo().goodsAndServices.Education}</td>
            <td>{data.board.getinfo().goodsAndServices.Influence}</td>
            <td>{data.board.getinfo().DemonStration ? "YES" : "NO"}</td>
            <td>{data.board.getinfo().unempolyment.length}</td>
            <td>{data.board.getinfo().loan}</td>
          </tr>
          <tr>
            <th scope="col">Fiscal</th>
            <th scope="col">Labor</th>
            <th scope="col">Taxation</th>
            <th scope="col">Health</th>
            <th scope="col">Education</th>
            <th scope="col">Foreign</th>
            <th scope="col">Immigration</th>
          </tr>
          <tr>
            <td>{data.board.getinfo().Policy.Fiscal}</td>
            <td>{data.board.getinfo().Policy.Labor}</td>
            <td>{data.board.getinfo().Policy.Taxation}</td>
            <td>{data.board.getinfo().Policy.Health}</td>
            <td>{data.board.getinfo().Policy.Education}</td>
            <td>{data.board.getinfo().Policy.Foreign}</td>
            <td>{data.board.getinfo().Policy.Immigration}</td>
          </tr>
          <tr>
            <th scope="col">bill</th>
            <td>{data.board.getinfo().PolicyVoting.Fiscal}</td>
            <td>{data.board.getinfo().PolicyVoting.Labor}</td>
            <td>{data.board.getinfo().PolicyVoting.Taxation}</td>
            <td>{data.board.getinfo().PolicyVoting.Health}</td>
            <td>{data.board.getinfo().PolicyVoting.Education}</td>
            <td>{data.board.getinfo().PolicyVoting.Foreign}</td>
            <td>{data.board.getinfo().PolicyVoting.Immigration}</td>
          </tr>
        </tbody>
      </table>
      <div className="p-2 flex-fill">
        <h3 className="container text-center">CapitalistClass</h3>
        <table className="table table-striped table-bordered" id="Capitialist information">
          <thead>
            <tr>
              <th scope="col">Score</th>
              <th scope="col">Revenue</th>
              <th scope="col">Capitalist</th>
              <th scope="col">influence</th>
              <th scope="col">Food</th>
              <th scope="col">FoodLimit</th>
              <th scope="col">Luxury</th>
              <th scope="col">LuxuryLimit</th>
              <th scope="col">Health</th>
              <th scope="col">HealthLimit</th>
              <th scope="col">Education</th>
              <th scope="col">EducationLimit</th>
              <th scope="col">loan</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{data.capitalistclass.getinfo().Score}</td>
              <td>{data.capitalistclass.getinfo().Revenue}</td>
              <td>{data.capitalistclass.getinfo().Capitalist}</td>
              <td>{data.capitalistclass.getinfo().goodsAndServices.Influence}</td>
              <td>{data.capitalistclass.getinfo().goodsAndServices.Food}</td>
              <td>{data.capitalistclass.getinfo().goodsAndServices.FoodLimit}</td>
              <td>{data.capitalistclass.getinfo().goodsAndServices.Luxury}</td>
              <td>{data.capitalistclass.getinfo().goodsAndServices.LuxuryLimit}</td>
              <td>{data.capitalistclass.getinfo().goodsAndServices.Health}</td>
              <td>{data.capitalistclass.getinfo().goodsAndServices.HealthLimit}</td>
              <td>{data.capitalistclass.getinfo().goodsAndServices.Education}</td>
              <td>{data.capitalistclass.getinfo().goodsAndServices.EducationLimit}</td>
              <td>{data.capitalistclass.getinfo().loan}</td>
            </tr>
            <tr>
              <th>Prices</th>
              <td></td>
              <td></td>
              <td></td>
              <td>{data.capitalistclass.getinfo().goodsPrices.Food}</td>
              <td></td>
              <td>{data.capitalistclass.getinfo().goodsPrices.Luxury}</td>
              <td></td>
              <td>{data.capitalistclass.getinfo().goodsPrices.Health}</td>
              <td></td>
              <td>{data.capitalistclass.getinfo().goodsPrices.Education}</td>
              <td></td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="d-flex">
        <div className="p-2 flex-fill">
          <h3 className="container text-center">State Companies</h3>
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              flexWrap: 'wrap',
              alignItems: 'flex-start',
              justifyContent: 'center',
            }}
          >
            {data.board.getinfo().companys.map((company, index) => (
              <div
                key={index}
                style={{
                  margin: '20px',
                  flex: '1 1 calc(25% - 40px)',
                  minHeight: '270px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-start',
                  alignItems: 'center',
                  border: '1px solid #ccc',
                  padding: '10px',
                  boxSizing: 'border-box',
                }}
              >
                <div style={{ marginBottom: '10px' }}>
                  <Image src={company.imageUrl} alt={`Image of ${company.name}`} width={100} height={100} />
                  {company.wages.level}
                </div>
                <div style={{ textAlign: 'center' }}>
                  {company.Strike ? <Image src="/Strike.jpg" alt={`Image of Strike`} width={50} height={50} /> : <p></p>}
                  {working(company) ? (
                    <div>
                      Working
                      {company.workingworkers.map((worker, workerIndex) => (
                        <div key={workerIndex}>
                          This worker is a {worker.skill}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div>No working {company.workingworkers.map((worker, workerIndex) => (
                      <div key={workerIndex}>
                        This worker is a {worker.skill}
                      </div>
                    ))}</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div>
          填充物
        </div>
        <div className="p-2 flex-fill">
          <h3 className="container text-center">Capitalist Class Companies</h3>
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              flexWrap: 'wrap',
              alignItems: 'flex-start',
              justifyContent: 'center',
            }}
          >
            {data.capitalistclass.getinfo().companys.map((company, index) => (
              <div
                key={index}
                style={{
                  margin: '20px',
                  flex: '1 1 calc(25% - 40px)',
                  minHeight: '270px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-start',
                  alignItems: 'center',
                  border: '1px solid #ccc',
                  padding: '10px',
                  boxSizing: 'border-box',
                }}
              >
                <div style={{ marginBottom: '10px' }}>
                  <Image src={company.imageUrl} alt={`Image of ${company.name}`} width={100} height={100} />
                  {company.wages.level}
                </div>
                <div style={{ textAlign: 'center' }}>
                  {company.Strike ? <Image src="/Strike.jpg" alt={`Image of Strike`} width={50} height={50} /> : <div></div>}
                  {working(company) ? (
                    <div>
                      Working
                      {company.workingworkers.map((worker, workerIndex) => (
                        <div key={workerIndex}>
                          This worker is a {worker.skill}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div>No working
                      {company.workingworkers.map((worker, workerIndex) => (
                        <div key={workerIndex}>
                          This worker is a {worker.skill}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div></>
  );
};
function working(company: Company): boolean {
  const workers = company.workingworkers;
  let skilledWorker = 0;
  for (let i = 0; i < workers.length; i++) {
    if (workers[i].skill === company.industry) {
      skilledWorker++;
    }
  }
  return company.workingworkers.length === company.requiredWorkers && skilledWorker >= company.skilledworker;
};
const arraysEqual = (a: number[], b: number[]) => {
  if (a === b) return true;
  if (a == null || b == null) return false;
  if (a.length !== b.length) return false;

  for (let i = 0; i < a.length; ++i) {
    if (a[i] !== b[i]) return false;
  }
  return true;
};
export default GameRun;