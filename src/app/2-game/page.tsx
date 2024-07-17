"use client";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import React, { useState, useEffect, ReactElement } from 'react';
import { WorkerClass } from '../../lib/worker class';
import { CapitalistClass } from '@/lib/Capitalist class';
import { Board } from '@/lib/board';
import Image from 'next/image'
import { workerData } from 'worker_threads';
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
}
interface Actions {
  basic: Action[];
  free: Action[];
}
interface VotingModalProps {
  isOpen: boolean;
  onClose: () => void;
  name: keyof Board["Policy"];
}
interface ActionToggleProps {
  onActionComplete: () => void;
}

export default function GameRun() {
  const [gameState, setGameState] = useState<GameState>(() => {
    // 从 Local Storage 加载初始状态
    if (typeof window !== "undefined") {
      const savedState = localStorage.getItem('gameState');
      if (savedState) {
        try {
          return JSON.parse(savedState);
        } catch (e) {
          console.error('Error parsing game state from localStorage', e);
        }
      }
    }
    return {
      currentTurn: 1,
      currentRound: 1,
      phase: 'Action',
      maxRounds: 5,
      maxTurns: 5
    };
  })

  useEffect(() => {
    if (gameState.currentRound > gameState.maxRounds && gameState.phase === 'Action') {
      setGameState(prev => ({ ...prev, phase: 'Production' }));
    }
  }, [gameState.currentRound, gameState.maxRounds, gameState.phase]);

  // 监听turns，当达到最大turn数时进行处理
  useEffect(() => {
    if (gameState.currentTurn > gameState.maxTurns) {
      alert('Game Over');
    }
  }, [gameState.currentTurn, gameState.maxTurns]);

  useEffect(() => {
    localStorage.setItem('gameState', JSON.stringify(gameState));
    localStorage.setItem('Board', JSON.stringify(Board.getInstance()));
    localStorage.setItem('WorkerClass', JSON.stringify(WorkerClass.getInstance()));
    localStorage.setItem('CapitalistClass', JSON.stringify(CapitalistClass.getInstance()));
  }, [gameState]);

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
  const [actionCompleted, setActionCompleted] = useState(false);
  return (<>
    <div className="d-flex">
      <p className="p-2 flex-fill">Phase: {gameState.phase}</p>
      <p className="p-2 flex-fill">Turn: {gameState.currentTurn}</p>
      <p className="p-2 flex-fill">Round: {gameState.currentRound}</p>
    </div>
    <DataTable />
    <ActionToggle onActionComplete={() => setActionCompleted(true)} />
    {actionCompleted && <button onClick={handleNextRound}>Next Round</button>}
  </>
  );
}



