import { useLocation } from "react-router-dom";
import React, { useState, useEffect } from "react";
import "./game.css";
import { Wheel } from "react-custom-roulette";

const data = [
  { option: "+5" },
  { option: "-5" },
  { option: "+10" },
  { option: "-10" },
  { option: "+15" },
  { option: "-15" },
];

const descriptions = [
  "Your Instagram post achieved an above-average engagement rate: +5 points.",
  "Poor timing! You posted during the middle of the night: -5 points.",
  "A successful rebranding improved your brand perception: +10 points.",
  "A poorly handled negative comment hurt your online reputation: -10 points.",
  "Your campaign went viral and created buzz: +15 points.",
  "Your PPC campaign burned through the budget with minimal clicks: -15 points.",
];

function GamePage() {
  const location = useLocation();
  const { players, industry } = location.state || {};

  const [mustSpin, setMustSpin] = useState(false);
  const [prizeNumber, setPrizeNumber] = useState(0);
  const [showModal, setShowModal] = useState(false); // Gère l'ouverture de la modale
  const [buttonText, setButtonText] = useState(""); // Texte du bouton
  const [buttonStyle, setButtonStyle] = useState({ backgroundColor: "#007BFF" }); // Style du bouton
  const [selectedPlayer, setSelectedPlayer] = useState(null); // To store selected player
  const [selectedPoints, setSelectedPoints] = useState(null); // To store points selected

  const [timerModalVisible, setTimerModalVisible] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60); // Timer de 60 secondes

  const [isSpinning, setIsSpinning] = useState(false); // Track if the character is spinning
  const [characterPose, setCharacterPose] = useState('normal'); // normal, happy, sad
  
  const [playerPoints, setPlayerPoints] = useState(
    players.map((player, index) => ({ ...player, points: 0, id: index })) // Add a unique id
  );

  const handleTimerClick = () => {
    setTimerModalVisible(true); // Affiche la modale du timer
    setTimeLeft(60); // Réinitialise le timer à 60 secondes
  };

  const handleSpinClick = () => {
    if (!mustSpin) {
      const newPrizeNumber = Math.floor(Math.random() * data.length); // Génère le prix une seule fois
      setPrizeNumber(newPrizeNumber); // Stocke ce numéro pour référence
      setMustSpin(true);
    }
  };

  // Logique du timer : compte à rebours
  useEffect(() => {
    let timer;
    if (timerModalVisible && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1); // Décrémente le temps restant
      }, 1000);
    } else if (timeLeft === 0) {
      clearInterval(timer);
    }

    // Clean-up si la modale est fermée ou que le timer arrive à 0
    return () => clearInterval(timer);
  }, [timeLeft, timerModalVisible]);

  const closeTimerModal = () => {
    setTimerModalVisible(false); // Ferme la modale du timer
    setTimeLeft(60); // Réinitialise le timer
  };

  const handlePlayerClick = (player) => {
    setSelectedPlayer(player); // Set the selected player
    setShowModal(true); // Show the modal
  };

  const handleRemovePoints = () => {
    if (selectedPlayer && selectedPoints !== null) {
      // Met à jour uniquement les points du joueur sélectionné en soustrayant
      setPlayerPoints((prevState) =>
        prevState.map((player) =>
          player.id === selectedPlayer.id
            ? { ...player, points: Math.max(0, player.points - selectedPoints) }
            : player // Les autres joueurs restent inchangés
        )
      );
      closeModal(); // Ferme la modale après avoir retiré les points
    }
  };

  const handleSelectPoints = (points) => {
    setSelectedPoints(points);
  };

  const handleAddPoints = () => {
    if (selectedPlayer && selectedPoints !== null) {
      // Update only the selected player's points
      setPlayerPoints(prevState =>
        prevState.map(player =>
          player.id === selectedPlayer.id
            ? { ...player, points: player.points + selectedPoints }
            : player // Keep the other players unchanged
        )
      );
      closeModal(); // Close the modal after adding points
    }
  };

  const handleStopSpinning = () => {
    setTimeout(() => {
      setMustSpin(false); // Stop the wheel spin
  
      const prize = data[prizeNumber]; // Get the prize
      setIsSpinning(true); // Start the character spin
  
      setTimeout(() => {
        // After spin animation, set the character's pose
        if (prize.option.includes("+")) {
          setCharacterPose("happy"); // Happy for positive outcomes
        } else if (prize.option.includes("-")) {
          setCharacterPose("sad"); // Sad for negative outcomes
        } else {
          setCharacterPose("normal"); // Neutral/default pose
        }
  
        setIsSpinning(false); // End the spin animation
  
        // Update the modal content
        if (prize.option.includes("+")) {
          setButtonText("Yay!");
          setButtonStyle({ backgroundColor: "#28a745" }); // Green for positive
        } else {
          setButtonText("Alright...");
          setButtonStyle({ backgroundColor: "#dc3545" }); // Red for negative
        }
  
        setShowModal(true); // Show the modal
      }, 1000); // Duration of the spin animation
    }, 1000); // Ensure this is in sync with the wheel's animation
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedPlayer(null);
    setSelectedPoints(null);
    setCharacterPose('normal'); // Reset to normal pose when modal closes
  };

  console.log(players); // Debugging: affiche les données des joueurs

  return (
    <div>
      <header className="game_header">
        <img src="/logo.png" alt="logo" />
        <h1>@{industry}</h1>
      </header>
      <div className="main">
        <div className="image-overlay-game"></div>
        <div className="player_list">
          <ul>
          {playerPoints.map((player, index) => {
  // Find the maximum points value
  const maxPoints = Math.max(...playerPoints.map(p => p.points));

  // Check if there's a unique leader
  const isLeader = player.points === maxPoints && playerPoints.filter(p => p.points === maxPoints).length === 1;

  return (
    <li key={index} style={{ marginBottom: "10px" }}>
      <div style={{ display: "flex", alignItems: "center" }}>
        {/* Image du joueur avec fallback */}
        <img
          className="player_img"
          src={player.image || "default-icon.png"} // Fallback vers une image par défaut si l'icône est vide
          alt="player icon"
          style={{
            width: "30px",
            height: "30px",
            borderRadius: "50%",
            marginRight: "10px",
          }}
        />
        <div className="player_stats">
          <span>{player.points} engagement</span>
        </div>
        <button onClick={() => handlePlayerClick(player)}>
          <img className="plus_button" src="/add.png" alt="add" />
        </button>
      </div>

      {/* Display leader icon only if there is a unique leader */}
      {isLeader && (
        <span style={{ marginLeft: "10px", color: "green", fontWeight: "bold" }}>
          🏆 Leader!
        </span>
      )}
    </li>
  );
})}
          </ul>
        </div>

        <div className="wheel_timer" style={{ position: "relative" }}>
          <h2>Wheel of Mystery</h2>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "20px" }}>
            <div style={{ position: "relative", display: "inline-block", zIndex: 1 }}>
              <Wheel
                mustStartSpinning={mustSpin}
                prizeNumber={prizeNumber}
                data={data}
                outerBorderColor="#f2f2f2"
                outerBorderWidth={10}
                innerBorderColor="#f2f2f2"
                radiusLineColor="#dedede"
                fontFamily="Inter"
                radiusLineWidth={1}
                fontSize={15}
                textColors={["#ffffff"]}
                backgroundColors={[
                  "#F22B35", "#F99533", "#24CA69", "#514E50", "#46AEFF", "#9145B7",
                ]}
                onStopSpinning={handleStopSpinning}
                pointerProps={{
                  src: "/pointer.webp",
                }}
              />
              <button
                onClick={handleSpinClick}
                disabled={mustSpin}
                className="spin_button"
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  height: "2em",
                  width: "2em",
                  borderRadius: "100%",
                  fontSize: "3em",
                  color: "#62C370",
                  boxShadow: "5px 5px 5px black",
                  zIndex: 10,
                  backgroundColor: "#ffffff",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                ▶
              </button>
            </div>
          </div>

          <div className="timer_button">
          <button
              onClick={handleTimerClick}
              className="timer-button"
              style={{
                fontSize: "1.2em",
                backgroundColor: "#ffffff",
                color: "#F22B35", // Rose
                padding: "10px 20px",
                borderRadius: "5px",
                border: "2px solid #F22B35",
                cursor: "pointer",
                boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                fontWeight: "bold",
              }}
            >
              Start Timer
            </button>
          </div>
        </div>

        <div className="other">
          <div className="rules_glossary">
           <a href="/">Glossary</a>
            <a href="/">Rules</a>
          </div>
          <div
            className={`character ${isSpinning ? "spin" : ""} ${characterPose}`}
          ></div>
          </div>
          </div>

 {/* Modale Timer */}
 {timerModalVisible && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 20,
            }}
          >
            <div
              style={{
                backgroundColor: "#fff",
                padding: "20px",
                borderRadius: "10px",
                width: "300px",
                textAlign: "center",
                boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.2)",
              }}
            >
              <h2>Timer</h2>
              <p>{timeLeft > 0 ? `Time left: ${timeLeft} seconds` : "Time's up!"}</p>
              <button
                onClick={closeTimerModal}
                className="modal_button"
                style={{
                  marginTop: "20px",
                  padding: "10px 20px",
                  backgroundColor: "#28a745", // Green for closing
                  color: "#fff",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                  fontSize: "16px",
                }}
              >
                Close
              </button>
            </div>
          </div>
        )}

      {/* Modale */}
      {showModal && (
  <div
    style={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 20,
    }}
  >
    <div
      style={{
        backgroundColor: "#fff",
        padding: "20px",
        borderRadius: "10px",
        width: "300px",
        textAlign: "center",
        boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.2)",
      }}
    >
      <h2>{buttonText === "Yay!" ? "Congratulations!" : "Too bad..."}</h2>
      <p>{descriptions[prizeNumber]}</p>
      <button
        onClick={closeModal}
        className="modal_button"
        style={{
          marginTop: "20px",
          padding: "10px 20px",
          backgroundColor: buttonStyle.backgroundColor,
          color: "#fff",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
          fontSize: "16px",
        }}
      >
        {buttonText}
      </button>
    </div>
  </div>
)}

