"use client";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import React, { useState, useEffect, ReactElement } from 'react';
import { WorkerClass } from '../../lib/worker class';
import { CapitalistClass } from '@/lib/Capitalist class';
import { Board } from '@/lib/board';
import Image from 'next/image'
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

export default function Process() {
  return (
    <>
      <DataTable />
      <GameRun />
    </>
  );
}

function GameRun() {
  const [gameState, setGameState] = useState<GameState>({
    currentTurn: 1,
    currentRound: 1,
    phase: 'Action',
    maxRounds: 5,
    maxTurns: 5
  });

  // 监听rounds和phases变化，适时进入生产阶段
  useEffect(() => {
    if (gameState.currentRound > gameState.maxRounds && gameState.phase === 'Action') {
      setGameState(prev => ({ ...prev, phase: 'Production' }));
    }
  }, [gameState.currentRound, gameState.maxRounds, gameState.phase]);

  // 监听turns，当达到最大turn数时进行处理
  useEffect(() => {
    if (gameState.currentTurn > gameState.maxTurns) {
      // 可以在这里处理游戏终止逻辑，例如显示游戏结束的消息、计算最终分数等
      console.log('Game Over');
    }
  }, [gameState.currentTurn, gameState.maxTurns]);

  const handleNextRound = () => {
    if (gameState.phase === 'Production') {
      // 生产阶段结束后重置回合计数，开始新的游戏回合
      if (gameState.currentTurn < gameState.maxTurns) {
        setGameState(prev => ({
          ...prev,
          currentTurn: prev.currentTurn + 1,
          currentRound: 1,
          phase: 'Action'
        }));
      }
    } else {
      setGameState(prev => ({ ...prev, currentRound: prev.currentRound + 1 }));

    }
  };
  const [actionCompleted, setActionCompleted] = useState(false);
  const handleActionComplete = () => {
    setActionCompleted(true);  // 设置操作已完成
  };

  return (
    <div>
      <p>Phase: {gameState.phase}</p>
      <p>Turn: {gameState.currentTurn}</p>
      <p>Round: {gameState.currentRound}</p>
      <ActionToggle />
      {actionCompleted && <button onClick={handleNextRound}>Next Round</button>}
    </div>
  );
}
function ActionToggle() {
  const [activePath, setActivePath] = useState<number[]>([]);

  const actions: Actions = {
    basic: [
      {
        label: 'Propose Bill',
        subActions: [
          {
            label: 'Fiscal',
            subActions: [
              { label: 'A',onClick: () =>{Board.getInstance().voting('Fiscal','A')}},
              { label: 'B' ,onClick: () =>{Board.getInstance().voting('Fiscal','B')}},
              { label: 'C' ,onClick: () =>{Board.getInstance().voting('Fiscal','C')}},
            ]
          },
          { label: 'Sub Action 1-2' }
        ]
      },
      {
        label: 'Basic Action 2', subActions: [
          {
            label: 'Sub Fiscal 13', subActions: [
              { label: 'Sub Fiscal 14' },
              { label: 'Sub Fiscal 25' }
            ]
          },
          { label: 'Sub Fiscal 24' }
        ]
      }
    ],
    free: [
      { label: 'Free Action 1' },
      { label: 'Free Action 2' }
    ]
  };

  const handleActionClick = (path: number[], action: Action) => {
      // 如果存在 onClick 函数，先执行它
      if (action.onClick) {
        action.onClick();
      }
    
      // 然后设置活动路径以展开或折叠子菜单
      if (action.subActions) {
        if (activePath.join(',') === path.join(',')) {
          // 如果当前路径已激活，则点击意味着折叠
          setActivePath(path.slice(0, -1));
        } else {
          // 否则展开子菜单
          setActivePath(path);
        }
      } else {
        // 如果没有子菜单，只执行 onClick 并可能重置路径
        setActivePath([]);
      }
    };
  

  const renderActions = (actionList: Action[], path: number[] = []) => {
      return actionList.map((action, index) => {
        const currentPath = [...path, index]; 
        const isActive = activePath.length >= currentPath.length && activePath.slice(0, currentPath.length).join(',') === currentPath.join(',');
        console.log(`Passing down path: [${currentPath.join(',')}] for ${action.label}`);
        console.log(`Active path: [${activePath.join(',')}]`, `Current path: [${currentPath.join(',')}]`, `Is active? ${isActive}`);
    
        return (
          <div key={index}>
            <button onClick={() => handleActionClick(currentPath, action)}>{action.label}</button>

            {isActive && action.subActions && (
              <div style={{ marginLeft: '20px' }}>
                {renderActions(action.subActions, currentPath)}
              </div>
            )}
          </div>
        );
      });
    };
    

  return (
    <div>
      {Object.entries(actions).map(([key, actionList], index) => (
        <div key={key}>
          <h3>{key.charAt(0).toUpperCase() + key.slice(1)} Actions</h3>
          {renderActions(actionList)}
        </div>
      ))}
    </div>
  );
}

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
    workercalss: WorkerClass.getInstance(),
    capitalistClass: CapitalistClass.getInstance(),
    board: Board.getInstance(),
  });
  const [message, setMessage] = useState('');
  useEffect(() => {
    // 获取各个类的实例
    const workerInstance = WorkerClass.getInstance();
    const capitalistInstance = CapitalistClass.getInstance();
    const boardInstance = Board.getInstance();

    // 更新数据的函数
    const updateData = () => {
      setData({
        workercalss: workerInstance,
        capitalistClass: capitalistInstance,
        board: boardInstance,
      });
    };
    

    // 为每个实例添加更新事件监听器
    workerInstance.on('update',(msg) => setMessage(msg), updateData);
    capitalistInstance.on('update',(msg) => setMessage(msg), updateData);
    boardInstance.on('update',(msg) => setMessage(msg), updateData);

    // 清除事件监听器的函数
    return () => {
      workerInstance.off('update', updateData);
      capitalistInstance.off('update', updateData);
      boardInstance.off('update', updateData);
    };
  }, []); // 空依赖数组意味着这个 effect 只在组件挂载时运行一次

  return (
    <><table className="table table-borderless">
      <thead>
        <tr>
          <th scope="col">Income</th>
          <th scope="col">Score</th>
          <th scope="col">Handle</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>{data.workercalss.getincome()}</td>
          <td>{data.workercalss.getScore()}</td>
          <td>@mdo</td>
        </tr>
      </tbody>
    </table>
      <table className="table table-borderless">
        <thead>
          <tr>
            <th scope="col">Deal</th>
            <th scope="col">Score</th>
            <th scope="col">Heath</th>
            <th scope="col">education</th>
            <th scope="col">influence</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><Image src={Board.getInstance().getBoardInfo().BusinessDeal.imageUrl} alt="Description of Image 1" width={100} height={100} /></td>
            <td>{data.board.getBoardInfo().StateTreasury}</td>
            <td>{data.board.getBoardInfo().PublicServices.Health}</td>
            <td>{data.board.getBoardInfo().PublicServices.Education}</td>
            <td>{data.board.getBoardInfo().PublicServices.Influence}</td>
          </tr>
        </tbody>
      </table>
      <div style={{
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'start'
      }}>
        <h3>State Companies</h3>
        {data.board.getcompany().map((company, index) => (
          <p key={index}>
            <Image src={company.imageUrl} alt="Description of Image 1" width={100} height={100} />
          </p>
        ))}
        <table className="table table-borderless">
          <thead>
            <tr>
              <th scope="col">Fiscal</th>
              <th scope="col">Labor</th>
              <th scope="col">Taxation</th>
              <th scope="col">Education</th>
              <th scope="col">Foreign</th>
              <th scope="col">Immigration</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{data.board.getBoardInfo().Policy.Fiscal}</td>
              <td>{data.board.getBoardInfo().Policy.Labor}</td>
              <td>{data.board.getBoardInfo().Policy.Taxation}</td>
              <td>{data.board.getBoardInfo().Policy.Education}</td>
              <td>{data.board.getBoardInfo().Policy.Foreign}</td>
              <td>{data.board.getBoardInfo().Policy.Immigration}</td>
            </tr>
            <tr>
              <td>{data.board.getBoardInfo().PolicyVoting.Fiscal}</td>
              <td>{data.board.getBoardInfo().PolicyVoting.Labor}</td>
              <td>{data.board.getBoardInfo().PolicyVoting.Taxation}</td>
              <td>{data.board.getBoardInfo().PolicyVoting.Education}</td>
              <td>{data.board.getBoardInfo().PolicyVoting.Foreign}</td>
              <td>{data.board.getBoardInfo().PolicyVoting.Immigration}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
}

function initialization() {
  Board.getInstance().Initialization();
  //CapitalistClass.getInstance().Initialization();
  //WorkerClass.().initialization();
}

