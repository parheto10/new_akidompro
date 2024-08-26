import React, {Fragment} from 'react';
import {useEffect, useState} from "react";
import HAUT_SCIO from "../../data/decret_scio.pdf"
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
                        src={HAUT_SCIO}
                        width="100%"
                        height="1000px"
                        allow="autoplay"
                        title="DECRET SCIO"
                    />
                    :
                    ""
                }
            </div>
        </Fragment>
    )

}


export default RapportAnalyseAgrial;