"use client";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import React, { useState, useEffect, ReactElement } from 'react';
import { WorkerClass, GoodsAndServices, Worker } from '../../lib/worker class';
import { CapitalistClass } from '@/lib/Capitalist class';
import { Board, Policy } from '@/lib/board';
import Image from 'next/image'
import { Company } from '@/lib/company';
import { parse, stringify } from 'flatted';
interface GameState {
  currentTurn: number;
  currentRound: number;
  phase: 'Action' | 'Production' | 'Preparation Phase';
  maxRounds: number;
  maxTurns: number;
}
interface Action {
  label: string;
  onClick?: () => void;
  subActions?: Action[];
  databstarget?: String;

}
interface Actions {
  basic: Action[];
  free: Action[];
}
interface ActionToggleProps {
  onActionComplete: () => void;
}

export default function GameRun() {
  const [first, setfirst] = useState(false);
  const [gameState, setGameState] = useState<GameState>(() => {
    if (typeof window !== "undefined") {
      const savedState = localStorage.getItem('gameState');
      if (savedState) {
        try {
          return parse(savedState); // Use flatted's parse
        } catch (e) {
          console.error('Error parsing game state from localStorage using flatted', e);
        }
      }
    }
    setfirst(true);
    return ({
      currentTurn: 1,
      currentRound: 1,
      phase: 'Action',
      maxRounds: 5,
      maxTurns: 5
    });
  });

  const [showModal, setShowModal] = useState(false);
  const [ActionCompleted, setActionCompleted] = useState(false);
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedBoard = localStorage.getItem('Board');
      const savedWorkerClass = localStorage.getItem('WorkerClass');
      const savedCapitalistClass = localStorage.getItem('CapitalistClass');

      if (savedBoard) {
        try {
          const board = Board.getInstance();
          Object.assign(board, parse(savedBoard)); // 使用 flatted 的 parse 方法
        } catch (e) {
          console.error('Error parsing board state from localStorage', e);
        }
      }

      if (savedWorkerClass) {
        try {
          const workerClass = WorkerClass.getInstance();
          Object.assign(workerClass, parse(savedWorkerClass)); // 使用 flatted 的 parse 方法
          if (workerClass.getworkingclassInfo().population.worker.length < 10) {
            setfirst(true);
          }
        } catch (e) {
          console.error('Error parsing worker class state from localStorage', e);
        }
      }

      if (savedCapitalistClass) {
        try {
          const capitalistClass = CapitalistClass.getInstance();
          Object.assign(capitalistClass, parse(savedCapitalistClass)); // 使用 flatted 的 parse 方法
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
    localStorage.setItem('gameState', stringify(gameState));
    const board = Board.getInstance();
    localStorage.setItem('Board', stringify(board)); // 使用 flatted 的 stringify 方法 
    const workerClass = WorkerClass.getInstance();
    localStorage.setItem('WorkerClass', stringify(workerClass)); // 使用 flatted 的 stringify 方法 
    const capitalistClass = CapitalistClass.getInstance();
    localStorage.setItem('CapitalistClass', stringify(capitalistClass)); // 使用 flatted 的 stringify 方法
  }, [gameState]);
  const [data, setData] = useState({
    workerclass: WorkerClass.getInstance(),
    capitalistclass: CapitalistClass.getInstance(),
    board: Board.getInstance(),
  });

  useEffect(() => {
    const workerInstance = WorkerClass.getInstance();
    const capitalistInstance = CapitalistClass.getInstance();
    const boardInstance = Board.getInstance();

    const updateData = () => {
      console.log('Updating data', {
        workerclass: workerInstance,
        capitalistclass: capitalistInstance,
        board: boardInstance,
      });
      setData({
        workerclass: workerInstance,
        capitalistclass: capitalistInstance,
        board: boardInstance,
      });
    };

    console.log('Registering event listeners');
    workerInstance.on('update', updateData);
    capitalistInstance.on('update', updateData);
    boardInstance.on('update', updateData);

    return () => {
      console.log('Unregistering event listeners');
      workerInstance.off('update', updateData);
      capitalistInstance.off('update', updateData);
      boardInstance.off('update', updateData);
    };
  }, []);
  const handleNextRound = () => {
    if (gameState.phase === 'Production') {
      if (gameState.currentTurn <= gameState.maxTurns) {
        setGameState(prev => ({
          ...prev,
          currentTurn: prev.currentTurn + 1,
          currentRound: 1,
          phase: 'Action'
        }));
      }
      setActionCompleted(false);
    } else {
      setGameState(prev => ({ ...prev, currentRound: prev.currentRound + 1 }));
      setActionCompleted(false);
    }
  };
  const handleInitialization = () => {
    const board = Board.getInstance();
    board.Initialization2p();
    const workerClass = WorkerClass.getInstance();
    workerClass.Initialization2P();
    const capitalistClass = CapitalistClass.getInstance();
    capitalistClass.Initialization();
    setGameState(prevState => ({
      ...prevState,
      currentTurn: 1,
      currentRound: 1,
      phase: 'Action'
    }));
    setfirst(false);
    setShowModal(true);
  }
  const handleCloseModal = () => {
    setShowModal(false);
    setGameState(prevState => ({
      ...prevState,
      currentTurn: 1,
      currentRound: 1,
      phase: 'Action'
    }));
  };
  return (<>
    <>{first && handleInitialization()}</>
    <div className="d-flex">
      <p className="p-2 flex-fill">Phase: {gameState.phase}</p>
      <p className="p-2 flex-fill">Turn: {gameState.currentTurn}</p>
      <p className="p-2 flex-fill">Round: {gameState.currentRound}</p>
      <button onClick={handleInitialization}>initialization</button>
    </div>
    {DataTable(data)}
    <ActionToggle onActionComplete={() => handleNextRound()} />
    {showModal && (
      <div className="modal fade show" style={{ display: 'block' }} aria-modal="true" role="dialog">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Game Initialized</h5>
              <button type="button" className="btn-close" onClick={handleCloseModal}></button>
            </div>
            <div className="modal-body">
              <p>The game is ready to play!</p>
              <button type="button" className="btn btn-secondary" onClick={() => { WorkerClass.getInstance().addWorker("Acriculture", null); handleCloseModal(); }}>Agriculture</button>
              <button type="button" className="btn btn-secondary" onClick={() => { WorkerClass.getInstance().addWorker("Luxury", null); handleCloseModal(); }}>Luxury</button>
              <button type="button" className="btn btn-secondary" onClick={() => { WorkerClass.getInstance().addWorker("Heathcare", null); handleCloseModal(); }}>Heathcare</button>
              <button type="button" className="btn btn-secondary" onClick={() => { WorkerClass.getInstance().addWorker("Education", null); handleCloseModal(); }}>Education</button>
              <button type="button" className="btn btn-secondary" onClick={() => { WorkerClass.getInstance().addWorker("Media", null); handleCloseModal(); }}>Media</button>
            </div>
            <div className="modal-footer">
            </div>
          </div>
        </div>
      </div>)}
  </>);
}
const ActionToggle: React.FC<ActionToggleProps> = ({ onActionComplete }) => {
  const [activePath, setActivePath] = useState<number[]>([]);
  const [votingName, setVotingName] = useState<keyof Policy>('Fiscal');
  const [usedBasicActions, setBasicAction] = useState(false);
  const [usedfreeActions, setfreeAction] = useState(false);
  const [Usingitem, setUsingitem] = useState<keyof GoodsAndServices>('Health');
  const [usingworker, setusingworker] = useState<Worker>();
  const openModalWithVoting = (name: keyof Policy) => {
    setVotingName(name);
  };
  const openusingModal = (name: keyof GoodsAndServices) => {
    setUsingitem(name);
  };
  const actions: Actions = {
    basic: [
      {
        label: 'Propose Bill',
        subActions: [
          {
            label: 'Fiscal',
            databstarget: 'Voting',
            onClick: () => openModalWithVoting('Fiscal'),
          },
          {
            label: 'Labor',
            databstarget: 'Voting',
            onClick: () => openModalWithVoting('Labor')
          },
          {
            label: 'Taxation',
            databstarget: 'Voting',
            onClick: () => openModalWithVoting('Taxation')
          },
          {
            label: 'Health',
            databstarget: 'Voting',
            onClick: () => openModalWithVoting('Health')
          },
          {
            label: 'Education',
            onClick: () => openModalWithVoting('Education')
          },
          {
            label: 'Foreign',
            onClick: () => openModalWithVoting('Foreign')
          },
          {
            label: 'Immigration',
            onClick: () => openModalWithVoting('Immigration')
          }
        ]
      },
      {
        label: 'working', subActions: [
          {
            label: 'Fiscal',
            onClick: () => openModalWithVoting('Fiscal'),
          },
          {
            label: 'Labor',
            onClick: () => openModalWithVoting('Labor')
          },
          {
            label: 'Taxation',
            onClick: () => openModalWithVoting('Taxation')
          },
          {
            label: 'Health',
            onClick: () => openModalWithVoting('Health')
          },
          {
            label: 'Education',
            onClick: () => openModalWithVoting('Education')
          },
          {
            label: 'Foreign',
            onClick: () => openModalWithVoting('Foreign')
          },
          {
            label: 'Immigration',
            onClick: () => openModalWithVoting('Immigration')
          }
        ]
      }
    ],
    free: [
      { label: 'Use Healthcare', databstarget: 'Using', onClick: () => openusingModal('Health') },
      { label: 'Use Education', databstarget: 'Using', onClick: () => openusingModal('Education') },
      { label: 'Use Luxury', databstarget: 'Using', onClick: () => openusingModal('Luxury') },
      { label: 'pay the loan', databstarget: 'loan' },
      { label: '发钱', databstarget: 'loan', onClick: () => WorkerClass.getInstance().addincome(100) },
    ]
  };
  const handleActionClick = (path: number[], action: Action) => {
    action.onClick?.();
    if (action.subActions) {
      if (activePath.join(',') === path.join(',')) {
        setActivePath(path.slice(0, -1));
      } else {
        setActivePath(path);
      }
    } else {
      setActivePath([]);
    }
  };
  const renderActions = (actionList: Action[], path: number[] = [], keyPrefix: string) => {

    if (keyPrefix === 'basic' && usedBasicActions) {
      return <div key="completed">已完成</div>;
    }
    if (keyPrefix === 'free' && usedfreeActions) {
      return <div key="completed">已完成</div>;
    }

    return actionList.map((action, index) => {
      const currentPath = [...path, index];
      const isActive = activePath.length >= currentPath.length && activePath.slice(0, currentPath.length).join(',') === currentPath.join(',');

      if (action.subActions && action.subActions.length > 0) {
        // Render button with subActions
        return (
          <div key={index} style={{ padding: '10px' }}>
            <button onClick={() => handleActionClick(currentPath, action)} className="btn btn-primary">{action.label}</button>
            {isActive && (
              <div>
                {renderActions(action.subActions, currentPath, keyPrefix)}
              </div>
            )}
          </div>
        );
      } else {
        return (
          <div key={index} style={{ padding: '10px' }}>
            <button type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target={"#" + action.databstarget} onClick={() => handleActionClick(currentPath, action)}>{action.label}</button>
          </div>
        );
      }
    });
  };
  const handleVote = (option: string) => {
    Board.getInstance().voting(
      votingName,
      option,
      () => {
        setBasicAction(true);
      },
      (error) => {
        alert(error);
      }
    );
  };
  const handleUsing = () => {
    WorkerClass.getInstance().using(
      Usingitem,
      () => {
        setfreeAction(true);
      },
      (error) => {
        alert(error);
      }
    );
  };
  const handleloan = () => {
    WorkerClass.getInstance().payoffloan(
      () => {
        setfreeAction(true);
      },
      (error) => {
        alert(error);
      }
    );
  };
  const handleNextRound = () => {
    setfreeAction(false);
    setBasicAction(false);
    onActionComplete();
  }
  return (
    <div className="container">
      <div className="d-flex justify-content-center" id="menu">
        {Object.entries(actions).map(([key, actionList]) => (
          <div className="pp-2 flex-fill" key={key} >
            <div className="text-center">
              <h3>{key.charAt(0).toUpperCase() + key.slice(1)} Actions</h3>
              {renderActions(actionList, [], key)}
            </div></div>
        ))}</div>
      {usedBasicActions && <button onClick={handleNextRound}>Next Round</button>}
      <div className="modal fade" id="Voting" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex={-1} aria-labelledby="staticBackdropLabel" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="staticBackdropLabel">{votingName}</h1>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div>{votingName}'s 当前政策{Board.getInstance().getBoardInfo().Policy[votingName]}</div>
            <div className="modal-body">
              <div className="d-flex justify-content-center" >
                <button type="button" style={{ margin: '10px' }} className="btn btn-primary pp-2 flex-fill" onClick={() => handleVote('A')}>A</button>
                <button type="button" style={{ margin: '10px' }} className="btn btn-primary pp-2 flex-fill" onClick={() => handleVote('B')}>B</button>
                <button type="button" style={{ margin: '10px' }} className="btn btn-primary pp-2 flex-fill" onClick={() => handleVote('C')}>C</button>
              </div>
            </div>
            {usedBasicActions && <p>这段话仅在 isActive 为 true 时显示。</p>}
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
            <div>{Usingitem}有{WorkerClass.getInstance().getworkingclassInfo().goodsAndServices[Usingitem]}</div>
            <div>{Usingitem === 'Education' as keyof GoodsAndServices && <p>当前有unskill worker{WorkerClass.getInstance().getworkingclassInfo().population.worker.filter(worker => worker.skill === "unskill").length}</p>}</div>
            <div className="modal-body">
              {Usingitem === 'Education' as keyof GoodsAndServices ? <button className="btn btn-primary" data-bs-target="#UsingEducation" data-bs-toggle="modal">usingeducation</button> : <button onClick={() => handleUsing()}>using</button>}
            </div>
            {usedfreeActions && <p>这段话仅在 isActive 为 true 时显示。</p>}
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
            <div>s 当前{WorkerClass.getInstance().getworkingclassInfo().loan}</div>
            <div className="modal-body">
              {
                WorkerClass.getInstance().getworkingclassInfo().loan !== 0 ?
                  WorkerClass.getInstance().getworkingclassInfo().income >= 50 ?
                    <button onClick={() => handleloan()}>A</button> :
                    <div>no money</div>
                  :
                  <div>no loan</div>
              }
              {usedfreeActions && <p>这段话仅在 isActive 为 true 时显示。</p>}
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
              <h1 className="modal-title fs-5" id="staticBackdropLabel">loan</h1>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div>当前有{WorkerClass.getInstance().getworkingclassInfo().population.worker.filter(worker => worker.skill === "unskill").length}</div>
            <div className="modal-body">
              <ul>
                {Board.getInstance().getBoardInfo().companys.map((company: Company, index: React.Key | null | undefined) => (
                  <div key={index} style={{ margin: '50px' }}>
                    {company.workingworkers.length > 0 && company.workingworkers.filter(worker => worker.skill === "unskill") && <Image src={company.imageUrl} alt={`Image of ${company.name}`} width={100} height={100} />}
                    {company.workingworkers && company.workingworkers.map((worker: Worker, index2: React.Key | null | undefined) => (
                      <div key={index2}>{worker.skill === "unskill" && <button onClick={() => setusingworker(worker)} className="btn btn-primary" data-bs-target="#upgrade" data-bs-toggle="modal" >Train Worker</button>}</div>))}
                  </div>))}</ul>
              {usedfreeActions && <p>这段话仅在 isActive 为 true 时显示。</p>}
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            </div>
          </div>
        </div>
      </div>
      <div className="modal fade" id="upgrade" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex={-1} aria-labelledby="staticBackdropLabel" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="staticBackdropLabel">loan</h1>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div>当前有{WorkerClass.getInstance().getworkingclassInfo().population.worker.filter(worker => worker.skill === "unskill").length}</div>
            <div className="modal-body">
              <button type="button" className="btn btn-primary" data-bs-dismiss="modal" onClick={() => WorkerClass.getInstance().upgrade(usingworker as Worker, 'Acriculture')}>Acriculture</button>
              <button type="button" className="btn btn-primary" data-bs-dismiss="modal" onClick={() => WorkerClass.getInstance().upgrade(usingworker as Worker, 'Luxury')}>Luxury</button>
              <button type="button" className="btn btn-primary" data-bs-dismiss="modal" onClick={() => WorkerClass.getInstance().upgrade(usingworker as Worker, 'Heathcare')}>Heathcare</button>
              <button type="button" className="btn btn-primary" data-bs-dismiss="modal" onClick={() => WorkerClass.getInstance().upgrade(usingworker as Worker, 'Education')}>Education</button>
              <button type="button" className="btn btn-primary" data-bs-dismiss="modal" onClick={() => WorkerClass.getInstance().upgrade(usingworker as Worker, 'Media')}>Media</button>
              {usedfreeActions && <p>这段话仅在 isActive 为 true 时显示。</p>}
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );








};

