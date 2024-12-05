import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./player.css";

function PlayerSetup() {
  const maxPlayers = 8;
  const minPlayers = 2;

  // Images et couleurs correspondantes
  const images = [
    "/players_icon/image_1.png", "/players_icon/image_2.png",
    "/players_icon/image_3.png", "/players_icon/image_4.png",
    "/players_icon/image_5.png", "/players_icon/image_6.png",
    "/players_icon/image_7.png", "/players_icon/image_8.png",
  ];

  const imageColors = {
    "/players_icon/image_1.png": "#E7386F",
    "/players_icon/image_2.png": "#E7C138",
    "/players_icon/image_3.png": "#F35D18",
    "/players_icon/image_4.png": "#8FC257",
    "/players_icon/image_5.png": "#F33218",
    "/players_icon/image_6.png": "#9747FF",
    "/players_icon/image_7.png": "#62C370",
    "/players_icon/image_8.png": "#38D0E7",
  };

  // Fonction de sélection aléatoire d'image
  const assignRandomImage = (usedImages) => {
    const availableImages = images.filter(image => !usedImages.includes(image));
    const randomImage = availableImages[Math.floor(Math.random() * availableImages.length)];
    const color = imageColors[randomImage] || "#000000";
    return { image: randomImage, color };
  };

  const [players, setPlayers] = useState([assignRandomImage([])]); // Le premier joueur est initialisé avec une image aléatoire
  const [industry, setIndustry] = useState("");
  const [modalPlayerIndex, setModalPlayerIndex] = useState(null);
  const navigate = useNavigate();

  // Utiliser usedImages ici après que les joueurs aient été initialisés
  const usedImages = players.map(player => player.image);

  const handleSubmit = () => {
    if (!industry || players.length < minPlayers || players.some(player => !player.name || !player.image)) {
      alert("Please complete all fields before proceeding.");
      return;
    }
    navigate("/game", { state: { players, industry } });
  };

  const selectImageForPlayer = (image) => {
    const color = imageColors[image] || "#000000";
    setPlayers(players.map((player, index) =>
      index === modalPlayerIndex ? { ...player, image, color } : player
    ));
    setModalPlayerIndex(null); // Close the modal after selection
  };

  const handleImageClick = (index) => {
    setModalPlayerIndex(index); // Open the modal when the player's avatar is clicked
  };

  return (
<div className="container">
  <header className="player_header">
    <img src="/logo.png" alt="Logo Ready, Set, Post!" />
  </header>
  <div className="image-overlay-player"/>
  <div className="content">
    <div className="title_industry">Industry name</div>
    <input
      type="text"
      placeholder="Enter industry"
      value={industry}
      onChange={(e) => setIndustry(e.target.value)}
      className="input-industry"
    />

    <div className="title">Choose your names</div>
    <div className="players-grid">
      {players.map((player, index) => (
        <div
          key={index}
          style={{
            marginBottom: "20px",
            display: "flex",
            flexDirection: "column", // Arrange l'avatar et le champ en colonne
            alignItems: "center",
          }}
        >
          {/* Avatar du joueur */}
          <img
            src={player.image || "placeholder.png"} // Image de l'avatar
            alt="Player Avatar"
            onClick={() => handleImageClick(index)}
            style={{
              width: "60px",
              height: "60px",
              borderRadius: "50%",
              cursor: "pointer",
              border: player.image ? `2px solid ${player.color}` : "2px solid red", // Bordure colorée
              marginBottom: "10px", // Espacement avec l'input
            }}
          />
          {/* Input du joueur */}
          <input
            type="text"
            placeholder="Enter your name"
            value={player.name}
            onChange={(e) =>
              setPlayers(players.map((p, i) =>
                i === index ? { ...p, name: e.target.value } : p
              ))
            }
            className="player-input"
            style={{
              color: player.color || "#000", // Couleur du texte basée sur l'icône
            }}
          />
        </div>
      ))}
    </div>

    {/* Buttons moved inside content */}
    <div className="buttons-container">
      {players.length < maxPlayers && (
        <button
          className="add-player-button"
          onClick={() =>
            setPlayers([...players, { name: "", ...assignRandomImage(usedImages) }])
          }
        >
          Add Player
        </button>
      )}
      
      <button onClick={handleSubmit} className="ready-button">
        Ready
      </button>
    </div>
  </div>

  {/* Modal for selecting player image */}
  {modalPlayerIndex !== null && (
    <div className="player_modal">
      <div className="player_modal-content">
        <div className="image-grid">
          {images.filter(image => !usedImages.includes(image)).map((image) => (
            <img
              key={image}
              src={image}
              alt="Choose"
              onClick={() => selectImageForPlayer(image)}
              className="player_modal-image"
            />
          ))}
        </div>
        <button onClick={() => setModalPlayerIndex(null)}>Close</button>
      </div>
    </div>
  )}



      {modalPlayerIndex !== null && (
        <div className="player_modal">
          <div className="player_modal-content">
            <div className="image-grid">
              {images.filter(image => !usedImages.includes(image)).map((image) => (
                <img
                  key={image}
                  src={image}
                  alt="Choose"
                  onClick={() => selectImageForPlayer(image)}
                  className="player_modal-image"
                />
              ))}
            </div>
            <button onClick={() => setModalPlayerIndex(null)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default PlayerSetup;
