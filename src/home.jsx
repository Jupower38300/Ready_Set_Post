import { useNavigate } from "react-router";
import "./home.css";

function Home () {

    const navigate = useNavigate();

    const handleNavigation = () => {
        navigate("/setup");
    }

    return (
        <>
            <header>   
                <img src="/logo.png" alt="Logo Ready, Set, Post!"/>
            </header>
            <div class="image-overlay"></div>
            <div className="main_home">
                <div className="img_home">
                    <img src="/home_character.png"/>
                </div>
                <div className="text_home">
                    <h1>Reimagine the way you learn community management :</h1>
                    <p>
                        A fun and interactive board game to master editorial lines and calendars in class!
                        <br></br><br></br>
                        <strong>Ready to roll the dice?</strong>
                    </p>

                    <button className="start_button" onClick={handleNavigation}> <strong>Ready</strong> </button>
                </div>
            </div>
        </>
    )
}

export default Home;