"use client"
import React, { useState, useEffect, useRef } from 'react';
import '@/app/ui/styles.css';
import { WorkerClass } from '../../lib/worker class';

export default function process(){
  WorkerClassaction(1)
  DataTable();
  GameRun();
  return(
    <><DataTable /><GameRun /></>
  )
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
function WorkerClassaction(number: number) {
  switch (number) {
    case 1:
      WorkerClass.getInstance().addincome(10);
      return <div>成功</div>;

    case 2:
      WorkerClass.getInstance().setScore(10);
      return <div>成功</div>;
    default:
      return null;
  }
}


function WorkerClasstime() {
  return (
    <><div>
      <button onClick={() => WorkerClassaction(1)}>1</button>
    </div>
    <div>
        <button onClick={() => WorkerClassaction(2)}>Create User</button>
        <button onClick={() => WorkerClassaction(3)}>Update User</button>
        <button onClick={() => WorkerClassaction(4)}>Delete User</button>
      </div></>
  );
}
function DataTable() {
  const[data, setData] = useState(WorkerClass.getInstance());

  // useEffect(() => {
  //   const fetchData = async () => {
  //     const response = await fetch('/api/data');
  //     const newData = await response.json();
  //     setData(newData);
  //   };
  //   fetchData();
  // }, []);

  if (!data) {
    return <div>Loading...</div>; 
  }

  return (
    <table>
      <thead>
        <tr>
          <th>Working class</th>
          <th>Score</th> {/* Added Score header */}
        </tr>
      </thead>
      <tbody>
        {data.getScore()}
      </tbody>
    </table>
  );
};

function initialization(){
//WorkerClass.getInstance.initialization();
}