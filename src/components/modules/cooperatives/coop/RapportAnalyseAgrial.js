import React, {Fragment} from 'react';
import {useEffect, useState} from "react";
import RAPPORT_AGRIAL from "../../../data/rapport_final_agrial.pdf"
import UserContext from "../../../context/useContext";

function RapportAnalyseAgrial() {
    const [cooperatives,setCooperatives] = useState([]);
    const user =  UserContext();

    // useEffect(()=>{
    //
    // },[user,sideID])
    return (
        <Fragment>
            <div>
                {user && user?.id === 8
                    ?
                    <iframe
                        src={RAPPORT_AGRIAL}
                        width="100%"
                        height="1000px"
                        allow="autoplay"
                        title="RAPPORT D'ANALYSE AGRIAL"
                    />
                    :
                    ""
                }
            </div>
        </Fragment>
    )

}


export default RapportAnalyseAgrial;