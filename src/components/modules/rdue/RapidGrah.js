import React, {Fragment} from 'react';
import {useEffect, useState} from "react";
import Rapide_Grah from "../../data/decret_Rapide_grah.pdf"
import UserContext from "../../context/useContext";

function RapportAnalyseAgrial() {
    const [cooperatives,setCooperatives] = useState([]);
    const user =  UserContext();

    return (
        <Fragment>
            <div>
                {user && user?.id === 8
                    ?
                    <iframe
                        src={Rapide_Grah}
                        width="100%"
                        height="1000px"
                        allow="autoplay"
                        title="DECRET RAPIDE GRAH"
                    />
                    :
                    ""
                }
            </div>
        </Fragment>
    )

}


export default RapportAnalyseAgrial;