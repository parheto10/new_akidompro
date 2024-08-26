import {Fragment, useEffect, useState} from "react";
import Content from "../../../Content";
import { Link, useNavigate, useParams } from "react-router-dom";
import UserContext from "../../../context/useContext";
import axios from "axios";
import Swal from "sweetalert2";
import Validation from "../../../Validation";

import ProducteurCoopList from "./tabs/ProducteurList";
import ParcelleCoopList from "./tabs/ParcelleList";
import RecolteCoopList from "./tabs/RecolteList";
import ParamsCoopList from "./tabs/ParamsList";
import { useTranslation } from "react-i18next";



import BaseUrl from "../../../config/baseUrl";

// const baseUrl = 'http://127.0.0.1:8000/api';
const url = BaseUrl();
function ViewsCoop(){
    const {t} = useTranslation();
    const navigate = useNavigate();
    const [errors, setErrorM] = useState({});
    const user = UserContext();
    const {coopID} = useParams();
    const [cooperative,setCooperative] = useState([]);
    const [campagneProj,setCampagneProj] = useState([]);
    const [campagne,setCampagne] = useState([]);
    const [groupeList,setGroupeList] = useState([]);
/*     const [prodList,setProdList] = useState([]);
    const [parcelleList,setParcelleList] = useState([]);
    const [cultures,setCultures] = useState([]);
    const [saisons,setSaisons] = useState([]); */


    const [nameComponent,setNameComponent] = useState('params');

   



    useEffect(()=>{
        try {

          if(coopID){

            axios.get(url+'/cooperative-list/?coopID='+coopID).then((resp)=>{
                setCooperative(resp.data[0]);
            });                       
          }
            
            axios.get(url+'/groupe-prod-list/').then((resp)=>{
              setGroupeList(resp.data)
            });

            if(user && user?.id){
                axios.get(url+'/campagnes-list/?userID='+user?.id).then((resp)=>{
                  setCampagneProj(resp.data)
                });

                axios.get(url+'/campagnes-list/?resp='+user?.id+'&open').then((resp)=>{
                  setCampagne(resp.data[0])
                });
            }

            


        } catch (error) {
            console.log(error)
        }
    },[coopID,user]);


    useEffect(()=>{
      if(cooperative && cooperative.projet && cooperative.projet.id)
      {
        //console.log(cooperative.projet?.id);
        /* axios.get(baseUrl+'/campagne-proj-list/?projId='+cooperative.projet?.id).then((resp)=>{
          setCampagneProj(resp.data)
        }); */

       /*  axios.get(baseUrl+'/campagne-proj-list/?now').then((resp)=>{
          setCampagne(resp.data[0])
        }); */
      }

     

    },[cooperative])


    const viewProjDetail=(projId)=>{
      navigate('/views-projet/'+projId+'/');
      //window.location.reload();
    }



    return (
        <Fragment>
            <Content sideID={"cooperatives"} parent={"generalite"}>        
              <div className="pb-9 mt-5">
                <div className="row align-items-center justify-content-between g-3 mb-4">
                  {/* <div className="col-12 col-md-auto"  #4D242C>
                    <h2 className="mb-0">Deal details</h2>
                  </div> */}
                  <div className="col-12 col-md-auto d-flex">
                      <Link className="btn px-3 px-sm-5 me-2" style={{backgroundColor: "#5F7929", color: "#fff", fontWeight: "bold"}} to={`/coops/producteur-list/${cooperative.id}`}>
                          <span className="fa-solid fa-people-group me-sm-2"></span>
                          <span className="d-none d-sm-inline">{t("Producteurs")}</span>
                      </Link>
                      <Link className="btn me-2" style={{backgroundColor: "#94a91b", color: "#fff", fontWeight: "bold"}} to={`/coops/parcelles-list/${cooperative.id}`}>
                          <span className="fa-solid fa-tree me-2"></span>
                          <span>{t("Parcelles")}</span>
                      </Link>
                      <Link className="btn me-2" style={{backgroundColor: "#EE9F27", color: "#fff", fontWeight: "bold"}} to={`/coops/productions-list/${cooperative.id}`}>
                          <span className="fa-solid fa-cubes me-2"></span>
                          <span>{t("Productions")}</span>
                      </Link>
                      {/* <Link className="btn me-2" style={{backgroundColor: "#4D242C", color: "#fff", fontWeight: "bold"}} to={`/coops/productions-list/${cooperative.id}`}>
                          <span className="fa-solid fa-cubes me-2"></span>
                          <span>Formations</span>
                      </Link> */}
                  <div>
                    
                    </div> 
                  </div>
                </div>
                <div className="row g-4 g-xl-6">
                  <div className="col-xl-5 col-xxl-4">
                    <div className="sticky-leads-sidebar">
                      <div className="card mb-3">
                        <div className="card-body">
                          <div className="row align-items-center g-3">
                            <div className="col-12 col-sm-auto flex-1">
                              <h3 className="fw-bolder mb-2 line-clamp-1">{cooperative.nomCoop}</h3>
                            
                              <div className="progress mb-2" style={{"height":"5px"}}>
                                <div className="progress-bar" role="progressbar" style={{"width": "100%", backgroundColor: "#E6CA83" }}aria-valuenow="100" aria-valuemin="0" aria-valuemax="100"></div>
                              </div>
                              <div className="d-flex align-items-center justify-content-between">
                                <p className="mb-0"> {t("Campagne")}</p>
                                <div>
                                  <span className="d-inline-block lh-sm me-1" data-feather="clock" style={{"height":"16px","width":"16px"}}></span>
                                  <span className="d-inline-block lh-sm"> {campagne?.libelle}</span>
                              </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="card">
                        <div className="card-body">
                          <h4 className="mb-5">{t("Paramètrage")}</h4>
                          <div className="row g-3">
                            <div className="col-12">
                              <div className="mb-2 border-bottom">
                                <div className="d-flex flex-wrap justify-content-between mb-2">
                                  <h5 className="mb-0 text-1000 me-2">{t("Campagne")}</h5>
                                </div>
                                <select className="form-select mb-3" aria-label="category">
                                  {campagneProj.map((campagne, index) =>
                                      <option value={campagne?.id}>{campagne?.libelle}</option>
                                  )}
                                </select>
                              </div>
                              <div className="mb-1 border-bottom">
                                <h5 className="mb-0 text-1000 mb-2">{t("Projet")} : <h6
                                    className="fw-bold fs--1 float-end cursor-pointer text-success"
                                    onClick={() => viewProjDetail(cooperative.projet?.id)}>{cooperative.projet?.nomProjet}</h6>
                                </h5>
                              </div>
                              <div className="mb-3 border-bottom">
                                <h5 className="mb-0 text-1000 mb-2">{t("Région")} : <h6
                                    className="fw-bold fs--1 float-end" style={{color: "#94a91b"}}>{cooperative.region?.libelle}</h6></h5>
                              </div>
                              <div className="mb-3 border-bottom">
                                <h5 className="mb-0 text-1000 mb-2">{t("Siège")} : <h6
                                    className="fw-bold fs--1 float-end" style={{color: "#94a91b"}}>{cooperative.siege}</h6></h5>
                              </div>
                              <div className="mb-3 border-bottom">
                                {cooperative.total_production_coop
                                    ?
                                    <h5 className="mb-0 text-1000 mb-2">{t("Volume Production")} : <h6
                                        className="fw-bold fs--1 float-end" style={{color: "#94a91b"}}>{cooperative.total_production_coop.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")} (KG)</h6>
                                      {/*// className="fw-bold fs--1 float-end text-primary">{cooperative.total_production_coop.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")} (KG)</h6>*/}
                                    </h5>
                                    :
                                    <h5 className="mb-0 text-1000 mb-2">{t("Volume Production")} : <h6
                                        className="fw-bold fs--1 float-end" style={{color: "#94a91b"}}>0 (KG)</h6>
                                      {/*// className="fw-bold fs--1 float-end text-primary">{cooperative.total_production_coop.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")} (KG)</h6>*/}
                                    </h5>
                                }
                              </div>
                              {/*  <div className="mb-4">
                                <div className="d-flex flex-wrap justify-content-between mb-2">
                                  <h5 className="mb-0 text-1000 me-2">Section</h5><button className="fw-bold fs--1 btn btn-sm btn-primary" data-bs-toggle="modal" data-bs-target="#addEventModalSection">Ajouter une section</button>
                                </div><select className="form-select mb-3" aria-label="lead-source">

                                  {sectionsList.map((section,index)=>
                                      <option value={section.id}>{section.libelle}</option>
                                    )}                                          
                                </select>
                              </div>
                              <div className="mb-4">
                                <div className="d-flex flex-wrap justify-content-between mb-2">
                                  <h5 className="mb-0 text-1000 me-2">Cultures de production</h5><button className="fw-bold fs--1 btn btn-sm btn-primary" data-bs-toggle="modal" data-bs-target="#addEventModalCulture">Ajouter une culture</button>
                                </div>
                                <select className="form-select" aria-label="lead-source">
                                {cultures.map((culture,index)=>
                                      <option value={culture.id}>{culture.libelle}</option>
                                    )}   
                                </select>
                              </div> 

                              <div className="mb-4">
                                <div className="d-flex flex-wrap justify-content-between mb-2">
                                  <h5 className="mb-0 text-1000 me-2">Saisons de production</h5><button className="fw-bold fs--1 btn btn-sm btn-primary" data-bs-toggle="modal" data-bs-target="#addEventModalSaison">Ajouter une saison</button>
                                </div><select className="form-select" aria-label="lead-source">
                                  {saisons.map((saison,index)=>
                                      <option value={saison.id}>{saison.libelle}</option>
                                    )} 
                                </select>
                              </div>  */}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-xl-7 col-xxl-8">
                    <div className="card mb-5" style={{backgroundColor: "#94A91B"}}>
                    <div className="card-body">
                        <div className="row g-4 g-xl-1 g-xxl-3 justify-content-between">

                          <div className="col-sm-auto">
                            <div className="d-sm-block d-inline-flex d-md-flex flex-xl-column flex-xxl-row align-items-center align-items-xl-start align-items-xxl-center">
                              {/* <div className="d-flex bg-success-100 rounded flex-center me-3 mb-sm-3 mb-md-0 mb-xl-3 mb-xxl-0" style={{"width":"32px", "height":"32px"}}>
                                  <span className="text-success-600 dark__text-success-300" data-feather="dollar-sign" style={{"width":"24px", "height":"24px"}}></span>
                              </div> */}
                              <div className="text-center">
                                <p className="fw-bold mb-1">{t("Producteurs")}</p>
                                <h4 className="fw-bolder text-nowrap text-white">{cooperative.total_producteurs_coop}</h4>
                              </div>
                            </div>
                          </div>

                          <div className="col-sm-auto">
                            <div className="d-sm-block d-inline-flex d-md-flex flex-xl-column flex-xxl-row align-items-center align-items-xl-start align-items-xxl-center border-start-sm ps-sm-5">
                              {/* <div className="d-flex bg-info-100 rounded flex-center me-3 mb-sm-3 mb-md-0 mb-xl-3 mb-xxl-0" style={{"width":"32px", "height":"32px"}}>
                                  <span className="text-info-600 dark__text-info-300" data-feather="code" style={{"width":"24px", "height":"24px"}}></span>
                              </div> */}
                              <div>
                                <p className="fw-bold mb-1">{t("Parcelles")}</p>
                                <h4 className="fw-bolder text-nowrap text-white text-center">{cooperative.total_parcelles_coop}</h4>
                              </div>
                            </div>
                          </div>

                          <div className="col-sm-auto">
                            <div className="d-sm-block d-inline-flex d-md-flex flex-xl-column flex-xxl-row align-items-center align-items-xl-start align-items-xxl-center border-start-sm ps-sm-5">
                              {/* <div className="d-flex bg-primary-100 rounded flex-center me-3 mb-sm-3 mb-md-0 mb-xl-3 mb-xxl-0" style={{"width":"32px", "height":"32px"}}>
                                  <span className="text-primary-600 dark__text-primary-300" data-feather="layout" style={{"width":"24px", "height":"24px"}}></span>
                              </div> */}
                              <div>
                                <p className="fw-bold mb-1">{t("Superficie totale")} (Ha)</p>
                                {cooperative.sumSuperficie?.total > 0
                                    ? <h4 className="fw-bolder text-nowrap text-white text-center">{cooperative.sumSuperficie?.total.toFixed(2)}</h4>
                                    : <h4 className="fw-bolder text-nowrap text-white text-center">0</h4>
                                }
                              </div>
                            </div>
                          </div>

                          <div className="col-sm-auto">
                            <div className="d-sm-block d-inline-flex d-md-flex flex-xl-column flex-xxl-row align-items-center align-items-xl-start align-items-xxl-center border-start-sm ps-sm-5">
                              {/* <div className="d-flex bg-primary-100 rounded flex-center me-3 mb-sm-3 mb-md-0 mb-xl-3 mb-xxl-0" style={{"width":"32px", "height":"32px"}}>
                                  <span className="text-primary-600 dark__text-primary-300" data-feather="layout" style={{"width":"24px", "height":"24px"}}></span>
                              </div> */}
                              <div>
                                <p className="fw-bold mb-1">{t("Plants plantés")}</p>
                                { cooperative.sumPlantCoop?.total
                                  ? <h4 className="fw-bolder text-nowrap text-white text-center">{cooperative.sumPlantCoop?.total}</h4>
                                  : <h4 className="fw-bolder text-nowrap text-white text-center">0</h4>}
                              </div>
                            </div>
                          </div>

                          <div className="col-sm-auto">
                            <div className="d-sm-block d-inline-flex d-md-flex flex-xl-column flex-xxl-row align-items-center align-items-xl-start align-items-xxl-center border-start-sm ps-sm-5">
                              {/* <div className="d-flex bg-primary-100 rounded flex-center me-3 mb-sm-3 mb-md-0 mb-xl-3 mb-xxl-0" style={{"width":"32px", "height":"32px"}}>
                                  <span className="text-primary-600 dark__text-primary-300" data-feather="layout" style={{"width":"24px", "height":"24px"}}></span>
                              </div> */}
                              <div>
                                <p className="fw-bold mb-1">{t("CO2 stocké eq(T)")}</p>
                                {cooperative.carbonStockeCoop
                                    ?
                                    <h4 className="fw-bolder text-nowrap text-white text-center">{cooperative.carbonStockeCoop.toFixed(2)}</h4>
                                    :
                                    <h4 className="fw-bolder text-nowrap text-danger text-center">0</h4>
                                }
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>


                    <div className="px-xl-4 mb-7 bg-white">
                      <div className="row mx-0 mx-sm-3 mx-lg-0 px-lg-0">
                      <div className="col-sm-12 col-xxl-6 border-bottom py-3">
                        <table className="w-100 table-stats">
                          <tr>
                            <th></th>
                            <th></th>
                            <th></th>
                          </tr>

                          <tr>
                            <td className="py-2">
                              <div className="d-inline-flex align-items-center">
                                <div className="d-flex bg-success-100 rounded-circle flex-center me-3"
                                    style={{"width": "24px", "height": "24px"}}>
                                  <i className="fa-solid fa-person"></i>
                                </div>
                                <p className="fw-bold mb-0">{t("Responsable")}</p>
                              </div>
                            </td>
                            <td className="py-2 d-none d-sm-block pe-sm-2">:</td>
                            <td className="py-2">
                              <div className="ps-6 ps-sm-0 fw-semi-bold mb-0 pb-3 pb-sm-0">{cooperative.respCoop}</div>
                            </td>
                          </tr>
                          <tr>
                            <td className="py-2">
                              <div className="d-inline-flex align-items-center">
                                <div className="d-flex bg-primary-100 rounded-circle flex-center me-3"
                                    style={{"width": "24px", "height": "24px"}}>
                                  <i className="fa-solid fa-phone"></i>
                                </div>
                                <p className="fw-bold mb-0">{t("Contact")}</p>
                              </div>
                            </td>
                            <td className="py-2 d-none d-sm-block pe-sm-2">:</td>
                            <td className="py-2"><a className="ps-6 ps-sm-0 fw-semi-bold mb-0 pb-3 pb-sm-0 text-900"
                                                    href="tel:+11123456789">{cooperative.contacts}</a></td>
                          </tr>

                          <tr>
                            <td className="py-2">
                              <div className="d-inline-flex align-items-center">
                                <div className="d-flex bg-success-100 rounded-circle flex-center me-3"
                                    style={{"width": "24px", "height": "24px"}}>
                                  <i className="fa-solid fa-truck-moving"></i>
                                </div>
                                <p className="fw-bold mb-0">{t("N° de Connaissement")}</p>
                              </div>
                            </td>
                            <td className="py-2 d-none d-sm-block pe-sm-2">:</td>
                            <td className="py-2">
                              <div className="ps-6 ps-sm-0 fw-semi-bold mb-0 pb-3 pb-sm-0">{cooperative.numConnaissement}</div>
                            </td>
                          </tr>


                        </table>
                      </div>
                        <div className="col-sm-12 col-xxl-6 border-bottom border-end-xxl py-3">
                          <table className="w-100 table-stats table-stats">
                            <tr>
                              <th></th>
                              <th></th>
                              <th></th>
                            </tr>
                            <tr>
                              <td className="py-2">
                                <div className="d-inline-flex align-items-center">
                                  <div className="d-flex bg-success-100 rounded-circle flex-center me-3"
                                      style={{"width": "24px", "height": "24px"}}>
                                    <i class="fa-solid fa-chart-simple"></i>
                                  </div>
                                  <p className="fw-bold mb-0">{t("Campagne en cours")} </p>
                                </div>
                              </td>
                              <td className="py-2 d-none d-sm-block pe-sm-2">:</td>
                              <td className="py-2">
                                <p className="ps-6 ps-sm-0 fw-semi-bold mb-0 mb-0 pb-3 pb-sm-0">{campagne?.libelle}</p>
                              </td>
                            </tr>
                            <tr>
                              <td className="py-2">
                                <div className="d-flex align-items-center">
                                  <div className="d-flex bg-info-100 rounded-circle flex-center me-3"
                                      style={{"width": "24px", "height": "24px"}}>
                                    <i class="fa-solid fa-chart-pie"></i>
                                  </div>
                                  <p className="fw-bold mb-0">{t("Volume Camp Préc")}: </p>
                                </div>
                              </td>
                              <td className="py-2 d-none d-sm-block pe-sm-2">:</td>
                              <td className="py-2">
                                { cooperative.total_production_coop ?
                                  <p className="ps-6 ps-sm-0 fw-semi-bold mb-0"> {cooperative.total_production_coop.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")} (KG)</p> :
                                  <p className="ps-6 ps-sm-0 fw-semi-bold mb-0">0 (KG)</p>
                                }
                              </td>
                            </tr>

                            <tr>
                              <td className="py-2">
                                <div className="d-inline-flex align-items-center">
                                  <div className="d-flex bg-success-100 rounded-circle flex-center me-3"
                                      style={{"width": "24px", "height": "24px"}}>
                                    <i className="fa-solid fa-info-circle"></i>
                                  </div>
                                  <p className="fw-bold mb-0">{t("N° Registre")}</p>
                                </div>
                              </td>
                              <td className="py-2 d-none d-sm-block pe-sm-2">:</td>
                              <td className="py-2">
                                <div
                                    className="ps-6 ps-sm-0 fw-semi-bold mb-0 pb-3 pb-sm-0">{cooperative.numRegistre}</div>
                              </td>
                            </tr>
                          </table>
                        </div>


                      </div>
                    </div>


                    <ul className="nav nav-underline deal-details scrollbar flex-nowrap w-100 pb-1 mb-6 bg-white" id="myTab"
                        role="tablist" style={{"overflow-y": "hidden"}}>
                      {/*<li className="nav-item text-nowrap me-2" role="presentation"><a className={nameComponent=='producteur'? "nav-link cursor-pointer active" :"nav-link cursor-pointer"} id="activity-tab" data-bs-toggle="tab" onClick={()=>setNameComponent('producteur')}> <span className="fa-solid fa-clipboard me-2 tab-icon-color"></span>Producteurs</a></li>
                      <li className="nav-item text-nowrap me-2" role="presentation"><a className={nameComponent=='parcelle'? "nav-link  cursor-pointer active" :"nav-link cursor-pointer"} id="notes-tab" data-bs-toggle="tab" onClick={()=>setNameComponent('parcelle')}> <span className="fa-solid fa-square-check me-2 tab-icon-color"></span>Parcelles</a></li>
                      <li className="nav-item text-nowrap me-2" role="presentation"><a className={nameComponent=='recolte'? "nav-link  cursor-pointer active" :"nav-link cursor-pointer"} id="call-tab" data-bs-toggle="tab" onClick={()=>setNameComponent('recolte')}> <span className="fa-solid fa-chart-line me-2 tab-icon-color"></span>Recoltes</a></li> */}
                      <li className="nav-item text-nowrap me-2" role="presentation"><a className={nameComponent==='params'? "nav-link  cursor-pointer active" :"nav-link cursor-pointer"} id="task-tab" data-bs-toggle="tab" href="#tab-task" role="tab" onClick={()=>setNameComponent('params')}> 
                          <span className="fa-solid fa-list me-2 tab-icon-color"></span>{t("Paramètres")}</a>
                      </li> 
                      
                  {/*    <li className="nav-item text-nowrap me-2" role="presentation"><a className="nav-link" id="emails-tab" data-bs-toggle="tab" href="#tab-emails" role="tab" aria-controls="tab-emails" aria-selected="true"> <span className="fa-solid fa-envelope me-2 tab-icon-color"></span>Emails </a></li>
                      <li className="nav-item text-nowrap me-2" role="presentation"><a className="nav-link" id="attachments-tab" data-bs-toggle="tab" href="#tab-attachments" role="tab" aria-controls="tab-attachments" aria-selected="true"> <span className="fa-solid fa-paperclip me-2 tab-icon-color"></span>Attachments</a></li> */}
                    </ul>
                    <div className="tab-content p-2 bg-white rounded-2" id="myTabContent">
                    {/*  {nameComponent == 'producteur' &&
                        <ProducteurCoopList coopID={coopID} campagne={campagne} />
                      }

                      {nameComponent == 'parcelle' &&
                        <ParcelleCoopList coopID={coopID} campagne={campagne}/>
                      }

                      {nameComponent=='recolte' &&
                        <RecolteCoopList coopID={coopID} campagne={campagne} campagneList={campagneProj}/>
                      } */}

                      {nameComponent === 'params' &&

                        <ParamsCoopList coopID={coopID} />

                      }
                      <div className="tab-pane fade" id="tab-call" role="tabpanel" aria-labelledby="call-tab">
                        <div className="row align-items-center gx-4 gy-3 flex-wrap mb-3">
                          <div className="col-auto d-flex flex-1">
                            <h2 className="mb-0">Call</h2>
                          </div>
                          <div className="col-auto">
                            <div className="d-flex gap-3 gap-sm-4">
                              <div className="form-check"><input className="form-check-input" id="allCall" type="radio" name="allCall" checked="checked" /><label className="form-check-label" for="allCall">All Call</label></div>
                              <div className="form-check"><input className="form-check-input" id="incomingCall" type="radio" name="allCall" /><label className="form-check-label" for="incomingCall">Incoming Call</label></div>
                              <div className="form-check"><input className="form-check-input" id="outgoingCall" type="radio" name="allCall" /><label className="form-check-label" for="outgoingCall">OutgoingCall</label></div>
                            </div>
                          </div>
                          <div className="col-auto"><button className="btn btn-primary"><span className="fa-solid fa-plus me-2"></span>Add Call</button></div>
                        </div>
                        <div className="border-top border-bottom border-200" id="leadDetailsTable" data-list='{"valueNames":["name","description","create_date","create_by","last_activity"],"page":5,"pagination":true}'>
                          <div className="table-responsive scrollbar mx-n1 px-1">
                            <table className="table fs--1 mb-0">
                              <thead>
                                <tr>
                                  <th className="white-space-nowrap fs--1 align-middle ps-0" style={{"width":"26px"}}>
                                    <div className="form-check mb-0 fs-0"><input className="form-check-input" type="checkbox" data-bulk-select='{"body":"lead-details-table-body"}' /></div>
                                  </th>
                                  <th className="sort white-space-nowrap align-middle pe-3 ps-0 text-uppercase" scope="col" data-sort="name" style={{"width":"20%", "min-width":"100px"}}>Name</th>
                                  <th className="sort align-middle pe-6 text-uppercase" scope="col" data-sort="description" style={{"width":"20%", "max-width":"60px"}}>description</th>
                                  <th className="sort align-middle text-start text-uppercase" scope="col" data-sort="create_date" style={{"width":"20%", "min-width":"115px"}}>create date</th>
                                  <th className="sort align-middle text-start text-uppercase" scope="col" data-sort="create_by" style={{"width":"20%", "min-width":"150px"}}>create by</th>
                                  <th className="sort align-middle ps-0 text-end text-uppercase" scope="col" data-sort="last_activity" style={{"width":"20%", "max-width":"115px"}}>Last Activity</th>
                                  <th className="align-middle pe-0 text-end" scope="col" style={{"width":"15%"}}></th>
                                </tr>
                              </thead>
                              <tbody className="list" id="lead-details-table-body">
                                <tr className="hover-actions-trigger btn-reveal-trigger position-static">
                                  <td className="fs--1 align-middle px-0 py-3">
                                    <div className="form-check mb-0 fs-0"><input className="form-check-input" type="checkbox" data-bulk-select-row='{"Name":{"avatar":"/team/35.webp","name":"Ansolo Lazinatov","status":"online"},"description":"Purchasing-Related Vendors","date":"Dec 29, 2021","creatBy":"Ansolo Lazinarov","lastActivity":{"iconColor":"text-success","label":"Active"}}' /></div>
                                  </td>
                                  <td className="name align-middle white-space-nowrap py-2 ps-0"><a className="d-flex align-items-center text-1000" href="#!">
                                      <div className="avatar avatar-m me-3 status-online"><img className="rounded-circle" src="../../assets/img/team/35.webp" alt="" /></div>
                                      <h6 className="mb-0 text-1000 fw-bold">Ansolo Lazinatov</h6>
                                    </a></td>
                                  <td className="description align-middle white-space-nowrap text-start fw-bold text-700 py-2 pe-6">Purchasing-Related Vendors</td>
                                  <td className="create_date text-end align-middle white-space-nowrap text-900 py-2">Dec 29, 2021</td>
                                  <td className="create_by align-middle white-space-nowrap fw-semi-bold text-1000">Ansolo Lazinarov</td>
                                  <td className="last_activity align-middle text-center py-2">
                                    <div className="d-flex align-items-center flex-1"><span className="fa-solid fa-clock me-1 text-success" data-fa-transform="shrink-2 up-1"></span><span className="fw-bold fs--1 text-900">Active</span></div>
                                  </td>
                                  <td className="align-middle text-end white-space-nowrap pe-0 action py-2">
                                    <div className="font-sans-serif btn-reveal-trigger position-static"><button className="btn btn-sm dropdown-toggle dropdown-caret-none transition-none btn-reveal" type="button" data-bs-toggle="dropdown" data-boundary="window" aria-haspopup="true" aria-expanded="false" data-bs-reference="parent"><span className="fas fa-ellipsis-h fs--2"></span></button>
                                      <div className="dropdown-menu dropdown-menu-end py-2"><a className="dropdown-item" href="#!">View</a><a className="dropdown-item" href="#!">Export</a>
                                        <div className="dropdown-divider"></div><a className="dropdown-item text-danger" href="#!">Remove</a>
                                      </div>
                                    </div>
                                  </td>
                                </tr>
                              
                              </tbody>
                            </table>
                          </div>
                          <div className="row align-items-center justify-content-between py-2 pe-0 fs--1">
                            <div className="col-auto d-flex">
                              <p className="mb-0 d-none d-sm-block me-3 fw-semi-bold text-900" data-list-info="data-list-info"></p><a className="fw-semi-bold" href="#!" data-list-view="*">View all<span className="fas fa-angle-right ms-1" data-fa-transform="down-1"></span></a><a className="fw-semi-bold d-none" href="#!" data-list-view="less">View Less<span className="fas fa-angle-right ms-1" data-fa-transform="down-1"></span></a>
                            </div>
                            <div className="col-auto d-flex"><button className="page-link" data-list-pagination="prev"><span className="fas fa-chevron-left"></span></button>
                              <ul className="mb-0 pagination"></ul><button className="page-link pe-0" data-list-pagination="next"><span className="fas fa-chevron-right"></span></button>
                            </div>
                          </div>
                        </div>
                      </div>
                  </div>
                  </div>
                </div>
              </div>
            </Content>
        </Fragment>
    )
}

export default ViewsCoop;