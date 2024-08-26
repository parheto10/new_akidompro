import axios from "axios";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import Validation from "../../../../Validation";
import { useTranslation } from "react-i18next";

import BaseUrl from "../../../../config/baseUrl";

// const baseUrl = 'http://127.0.0.1:8000/api';
const url = BaseUrl();

function ParamsCoopList({coopID}){
    const {t} = useTranslation();
    const [saisons,setSaisons] = useState([]);
    const [cultures,setCultures] = useState([]);
    const [sectionsList,setSectionList] = useState([]);
    const [errors, setErrorM] = useState({});

    const [sectData,setSectData] = useState({
      "libelle":""
    });

    const [cultureData,setCultureData] = useState({
      "libelle":"",
      "prix_unitaire_culture":""
    });

    const [saisonData,setSaisonData] = useState({
      "libelle":""
    });

    const [usectData,setuSectData] = useState({
      "libelle":""
    });

    const [ucultureData,setuCultureData] = useState({
      "libelle":"",
      "prix_unitaire_culture":""
    });

    const [usaisonData,setuSaisonData] = useState({
      "libelle":""
    });

    useEffect(()=>{
      if(coopID){

        try { 
              axios.get(url+'/section-list/?coopID='+coopID).then((resp)=>{
                setSectionList(resp.data);
              });
              axios.get(url+'/culture-list/?coopID='+coopID).then((resp)=>{
                setCultures(resp.data);
              }) 
    
               axios.get(url+'/saison-recoltes-list/?coopID='+coopID).then((resp)=>{
                setSaisons(resp.data);
              }) 
            
        } catch (error) {
            
        }
      }
    },[coopID]);

    const handleChangeSect=(event)=>{
      setSectData({
        ...sectData,
        [event.target.name]:event.target.value
      });
    }

    const handleChangeCulture=(event)=>{
      setCultureData({
        ...cultureData,
        [event.target.name]:event.target.value
      })
    }

    const handleChangeSaison=(event)=>{
      setSaisonData({
        ...saisonData,
        [event.target.name]:event.target.value
      })
    }

    const handleChangeSectEdit=(event)=>{
      setuSectData({
        ...usectData,
        [event.target.name]:event.target.value
      });
    }

    const handleChangeCultureEdit=(event)=>{
      setuCultureData({
        ...ucultureData,
        [event.target.name]:event.target.value
      })
    }

    const handleChangeSaisonEdit=(event)=>{
      setuSaisonData({
        ...usaisonData,
        [event.target.name]:event.target.value
      })
    }

    const submitSaison=()=>{
      setErrorM(Validation(saisonData));
  
      if(saisonData.libelle !=""){
        const _formData = new FormData();
        _formData.append('libelle',saisonData.libelle);
        _formData.append('cooperativeID',coopID);
        try {
          axios.post(url+'/saison-save/',_formData).then((resp)=>{
            if(resp.data.bool)
            {
              window.$('#addEventModalSaison').modal('hide');
              Swal.fire({
                position: 'top-end',
                icon: 'success',
                title: 'Enregistrement effectué avec succès !',
                showConfirmButton: false,
                timer: 3000,
                toast:true,
                // position:'top-right',
                timerProgressBar:true
              });
  
              axios.get(url+'/saison-recoltes-list/?coopID='+coopID).then((resp)=>{
                setSaisons(resp.data);
            });
  
            setSaisonData({
              "libelle":""
            })
  
            }
            else
            {
              Swal.fire({
                // position: 'top-end',
                icon: 'error',
                title: resp.data.msg,
                showConfirmButton: false,
                timer: 3000,
                toast:true,
                position:'top-right',
                timerProgressBar:true
              });
            }
          })
        } catch (error) {
          console.log(error);
        }
      }
    }

    const submitSect=()=>{
      setErrorM(Validation(sectData));
  
      if(sectData.libelle !=""){
        const _formData = new FormData();
        _formData.append('libelle',sectData.libelle);
        _formData.append('cooperativeID',coopID);
        try {
          axios.post(url+'/section-save/',_formData).then((resp)=>{
            if(resp.data.bool)
            {
              window.$('#addEventModalSection').modal('hide');
              Swal.fire({
                // position: 'top-end',
                icon: 'success',
                title: 'Enregistrement effectué avec succès !',
                showConfirmButton: false,
                timer: 3000,
                toast:true,
                position:'top-right',
                timerProgressBar:true
              });
  
              axios.get(url+'/section-list/?coopID='+coopID).then((resp)=>{
                setSectionList(resp.data);
            });
  
            setSectData({
              "libelle":""
            })
  
            }
            else
            {
              Swal.fire({
                // position: 'top-end',
                icon: 'error',
                title: resp.data.msg,
                showConfirmButton: false,
                timer: 3000,
                toast:true,
                position:'top-right',
                timerProgressBar:true
              });
            }
          })
        } catch (error) {
          console.log(error);
        }
      }
    }

    const submitCulture=()=>{
      setErrorM(Validation(cultureData));
  
      if(cultureData.libelle !="" && cultureData.prix_unitaire_culture){
        const _formData = new FormData();
        _formData.append('libelle',cultureData.libelle);
        _formData.append('prix_unitaire_culture',cultureData.prix_unitaire_culture);
        _formData.append('cooperativeID',coopID);
        try {
          axios.post(url+'/culture-save/',_formData).then((resp)=>{
            if(resp.data.bool)
            {
              window.$('#addEventModalCulture').modal('hide');
              Swal.fire({
                // position: 'top-end',
                icon: 'success',
                title: 'Enregistrement effectué avec succès !',
                showConfirmButton: false,
                timer: 3000,
                toast:true,
                position:'top-right',
                timerProgressBar:true
              });
  
              axios.get(url+'/culture-list/?coopID='+coopID).then((resp)=>{
                setCultures(resp.data);
            });
  
            setCultureData({
              "libelle":"",
              "prix_unitaire_culture":""
            })
  
            }
            else
            {
              Swal.fire({
                // position: 'top-end',
                icon: 'error',
                title: resp.data.msg,
                showConfirmButton: false,
                timer: 3000,
                toast:true,
                position:'top-right',
                timerProgressBar:true
              });
            }
          })
        } catch (error) {
          console.log(error);
        }
      }
    }



    const sectionOpenUpdateModal=(id,libelle)=>{
      setuSectData({
        "libelle":libelle
      })
      window.$(`#EventModalSection${id}`).modal('show');
    }

    const saisonOpenUpdateModal=(id,libelle)=>{
      setuSaisonData({
        "libelle":libelle
      })
      window.$(`#EventModalSaison${id}`).modal('show');
    }

    const cultureOpenUpdateModal=(id,libelle,prx)=>{
      setuCultureData({
        "libelle":libelle,
        "prix_unitaire_culture":prx
      })
      window.$(`#EventModalCulture${id}`).modal('show');
    }


    const submitSaisonEdit=(id)=>{
      setErrorM(Validation(usaisonData));
  
      if(usaisonData.libelle !=""){
        const _formData = new FormData();
        _formData.append('libelle',usaisonData.libelle);
        _formData.append('id',id);
        try {
          axios.post(url+'/saison-update/',_formData).then((resp)=>{
            if(resp.data.bool)
            {
              window.$(`#EventModalSaison${id}`).modal('hide');
              Swal.fire({
                // position: 'top-end',
                icon: 'success',
                title: 'Modification effectué avec succès !',
                showConfirmButton: false,
                timer: 3000,
                toast:true,
                position:'top-right',
                timerProgressBar:true
              });
  
              axios.get(url+'/saison-recoltes-list/?coopID='+coopID).then((resp)=>{
                setSaisons(resp.data);
            });
  
            setuSaisonData({
              "libelle":""
            })
  
            }
            else
            {
              Swal.fire({
                // position: 'top-end',
                icon: 'error',
                title: resp.data.msg,
                showConfirmButton: false,
                timer: 3000,
                toast:true,
                position:'top-right',
                timerProgressBar:true
              });
            }
          })
        } catch (error) {
          console.log(error);
        }
      }
    }

    const submitSectEdit=(id)=>{
      setErrorM(Validation(usectData));
  
      if(usectData.libelle !=""){
        const _formData = new FormData();
        _formData.append('libelle',usectData.libelle);
        _formData.append('id',id);
        try {
          axios.post(url+'/section-update/',_formData).then((resp)=>{
            if(resp.data.bool)
            {
              window.$(`#EventModalSection${id}`).modal('hide');
              Swal.fire({
                // position: 'top-end',
                icon: 'success',
                title: 'Modification effectué avec succès !',
                showConfirmButton: false,
                timer: 3000,
                toast:true,
                position:'top-right',
                timerProgressBar:true
              });
  
              axios.get(url+'/section-list/?coopID='+coopID).then((resp)=>{
                setSectionList(resp.data);
            });
  
            setuSectData({
              "libelle":""
            })
  
            }
            else
            {
              Swal.fire({
                // position: 'top-end',
                icon: 'error',
                title: resp.data.msg,
                showConfirmButton: false,
                timer: 3000,
                toast:true,
                position:'top-right',
                timerProgressBar:true
              });
            }
          })
        } catch (error) {
          console.log(error);
        }
      }
    }

    const submitCultureEdit=(id)=>{
      setErrorM(Validation(ucultureData));
  
      if(ucultureData.libelle !="" && ucultureData.prix_unitaire_culture){
        const _formData = new FormData();
        _formData.append('libelle',ucultureData.libelle);
        _formData.append('prix_unitaire_culture',ucultureData.prix_unitaire_culture);
        _formData.append('id',id);
        try {
          axios.post(url+'/culture-update/',_formData).then((resp)=>{
            if(resp.data.bool)
            {
              window.$(`#EventModalCulture${id}`).modal('hide');
              Swal.fire({
                // position: 'top-end',
                icon: 'success',
                title: 'Modification effectué avec succès !',
                showConfirmButton: false,
                timer: 3000,
                toast:true,
                position:'top-right',
                timerProgressBar:true
              });
  
              axios.get(url+'/culture-list/?coopID='+coopID).then((resp)=>{
                setCultures(resp.data);
            });
  
            setuCultureData({
              "libelle":"",
              "prix_unitaire_culture":""
            })
  
            }
            else
            {
              Swal.fire({
                // position: 'top-end',
                icon: 'error',
                title: resp.data.msg,
                showConfirmButton: false,
                timer: 3000,
                toast:true,
                position:'top-right',
                timerProgressBar:true
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
              <div className="tab-pane fade active show mb-3 " >
                  <div className="row align-items-center gx-4 gy-3 flex-wrap mb-3">
                      <div className="col-auto d-flex flex-1">
                       <h4 className="mb-0">{t("Saisons de recolte")} ({saisons.length})</h4>
                       <button className="fw-bold fs--1 btn btn-sm py-1 mx-2" style={{backgroundColor: "#94a91b", color: "#fff", fontWeight: "bold"}} data-bs-toggle="modal" data-bs-target="#addEventModalSaison">{t("Ajouter une saison")}</button>
                      </div>

                    </div>
                    <div className="border-top border-bottom border-200" id="leadDetailsTable" >
                    <div className="table-responsive scrollbar mx-n1 px-1">
                        <table className="table fs--1 mb-0">
                          <thead>
                            <tr className="" style={{backgroundColor: "#E6CA83"}}>                             
                              <th className="sort white-space-nowrap align-middle pe-3 ps-0 text-uppercase text-center">{t("Libelle")}</th>
                              <th className="sort align-middle ps-0 text-center text-uppercase" >{t("Action")}</th>
                             
                            </tr>
                          </thead>
                          <tbody className="list" id="lead-details-table-body">
                              {saisons.map((saison,index)=>
                                 <tr className="hover-actions-trigger btn-reveal-trigger position-static" >
                               
                                 <td className="dealName align-middle white-space-nowrap py-0 ps-0 text-center"><b>{saison.libelle}</b></td>
                                 <td className="text-center">
                                      <button className="btn btn-sm p-1 mx-1" style={{backgroundColor: "#94a91b", color: "#fff", fontWeight: "bold"}} onClick={()=>saisonOpenUpdateModal(saison.id,saison.libelle)}><i class="fa-solid fa-pencil"></i></button>
                                      <div className="modal fade" id={`EventModalSaison${saison.id}`} data-bs-backdrop="static" role="dialog" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                                              <div className="modal-dialog ">
                                                <div className="modal-content border">
                                                  <div id="addEventForm" autoComplete="off">
                                                    <div className="modal-header px-card border-0">
                                                      <div className="w-100 d-flex justify-content-between align-items-start">
                                                        <div>
                                                          <h5 className="mb-0 lh-sm text-1000">{t("Modifier")} <b className="text-success">{saison.libelle}</b></h5>
                                                        </div><button className="btn p-1 fs--2 text-900" type="button" data-bs-dismiss="modal" aria-label="Close">{t("Fermer")} </button>
                                                      </div>
                                                    </div>
                                                    <div className="modal-body p-card py-0">

                                              

                                                      <div className="form-floating mb-3">
                                                        <input className="form-control" id="sigle" type="text" name="libelle" onChange={handleChangeSaisonEdit} value={usaisonData.libelle}/>
                                                        {errors.libelle && <span className="text-danger p-0 m-0">{errors.libelle}</span>}
                                                        <label htmlFor="eventTitle" className="pb-2 text-black">{t("Libelle")}</label>
                                                      </div>
                                                      
                                                      
                                                      </div>
                                                      <div className="modal-footer d-flex justify-content-between align-items-center border-0">
                                                        <button className="btn btn-success px-4 form-control" type="button" onClick={()=>submitSaisonEdit(saison.id)}>{t("Modifier")}</button>
                                                      </div>
                                                  </div>
                                                </div>
                                              </div>
                                            </div>
                                  </td>
                               </tr> 
                              )}
                               
                              
                          </tbody>
                        </table>
                      </div>
                   
                    </div>
              </div>
              
              <div className="tab-pane fade active show" id="notes-tab" role="tabpanel" aria-labelledby="activity-tab">
                  <div className="row align-items-center gx-4 gy-3 flex-wrap mb-3">
                      <div className="col-auto d-flex flex-1">
                       <h4 className="mb-0">{t("Cultures")} ({cultures.length})</h4>
                       <button className="fw-bold fs--1 btn btn-sm py-1 mx-2" style={{backgroundColor: "#94a91b", color: "#fff", fontWeight: "bold"}} data-bs-toggle="modal" data-bs-target="#addEventModalCulture">{t("Ajouter une culture")}</button>
                      </div>

                    </div>
                    <div className="border-top border-bottom border-200" id="leadDetailsTable" >
                    <div className="table-responsive scrollbar mx-n1 px-1">
                    <table className="table fs--1 mb-0">
                          <thead>
                            <tr className="" style={{backgroundColor: "#E6CA83"}}>                              
                              <th className="sort white-space-nowrap align-middle  ps-0 text-uppercase text-center">{t("Libelle")}</th>
                              <th className="sort white-space-nowrap align-middle  ps-0 text-uppercase text-center">{t("Prix du kilogramme")} (Fcfa)</th>
                              <th className="sort align-middle ps-0 text-center text-uppercase" >{t("Action")}</th>                             
                            </tr>
                          </thead>
                          <tbody className="list" id="lead-details-table-body">
                                  {cultures.map((culture,index)=>
                                    <tr className="hover-actions-trigger btn-reveal-trigger position-static" >
                                      
                                       <td className="dealName align-middle white-space-nowrap  ps-0 text-center"><b>{culture.libelle}</b></td>
                                       <td className="dealName align-middle white-space-nowrap  ps-0 text-center"><b>{culture.prix_unitaire_culture}</b></td>
                                        <td className="text-center">
                                            <button className="btn btn-sm p-1 mx-1" style={{backgroundColor: "#94a91b", color: "#fff", fontWeight: "bold"}} onClick={()=>cultureOpenUpdateModal(culture.id,culture.libelle,culture.prix_unitaire_culture)}><i class="fa-solid fa-pencil"></i></button>
                                            <div className="modal fade" id={`EventModalCulture${culture.id}`} data-bs-backdrop="static" role="dialog" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                                                  <div className="modal-dialog ">
                                                    <div className="modal-content border">
                                                      <div id="addEventForm" autoComplete="off">
                                                        <div className="modal-header px-card border-0">
                                                          <div className="w-100 d-flex justify-content-between align-items-start">
                                                            <div>
                                                              <h5 className="mb-0 lh-sm text-1000">{t("Modifier")} <b className="text-success">{culture.libelle}</b></h5>
                                                            </div><button className="btn p-1 fs--2 text-900" type="button" data-bs-dismiss="modal" aria-label="Close">{t("Fermer")}</button>
                                                          </div>
                                                        </div>
                                                        <div className="modal-body p-card py-0">

                                                  

                                                          <div className="form-floating mb-3">
                                                            <input className="form-control" id="sigle" type="text" name="libelle" onChange={handleChangeCultureEdit} value={ucultureData.libelle}/>
                                                            {errors.libelle && <span className="text-danger p-0 m-0">{errors.libelle}</span>}
                                                            <label htmlFor="eventTitle" className="pb-2 text-black">{t("Libelle")}</label>
                                                          </div>

                                                          <div className="form-floating mb-3">
                                                            <input className="form-control" id="sigle" type="text" name="prix_unitaire_culture" onChange={handleChangeCultureEdit} value={ucultureData.prix_unitaire_culture}/>
                                                            {errors.prix_unitaire_culture && <span className="text-danger p-0 m-0">{errors.prix_unitaire_culture}</span>}
                                                            <label htmlFor="eventTitle" className="pb-2 text-black">{t("Prix du kilogramme")}</label>
                                                          </div>
                                                          
                                                          
                                                          </div>
                                                          <div className="modal-footer d-flex justify-content-between align-items-center border-0">
                                                            <button className="btn btn-success px-4 form-control" type="button" onClick={()=>submitCultureEdit(culture.id)}>{t("Modifier")} </button>
                                                          </div>
                                                      </div>
                                                    </div>
                                                  </div>
                                                </div>
                                        </td>
                                     </tr>
                                  )}
                                  
                              
                          </tbody>
                        </table>
                      </div>
                      
                    </div>
              </div>

              <div className="tab-pane fade active show mt-3" id="notes-tab" role="tabpanel" aria-labelledby="activity-tab">
                  <div className="row align-items-center gx-4 gy-3 flex-wrap mb-3">
                      <div className="col-auto d-flex flex-1">
                       <h4 className="mb-0 mx-2">{t("Sections")} ({sectionsList.length})</h4>
                       <button className="fw-bold fs--1 btn btn-sm py-1 float-end" style={{backgroundColor: "#94a91b", color: "#fff", fontWeight: "bold"}} data-bs-toggle="modal" data-bs-target="#addEventModalSection">{t("Ajouter une section")}</button>
                      </div>

                    </div>
                    <div className="border-top border-bottom border-200" id="leadDetailsTable" >
                    <div className="table-responsive scrollbar mx-n1 px-1">
                    <table className="table fs--1 mb-0">
                          <thead>
                            <tr className="rounded-2" style={{backgroundColor: "#E6CA83"}}>
                             
                              <th className="sort white-space-nowrap align-middle pe-3 ps-0 text-uppercase text-center" >Libelle</th>
                              <th className="sort align-middle ps-0 text-center text-uppercase" >Action</th>
                             
                            </tr>
                          </thead>
                          <tbody className="list" id="lead-details-table-body">
                                    {sectionsList.map((section,index)=>
                                         <tr className="hover-actions-trigger btn-reveal-trigger position-static" >
                                         
                                         <td className="dealName align-middle white-space-nowrap ps-0 text-center"><b>{section.libelle}</b></td>
                                         <td className="text-center">
                                              <button className="btn btn-sm p-1 mx-1" style={{backgroundColor: "#94a91b", color: "#fff", fontWeight: "bold"}} onClick={()=>sectionOpenUpdateModal(section.id,section.libelle)}><i class="fa-solid fa-pencil"></i></button>

                                              <div className="modal fade" id={`EventModalSection${section.id}`} data-bs-backdrop="static" role="dialog" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                                                <div className="modal-dialog ">
                                                  <div className="modal-content border">
                                                    <div id="addEventForm" autoComplete="off">
                                                      <div className="modal-header px-card border-0">
                                                        <div className="w-100 d-flex justify-content-between align-items-start">
                                                          <div>
                                                            <h5 className="mb-0 lh-sm text-1000">{t("Modifier")} <b className="text-primary">{section.libelle}</b></h5>
                                                          </div><button className="btn p-1 fs--2 text-900" type="button" data-bs-dismiss="modal" aria-label="Close">Fermer </button>
                                                        </div>
                                                      </div>
                                                      <div className="modal-body p-card py-0">

                                                

                                                        <div className="form-floating mb-3">
                                                          <input className="form-control" id="sigle" type="text" name="libelle" onChange={handleChangeSectEdit} value={usectData.libelle}/>
                                                          {errors.libelle && <span className="text-danger p-0 m-0">{errors.libelle}</span>}
                                                          <label htmlFor="eventTitle" className="pb-2 text-black">Libelle</label>
                                                        </div>
                                                        
                                                        
                                                        </div>
                                                        <div className="modal-footer d-flex justify-content-between align-items-center border-0">
                                                          <button className="btn btn-success px-4 form-control" type="button" onClick={()=>submitSectEdit(section.id)}>{t("Modifier")}</button>
                                                        </div>
                                                    </div>
                                                  </div>
                                                </div>
                                              </div>
                                          </td>
                                       </tr>
                                    )}
                                  
                              
                          </tbody>
                        </table>
                      </div>
                     
                    </div>
              </div>

                {/* ajout de la section */}
                <div className="modal fade" id="addEventModalSection" data-bs-backdrop="static" role="dialog" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                  <div className="modal-dialog ">
                    <div className="modal-content border">
                      <div id="addEventForm" autoComplete="off">
                        <div className="modal-header px-card border-0">
                          <div className="w-100 d-flex justify-content-between align-items-start">
                            <div>
                              <h5 className="mb-0 lh-sm text-1000">{t("Enregistrement d'une section")}</h5>
                            </div><button className="btn p-1 fs--2 text-900" type="button" data-bs-dismiss="modal" aria-label="Close">{t("Fermer")} </button>
                          </div>
                        </div>
                        <div className="modal-body p-card py-0">

                  

                          <div className="form-floating mb-3">
                            <input className="form-control" id="sigle" type="text" name="libelle" onChange={handleChangeSect} value={sectData.libelle}/>
                            {errors.libelle && <span className="text-danger p-0 m-0">{errors.libelle}</span>}
                            <label htmlFor="eventTitle" className="pb-2 text-black">Libelle</label>
                          </div>
                          
                          
                          </div>
                          <div className="modal-footer d-flex justify-content-between align-items-center border-0">
                            <button className="btn btn-primary px-4 form-control" type="button" onClick={submitSect}>{t("Ajouter")}</button>
                          </div>
                      </div>
                    </div>
                  </div>
                </div>


                {/* ajout culture */}

                <div className="modal fade" id="addEventModalCulture" data-bs-backdrop="static" role="dialog" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                  <div className="modal-dialog ">
                    <div className="modal-content border">
                      <div id="addEventForm" autoComplete="off">
                        <div className="modal-header px-card border-0">
                          <div className="w-100 d-flex justify-content-between align-items-start">
                            <div>
                              <h5 className="mb-0 lh-sm text-1000">Enregistrement d'une culture</h5>
                            </div><button className="btn p-1 fs--2 text-900" type="button" data-bs-dismiss="modal" aria-label="Close">{t("Fermer")} </button>
                          </div>
                        </div>
                        <div className="modal-body p-card py-0">

                  

                          <div className="form-floating mb-3">
                            <input className="form-control" id="sigle" type="text" name="libelle" onChange={handleChangeCulture} value={cultureData.libelle}/>
                            {errors.libelle && <span className="text-danger p-0 m-0">{errors.libelle}</span>}
                            <label htmlFor="eventTitle" className="pb-2 text-black">Libelle</label>
                          </div>

                          <div className="form-floating mb-3">
                            <input className="form-control" id="sigle" type="text" name="prix_unitaire_culture" onChange={handleChangeCulture} value={cultureData.prix_unitaire_culture}/>
                            {errors.prix_unitaire_culture && <span className="text-danger p-0 m-0">{errors.prix_unitaire_culture}</span>}
                            <label htmlFor="eventTitle" className="pb-2 text-black">{t("Prix du kilogramme")}</label>
                          </div>
                          
                          
                          </div>
                          <div className="modal-footer d-flex justify-content-between align-items-center border-0">
                            <button className="btn btn-primary px-4 form-control" type="button" onClick={submitCulture}>{t("Ajouter")}</button>
                          </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* ajout saison */}

                <div className="modal fade" id="addEventModalSaison" data-bs-backdrop="static" role="dialog" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                  <div className="modal-dialog ">
                    <div className="modal-content border">
                      <div id="addEventForm" autoComplete="off">
                        <div className="modal-header px-card border-0">
                          <div className="w-100 d-flex justify-content-between align-items-start">
                            <div>
                              <h5 className="mb-0 lh-sm text-1000">Enregistrement d'une saison</h5>
                            </div><button className="btn p-1 fs--2 text-900" type="button" data-bs-dismiss="modal" aria-label="Close">{t("Fermer")} </button>
                          </div>
                        </div>
                        <div className="modal-body p-card py-0">

                  

                          <div className="form-floating mb-3">
                            <input className="form-control" id="sigle" type="text" name="libelle" onChange={handleChangeSaison} value={saisonData.libelle}/>
                            {errors.libelle && <span className="text-danger p-0 m-0">{errors.libelle}</span>}
                            <label htmlFor="eventTitle" className="pb-2 text-black">Libelle</label>
                          </div>
                          
                          
                          </div>
                          <div className="modal-footer d-flex justify-content-between align-items-center border-0">
                            <button className="btn btn-primary px-4 form-control" type="button" onClick={submitSaison}>{t("Ajouter")}</button>
                          </div>
                      </div>
                    </div>
                  </div>
                </div>
                

        </>
    )
}
//Une rencontre avec EXACTGREEN au niveau de la technologie

/* 

**EUDR reglementation sur la deforestation
**pilote de gestion de l'application 
**arguments pour chercher des marchés
**c'est nous qui allons gerer les données dans sa globalité
**les coops savent pour la reglementation 
**

*/

export default ParamsCoopList;