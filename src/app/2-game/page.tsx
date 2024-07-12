"use client";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import React, { useState, useEffect, ReactElement } from 'react';
import { WorkerClass } from '../../lib/worker class';
import { CapitalistClass } from '@/lib/Capitalist class';
import {Board} from '@/lib/board';

export default function Process() {
  return (
    <>
      <DataTable />
      <GameRun />
    </>
  );
}

function GameRun() {
  const [step, setStep] = useState(0);
  const [turn, setTurn] = useState(1);

  useEffect(() => {
    if (step === 0 && turn === 1) {
      initialization();
    }
  }, [step, turn]);

  const initialization = () => {
    console.log("Initialization started because step is 0 and turn is 1");
  };

  return (
    <div>
      <p>Game Step: {step}</p>
      <p>Turn: {turn}</p>
      <WorkerClasstime />
    </div>
  );
}

function WorkerClassaction(number: number): ReactElement | null {
  switch (number) {
    case 1:
      WorkerClass.getInstance().addincome(10);
      return <div>成功1 {WorkerClass.getInstance().getincome()}</div>;
    case 2:
      WorkerClass.getInstance().setScore(10);
      return <div>成功2{WorkerClass.getInstance().getScore()}</div>;
    default:
      return null;
  }
}

function WorkerClasstime() {
  const [result, setResult] = useState<ReactElement | null>(null);

  const handleClick = (number: number) => {
    const actionResult = WorkerClassaction(number);
    setResult(actionResult);
  };

  return (
    <>
      <div>
        <button onClick={() => handleClick(1)}>1</button>
      </div>
      <div>
        <button onClick={() => handleClick(2)}>Create User</button>
        <button onClick={() => handleClick(3)}>Update User</button>
        <button onClick={() => handleClick(4)}>Delete User</button>
      </div>
      {result}
    </>
  );
}

function DataTable() {
  const [data, setData] = useState({
    income: WorkerClass.getInstance().getincome(),
    score: WorkerClass.getInstance().getScore()
  });

  useEffect(() => {
    const workerInstance = WorkerClass.getInstance();

    const updateData = () => {
      setData({
        income: workerInstance.getincome(),
        score: workerInstance.getScore()
      });
    };

    workerInstance.on('update', updateData);

    // Cleanup function to remove the event listener
    return () => {
      workerInstance.off('update', updateData);
    };
  }, []);

  return (
    <table className="table table-borderless">
      <thead>
        <tr>
          <th scope="col">Income</th>
          <th scope="col">Score</th>
          <th scope="col">Handle</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>{data.income}</td>
          <td>{data.score}</td>
          <td>@mdo</td>
        </tr>
      </tbody>
    </table>
  );
}

// function initialization() {
//   Board.getInstance().Initialization();
//   CapitalistClass.getInstance().Initialization();
//   WorkerClass.().initialization();
// }
