"use client"


const VotingModal = ({ isOpen, onClose, options,name}) => {
    if (!isOpen) return null;
  
    return (
      <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', backgroundColor: 'white', padding: '20px', border: '1px solid black', zIndex: 100 }}>
        {name}<div/>
        <div>
        {options.map(option => (
          <button key={option.label} onClick={() => { option.onClick(); onClose(); }} style={{ margin: '10px' }}>
            {option.label}
          </button>
        ))
        }
        </div>
        <button onClick={onClose}>Close</button>
      </div>
    );
  };
  import React, { useState } from 'react';

function ActionToggle() {
  const [isModalOpen, setModalOpen] = useState(false);
  const [modalOptions, setModalOptions] = useState([]);

  const handleFiscalClick = () => {
    const options = [
      { label: 'A', onClick: () => Board.getInstance().voting('Fiscal', 'A') },
      { label: 'B', onClick: () => Board.getInstance().voting('Fiscal', 'B') },
      { label: 'C', onClick: () => Board.getInstance().voting('Fiscal', 'C') }
    ];
    setModalOptions(options);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  return (
    <div>
      <button onClick={handleFiscalClick}>Propose Fiscal Bill</button>
      <VotingModal isOpen={isModalOpen} onClose={closeModal} options={modalOptions} name={'Fiscal'}/>
    </div>
  );
}

export default ActionToggle;
