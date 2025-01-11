import { Menu03Icon } from "hugeicons-react";
import { Sun01Icon } from "hugeicons-react";
import { Film01Icon } from "hugeicons-react";


const Dashboard = () => {
    return (
        <div className="dashboard">
            <div className="top">

                <div className="leftSectionTop">
                    <div className="expandIcon">
                        <Menu03Icon />
                    </div>
                    <div className="titleAndLogoContainer" >
                        <h1> Watchlist </h1>
                        <Film01Icon color ="white"/> 
                    </div>
                </div>


                <div className="darkLightContainer">
                    <Sun01Icon />
                </div>
            </div>

            <nav>
                <div className="navContainer">
                    <p> hey </p>
                </div>
            </nav>

        </div>
    );
}

export default Dashboard;