function DataTable(data: { workerclass: WorkerClass; capitalistclass: CapitalistClass; board: Board; }) {
  return (
    <><h3 className="container text-center">workercalss</h3>
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
            <td className="col">{data.workerclass.getworkingclassInfo().population.worker.length}</td>
            <td className="col">{data.workerclass.getworkingclassInfo().population.population_level}</td>
            <td className="col">{data.workerclass.getworkingclassInfo().income}</td>
            <td className="col">{data.workerclass.getworkingclassInfo().score}</td>
            <td className="col">{data.workerclass.getworkingclassInfo().goodsAndServices.Food}</td>
            <td className="col">{data.workerclass.getworkingclassInfo().goodsAndServices.Luxury}</td>
            <td className="col">{data.workerclass.getworkingclassInfo().goodsAndServices.Education}</td>
            <td className="col">{data.workerclass.getworkingclassInfo().goodsAndServices.Health}</td>
            <td className="col">{data.workerclass.getworkingclassInfo().goodsAndServices.Influence}</td>
            <td className="col">{data.workerclass.getworkingclassInfo().tradeUnions.Acriculture ? '有' : '没有'}</td>
            <td className="col">{data.workerclass.getworkingclassInfo().tradeUnions.Luxury ? '有' : '没有'}</td>
            <td className="col">{data.workerclass.getworkingclassInfo().tradeUnions.Heathcare ? '有' : '没有'}</td>
            <td className="col">{data.workerclass.getworkingclassInfo().tradeUnions.Education ? '有' : '没有'}</td>
            <td className="col">{data.workerclass.getworkingclassInfo().tradeUnions.Media ? '有' : '没有'}</td>
            <td className="col">{data.workerclass.getworkingclassInfo().loan}</td>
          </tr>
        </tbody>
      </table>
      <h3 className="container text-center">State</h3>
      <table className="table table-striped table-bordered" id="state information">
        <thead>
          <tr>
            <th scope="col">Deal</th>
            <th scope="col">StateTreasury</th>
            <th scope="col">Heath</th>
            <th scope="col">education</th>
            <th scope="col">influence</th>
            <th >loan</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td rowSpan={3}><Image src={Board.getInstance().getBoardInfo().BusinessDeal.imageUrl} alt="Description of Image 1" width={100} height={100} /></td>
            <td>{data.board.getBoardInfo().StateTreasury}</td>
            <td>{data.board.getBoardInfo().PublicServices.Health}</td>
            <td>{data.board.getBoardInfo().PublicServices.Education}</td>
            <td>{data.board.getBoardInfo().PublicServices.Influence}</td>
            <td>{data.board.getBoardInfo().loan}</td>
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
            <td>{data.board.getBoardInfo().Policy.Fiscal}</td>
            <td>{data.board.getBoardInfo().Policy.Labor}</td>
            <td>{data.board.getBoardInfo().Policy.Taxation}</td>
            <td>{data.board.getBoardInfo().Policy.Health}</td>
            <td>{data.board.getBoardInfo().Policy.Education}</td>
            <td>{data.board.getBoardInfo().Policy.Foreign}</td>
            <td>{data.board.getBoardInfo().Policy.Immigration}</td>
          </tr>
          <tr>
            <th scope="col">bill</th>
            <td>{data.board.getBoardInfo().PolicyVoting.Fiscal}</td>
            <td>{data.board.getBoardInfo().PolicyVoting.Labor}</td>
            <td>{data.board.getBoardInfo().PolicyVoting.Taxation}</td>
            <td>{data.board.getBoardInfo().PolicyVoting.Health}</td>
            <td>{data.board.getBoardInfo().PolicyVoting.Education}</td>
            <td>{data.board.getBoardInfo().PolicyVoting.Foreign}</td>
            <td>{data.board.getBoardInfo().PolicyVoting.Immigration}</td>
          </tr>
        </tbody>
      </table>
      <div className="p-2 flex-fill">
        <h3 className="container text-center">capitalistClass</h3>
        <table className="table table-borderless" id="Capitialist information">
          <thead>
            <tr>
              <th scope="col">Score</th>
              <th scope="col">Revenue</th>
              <th scope="col">Capitalist</th>
              <th scope="col">influence</th>
              <th scope="col">Food</th>
              <th scope="col">Luxury</th>
              <th scope="col">Health</th>
              <th scope="col">Education</th>
              <th scope="col">loan</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{data.capitalistclass.getCapitalistInfo().Score}</td>
              <td>{data.capitalistclass.getCapitalistInfo().Revenue}</td>
              <td>{data.capitalistclass.getCapitalistInfo().Capitalist}</td>
              <td>{data.capitalistclass.getCapitalistInfo().Influence}</td>
              <td>{data.capitalistclass.getCapitalistInfo().goodsAndServices.Food}</td>
              <td>{data.capitalistclass.getCapitalistInfo().goodsAndServices.Luxury}</td>
              <td>{data.capitalistclass.getCapitalistInfo().goodsAndServices.Health}</td>
              <td>{data.capitalistclass.getCapitalistInfo().goodsAndServices.Education}</td>
              <td>{data.capitalistclass.getCapitalistInfo().loan}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="d-flex">
        <div className="p-2 flex-fill">
          <h3 className="container text-center">State Companies</h3>
          <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'start' }}>
            {data.board.getBoardInfo().companys.map((company: Company, index: React.Key | null | undefined) => (
              <div key={index} style={{ margin: '50px' }}>
                <Image src={company.imageUrl} alt={`Image of ${company.name}`} width={100} height={100} />
                <div>
                  {working(company) ?
                    <div>working</div> :
                    <div>noworking</div>}
                </div>
              </div>
            ))}</div>
        </div>
        <div className="p-2 flex-fill">
          <h3 className="container text-center">capitalistclass Companies</h3>
          <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'start' }}>
            {data.capitalistclass.getCapitalistInfo().Company.map((company: Company, index: React.Key | null | undefined) => (
              <div key={index} style={{ margin: '50px' }}>
                <Image src={company.imageUrl} alt={`Image of ${company.name}`} width={100} height={100} />
                <div>
                  {working(company) ?
                    <div>working</div> :
                    <div>noworking</div>}
                </div>
              </div>
            ))}</div></div>
      </div></>
  );
}

function working(company: Company): boolean {
  const workers = WorkerClass.getInstance().getworkingclassInfo().population.worker;
  let Workers = 0, skilledWorker = 0;

  for (let i = 0; i < workers.length; i++) {
    const workerLocation = workers[i].location;
    if (workerLocation && workerLocation.name === company.name) {
      Workers++;
      if (workers[i].skill !== 'unskill') {
        skilledWorker++;
      }
    }
  }
  return Workers === company.requiredWorkers && skilledWorker >= company.skilledworker;
}

