import Select from "react-select";
import Content from "../../Content";
import { useEffect, useState } from "react";
import axios from "axios";
import ResultatSimulation from "./Resultats";
import Swal from "sweetalert2";

import BaseUrl from "../../config/baseUrl";

// const baseUrl = 'http://127.0.0.1:8000/api';
const url = BaseUrl();

function SimulationCarbon(){
    const [nameComponent,setNameComponents] = useState('');
    const [especes,setEspeces] = useState([]);
    const [selectOptionEspece,setSelectOptionEspece] = useState(null);
    const [peuplement,setPeuplementData] = useState('1');
    const [quantity,setQuantityData] = useState(1);
    const [especeSimulates,setEspeceSimulates] = useState([]);
    const [loadingStart,setLoadingStart] = useState(false);
    const [simulate,setSimulate] = useState('');
    const [loadingSimulate,setLoadingSimulate] = useState(false);

    const [errorEsp,setErrorEsp] = useState('');
    const [errorPeupl,setErrorPeupl] = useState('');
    const [errorQty,setErrorQty] = useState('');


    const isErrorFunct=()=>{
        if(selectOptionEspece != null){setErrorEsp('')};
        if(peuplement != ''){setErrorPeupl('')};
        if(quantity != ''){setErrorQty('')};
    }


    useEffect(()=>{
        try {
            axios.get(url+'/especes/').then((resp)=>{
                setEspeces(resp.data);
            })
        } catch (error) {
            console.log(error);
        }
        isErrorFunct();
    },[]);

    const options = especes.map((espece)=>(({
        label: `${espece.libelle}`,
        value:`${espece.id}`
    })));


    const handleChangeSelectOptionEspece=(selectOption)=>{
        setSelectOptionEspece(selectOption.value);
    }

    const submitEspece=()=>{
        setErrorEsp('');
        setErrorQty('');

        if(selectOptionEspece != null && quantity != ''){
            const _formData = new FormData();
            _formData.append('simulateID',simulate);
            _formData.append('espece',selectOptionEspece);
            _formData.append('quantity',quantity);

            try {
                axios.post(url+'/espece-simulate/',_formData).then((resp)=>{
                    if(resp.data.bool){
                        setEspeceSimulates(resp.data.especeTab);
                    }else{
                        setErrorEsp(resp.data.msg)
                    }
                })
            } catch (error) {
                console.log(error);
            }
        }

        if(selectOptionEspece == null){setErrorEsp('espece obligatoire')};
        if(quantity == ''){setErrorQty('champs est vide.')};
    }

    const lanceSimulateFunction=()=>{
        const _formData = new FormData();
        _formData.append('peuplement',peuplement);

        setLoadingStart(true);
        try {
            axios.post(url+'/start-simulate/',_formData).then((resp)=>{
                setLoadingStart(false);
                if(resp.data.bool){
                    setSimulate(resp.data.simulateID);
                    setNameComponents('create');
                }
            })
        } catch (error) {
            console.log(error);
        }
    }

    const submitSimulate =()=>{
        setErrorEsp('');
        const _formData = new FormData();
        _formData.append('simulateID',simulate);
        _formData.append('peuplement',peuplement);

        setLoadingSimulate(true);

        if(especeSimulates.length > 0) {
            try {
                axios.post(url+'/resultat-simulate/',_formData).then((resp)=>{
                    setLoadingSimulate(false);
                    if(resp.data.bool){
                        setNameComponents('result');
                    }else{
                        Swal.fire({
                            title: 'ATTENTION !',
                            text: resp.data.msg,
                            icon: 'error',
                            showCancelButton: false,
                            confirmButtonColor: '#3085d6',
                            confirmButtonText: 'OK'
                          }).then((result) => {
                            if (result.isConfirmed) {
                                window.location.reload();
                            }
                          }); 
                    }
                })
            } catch (error) {
                console.log(error);
            }
        }else{
            setLoadingSimulate(false);
            setErrorEsp("Espèce inexistant !")
        }
        
    }


    return (
        <>
        <Content>
     
        
            <h2 className="mb-4 text-center border p-2 rounded" style={{"backgroundColor":"white"}}>
                {loadingStart && 
                    <>
                        <div className="spinner-grow text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                        </div>
                        <div className="spinner-grow text-secondary" role="status">
                        <span className="visually-hidden">Loading...</span>
                        </div>
                        <div className="spinner-grow text-success" role="status">
                        <span className="visually-hidden">Loading...</span>
                        </div>
                    </>
                }
                Simulation Carbone {simulate == ""  && <button className="btn btn-warning px-5 px-sm-15 " onClick={lanceSimulateFunction}>Lancer une nouvelle simulation</button>}
            </h2>

            {nameComponent == 'create' &&
                <>
            <div className="row border" style={{"backgroundColor":"white"}}>
                <div className="col-xl-2"></div>
                <div className="col-xl-8">
                <div className="row g-3 my-4">
                    <div className="col-sm-3 col-md-6">
                        <div className="form-floating">
                            <input className="form-control" id="floatingInputGrid" type="text" placeholder="Project title" name="peuplement" onChange={(e)=>setPeuplementData(e.target.value)} value={peuplement} />
                            <label for="floatingInputGrid">Année de peuplement des espèces</label>
                        </div>
                        {errorPeupl != "" && <span className="text-danger">{errorPeupl}</span>}
                    </div>

                    <div className="position-relative">
                        <hr className="bg-200 mt-1" />
                        <div className="divider-content-center bg-white">Ajouter des essences</div>
                    </div>

                    <div className="col-sm-3 col-md-6">
                        <div className="form-floating">
                        <i className="mb-2">Especes</i>
                            <Select options={options} onChange={handleChangeSelectOptionEspece} />
                            
                        </div>
                        {errorEsp != "" && <span className="text-danger">{errorEsp}</span>}
                    </div>

                    <div className="col-sm-3 col-md-3">
                    
                            <i className="mb-2">Quantités de plants</i>
                            <input className="form-control" id="floatingInputGri" type="text" placeholder="Quantité d'espèce" name="quantity" onChange={(e)=>setQuantityData(e.target.value)} value={quantity} />
                            {errorQty != "" && <span className="text-danger">{errorQty}</span>}
                    </div>

                    <div className="col-sm-3 col-md-3">
                     
                            <div className="col-auto"><button class={!loadingSimulate ? "btn btn-success px-5 my-4 " : "btn btn-success px-5 my-4 disabled"} onClick={submitEspece}>Valider</button></div>
                       
                    </div>

                    {especeSimulates.length > 0 && 
                        <>
                    <div className="position-relative">
                        <hr className="bg-200 mt-1" />
                        <div className="divider-content-center bg-white">Leste des espèces</div>
                    </div>


                    <div id="tableExample2" style={{"backgroundColor":"white"}} >
                        <div className="table-responsive">
                          <table className="table table-striped table-sm fs--1 mb-0 bg-light">
                            <thead>
                              <tr>
                                <th className="sort border-top ps-3" data-sort="name">Nom espèce</th>
                                <th className="sort border-top" data-sort="email">Quantités</th>
                              </tr>
                            </thead>
                            <tbody className="list">
                                {especeSimulates.map((espece,index)=>
                                    <tr>
                                        <td className="align-middle ps-3 name">{espece.libelle}</td>
                                        <td className="align-middle email">{espece.quantity}</td>
                                    </tr>
                                )}
                               
                              </tbody>
                          </table>
                        </div>
                       
                      </div>
                        </>
                    }
                    
                    

                  
                   
                    
                    
                    <div className="col-12 gy-6">
                    <div className="row g-3 justify-content-start">
                        <button class={loadingSimulate ? "btn btn-primary px-5 px-sm-15 disabled" : "btn btn-primary px-5 px-sm-15" } onClick={submitSimulate}>Lancer la simulation</button>
                    </div>
                    </div>
                </div>
                </div>
                <div className="col-xl-2"></div>
            </div>
                </>
            }

            {nameComponent == 'result' &&
                 <ResultatSimulation  simulate={simulate} /> 
            }
      
            </Content> 

            
        </>
    )
}

export default SimulationCarbon;