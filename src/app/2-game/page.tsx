"use client"
import React, { useState, useEffect, useRef } from 'react';

import '@/app/ui/styles.css';
import { WorkerClass } from '../../lib/worker class';

export default function process(){
  DataTable();
  GameRun();
  return(
    <><DataTable /><GameRun /><div>
      working
    </div></>
  )
}

function GameRun() {
  const [step, setStep] = useState(0);
  const [turn, setTurn] = useState(1);

  useEffect(() => {
      if (step === 0 && turn === 1) {
          initialization();
      }
  }, [step, turn]);  // Dependency array to ensure effect runs only when step or turn changes

  // Assume this is a correct function for initialization
  const initialization = () => {
      console.log("Initialization started because step is 0 and turn is 1");
  };

  return (
      <div>
          <p>Game Step: {step}</p>
          <p>Turn: {turn}</p>
          {step >= 0 && step < 5 && <WorkerClasstime />}
      </div>
  );
}

function WorkerClasstime() {
  // Assuming WorkerClassaction is defined to handle button actions
  // const workerClassaction = (number) => {
  //     console.log(`Action for ${number}`);
  // };

  return (
      <div>
          <button onClick={() => WorkerClassaction(1)}>Fetch User</button>
          <button onClick={() => WorkerClassaction(2)}>Create User</button>
          <button onClick={() => WorkerClassaction(3)}>Update User</button>
          <button onClick={() => WorkerClassaction(4)}>Delete User</button>
      </div>
  );
}

function WorkerClassaction(number: number){
  switch(number){
    case 1 :
      WorkerClass.getInstance().addincome(10);
      break;
    case 2:
      WorkerClass.getInstance().setScore(10);
      break;

  }

}
function DataTable() {
  const[data, setData] = useState(WorkerClass.getInstance());

  useEffect(() => {
    // Simulate fetching data
    const fetchData = async () => {
      const response = await fetch('/api/data');
      const newData = await response.json();
      setData(newData);
    };
    fetchData();
  }, []);

  if (!data) {
    return <div>Loading...</div>; 
  }

  return (
      <table>
          <thead>
              <tr>
                  <th>ID</th>
                  <th>Value</th>
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