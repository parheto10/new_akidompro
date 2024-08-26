import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import BaseUrl from "../../../../config/baseUrl";

// const baseUrl = 'http://127.0.0.1:8000/api';
const url = BaseUrl();
function ParcelleCoopList({coopID,campagne}){
    const navigate =  useNavigate();

    const [parcelleList,setParcelleList] = useState([]);

    useEffect(()=>{
        if(coopID){
            try {
                axios.get(url+'/parcelles-list/?coopID='+coopID).then((resp)=>{
                    setParcelleList(resp.data);
                })
            } catch (error) {
                console.log(error)
            }
        } 
       
    },[coopID,campagne]);

    const ViewProducteur=(prodID)=>{
    
        navigate('/views-producteur/'+prodID+'/');
        //window.location.reload();
      }

    return (
        <>
              <div className="tab-pane fade active show" id="notes-tab" role="tabpanel" aria-labelledby="activity-tab">
                  <div className="row align-items-center gx-4 gy-3 flex-wrap mb-3">
                      <div className="col-auto d-flex flex-1">
                       <h2 className="mb-0">Parcelles ({parcelleList.length})</h2>
                      </div>
                      <div className="col-auto">
                            <div className="search-box">
                              <form className="position-relative" data-bs-toggle="search" data-bs-display="static">
                                  <input className="form-control search-input search" type="search" placeholder="Recherche parcelle" aria-label="Search" />
                                <span className="fas fa-search search-box-icon"></span>
                              </form>
                            </div>
                      </div> 
                      <div className="col-auto"><button className="btn btn-primary" ><span className="fa-solid fa-plus me-2"></span>Ajouter</button></div>
                    </div>
                    <div className="border-top border-bottom border-200" id="leadDetailsTable" >
                    <div className="table-responsive scrollbar mx-n1 px-1">
                        <table className="table fs--1 mb-0">
                          <thead>
                            <tr className="bg-warning">
                              <th className="white-space-nowrap fs--1 align-middle ps-0" style={{"width":"26px"}}>
                                <div className="form-check mb-0 fs-0"><input className="form-check-input" type="checkbox"  /></div>
                              </th>
                              <th className="sort white-space-nowrap align-middle pe-3 ps-0 text-uppercase" scope="col" data-sort="dealName" style={{"width":"12%", "min-width":"80px"}}>Code</th>
                              <th className="sort align-middle pe-6 text-uppercase text-center" scope="col" data-sort="amount" style={{"width":"22%", "min-width":"200px"}}>Producteur</th>
                              <th className="sort align-middle text-center text-uppercase" scope="col" data-sort="stage" style={{"width":"15%", "min-width":"10px"}}>CO2(eq T)</th>
                              <th className="sort align-middle text-center text-uppercase" scope="col" data-sort="probability" style={{"width":"15%", "min-width":"120px"}}>Latitude</th>
                              <th className="sort align-middle ps-0 text-center text-uppercase" scope="col" data-sort="date" >Longitude</th>
                              <th className="sort align-middle text-center text-uppercase" scope="col" data-sort="type" >Superficie (ha)</th>
                              <th className="align-middle pe-0 text-center" scope="col" > Action</th>
                            </tr>
                          </thead>
                          <tbody className="list" id="lead-details-table-body">
                              {parcelleList.map((parcelle,index)=>
                                   <tr className="hover-actions-trigger btn-reveal-trigger position-static" >
                                   <td className="fs--1 align-middle px-0 py-3">
                                     <div className="form-check mb-0 fs-0"><input className="form-check-input" type="checkbox"  /></div>
                                   </td>
                                   <td className="dealName align-middle white-space-nowrap py-2 ps-0"><a className="fw-semi-bold text-primary cursor-pointer" onClick={()=>ViewProducteur(parcelle.producteur?.code)}>{parcelle.code}</a></td>
                                   <td className="amount align-middle white-space-nowrap text-start fw-bold text-700 py-2 text-center pe-6">{parcelle.producteur?.nomComplet}</td>
                                   <td className="stage align-middle white-space-nowrap text-900 py-2 text-center"><span className="badge badge-phoenix fs--2 badge-phoenix-success">0</span></td>
                                   <td className="probability align-middle white-space-nowrap text-center">
                                     {parcelle.latitude}
                                   </td>
                                   <td className="date align-middle text-700 text-center py-2 white-space-nowrap text-center">{parcelle.longitude}</td>
                                   <td className="type align-middle fw-semi-bold py-2 text-center" >{parcelle.superficie}</td>
                                   <td className="align-middle text-end white-space-nowrap pe-0 action py-2">
                                     <div className="font-sans-serif btn-reveal-trigger position-static"><button className="btn btn-sm dropdown-toggle dropdown-caret-none transition-none btn-reveal" type="button" data-bs-toggle="dropdown" data-boundary="window" aria-haspopup="true" aria-expanded="false" data-bs-reference="parent"><span className="fas fa-ellipsis-h fs--2"></span></button>
                                       <div className="dropdown-menu dropdown-menu-end py-2">
                                      {/*  <a className="dropdown-item" href="#!">Ajouter planting</a> */}
                                         <a className="dropdown-item" href="#!">Modifier</a>
                                         <div className="dropdown-divider"></div>
                                         <a className="dropdown-item text-danger" href="#!">Supprimer</a>
                                       </div>
                                     </div>
                                   </td>
                                   <td></td>
                                 </tr>
                              )}
                          </tbody>
                        </table>
                      </div>
                      <div className="row align-items-center justify-content-between py-2 pe-0 fs--1">
                        <div className="col-auto d-flex">
                          <p className="mb-0 d-none d-sm-block me-3 fw-semi-bold text-900" data-list-info="data-list-info"></p><a className="fw-semi-bold" href="#!" data-list-view="*">{/* <span className="fas fa-angle-right ms-1" data-fa-transform="down-1"></span> */}</a><a className="fw-semi-bold d-none" href="#!" data-list-view="less">View Less<span className="fas fa-angle-right ms-1" data-fa-transform="down-1"></span></a>
                        </div>
                        <div className="col-auto d-flex"><button className="page-link" data-list-pagination="prev"><span className="fas fa-chevron-left"></span></button>
                          <ul className="mb-0 pagination"></ul><button className="page-link pe-0" data-list-pagination="next"><span className="fas fa-chevron-right"></span></button>
                        </div> 
                      </div>
                    </div>
              </div>
        </>
    )
}

export default ParcelleCoopList;