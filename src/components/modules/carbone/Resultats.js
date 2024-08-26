import { useEffect, useState } from "react";
import Content from "../../Content";
import axios from "axios";

import BaseUrl from "../../config/baseUrl";

// const baseUrl = 'http://127.0.0.1:8000/api';
const url = BaseUrl();
function ResultatSimulation({simulate}){

    const [especeSimulates,setEspeceSimulates] = useState([]);
    const [simulateData,setSimulateData] = useState([]);
    const [categorieEspeces,setCategorieEspeces]= useState({
        "forestier":'',
        "fruitier":'',
        "legumineuse":''
    });

    const [qtyTotal,setQtyTotal] = useState(0);

    useEffect(()=>{
        if(simulate){
            try {
                axios.get(url+'/simulate-list/?sID='+simulate).then((resp)=>{
                    setSimulateData(resp.data[0])
                });

                axios.get(url+'/especes-simulate-list/?sID='+simulate).then((resp)=>{
                    setEspeceSimulates(resp.data)
                });
            } catch (error) {
                 
            }
        }
    },[simulate])


    const categoryDetailFunction=()=>{
        let quantity = 0;
        let forest = 0;
        let fruit = 0;
        let legume = 0;

        especeSimulates.forEach((esp)=>{
            quantity = quantity + esp.quantity

            if(esp.espece.categorie == 1){
                forest = forest + 1
            }

            if(esp.espece.categorie == 2){
                fruit = fruit + 1
            } 

            if(esp.espece.categorie == 3){
                legume = legume + 1
            }
        });

        setQtyTotal(quantity);
        setCategorieEspeces({
            'forestier':forest,
            'fruitier':fruit,
            'legumineuse':legume
        })
    }


    useEffect(()=>{
        categoryDetailFunction();
    },[especeSimulates])

    
    return (
        <>
      

                <div className="mb-9 border p-3" style={{"backgroundColor":"white"}}>
                <h2 className="mb-2 text-success text-center">FELICITATION SIMULATION TERMINEE !!! </h2>
                <div className="row align-items-center mb-3 gx-3 gy-2">
                    <div className="col-12 col-sm-auto">
                    <p className="text-800 lh-sm mb-2">CODE DE SIMULATION <a className="fw-bold ms-1" href="#!">#{simulateData.code}</a></p>
                    </div>
                     <div className="col-12 col-sm-auto flex-grow-1">
                    <div className="row align-items-center flex-wrap gy-1">
                        <div className="col-auto flex-grow-1">
                        <p className="text-800 lh-sm mb-0">Année de peuplement : <a className="fw-bold ms-1" href="#!">{simulateData.anneePeuplement} ans</a></p>
                        </div>
                        {/* <div className="col-auto">
                        <div className="dropdown"><button className="btn dropdown-toggle dropdown-caret-none px-0 text-900" type="button" data-bs-toggle="dropdown" aria-expanded="false">More action<span className="fas fa-chevron-down ms-2 fs--2"></span></button>
                            <ul className="dropdown-menu dropdown-menu-end">
                            <li><a className="dropdown-item" href="#">Action</a></li>
                            <li><a className="dropdown-item" href="#">Another action</a></li>
                            <li><a className="dropdown-item" href="#">Something else here</a></li>
                            <li><a className="dropdown-item" href="#">Cancel</a></li>
                            </ul>
                        </div>
                        </div> */}
                    </div>
                    </div> 
                </div>
                <div className="row gx-5">
                    <div className="col-12 col-xl-8 col-xxl-9">
                    <div id="orderTable">
                        <div className="table-responsive scrollbar">
                        <table className="table fs--1 mb-0 border-top border-200">
                            <thead>
                            <tr>
                                {/* <th className="sort white-space-nowrap align-middle fs--2" scope="col"></th> */}
                                <th className="sort white-space-nowrap align-middle" scope="col" style={{"minWidth":"100px"}} data-sort="products">NOM USUEL</th>
                                <th className="sort align-middle ps-4" scope="col" data-sort="color" style={{"width":"250px"}}>NOM SCIENTIFIQUE</th>
                                <th className="sort align-middle ps-4" scope="col" data-sort="size" style={{"width":"300px"}}>DENSITE</th>
                                <th className="sort align-middle text-end ps-4" scope="col" data-sort="price" style={{"width":"150px"}}>CO2 ANNUEL (Kg)</th>
                                <th className="sort align-middle text-end ps-4" scope="col" data-sort="total" style={{"width":"250px"}}>QUANTITE PRODUIT</th>
                                <th className="sort align-middle text-end ps-4" scope="col" data-sort="total" style={{"width":"250px"}}>CO2 STOCKE en eq CO2 (tonne)</th>
                            </tr>
                            </thead>
                            <tbody className="list" id="order-table-body"> 
                                {especeSimulates.map((espece,index)=>
                                     <tr className="hover-actions-trigger btn-reveal-trigger position-static">
                              
                                     <td className="products align-middle py-0">{espece.espece.libelle}</td>
                                     <td className="color align-middle white-space-nowrap text-900 py-0 ps-4">{espece.espece.accronyme}</td>
                                     <td className="size align-middle white-space-nowrap text-700 fw-semi-bold py-0 ps-4">{espece.espece.densite}</td>
                                     <td className="price align-middle text-900 fw-semi-bold text-end py-0 ps-4">{espece.espece.co2_annuel}</td>
                                     <td className="total align-middle fw-bold text-1000 text-end py-0 ps-4">{espece.quantity}</td>
                                     <td className="total align-middle fw-bold text-1000 text-end py-0 ps-4">{espece.carboneStocke}</td>
                                 </tr>
                                )}
                           
                            </tbody>
                        </table>
                        </div>
                    </div>
                    <div className="d-flex flex-between-center py-3 border-bottom mb-6">
                        <p className="text-1100 fw-semi-bold lh-sm mb-0">Carbone total stocké eq CO2 (tonne) :</p>
                        <p className="text-1100 fw-bold lh-sm mb-0">{simulateData.totalCarbone}</p>
                    </div>
                    </div>
                    <div className="col-12 col-xl-4 col-xxl-3">
                    <div className="row">
                        <div className="col-12">
                        <div className="card mb-3">
                            <div className="card-body">
                            <h3 className="card-title mb-4">Resumé</h3>
                            <div>
                                <div className="d-flex justify-content-between">
                                <p className="text-900 fw-semi-bold">Especes Totales :</p>
                                <p className="text-1100 fw-semi-bold text-primary">{especeSimulates.length}</p>
                                </div>
                                <div className="d-flex justify-content-between">
                                <p className="text-900 fw-semi-bold">Especes Forestieres :</p>
                                <p className="text-primary fw-semi-bold">{categorieEspeces.forestier}</p>
                                </div>
                                <div className="d-flex justify-content-between">
                                <p className="text-900 fw-semi-bold">Especes Fruitiere :</p>
                                <p className="text-1100 fw-semi-bold text-primary">{categorieEspeces.fruitier}</p>
                                </div>
                                <div className="d-flex justify-content-between">
                                <p className="text-900 fw-semi-bold">Especes Legumineuse :</p>
                                <p className="text-1100 fw-semi-bold text-primary">{categorieEspeces.legumineuse}</p>
                                </div>
                              {/*   <div className="d-flex justify-content-between">
                                <p className="text-900 fw-semi-bold">Subtotal :</p>
                                <p className="text-1100 fw-semi-bold">$665</p>
                                </div> */}
                                <div className="d-flex justify-content-between">
                                <p className="text-900 fw-semi-bold">Plants total produits :</p>
                                <p className="text-1100 fw-semi-bold text-primary">{qtyTotal}</p>
                                </div>
                            </div>
                            <div className="d-flex justify-content-between border-top border-top pt-4">
                                <h4 className="mb-0">CO2 stocké (t):</h4>
                                <h4 className="mb-0 text-primary">{simulateData.totalCarbone}</h4>
                            </div>
                            </div>
                        </div>
                        </div>
                        <div className="col-12">
                        <div className="card">
                            <div className="card-body">
                             
                                <button className="btn btn-warning w-100" onClick={()=>window.location.reload()}>Nouvelle simulation</button>
                            </div>
                        </div>
                        </div>
                    </div>
                    </div>
                </div>
                </div>
            
    
          
        </>
    )
}

export default ResultatSimulation;