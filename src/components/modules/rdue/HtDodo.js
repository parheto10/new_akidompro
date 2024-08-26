import React, {Fragment} from 'react';
import {useEffect, useState} from "react";
import HAUTE_DODO from "../../data/decret_Haute_dodo.pdf"
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
                        src={HAUTE_DODO}
                        width="100%"
                        height="1000px"
                        allow="autoplay"
                        title="DECRET HAUTE DODO"
                    />
                    :
                    ""
                }
            </div>
        </Fragment>
    )

}


export default RapportAnalyseAgrial;