const ActionToggle: React.FC<ActionToggleProps> = ({ onActionComplete }) => {
  const [activePath, setActivePath] = useState<number[]>([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [votingName, setVotingName] = useState('');
  const [usedBasicActions, setBasicActionCompleted] = useState(false);
  const [usedfreeActions, setfreeActionCompleted] = useState(false);
  const openModalWithVoting = (name: string) => {
    setModalOpen(true);
    setVotingName(name);
  };
  const setAction = () => {
    setBasicActionCompleted(true);
    onActionComplete();
  }
  const actions: Actions = {
    basic: [
      {
        label: 'Propose Bill',
        subActions: [
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
      { label: 'Use heath' },
      { label: 'Free Action 2' }
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
    if (keyPrefix === 'basic' && usedBasicActions) {
      return <div key="completed">已完成</div>;
    }

    return actionList.map((action, index) => {
      const currentPath = [...path, index];
      const isActive = activePath.length >= currentPath.length && activePath.slice(0, currentPath.length).join(',') === currentPath.join(',');
      return (
        <div key={index} >
          <button onClick={() => handleActionClick(currentPath, action)}>{action.label}</button>
          {isActive && action.subActions && (
            <div style={{ marginLeft: '20px' }}>
              {renderActions(action.subActions, currentPath, keyPrefix)}
            </div>
          )}
        </div>
      );
    });
  };


  return (
    <div className="container">
      <div className="d-flex justify-content-center">
        {Object.entries(actions).map(([key, actionList]) => (
          <div className="pp-2 flex-fill" key={key} >
            <div className="text-center">
              <h3>{key.charAt(0).toUpperCase() + key.slice(1)} Actions</h3>
              {renderActions(actionList, [], key)}
            </div></div>
        ))}</div>
      <VotingModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        onSuccess={setAction}
        name={votingName}
      />
    </div>
  );
};

// function MultiplayerGameActions() {
//   const [playerStatus, setPlayerStatus] = useState({
//       player1: { hasPerformedBasic: false, hasPerformedFree: false },
//       player2: { hasPerformedBasic: false, hasPerformedFree: false }
//   });

//   const handleBasicAction = (player) => {
//       alert(`${player} executing Basic Action`);
//       setPlayerStatus(prev => ({
//           ...prev,
//           [player]: { ...prev[player], hasPerformedBasic: true }
//       }));
//   };

//   const handleFreeAction = (player) => {
//       alert(`${player} executing Free Action`);
//       setPlayerStatus(prev => ({
//           ...prev,
//           [player]: { ...prev[player], hasPerformedFree: true }
//       }));
//   };

//   const resetActions = (player) => {
//       // Optionally reset actions at the end of the turn
//       setPlayerStatus(prev => ({
//           ...prev,
//           [player]: { hasPerformedBasic: false, hasPerformedFree: false }
//       }));
//   };

//   return (
//       <div>
//           {Object.entries(playerStatus).map(([player, { hasPerformedBasic, hasPerformedFree }]) => (
//               <div key={player}>
//                   <h3>{player.toUpperCase()}'s Turn</h3>
//                   {!hasPerformedBasic && (
//                       <button onClick={() => handleBasicAction(player)}>Perform Basic Action</button>
//                   )}
//                   {!hasPerformedFree && (
//                       <button onClick={() => handleFreeAction(player)}>Perform Free Action (Optional)</button>
//                   )}
//                   <button onClick={() => resetActions(player)}>End Turn & Reset Actions</button>
//               </div>
//           ))}
//       </div>
//   );
// }
function DataTable() {
  const [data, setData] = useState({
    workerclass: WorkerClass.getInstance(),
    capitalistclass: CapitalistClass.getInstance(),
    board: Board.getInstance(),
  });

  useEffect(() => {
    // 获取各个类的实例
    const workerInstance = WorkerClass.getInstance();
    const capitalistInstance = CapitalistClass.getInstance();
    const boardInstance = Board.getInstance();

    // 更新数据的函数
    const updateData = () => {
      setData({
        workerclass: workerInstance,
        capitalistclass: capitalistInstance,
        board: boardInstance,
      });
    };


    // 为每个实例添加更新事件监听器
    workerInstance.on('update', updateData);
    capitalistInstance.on('update', updateData);
    boardInstance.on('update', updateData);

    // 清除事件监听器的函数
    return () => {
      workerInstance.off('update', updateData);
      capitalistInstance.off('update', updateData);
      boardInstance.off('update', updateData);
    };
  }, []); // 空依赖数组意味着这个 effect 只在组件挂载时运行一次

  return (
    <><h3 className="container text-center">workercalss</h3>
      <table className="table table-striped table-bordered">
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
      <table className="table table-striped table-bordered">
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
            <td rowSpan="3"><Image src={Board.getInstance().getBoardInfo().BusinessDeal.imageUrl} alt="Description of Image 1" width={100} height={100} /></td>
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
            <th scope="col">Education</th>
            <th scope="col">Foreign</th>
            <th scope="col">Immigration</th>
          </tr>
          <tr>
            <td>{data.board.getBoardInfo().Policy.Fiscal}</td>
            <td>{data.board.getBoardInfo().Policy.Labor}</td>
            <td>{data.board.getBoardInfo().Policy.Taxation}</td>
            <td>{data.board.getBoardInfo().Policy.Education}</td>
            <td>{data.board.getBoardInfo().Policy.Foreign}</td>
            <td>{data.board.getBoardInfo().Policy.Immigration}</td>
          </tr>
          <tr>
            <th scope="col">bill</th>
            <td>{data.board.getBoardInfo().PolicyVoting.Fiscal}</td>
            <td>{data.board.getBoardInfo().PolicyVoting.Labor}</td>
            <td>{data.board.getBoardInfo().PolicyVoting.Taxation}</td>
            <td>{data.board.getBoardInfo().PolicyVoting.Education}</td>
            <td>{data.board.getBoardInfo().PolicyVoting.Foreign}</td>
            <td>{data.board.getBoardInfo().PolicyVoting.Immigration}</td>
          </tr>
        </tbody>
      </table><div className="d-flex">
        <div className="p-2 flex-fill">
          <h3 className="container text-center">State Companies</h3>
          <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'start' }}>
            {data.board.getBoardInfo().companys.map((company, index) => (
              <div key={index} style={{ margin: '50px' }}>
                <Image src={company.imageUrl} alt={`Image of ${company.name}`} width={100} height={100} />
                working
              </div>
            ))}</div>
        </div>
        <div className="p-2 flex-fill">
          <h3 className="container text-center">capitalistClass</h3>
          <table className="table table-borderless">
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
      </div>
    </>
  );
}

function initialization() {
  Board.getInstance().Initialization();
  //CapitalistClass.getInstance().Initialization();
  //WorkerClass.().initialization();
}



























const VotingModal: React.FC<{ isOpen: boolean, onClose: () => void, onSuccess: () => void, name: string }> = ({ isOpen, onClose, onSuccess, name }) => {
  if (!isOpen) return null;

  const handleVote = (option: string) => {
    Board.getInstance().voting(
      name,
      option,
      () => {
        onSuccess(); // 投票成功
        onClose();
      },
      (error) => {
        alert(error); // 投票失败
      }
    );
  };

  return (
    <>
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0,0,0,0.5)',
        zIndex: 99
      }} />
      <div style={{
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        backgroundColor: 'white',
        padding: '20px',
        border: '1px solid black',
        zIndex: 100
      }}>
        <div>{name}'s 当前政策{Board.getInstance().getBoardInfo().Policy[name]}</div>
        <div>
          <button onClick={() => handleVote('A')}>A</button>
          <button onClick={() => handleVote('B')}>B</button>
          <button onClick={() => handleVote('C')}>C</button>
        </div>
        <button onClick={onClose}>Close</button>
      </div>
    </>
  );
};
