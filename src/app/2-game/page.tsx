"use client";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import React, { useState, useEffect, ReactElement } from 'react';
import { WorkerClass, GoodsAndServices, Worker } from '../../lib/worker class';
import { CapitalistClass, CapitalistGoodsAndServices } from '@/lib/Capitalist class';
import { Board, Policy, StategoodsAndServices } from '@/lib/board';
import Image from 'next/image'
import { CapitalistCompany, Company } from '@/lib/company';
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
  usedBasicActions: boolean;
  usedfreeActions: boolean;
  setBasicAction: () => void;
  setfreeAction: () => void;
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
  const [usedBasicActions, setUsedBasicActions] = useState(false);
  const [usedfreeActions, setUsedFreeActions] = useState(false);

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
          if (workerClass.getinfo().population.worker.length < 10) {
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
        Production();
        setGameState(prev => ({
          ...prev,
          currentTurn: prev.currentTurn + 1,
          currentRound: 1,
          phase: 'Action'
        }));
      }
      setUsedBasicActions(false);
      setUsedFreeActions(false);
    } else {
      setGameState(prev => ({ ...prev, currentRound: prev.currentRound + 1 }));
      setUsedBasicActions(false);
      setUsedFreeActions(false);
    }
  };
  const handleInitialization = () => {

    const board = Board.getInstance();
    board.Initialization2p();
    const capitalistClass = CapitalistClass.getInstance();
    capitalistClass.Initialization();
    const workerClass = WorkerClass.getInstance();
    workerClass.Initialization2P();

    setGameState(prevState => ({
      ...prevState,
      currentTurn: 1,
      currentRound: 1,
      phase: 'Action'
    }));
    setfirst(false);
    setShowModal(true);
    setUsedBasicActions(false);
    setUsedFreeActions(false)
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
  const updateData = () => {
    console.log('Updating data', {
      workerclass: WorkerClass.getInstance(),
      capitalistclass: CapitalistClass.getInstance(),
      board: Board.getInstance(),
    });
  }
  const Production = () => {
    for (let i = 0; i < Board.getInstance().getinfo().companys.length; i++) {

    }
  }

  return (<>
    <>{first && handleInitialization()}</>
    <div className="d-flex">
      <p className="p-2 flex-fill">Phase: {gameState.phase}</p>
      <p className="p-2 flex-fill">Turn: {gameState.currentTurn}</p>
      <p className="p-2 flex-fill">Round: {gameState.currentRound}</p>
      <button onClick={handleInitialization}>initialization</button>
      <button onClick={updateData}>information</button>
    </div>
    {DataTable(data)}
    <ActionToggle
      onActionComplete={() => handleNextRound()}
      usedBasicActions={usedBasicActions}
      usedfreeActions={usedfreeActions}
      setBasicAction={() => setUsedBasicActions(true)}
      setfreeAction={() => setUsedFreeActions(true)}
    />
    {showModal && (
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
              <button type="button" className="btn btn-secondary" onClick={() => { WorkerClass.getInstance().addWorker("Heathlcare", null); handleCloseModal(); }}>Heathlcare</button>
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
const ActionToggle: React.FC<ActionToggleProps> = ({ onActionComplete, usedBasicActions, usedfreeActions, setBasicAction, setfreeAction }) => {

  const [activePath, setActivePath] = useState<number[]>([]);
  const [votingName, setVotingName] = useState<keyof Policy>('Fiscal');
  const [Usingitem, setUsingitem] = useState<keyof GoodsAndServices>('Health');
  const [usingworker, setusingworker] = useState<Worker>();
  const [votingrapidly, setvotingrapidly] = useState(false);
  const [inputValue, setInputValue] = useState<number | string>('');
  const [submitcondition, setsubmitcondition] = useState(false);
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
            databstarget: 'Votingbill',
            onClick: () => openModalWithVoting('Fiscal'),
          },
          {
            label: 'Labor',
            databstarget: 'Votingbill',
            onClick: () => openModalWithVoting('Labor')
          },
          {
            label: 'Taxation',
            databstarget: 'Votingbill',
            onClick: () => openModalWithVoting('Taxation')
          },
          {
            label: 'Health',
            databstarget: 'Votingbill',
            onClick: () => openModalWithVoting('Health')
          },
          {
            label: 'Education',
            databstarget: 'Votingbill',
            onClick: () => openModalWithVoting('Education')
          },
          {
            label: 'Foreign',
            databstarget: 'Votingbill',
            onClick: () => openModalWithVoting('Foreign')
          },
          {
            label: 'Immigration',
            databstarget: 'Votingbill',
            onClick: () => openModalWithVoting('Immigration')
          }
        ]
      },
      {
        label: 'Buying', subActions: [
          {
            label: 'Food',
            databstarget: 'Buying',
            onClick: () => openusingModal('Food'),
          },
          {
            label: 'Education',
            databstarget: 'Buying',
            onClick: () => openusingModal('Education'),
          },
          {
            label: 'Health',
            databstarget: 'Buying',
            onClick: () => openusingModal('Health'),
          },
          {
            label: 'Luxury',
            databstarget: 'Buying',
            onClick: () => openusingModal('Luxury'),
          },
          {
            label: 'Influence',
            databstarget: 'Buying',
            onClick: () => openusingModal('Influence'),
          },
        ]
      }
    ],
    free: [
      { label: 'Use Heathlcare', databstarget: 'Using', onClick: () => openusingModal('Health') },
      { label: 'Use Education', databstarget: 'Using', onClick: () => openusingModal('Education') },
      { label: 'Use Luxury', databstarget: 'Using', onClick: () => openusingModal('Luxury') },
      { label: 'Swap workers', databstarget: 'SwapWorker' },
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
  const renderBuyingOptions = (item: keyof GoodsAndServices) => {
    const sources = {
      'Food': [
        { source: 'CapitalistClass', getInstance: () => CapitalistClass.getInstance().getinfo().goodsAndServices.Food },
        { source: 'State', getInstance: () => null }
      ],
      'Luxury': [
        { source: 'CapitalistClass', getInstance: () => CapitalistClass.getInstance().getinfo().goodsAndServices.Luxury },
        { source: 'State', getInstance: () => null }
      ],
      'Health': [
        { source: 'CapitalistClass', getInstance: () => CapitalistClass.getInstance().getinfo().goodsAndServices.Health },
        { source: 'State', getInstance: () => Board.getInstance().getinfo().goodsAndServices.Health },
      ],
      'Education': [
        { source: 'CapitalistClass', getInstance: () => CapitalistClass.getInstance().getinfo().goodsAndServices.Education },
        { source: 'State', getInstance: () => Board.getInstance().getinfo().goodsAndServices.Education },
      ],
      'Influence': [
        { source: 'State', getInstance: () => Board.getInstance().getinfo().goodsAndServices.Influence },
      ]
    };

    return sources[item].map(({ source, getInstance }) => (
      <div key={source}>
        <div>
          {`from ${source}`}
          {getInstance && getInstance()}
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
        option,
        () => {
          WorkerClass.getInstance().getinfo().goodsAndServices.Influence--;
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
      () => {
        setfreeAction();
      },
      (error) => {
        alert(error);
      }
    );
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
    onActionComplete();
  }
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>, key: String) => {
    const value = event.target.value;
    const numberValue = parseFloat(value);
    let isValid = true;
  
    const workerInfo = WorkerClass.getInstance().getinfo();
    const capitalistInfo = CapitalistClass.getInstance().getinfo();
    const boardInfo = Board.getInstance().getinfo();
  
    if (key === 'Influence') {
      isValid = !isNaN(numberValue) && numberValue > 0 && numberValue <= workerInfo.goodsAndServices.Influence;
    } else if (key === 'CapitalistClass') {
      const itemPrice = capitalistInfo.goodsPrices[Usingitem as keyof CapitalistGoodsAndServices];
      isValid = !isNaN(numberValue) && numberValue > 0 && numberValue <= capitalistInfo.goodsAndServices[Usingitem as keyof CapitalistGoodsAndServices] &&
                workerInfo.income >= itemPrice * numberValue;
    } else if (key === 'State') {
      const itemPrice = boardInfo.goodsAndServices[Usingitem as keyof StategoodsAndServices];
      if (Usingitem === 'Health' || Usingitem === 'Education') {
        isValid = !isNaN(numberValue) && numberValue > 0 && numberValue <= boardInfo.goodsAndServices[Usingitem as keyof StategoodsAndServices] &&
                  workerInfo.income >= itemPrice * numberValue;
      }
    } else if (key === 'Import') {
      // Handle Import logic if needed
    } else {
      const itemPrice = boardInfo.goodsAndServices[Usingitem as keyof StategoodsAndServices];
      isValid = !isNaN(numberValue) && numberValue > 0 && numberValue <= boardInfo.goodsAndServices[Usingitem as keyof StategoodsAndServices] &&
                workerInfo.income >= itemPrice * numberValue;
    }
  
    if (isValid || value === '') {
      setInputValue(numberValue);
      console.log("set"+{numberValue})
    }
    setsubmitcondition(isValid);
  };
  const handleVotingSubmit = () => {
    if (typeof inputValue === 'number') {
      console.log('Submitted value:', inputValue);
      Board.getInstance().Voting2(inputValue);
    } else {
      console.error('Invalid input value');
    }
  };
  const handleBuyingSubmit = (event: React.MouseEvent<HTMLButtonElement>, source: string) => {
    if (typeof inputValue === 'number') {
      if (source === 'CapitalistClass') {
        WorkerClass.getInstance().getinfo().income -= CapitalistClass.getInstance().getinfo().goodsPrices[Usingitem as keyof CapitalistGoodsAndServices] * inputValue;
        CapitalistClass.getInstance().getinfo().Revenue += Board.getInstance().goodsPrices(Usingitem as keyof StategoodsAndServices) * inputValue;
      }
      else if (source === 'State') {
        console.log("State"+Board.getInstance().goodsPrices(Usingitem as keyof StategoodsAndServices)+inputValue)
        WorkerClass.getInstance().addincome (-Board.getInstance().goodsPrices(Usingitem as keyof StategoodsAndServices) * inputValue);
        Board.getInstance().getinfo().StateTreasury += Board.getInstance().goodsPrices(Usingitem as keyof StategoodsAndServices) * inputValue;
      }
      else {
        WorkerClass.getInstance().getinfo().income -= CapitalistClass.getInstance().getinfo().goodsPrices[Usingitem as keyof CapitalistGoodsAndServices] * inputValue;
        CapitalistClass.getInstance().getinfo().Revenue += Board.getInstance().goodsPrices(Usingitem as keyof StategoodsAndServices) * inputValue;
      }
      console.log('Submitted value:', inputValue);
      WorkerClass.getInstance().Buying(inputValue, Usingitem, () => {
        setBasicAction();
      },
        (error) => {
          alert(error);
        })
    } else {
      console.error('Invalid input value');
    }
  };

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
      <div className="modal fade" id="Votingbill" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex={-1} aria-labelledby="staticBackdropLabel" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="staticBackdropLabel">{votingName}</h1>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div>{votingName}`s 当前政策{Board.getInstance().getinfo().Policy[votingName]}
            </div>
            <div className="modal-body">
              <div className="d-flex justify-content-center" >
                <div>
                  <button type="button" style={{ margin: '10px' }} className="btn btn-primary pp-2 flex-fill" onClick={() => setvotingrapidly(true)}
                    disabled={!(!votingrapidly && WorkerClass.getInstance().getinfo().goodsAndServices.Influence > 0)}>Voting rapidly</button>
                  <button type="button" style={{ margin: '10px' }} className="btn btn-primary pp-2 flex-fill" onClick={() => setvotingrapidly(false)}
                    disabled={!votingrapidly}>Voting after Production</button>
                </div>

                <div>-
                  <button type="button" style={{ margin: '10px' }} className="btn btn-primary pp-2 flex-fill" onClick={() => handleVote('A')} data-bs-dismiss="modal"
                    data-bs-toggle={votingrapidly ? "modal" : undefined}
                    data-bs-target={votingrapidly ? "#Voting" : undefined}
                    disabled={usedBasicActions}>A</button>
                  <button type="button" style={{ margin: '10px' }} className="btn btn-primary pp-2 flex-fill" onClick={() => handleVote('B')} data-bs-dismiss="modal"
                    data-bs-toggle={votingrapidly ? "modal" : undefined}
                    data-bs-target={votingrapidly ? "#Voting" : undefined}
                    disabled={usedBasicActions}>B</button>
                  <button type="button" style={{ margin: '10px' }} className="btn btn-primary pp-2 flex-fill" onClick={() => handleVote('C')} data-bs-dismiss="modal"
                    data-bs-toggle={votingrapidly ? "modal" : undefined}
                    data-bs-target={votingrapidly ? "#Voting" : undefined}
                    disabled={usedBasicActions}>C</button>
                </div>
              </div>
              <label data-bs-dismiss="modal" aria-label="Close" />
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
            <div>{Usingitem}有{WorkerClass.getInstance().getinfo().goodsAndServices[Usingitem]}</div>
            <div>{Usingitem === 'Education' as keyof GoodsAndServices && <p>当前有unskill worker{WorkerClass.getInstance().getinfo().population.worker.filter(worker => worker.skill === "unskill").length}</p>}</div>
            <div className="modal-body">
              {WorkerClass.getInstance().getinfo().goodsAndServices[Usingitem] >= WorkerClass.getInstance().getinfo().population.population_level ?
                Usingitem === 'Education' as keyof GoodsAndServices ?
                  <button className="btn btn-primary" data-bs-target="#UsingEducation" data-bs-toggle="modal" disabled={usedfreeActions}>using</button> :
                  <button className="btn btn-primary" onClick={() => handleUsing()} disabled={usedfreeActions} data-bs-dismiss="modal">using</button> :
                <button className="btn btn-primary" onClick={() => handleUsing()} disabled={usedfreeActions}>not enough</button>
              }
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
            <div>s 当前{WorkerClass.getInstance().getinfo().loan}</div>
            <div className="modal-body">
              {
                WorkerClass.getInstance().getinfo().loan !== 0 ?
                  WorkerClass.getInstance().getinfo().income >= 50 ?
                    <button onClick={() => handleloan()} data-bs-dismiss="modal" >A</button> :
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
              <h1 className="modal-title fs-5" id="staticBackdropLabel">UsingEducation</h1>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div>当前有{WorkerClass.getInstance().getinfo().population.worker.filter(worker => worker.skill === "unskill").length}</div>
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
            <div>当前有{WorkerClass.getInstance().getinfo().population.worker.filter(worker => worker.skill === "unskill").length}</div>
            <div className="modal-body">
              <button type="button" className="btn btn-primary" data-bs-dismiss="modal" onClick={() => WorkerClass.getInstance().upgrade(usingworker as Worker, 'Agriculture')}>Agriculture</button>
              <button type="button" className="btn btn-primary" data-bs-dismiss="modal" onClick={() => WorkerClass.getInstance().upgrade(usingworker as Worker, 'Luxury')}>Luxury</button>
              <button type="button" className="btn btn-primary" data-bs-dismiss="modal" onClick={() => WorkerClass.getInstance().upgrade(usingworker as Worker, 'Heathlcare')}>Heathlcare</button>
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
      <div className="modal fade" id="SwapWorker" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex={-1} aria-labelledby="staticBackdropLabel" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="staticBackdropLabel">SwapWorker</h1>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div>当前有{Board.getInstance().getinfo().unempolyment.filter(worker => worker.skill === 'unskill').length}</div>
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
              {usedfreeActions && <p>这段话仅在 isActive 为 true 时显示。</p>}
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            </div>
          </div>
        </div>
      </div>
      <div className="modal fade " id="Voting" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex={-1} aria-labelledby="staticBackdropLabel" aria-hidden="true" >
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
                  onChange={(event) => handleInputChange(event, 'Influence')}
                />
              </div>
              <button onClick={handleVotingSubmit} className="btn btn-primary" type="button" data-bs-dismiss="modal">Submit</button>

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
              <h1 className="modal-title fs-5" id="staticBackdropLabel">{Usingitem}</h1>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div>{Usingitem}有{WorkerClass.getInstance().getinfo().goodsAndServices[Usingitem]}</div>
            <div>{Usingitem === 'Education' as keyof GoodsAndServices && <p>当前有unskill worker{WorkerClass.getInstance().getinfo().population.worker.filter(worker => worker.skill === "unskill").length}</p>}</div>
            <div className="modal-body">
              {renderBuyingOptions(Usingitem)}
            </div>
            {usedfreeActions && <p>这段话仅在 isActive 为 true 时显示。</p>}
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

      <h3 className="container text-center">workercalss</h3>
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
            <th >Heathlcare-Trade unions</th>
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
            <td className="col">{data.workerclass.getinfo().tradeUnions.Agriculture ? '有' : '没有'}</td>
            <td className="col">{data.workerclass.getinfo().tradeUnions.Luxury ? '有' : '没有'}</td>
            <td className="col">{data.workerclass.getinfo().tradeUnions.Heathlcare ? '有' : '没有'}</td>
            <td className="col">{data.workerclass.getinfo().tradeUnions.Education ? '有' : '没有'}</td>
            <td className="col">{data.workerclass.getinfo().tradeUnions.Media ? '有' : '没有'}</td>
            <td className="col">{data.workerclass.getinfo().loan}</td>
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
            <td rowSpan={3}><Image src={Board.getInstance().getinfo().BusinessDeal.imageUrl} alt="Description of Image 1" width={100} height={100} /></td>
            <td>{data.board.getinfo().StateTreasury}</td>
            <td>{data.board.getinfo().goodsAndServices.Health}</td>
            <td>{data.board.getinfo().goodsAndServices.Education}</td>
            <td>{data.board.getinfo().goodsAndServices.Influence}</td>
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
              <td>{data.capitalistclass.getinfo().Score}</td>
              <td>{data.capitalistclass.getinfo().Revenue}</td>
              <td>{data.capitalistclass.getinfo().Capitalist}</td>
              <td>{data.capitalistclass.getinfo().Influence}</td>
              <td>{data.capitalistclass.getinfo().goodsAndServices.Food}</td>
              <td>{data.capitalistclass.getinfo().goodsAndServices.Luxury}</td>
              <td>{data.capitalistclass.getinfo().goodsAndServices.Health}</td>
              <td>{data.capitalistclass.getinfo().goodsAndServices.Education}</td>
              <td>{data.capitalistclass.getinfo().loan}</td>
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
                </div>
                <div style={{ textAlign: 'center' }}>
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
                </div>
                <div style={{ textAlign: 'center' }}>
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