import { useState } from "react";
import { Wheel } from "react-custom-roulette";

const data = [
    { option: "1" },
    { option: "2" },
    { option: "3" },
    { option: "4" },
    { option: "5" },
    { option: "6" },
];

export default function Roulette() {
    const [mustSpin, setMustSpin] = useState(false);
    const [prizeNumber, setPrizeNumber] = useState(0);

    const handleSpinClick = () => {
        // Choisir un nouveau prix aléatoire
        if (!mustSpin) {
            const newPrizeNumber = Math.floor(Math.random() * data.length);
            setPrizeNumber(newPrizeNumber);
            setMustSpin(true);
        }
    };

    const handleStopSpinning = () => {
        // Petit délai avant de réinitialiser l'état pour éviter un jitter
        setTimeout(() => {
            setMustSpin(false);  // Arrêt de l'animation de manière fluide
        });  // Temps ajustable pour assurer que la roue a bien fini son mouvement
    };

    return (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "20px" }}>
            <Wheel
                mustStartSpinning={mustSpin}
                prizeNumber={prizeNumber}
                data={data}
                outerBorderColor="#f2f2f2"
                outerBorderWidth={10}
                innerBorderColor="#f2f2f2"
                radiusLineColor="#dedede"
                radiusLineWidth={1}
                fontSize={15}
                textColors={["#ffffff"]}
                backgroundColors={[
                    "#F22B35",
                    "#F99533",
                    "#24CA69",
                    "#514E50",
                    "#46AEFF",
                    "#9145B7",
                ]}
                onStopSpinning={handleStopSpinning}  // Gère la fin de l'animation
            />
            <button onClick={handleSpinClick} disabled={mustSpin}>
                {mustSpin ? "Spinning..." : "SPIN"}
            </button>
            <p>Result: {!mustSpin ? data[prizeNumber].option : "Waiting..."}</p>
        </div>
    );
}
