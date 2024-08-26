import { useEffect, useState } from "react"
import Content from "../../Content";
import axios from "axios";
import UserContext from "../../context/useContext";
import moment from 'moment';
import Validation from "../../Validation";
import Swal from "sweetalert2";


import BaseUrl from "../../config/baseUrl";

// const baseUrl = 'http://127.0.0.1:8000/api';
const url = BaseUrl();
function CampagneList(){

    const user = UserContext();
    const [errors, setErrorM] = useState({});
    const [campagnes,setCampagnes] = useState([]);

    const [campagneData,setCampagneData] = useState({
      "dateDebut":"",
      "DateFin":""
    })

    useEffect(()=>{
        if(user && user.id)
        {
            try {
                axios.get(url+'/campagnes-list/?userID='+user.id).then((resp)=>
                {
                  setCampagnes(resp.data);
                }
                )
            } catch (error) {
                console.log(error);
            }
        }
        
    },[user]);

    const handleChangeCampagne=(event)=>{

      setCampagneData({
        ...campagneData,
        [event.target.name]:event.target.value
      });
    }


    const submitFormCampagne =()=>{
      setErrorM(Validation(campagneData));
      const _formData = new FormData();
      if (campagneData.dateDebut !="" && campagneData.DateFin !=""){
          _formData.append('dateDebut',campagneData.dateDebut);
          _formData.append('DateFin',campagneData.DateFin);
          _formData.append('userID',user.id);

          try {
            axios.post(url+'/create-new-campagne/',_formData).then((resp)=>{
              if(resp.data.bool)
              {
                window.$('#addEventModalCampagne').modal('hide');
                Swal.fire({
                  title: 'FELICITATION !',
                  html: "La campagne <b>"+resp.data.lib+"</b> a bien été enregistrée.",
                  icon: 'success',
                  showCancelButton: false,
                  confirmButtonColor: '#3085d6',
                  confirmButtonText: 'OK'
                }).then((result) => {
                  if (result.isConfirmed) {

                      window.location.reload();
    
                  }
                });
              }
              else
              {
                Swal.fire({
                  title: 'Attention !',
                  text: resp.data.msg,
                  icon: 'error',
                  showCancelButton: false,
                  confirmButtonColor: '#3085d6',
                  confirmButtonText: 'OK'
                });
              }
            })
          } catch (error) {
            console.log(error);
          }
      }
    }


    return (
      <>
        <Content sideID={"campagne"} parent={"params"}>
        <h2 className="text-bold text-1100 mb-5">Listes des campagnes</h2>
                    <div id="members" >
                      <div className="row align-items-center justify-content-between g-3 mb-4">
                        <div className="col col-auto">
                          <div className="search-box">
                            <form className="position-relative" data-bs-toggle="search" data-bs-display="static">
                                <input className="form-control search-input search" type="search" placeholder="Chercher une campagne" aria-label="Search" />
                              <span className="fas fa-search search-box-icon"></span>
                            </form>
                          </div>
                        </div>
                        <div className="col-auto">
                          <div className="d-flex align-items-center">
                              {/* <button className="btn btn-link text-900  backgroundColor: "#94a91b", me-4 px-0"><span className="fa-solid fa-file-export fs--1 me-2"></span>Export</button> */}
                              <button className="btn btn-sm" type="button" style={{backgroundColor: "#94a91b", color: "#fff", fontWeight: "bold"}} data-bs-toggle="modal" data-bs-target="#addEventModalCampagne">
                                <span className="fas fa-plus pe-2 fs--2"></span>
                                Nouvelle campagne
                              </button>
                          </div>
                        </div>
                      </div>
                      <div className="mx-n4 mx-lg-n6 px-4 px-lg-6 mb-9 bg-white border-y border-300 mt-2 position-relative top-1">
                        <div className="table-responsive scrollbar ms-n1 ps-1">
                          <table className="table table-striped table-sm fs--1 mb-0 ">
                            <thead>
                              <tr className="" style={{backgroundColor: "#E6CA83", color: "#fff", fontWeight: "bold"}}>
                                <th className="sort align-middle" scope="col" data-sort="customer" style={{width:"20%"}}>Libelle</th>
                                <th className="sort align-middle" scope="col" data-sort="email" style={{width:"20%"}}>Date de debut</th>
                                <th className="sort align-middle pe-3" scope="col" data-sort="mobile_number" style={{width:"20%"}}>Date de fin</th>
                                <th className="sort align-middle" scope="col" data-sort="email" style={{width:"20%"}}>Status</th>
                                <th className="sort align-middle text-end" scope="col" data-sort="last_active" style={{width:"21%",  minWidth:"200px"}}>Action</th>
                              </tr>
                            </thead>
                            <tbody className="list" id="members-table-body">
                             
                                   {campagnes &&
                                    campagnes.map((campagne,index)=>
                                        <tr className="hover-actions-trigger btn-reveal-trigger position-static" >
                                            
                                        <td className="email align-middle white-space-nowrap">
                                            {campagne.libelle}
                                        </td>
                                        <td className="email align-middle white-space-nowrap">
                                            {moment(campagne.dateDebut).format('MMMM yyyy')}        
                                        </td>
                                        <td className="city align-middle white-space-nowrap text-900">{moment(campagne.DateFin).format('MMMM YYYY')}  </td>
                                        <td className="city align-middle white-space-nowrap text-900">
                                            {campagne.etat && <span className="badge bg-success">en cours</span>}
                                            {!campagne.etat && <span className="badge bg-warning">clôturé</span>}
                                        </td>
                                        <td className="last_active align-middle text-end white-space-nowrap text-700">
                                            <button className="btn btn-danger btn-sm p-1" >clôturer</button>
                                        </td>
                                    </tr>
                                    )
                                   }

                              
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


      <div className="modal fade" id="addEventModalCampagne" data-bs-backdrop="static" role="dialog" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
          <div className="modal-dialog modal-md">
            <div className="modal-content border">
              <div id="addEventForm" autoComplete="off">
                <div className="modal-header px-card border-0">
                  <div className="w-100 d-flex justify-content-between align-items-start">
                    <div>
                      <h5 className="mb-0 lh-sm text-1000">Nouvelle campagne</h5>
                    </div><button className="btn p-1 fs--2 text-900" type="button" data-bs-dismiss="modal" aria-label="Close">Fermer </button>
                  </div>
                </div>
                <div className="modal-body p-card py-0">
              
                  
                  <div className="form-floating mb-3">
                    <input className="form-control" id="sigle" type="date" name="dateDebut" onChange={handleChangeCampagne} value={campagneData.dateDebut} />
                    {errors.dateDebut && <span className="text-danger">{errors.dateDebut}</span>}
                    <label htmlFor="eventTitle" className="pb-2 text-warning">Date de debut</label>
                  </div>
                  <div className="form-floating mb-3">
                    <input className="form-control" id="chef" type="date" name="DateFin" onChange={handleChangeCampagne} value={campagneData.DateFin}/>
                    {errors.DateFin && <span className="text-danger">{errors.DateFin}</span>}
                    <label htmlFor="eventTitle" className="pb-2 text-warning">Date de fin</label>
                  </div>
                  
                  </div>
                  <div className="modal-footer d-flex justify-content-between align-items-center border-0">
                    <button className="btn px-4 form-control" style={{backgroundColor: "#94a91b", color: "#fff", fontWeight: "bold"}} type="button" onClick={submitFormCampagne}>Ajouter</button>
                  </div>
              </div>
            </div>
          </div>
        </div>
        </Content>
      </>
    )
}

export default CampagneList;