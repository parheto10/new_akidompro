import Content from "../../../Content";
import React, {Fragment, useEffect, useState} from 'react';
import UserContext from "../../../context/useContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import Validation from "../../../Validation";
import { useTranslation } from "react-i18next";

import BaseUrl from "../../../config/baseUrl";

// const baseUrl = 'http://127.0.0.1:8000/api';
const url = BaseUrl();
function ListCoop(){
    const {t} = useTranslation();
    const [cooperatives,setCooperatives] = useState([]);
    const user = UserContext();

    const [errors, setErrorM] = useState({});
    const navigate = useNavigate();


    const [regionList,setRegionList] = useState([]);
    const [errorNameCoop,setErrorNameCoop] = useState('');
    const [projets,setProjets] = useState([]);
    const [coopData,setCoopData] = useState({
      "region":"",
      "respCoop":"",
      "nomCoop":"",
      "contacts":"",
      "logo":"",
      'projet':"",
      "siege":""
    });

    const [ucoopData,setuCoopData] = useState({
      "region":"",
      "respCoop":"",
      "nomCoop":"",
      "contacts":"",
      "logo":"",
      "projet":"",
      "siege":""
    });

    useEffect(()=>{
      if(user && user.id){
        try {
          axios.get(url+'/cooperative-list/?userID='+user.id).then((resp)=>{
            setCooperatives(resp.data);
          });
        } catch (error) {
          console.log(error);
        }

        try {
          axios.get(url+'/proj-list/?userID='+user.id).then((resp)=>{
              setProjets(resp.data)
          })
      } catch (error) {
          
      }
      }

      try {
        axios.get(url+'/region-list/').then((resp)=>{
          setRegionList(resp.data);
        })
      } catch (error) { 
        console.log(error);
      }
 
    },[user])

    const handleChangeCoop=(event)=>{
      setCoopData({
        ...coopData,
        [event.target.name]: event.target.value
      })
    }
  
    const handleFileChangeCoop=(event)=>{
      setCoopData({
          ...coopData,
          [event.target.name]:event.target.files[0]
      });
    }
    /* update cooperative */
    const handleChangeCoopEdit=(event)=>{
      setuCoopData({
        ...ucoopData,
        [event.target.name]: event.target.value
      })
    }
  
    const handleFileChangeCoopEdit=(event)=>{
      setuCoopData({
          ...ucoopData,
          [event.target.name]:event.target.files[0]
      });
    }
  
    function generateUniqueID() {
      const timestamp = new Date().getTime().toString(); 
      const randomNum = Math.random().toString(36).substr(2, 9); 
  
      return timestamp + randomNum; 
    }

    const submitCoop=()=>{
      setErrorM(Validation(coopData));
  
      if(coopData.region !="" && coopData.nomCoop !="" && coopData.respCoop !="" && coopData.contacts !="" )
      {
        const _formData = new FormData();
        _formData.append('region',coopData.region);
        _formData.append('respCoop',coopData.respCoop);
        _formData.append('nomCoop',coopData.nomCoop);
        _formData.append('contacts',coopData.contacts);
        _formData.append('projetID',coopData.projet);
        _formData.append('siege',coopData.siege);
        _formData.append('userID',user.id);
  
        if (coopData.logo !=""){
  
            const currentTimeInSeconds = Math.floor(new Date().getTime() / 1000);
            const originalExtension = coopData.logo.name.split('.').pop();
            const newFileName = `${currentTimeInSeconds}_logo_${coopData.nomCoop}_${generateUniqueID()}.${originalExtension}`;
            const photo = new File([coopData.logo], newFileName, { type: coopData.logo.type });
          _formData.append('logo',photo);
  
        }
  
        setErrorNameCoop('');
  
        Swal.fire({
          title: 'Enregistrement...',
          html: 'Veillez patientez...',
          allowEscapeKey: false,
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading()
          },
          
        });
  
         try {
          axios.post(url+'/create-new-cooperative/',_formData).then((resp)=>{
            Swal.close()
  
            if(resp.data.bool)
            {
              window.$('#addEventModal').modal('hide');
              Swal.fire({
                title: 'FELICITATION !',
                html: "La coopérative <b>"+coopData.nomCoop+"</b> a bien été enregistrée.",
                icon: 'success',
                showCancelButton: false,
                confirmButtonColor: '#3085d6',
                confirmButtonText: 'OK'
              }).then((result) => {
                if (result.isConfirmed) {
  
                  axios.get(url+'/cooperative-list/?userID='+user.id).then((resp)=>{
                    setCooperatives(resp.data);
                  });
  
                }
              });
  
              setCoopData({
                "region":"",
                "respCoop":"",
                "logo":"",
                "nomCoop":"",
                "contacts":"",
                "projet":"",
                "siege":""
              })
            }
            else
            {
              setErrorNameCoop(resp.data.msg);
            }
          })
        } catch (error) {
          console.log(error);
        } 
        
      } 
    }

    const goToViewCooperative=(coopID)=>{
      navigate('/views-coop/'+coopID+'/');
    }

    const onOpenModalEdit=(coopID)=>{
      window.$(`#EditEventModalCoop${coopID}`).modal('show')
      try {
        axios.get(url+'/cooperative-list/?coopID='+coopID).then((resp)=>{
          setuCoopData({
            "region":resp.data[0].region?.id,
            "contacts":resp.data[0].contacts,
            "nomCoop":resp.data[0].nomCoop,
            "respCoop":resp.data[0].respCoop,
            "projet":resp.data[0].projet?.id,
            "siege":resp.data[0].siege,
          });
      });
      } catch (error) {
        console.log(error)
      }
    }

    const submitCoopEdit=(id)=>{
      setErrorM(Validation(ucoopData));
  
      if(ucoopData.siege !="" && ucoopData.region !="" && ucoopData.nomCoop !="" && ucoopData.respCoop !="" && ucoopData.contacts !="" )
      {
        const _formData = new FormData();
        _formData.append('region',ucoopData.region);
        _formData.append('respCoop',ucoopData.respCoop);
        _formData.append('nomCoop',ucoopData.nomCoop);
        _formData.append('contacts',ucoopData.contacts);
        _formData.append('siege',ucoopData.siege);
        _formData.append('projetID',ucoopData.projet);
        _formData.append('id',id);
  
        setErrorNameCoop('');
  
        Swal.fire({
          title: 'Modification...',
          html: 'Veillez patientez...',
          allowEscapeKey: false,
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading()
          },
          
        });
  
         try {
          axios.post(url+'/cooperative-update/',_formData).then((resp)=>{
            Swal.close()
  
            if(resp.data.bool)
            {
              window.$(`#EditEventModalCoop${id}`).modal('hide');
              Swal.fire({
                title: 'FELICITATION !',
                html: "La coopérative <b>"+ucoopData.nomCoop+"</b> a bien été modifiée.",
                icon: 'success',
                showCancelButton: false,
                confirmButtonColor: '#3085d6',
                confirmButtonText: 'OK'
              }).then((result) => {
                if (result.isConfirmed) {
  
                  axios.get(url+'/cooperative-list/?userID='+user.id).then((resp)=>{
                    setCooperatives(resp.data);
                  });
  
                }
              });
  
              setuCoopData({
                "region":"",
                "respCoop":"",
                "nomCoop":"",
                "contacts":"",
                "projet":"",
                "siege":""
              })
            }
            else
            {
              setErrorNameCoop('Un problème est subvenu !');
            }
          })
        } catch (error) {
          console.log(error);
        } 
        
      } 
    }

    return (
        <Fragment>
            <Content sideID={"cooperatives"} parent={"generalite"} className="mt-5">
            {user && user.is_adg ? 
              <h2 className="text-bold text-1100 mb-5 mt-5">{t("Info Profil")}</h2> :
              <h2 className="text-bold text-1100 mb-5 mt-5">{t("Coopératives")}</h2>
            }
            <div id="members" >
              <div className="row align-items-center justify-content-between g-3 mb-4">
                <div className="col col-auto">
                  <div className="search-box">
                    <form className="position-relative" data-bs-toggle="search" data-bs-display="static">
                        <input className="form-control search-input search" type="search" placeholder="Recherche une coopérative" aria-label="Search" />
                      <span className="fas fa-search search-box-icon"></span>
                    </form>
                  </div>
                </div>
                <div className="col-auto">
                  <div className="d-flex align-items-center">
                      {/* <button className="btn btn-link text-900 me-4 px-0"><span className="fa-solid fa-file-export fs--1 me-2"></span>Export</button> */}
                      {user && user.is_responsable ? 
                        <button className="btn btn-primary btn-sm" type="button" data-bs-toggle="modal" data-bs-target="#addEventModal">
                          <span className="fas fa-plus pe-2 fs--2"></span>
                            {t("Créer une coopérative")}
                        </button> : ""
                      }
                  </div>
                </div>
              </div>
              <div className="mx-n4 mx-lg-n6 px-4 px-lg-6 mb-9 bg-white border-y border-300 mt-2 position-relative top-1">
                <div className="table-responsive scrollbar ms-n1 ps-1">
                  <table className="table table-striped table-sm fs--1 mb-0 ">
                    <thead>
                      <tr className="" style={{backgroundColor: "#EE9F27", color: "#fff"}}>
                      <th className="sort align-middle text-center" scope="col"  style={{width:"5%"}}>Logo</th>
                        <th className="sort align-middle text-center" scope="col"  style={{width:"20%"}}>{t("Coopérative")}</th>
                        <th className="sort align-middle text-center" scope="col" style={{width:"20%"}}>{t("Région")}</th>
                        <th className="sort align-middle text-center" scope="col" style={{width:"20%"}}>{t("Siège")}</th>
                        <th className="sort align-middle text-center pe-3" scope="col"  style={{width:"20%"}}>{t("Projet associé")}</th>
                        <th className="sort align-middle text-center" scope="col" style={{width:"15%"}}>{t("Responsable")}</th>
                        <th className="sort align-middle text-center" scope="col" style={{width:"15%"}}>{t("Producteurs")}</th>
                        <th className="sort align-middle text-center " scope="col" style={{width:"10%",  minWidth:"50px"}}>{t("Action")}</th>
                      </tr>
                    </thead>
                    <tbody className="list" id="members-table-body">
                      
                          {cooperatives.map((coop,index)=>
                              <tr className="hover-actions-trigger btn-reveal-trigger position-static" >
                                    <td className="email align-middle white-space-nowrap text-center">
                                    <img src={coop.logo}  width={150} height={100}/>
                                </td>
                                <td className="email align-middle white-space-nowrap text-center">
                                    {coop.nomCoop}
                                </td>
                                <td className="email align-middle white-space-nowrap text-center">
                                      {coop.region?.libelle}
                                </td>
                                <td className="email align-middle white-space-nowrap text-center">
                                      {coop.siege}
                                </td>
                                <td className="city align-middle white-space-nowrap text-900 text-center">{coop.projet?.nomProjet}</td>
                                <td className="city align-middle white-space-nowrap text-900 text-center">
                                  {coop.respCoop}
                                </td>

                                <td className="city align-middle white-space-nowrap text-900 text-center">
                                  <b>{coop.total_producteurs_coop}</b>
                                </td>
                                
                                
                                <td className="last_active align-middle  white-space-nowrap text-700 text-center">
                                    <button className="btn btn-success btn-sm p-1 mx-1" onClick={()=>goToViewCooperative(coop.id)}><i className="fas fa-eye"></i></button>
                                    <button className="btn btn-primary btn-sm p-1" onClick={()=>onOpenModalEdit(coop.id)}><i className="fas fa-pencil"></i></button>

                                    {/* modal edit cooperatives */}

                                      <div className="modal fade" id={`EditEventModalCoop${coop.id}`} data-bs-backdrop="static" role="dialog" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                                        <div className="modal-dialog modal-md">
                                          <div className="modal-content border">
                                            <div id="addEventForm" autoComplete="off">
                                              <div className="modal-header px-card border-0">
                                                <div className="w-100 d-flex justify-content-between align-items-start">
                                                  <div>
                                                    <h5 className="mb-0 lh-sm text-1000">Modification <b className="text-success">{coop.nomCoop}</b></h5>
                                                  </div><button className="btn p-1 fs--2 text-900" type="button" data-bs-dismiss="modal" aria-label="Close">Fermer </button>
                                                </div>
                                              </div>
                                              <div className="modal-body p-card py-0">
                                                <div className="row">
                                                  <div className="form-floating mb-5 col-md-6">
                                                    <select className="form-select" id="categorie" name="region" onChange={handleChangeCoopEdit} value={ucoopData.region}>
                                                      <option selected="selected" value="">...</option>
                                                      {regionList.map((region,index)=>
                                                        <option value={region.id}>{region.libelle}</option>
                                                      )}
                                                    </select>
                                                    {errors.region && <span className="text-danger p-0 m-0">{errors.region}</span>}
                                                    <label htmlFor="eventLabel" className="pb-2 text-warning">Région</label>
                                                  </div>

                                                  <div className="form-floating mb-5 col-md-6">
                                                    <select className="form-select" id="projet" name="projet" onChange={handleChangeCoopEdit} value={ucoopData.projet}>
                                                      <option selected="selected" value="">...</option>
                                                      {projets.map((projet,index)=>
                                                        <option value={projet?.id}>{projet?.nomProjet}</option>
                                                      )}
                                                    </select>
                                                    {/* {errors.projet && <span className="text-danger p-0 m-0">{errors.projet}</span>} */}
                                                    <label htmlFor="eventLabel" className="pb-2 text-warning">Projets</label>
                                                  </div>

                                                </div>
                                              
                                                
                                                <div className="form-floating mb-3">
                                                  <input className="form-control" id="sigle" type="text" name="nomCoop" onChange={handleChangeCoopEdit} value={ucoopData.nomCoop} />
                                                  {errors.nomCoop && <span className="text-danger p-0 m-0">{errors.nomCoop}</span>}
                                                  {errorNameCoop !="" && <span className="text-danger p-0 m-0">{errorNameCoop}</span>}
                                                  <label htmlFor="eventTitle" className="pb-2 text-warning">Nom de la coopérative</label>
                                                </div>

                                                <div className="form-floating mb-3">
                                                  <input className="form-control" id="sigle" type="text" name="siege" onChange={handleChangeCoopEdit} value={ucoopData.siege} />
                                                  {errors.siege && <span className="text-danger p-0 m-0">{errors.siege}</span>}
                                                  <label htmlFor="eventTitle" className="pb-2 text-warning">Siege de la coopérative (Ville)</label>
                                                </div>


                                                <div className="form-floating mb-3">
                                                  <input className="form-control" id="chef" type="text" name="respCoop" onChange={handleChangeCoopEdit} value={ucoopData.respCoop} />
                                                  {errors.respCoop && <span className="text-danger p-0 m-0">{errors.respCoop}</span>}
                                                  <label htmlFor="eventTitle" className="pb-2 text-warning">Nom complet du responsable</label>
                                                </div>

                                                <div className="form-floating mb-3">
                                                  <input className="form-control" id="titre" type="text" name="contacts" onChange={handleChangeCoopEdit} value={ucoopData.contacts} />
                                                  {errors.contacts && <span className="text-danger p-0 m-0">{errors.contacts}</span>}
                                                  <label htmlFor="eventTitle" className="pb-2 text-warning">Contact de la coopérative</label>
                                                </div>

                                                
                                                
                                                
                                                </div>
                                                <div className="modal-footer d-flex justify-content-between align-items-center border-0">
                                                  <button className="btn btn-success px-4 form-control" type="button" onClick={()=>submitCoopEdit(coop.id)}>Modifier</button>
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

            {/* modal add cooperatives */}
            <div className="modal fade" id="addEventModal" data-bs-backdrop="static" role="dialog" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
              <div className="modal-dialog modal-md">
                <div className="modal-content border">
                  <div id="addEventForm" autoComplete="off">
                    <div className="modal-header px-card border-0">
                      <div className="w-100 d-flex justify-content-between align-items-start">
                        <div>
                          <h5 className="mb-0 lh-sm text-1000">Création d'une coopérative</h5>
                        </div><button className="btn p-1 fs--2 text-900" type="button" data-bs-dismiss="modal" aria-label="Close">Fermer </button>
                      </div>
                    </div>
                    <div className="modal-body p-card py-0">
                      <div className="row">
                        <div className="form-floating mb-5 col-md-6">
                          <select className="form-select" id="categorie" name="region" onChange={handleChangeCoop} value={coopData.region}>
                            <option selected="selected" value="">...</option>
                            {regionList.map((region,index)=>
                              <option value={region.id}>{region.libelle}</option>
                            )}
                          </select>
                          {errors.region && <span className="text-danger p-0 m-0">{errors.region}</span>}
                          <label htmlFor="eventLabel" className="pb-2 text-warning">Région</label>
                        </div>

                        <div className="form-floating mb-5 col-md-6">
                          <select className="form-select" id="projet" name="projet" onChange={handleChangeCoop} value={coopData.projet}>
                            <option selected="selected" value="">...</option>
                            {projets.map((projet,index)=>
                              <option value={projet?.id}>{projet?.nomProjet}</option>
                            )}
                          </select>
                          {/* {errors.projet && <span className="text-danger p-0 m-0">{errors.projet}</span>} */}
                          <label htmlFor="eventLabel" className="pb-2 text-warning">Projets</label>
                        </div>

                      </div>
                    
                      
                      <div className="form-floating mb-3">
                        <input className="form-control" id="sigle" type="text" name="nomCoop" onChange={handleChangeCoop} value={coopData.nomCoop} />
                        {errors.nomCoop && <span className="text-danger p-0 m-0">{errors.nomCoop}</span>}
                        {errorNameCoop !="" && <span className="text-danger p-0 m-0">{errorNameCoop}</span>}
                        <label htmlFor="eventTitle" className="pb-2 text-warning">Nom de la coopérative</label>
                      </div>

                      <div className="form-floating mb-3">
                        <input className="form-control" id="sigle" type="text" name="siege" onChange={handleChangeCoop} value={coopData.siege} />
                        {errors.siege && <span className="text-danger p-0 m-0">{errors.siege}</span>}
                        <label htmlFor="eventTitle" className="pb-2 text-warning">Siege de la coopérative (Ville)</label>
                      </div>


                      <div className="form-floating mb-3">
                        <input className="form-control" id="chef" type="text" name="respCoop" onChange={handleChangeCoop} value={coopData.respCoop} />
                        {errors.respCoop && <span className="text-danger p-0 m-0">{errors.respCoop}</span>}
                        <label htmlFor="eventTitle" className="pb-2 text-warning">Nom complet du responsable</label>
                      </div>

                      <div className="form-floating mb-3">
                        <input className="form-control" id="titre" type="text" name="contacts" onChange={handleChangeCoop} value={coopData.contacts} />
                        {errors.contacts && <span className="text-danger p-0 m-0">{errors.contacts}</span>}
                        <label htmlFor="eventTitle" className="pb-2 text-warning">Contact de la coopérative</label>
                      </div>

                      <div className="form-floating mb-3">
                        <input className="form-control" id="titre" type="file" name="logo" onChange={handleFileChangeCoop} />
                        <label htmlFor="eventTitle" className="pb-2 text-warning">Logo de la coopérative (Facultatif)</label>
                      </div>
                      
                      
                      </div>
                      <div className="modal-footer d-flex justify-content-between align-items-center border-0">
                        <button className="btn btn-primary px-4 form-control" type="button" onClick={submitCoop}>Ajouter</button>
                      </div>
                  </div>
                </div>
              </div>
            </div>
            </Content>
        </Fragment>
    )
}
export default ListCoop;