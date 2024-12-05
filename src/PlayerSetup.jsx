import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function PlayerSetup() {
  const [players, setPlayers] = useState([{ name: "", image: "", color: "" }]);
  const [industry, setIndustry] = useState(""); // Industry for all players
  const [modalPlayerIndex, setModalPlayerIndex] = useState(null); // Tracks which player's modal is open
  const navigate = useNavigate();

  const maxPlayers = 8; // Maximum number of players
  const minPlayers = 2; // Minimum number of players

  const images = [
    "players_icon/image_1.png", "players_icon/image_2.png", "players_icon/image_3.png", "players_icon/image_4.png",
    "players_icon/image_5.png", "players_icon/image_6.png", "players_icon/image_7.png", "players_icon/image_8.png",
  ]; // Replace with your actual image paths
  
  // Add colors corresponding to each image (for example)
  const imageColors = {
    "players_icon/image_1.png": "#E7386F", 
    "players_icon/image_2.png": "#E7C138", 
    "players_icon/image_3.png": "#F35D18", 
    "players_icon/image_4.png": "#8FC257", 
    "players_icon/image_5.png": "#F33218", 
    "players_icon/image_6.png": "#9747FF",
    "players_icon/image_7.png": "#62C370", 
    "players_icon/image_8.png": "#38D0E7", 
  };

  const usedImages = players.map(player => player.image);
  const availableImages = images.filter(image => !usedImages.includes(image));

  const handleSubmit = () => {
    if (!industry) {
      alert("Please enter an industry.");
      return;
    }

    // Ensure there are at least 2 players
    if (players.length < minPlayers) {
      alert(`Please add at least ${minPlayers} players.`);
      return;
    }

    const isValid = players.every(player => player.name && player.image);
    if (!isValid) {
      alert("Please complete all fields for all players.");
      return;
    }

    // Pass players and industry to the next page
    navigate("/game", { state: { players, industry } });
  };

  const assignRandomImage = () => {
    const randomImage = availableImages[Math.floor(Math.random() * availableImages.length)];
    const color = imageColors[randomImage] || "#000000"; // Default color is black if no color found
    return { image: randomImage, color }; // Return the image with its color
  };

  const handleImageClick = (index) => {
    setModalPlayerIndex(index);
  };

  const selectImageForPlayer = (image) => {
    const color = imageColors[image] || "#000000"; // Default color is black if no color found
    setPlayers(players.map((player, index) =>
      index === modalPlayerIndex ? { ...player, image, color } : player
    ));
    setModalPlayerIndex(null); // Close the modal
  };

  return (
    <div>
      <h2>Player Setup</h2>

      {/* Input for Industry */}
      <div style={{ marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Enter industry"
          value={industry}
          onChange={(e) => setIndustry(e.target.value)}
          style={{ width: "300px", padding: "10px", marginBottom: "10px" }}
        />
      </div>

      {/* Input for Players */}
      {players.map((player, index) => (
        <div key={index} style={{ marginBottom: "10px", display: "flex", alignItems: "center" }}>
          <input
            type="text"
            placeholder="Enter your name"
            value={player.name}
            onChange={(e) =>
              setPlayers(players.map((p, i) =>
                i === index ? { ...p, name: e.target.value } : p
              ))
            }
            style={{
              marginRight: "10px",
              color: player.color, // Only change text color to match the selected icon color
            }}
          />
          <img
            src={player.image || (index === 0 ? assignRandomImage().image : "placeholder.png")} // First player gets random image
            alt="Player Avatar"
            onClick={() => handleImageClick(index)}
            style={{
              width: "50px",
              height: "50px",
              borderRadius: "50%",
              cursor: "pointer",
              border: player.image ? "2px solid green" : "2px solid red",
            }}
          />
        </div>
      ))}

      <button
        onClick={() =>
          setPlayers([...players, { name: "", image: assignRandomImage().image, color: assignRandomImage().color }])
        }
        disabled={players.length >= maxPlayers} // Disable button if max players are reached
        style={{ marginRight: "10px" }}
      >
        Add Player
      </button>
      <button onClick={handleSubmit}>Start Game</button>

      {/* Image Selection Modal */}
      {modalPlayerIndex !== null && (
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
          }}
        >
          <div
            style={{
              backgroundColor: "#fff",
              padding: "20px",
              borderRadius: "10px",
              display: "flex",
              flexWrap: "wrap",
              gap: "10px",
              justifyContent: "center",
            }}
          >
            {availableImages.map((image) => (
              <img
                key={image}
                src={image}
                alt="Avatar Option"
                onClick={() => selectImageForPlayer(image)}
                style={{
                  width: "50px",
                  height: "50px",
                  borderRadius: "50%",
                  cursor: "pointer",
                  border: "2px solid #000",
                }}
              />
            ))}
            <button
              onClick={() => setModalPlayerIndex(null)}
              style={{ marginTop: "20px", padding: "10px 20px", cursor: "pointer" }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default PlayerSetup;
