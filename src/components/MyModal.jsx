import React, { useState, useEffect } from 'react';

function MyModal({ setIsModalOpen }) {
    const [showAgain, setShowAgain] = useState(false); 
  
    useEffect(() => {
      if (localStorage.getItem("modal")) {
        setIsModalOpen(false);
      }
    }, [setIsModalOpen]);
  
    const handleCloseModal = () => {
      setIsModalOpen(false);
      if(showAgain) {
        localStorage.setItem("modal", true);
      }
    };
  
    return (
      <div>
          <div className="modal-overlay" onClick={handleCloseModal}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <p>Platforms will keep spawning in random directions, <br/> Use the "WASD" Keys to roll on the spawning platforms before they disappear!</p>
              <img src="/tutImg.png" alt="tutImg" />
              <div>
                <input type="checkbox" id="checkbox" className="check" onClick={() => setShowAgain(!showAgain)} />
                <label htmlFor="checkbox" className="show"> Don't show again</label>
              </div>
              <button className="startBtn" onClick={handleCloseModal}>Start!</button>
            </div>
          </div>
      </div>
    );
}
  
export default MyModal;