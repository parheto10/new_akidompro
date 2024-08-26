import { useEffect, useState } from "react";
import Content from "../../../Content";
import { Link, useParams } from "react-router-dom";
import axios from "axios";

import BaseUrl from "../../../config/baseUrl";

// const baseUrl = 'http://127.0.0.1:8000/api';
const url = BaseUrl();
function RecolteProdList(){
    const {prodCode} = useParams();

    const [producteur,setProducteur] = useState([]);
    const [recoltes,setRecoltes] = useState([]);

    useEffect(()=>{
        axios.get(url+'/producteurs-list-paginate/?prodCode='+prodCode).then((resp)=>{
            setProducteur(resp.data.results[0]);
        });

        axios.get(url+'/recoltes-producteurs-list/?prodCode='+prodCode).then((resp)=>{
            setRecoltes(resp.data);
        });

    },[]);

    return (
        <>
            <Content sideID={"cooperatives"} parent={"generalite"}>
            <h2 className="text-bold text-1100 mb-5">Liste des recoltes <Link className="btn-link" to={`/views-producteur/${prodCode}/`}>{producteur?.nomComplet}</Link></h2>
            <div className="mb-5 bg-white p-3 border-2 rounded-2 " >
            <div className="row">
                    <div className="col-md-4">
                        <div className="card">
                            <h5 className="card-header bg-primary text-white p-2 text-center">
                                Nombre de sacs total
                            </h5>
                            <div className="card-body p-2">
                                <h3 className="card-title text-center text-secondary">0</h3>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4">
                    <div className="card">
                            <h5 className="card-header bg-success text-white p-2 text-center">
                                Poids total vendu en tonne
                            </h5>
                            <div className="card-body p-2">
                                <h3 className= "card-title text-center text-success" >0</h3>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="card">
                            <h5 className="card-header bg-info text-white p-2 text-center">
                                Montant total en Fcfa
                            </h5>
                            <div className="card-body p-2">
                                <h3 className="card-title text-center text-warning">0</h3>
                            </div>
                        </div>
                    </div>
              </div>
            </div>
                    <div id="members" >
                      <div className="row align-items-center justify-content-between g-3 mb-4">
                        <div className="col col-auto">
                          <div className="search-box">
                            <form className="position-relative" data-bs-toggle="search" data-bs-display="static">
                                <input className="form-control search-input search" type="search" placeholder="Recherche une recolte" aria-label="Search" />
                              <span className="fas fa-search search-box-icon"></span>
                            </form>
                          </div>
                        </div>
                        <div className="col-auto">
                          <div className="d-flex align-items-center">
                              {/* <button className="btn btn-link text-900 me-4 px-0"><span className="fa-solid fa-file-export fs--1 me-2"></span>Export</button> */}
                              <button className="btn btn-primary btn-sm" type="button" data-bs-toggle="modal" data-bs-target="#addEventModal">
                                <span className="fas fa-plus pe-2 fs--2"></span>
                                Ajouter une recolte
                              </button>
                          </div>
                        </div>
                      </div>
                      <div className="mx-n4 mx-lg-n6 px-4 px-lg-6 mb-9 bg-white border-y border-300 mt-2 position-relative top-1">
                        <div className="table-responsive scrollbar ms-n1 ps-1">
                          <table className="table fs--1 mb-0">
                                <thead>
                                <tr className="bg-warning">
                                    <th className="white-space-nowrap fs--1 align-middle ps-0" style={{"width":"26px"}}>
                                    <div className="form-check mb-0 fs-0"><input className="form-check-input" type="checkbox"  /></div>
                                    </th>
                                    <th className="sort white-space-nowrap align-middle pe-3 ps-0 text-uppercase" scope="col"  >Code</th>
                                    <th className="sort align-middle pe-6 text-uppercase text-center" scope="col" data-sort="amount" >Producteur</th>
                                    <th className="sort align-middle text-center text-uppercase" scope="col" data-sort="stage" style={{"width":"5%", "min-width":"10px"}}>Campagne</th>
                                    <th className="sort align-middle text-center text-uppercase" scope="col" data-sort="probability" style={{"width":"5%", "min-width":"120px"}}>Saisons</th>
                                    <th className="sort align-middle ps-0 text-center text-uppercase" scope="col" data-sort="date" >Culture</th>
                                    <th className="sort align-middle text-center text-uppercase" scope="col" data-sort="type" >Lieu de production</th>
                                    <th className="align-middle pe-0 text-center" scope="col" > Sacs</th>
                                    <th className="align-middle pe-0 text-center" scope="col" > Poids(Kg)</th>
                                    <th className="sort align-middle text-center text-uppercase" scope="col" data-sort="type" >Montant(Fcfa)</th>
                                </tr>
                                </thead>
                                <tbody className="list" id="lead-details-table-body">
                                    {recoltes.map((recolte,index)=>
                                        <tr className="hover-actions-trigger btn-reveal-trigger position-static" >
                                        <td className="fs--1 align-middle px-0 py-3">
                                            <div className="form-check mb-0 fs-0"><input className="form-check-input" type="checkbox"  /></div>
                                        </td>
                                        <td className="dealName align-middle white-space-nowrap py-2 ps-0"><a className="fw-semi-bold text-primary cursor-pointer" >{recolte.code}</a></td>
                                        <td className="amount align-middle white-space-nowrap text-start fw-bold text-700 py-2 text-center pe-6">{recolte.producteur?.nomComplet}</td>
                                        <td className="stage align-middle white-space-nowrap text-900 py-2 text-center">{recolte.campagne?.libelle}</td>
                                        <td className="probability align-middle white-space-nowrap">
                                        {recolte.saison?.libelle}
                                            {/* <p className="text-800 fs--2 mb-0">67%</p>
                                            <div className="progress bg-primary-100" style={{"height":"3px"}} role="progressbar">
                                            <div className="progress-bar bg-info" style={{"width": "50.206896551724135%"}} role="progressbar" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100"></div>
                                            </div>  */}
                                        </td>
                                        <td className="date align-middle text-700 text-center py-2 white-space-nowrap">{recolte.culture?.libelle}</td>
                                        <td className="type align-middle fw-semi-bold py-2 text-center" >{recolte.lieu_production}</td>
                                        <td className="align-middle text-end white-space-nowrap pe-0 action py-2">
                                            {recolte.nbre_sacs}
                                        </td>
                                            {recolte.poids_total
                                                ?
                                                <td className="align-middle text-end white-space-nowrap pe-0 action py-2 text-center">
                                                    {recolte.poids_total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")}
                                                </td>
                                                :
                                                <td className="align-middle text-end white-space-nowrap pe-0 action py-2 text-center">
                                                    0
                                                </td>

                                            }
                                            <td className="align-middle text-end white-space-nowrap pe-0 action py-2 text-center">{recolte.prix_total}</td>
                                        </tr>
                                    )}
                                </tbody>
                  </table>
                        </div>
                        <div className="row align-items-center justify-content-between py-2 pe-0 fs--1">
                          <div className="col-auto d-flex">
                            <p className="mb-0 d-none d-sm-block me-3 fw-semi-bold text-900" data-list-info="data-list-info"></p>
                               {/*  <a className="fw-semi-bold" href="#!" data-list-view="*"> Utilisateurs<span className="fas fa-angle-right ms-1" data-fa-transform="down-1"></span></a>  */}
                              <a className="fw-semi-bold d-none" href="#!" data-list-view="less">
                                View Less
                                <span className="fas fa-angle-right ms-1" data-fa-transform="down-1"></span>
                              </a>
                          </div>
                          <div className="col-auto d-flex">
                                <button className="page-link" data-list-pagination="prev">
                                    <span className="fas fa-chevron-left"></span>
                                </button>
                                <ul className="mb-0 pagination"></ul>
                                <button className="page-link pe-0" data-list-pagination="next">
                                    <span className="fas fa-chevron-right"></span>
                                </button>
                          </div>
                        </div>
                      </div>
                    </div>
            </Content>
        </>
    )
}

export default RecolteProdList;