import React, {Fragment} from 'react';
import {useEffect, useState} from "react";
import RAPPORT_COOPAHS from "../../../data/rapport_final_agrial.pdf"
import UserContext from "../../../context/useContext";


// Create styles
// const styles = StyleSheet.create({
//   page: {
//     flexDirection: 'row',
//     backgroundColor: '#E4E4E4'
//   },
//   section: {
//     margin: 10,
//     padding: 10,
//     flexGrow: 1
//   }
// });



function RapportAnalyseCoopaahs() {
    const [cooperatives,setCooperatives] = useState([]);
    const user =  UserContext();

    // useEffect(()=>{
    //
    // },[user,sideID])
    return (
        <Fragment>
            <div>
                {user && user?.id === 11
                    ? <iframe
                        src={RAPPORT_COOPAHS}
                        width="100%"
                        height="1000px"
                        allow="autoplay"
                        title="RAPPORT D'ANALYSE COOPAAHS"
                    />
                    : ""
                }
                {/*<Document file={RAPPORT}>*/}
                {/*    /!*<Page pageNumber={1} />*!/*/}
                {/*</Document>*/}
            </div>
        </Fragment>
    )

}


export default RapportAnalyseCoopaahs;