{/* Modal content with buttons */}
{showModal && selectedPlayer && (
  <div className="modal">
    <div className="modal-content">
      <button className="close-modal" onClick={closeModal}>
        &#10005;
      </button>

      {/* Engagement Title */}
      <h2>Engagement</h2>

      {/* Player's Name (above the icon), with dynamic color */}
      <h3 style={{ color: selectedPlayer.color }}>{selectedPlayer.name}</h3>

      {/* Player's Icon */}
      <div className="icon-container">
        <img src={selectedPlayer.image || "default-icon.png"} alt="Player Icon" />
      </div>

      {/* Point Selection Buttons */}
      <div className="points-buttons">
        <button
          className={selectedPoints === 5 ? 'selected' : ''}
          onClick={() => handleSelectPoints(5)}
        >
          +5
        </button>
        <button
          className={selectedPoints === 10 ? 'selected' : ''}
          onClick={() => handleSelectPoints(10)}
        >
          +10
        </button>
        <button
          className={selectedPoints === 15 ? 'selected' : ''}
          onClick={() => handleSelectPoints(15)}
        >
          +15
        </button>
      </div>

      {/* Add and Remove Points Buttons */}
      <div className="points-actions">
        <button
          onClick={handleAddPoints}
          className="add-points-button"
          disabled={selectedPoints === null}
        >
          Add Points
        </button>
        <button
          onClick={handleRemovePoints}
          className="remove-points-button"
          disabled={selectedPoints === null}
        >
          Remove Points
        </button>
      </div>
    </div>
  </div>
)}


    </div>
  );
}

export default GamePage;
