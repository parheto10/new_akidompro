import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import personIcon from '../../../../assets/img/avatar.jpg';
import peopleIcon from '../../../../assets/img/peopleicon.png';
import Validation from "../../../../Validation";


import BaseUrl from "../../../../config/baseUrl";

// const baseUrl = 'http://127.0.0.1:8000/api';
const url = BaseUrl();
function ProducteurCoopList({coopID,campagne}){
    const navigate = useNavigate();
    const [errors, setErrorM] = useState({});
    const [groupeList,setGroupeList] = useState([]);
    const [prodList,setProdList] = useState([]);
    const [sectionsList,setSectionList] = useState([]);
    const [producteurData,setProducteurData] = useState({
        "section":"",
        "nomComplet":"",
        "contacts":"",
        "photo":"",
        "nbParc":"1",
        "groupe":"",
        "representant":"",
        'lieu_habitation':""
    });


    useEffect(()=>{
        if(coopID){

            try {
                axios.get(url+'/producteurs-list/?coopID='+coopID).then((resp)=>{
                    setProdList(resp.data);
                  });  
                  axios.get(url+'/section-list/?coopID='+coopID).then((resp)=>{
                    setSectionList(resp.data);
                  });
                
            } catch (error) {
                
            }

             
                                        
          }
    },[coopID,campagne])
    const submitProd=()=>{
        setErrorM(Validation(producteurData));
        if(producteurData.nomComplet !="" && producteurData.section !="" )
        {
    
          const _formData = new FormData();
          _formData.append('nomComplet',producteurData.nomComplet);
          _formData.append('section',producteurData.section);
          _formData.append('contacts',producteurData.contacts);
          _formData.append('nbParc',producteurData.nbParc);
          _formData.append('campagne',campagne.id);
          _formData.append('groupe',producteurData.groupe);
          _formData.append('representant',producteurData.representant);
          _formData.append('lieu_habitation',producteurData.lieu_habitation);
    
          if(producteurData.photo !="")
          {
            const currentTimeInSeconds = Math.floor(new Date().getTime() / 1000);
            const originalExtension = producteurData.photo.name.split('.').pop();
            const newFileName = `${currentTimeInSeconds}_photo_${producteurData.nomComplet}.${originalExtension}`;
            const photo = new File([producteurData.photo], newFileName, { type: producteurData.photo.type });
          _formData.append('photo',photo);
          }
    
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
            axios.post(url+'/producteur-coop-save/',_formData).then((resp)=>{
              Swal.close()
              if(resp.data.bool)
              {
                window.$('#addEventModalProd').modal('hide');
                Swal.fire({
                  title: 'FELICITATION !',
                  html: " <b>"+producteurData.nomComplet+"</b> a bien été enregistrée, avec le code <b>"+resp.data.code+"</b> ",
                  icon: 'success',
                  showCancelButton: false,
                  confirmButtonColor: '#3085d6',
                  confirmButtonText: 'OK'
                }).then((result) => {
                  if (result.isConfirmed) {
    
                    axios.get(url+'/producteurs-list/?coopID='+coopID).then((resp)=>{
                      setProdList(resp.data);
                    });   
    
                  }
                });
    
                setProducteurData({
                  "nomComplet":"",
                  "groupe":"",
                  "nbParc":"0",
                  "section":"",
                  "representant":"",
                  "contacts":"",
                  "photo":""
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
    
      const ViewProducteur=(prodID)=>{
    
        navigate('/views-producteur/'+prodID+'/');
        //window.location.reload();
      }

      const onPenModalProd=()=>{
        if(sectionsList.length>0)
        {
          window.$('#addEventModalProd').modal('show')
        }
        else
        {
          Swal.fire({
            title: 'ATTENTION !',
            html: "Aucune section n'est enregistré pour cette coopérative",
            icon: 'error',
            showCancelButton: false,
            confirmButtonColor: 'red',
            confirmButtonText: 'OK'
          })
        }
        
      }

      const handleFileChangePhotoProd=(event)=>{
        setProducteurData({
            ...producteurData,
            [event.target.name]:event.target.files[0]
        });
      }

    const handleChangeProd=(event)=>{
        setProducteurData({
          ...producteurData,
          [event.target.name]:event.target.value
        });
    }
    return (
        <>
              <div className="tab-pane fade active show" id="tab-activity" role="tabpanel" aria-labelledby="activity-tab">
                  <div className="row align-items-center gx-4 gy-3 flex-wrap mb-3">
                      <div className="col-auto d-flex flex-1">
                        <h2 className="mb-0">Liste des producteurs ({prodList.length})</h2>
                      </div>
                      <div className="col-auto">
                            <div className="search-box">
                              <form className="position-relative" data-bs-toggle="search" data-bs-display="static">
                                  <input className="form-control search-input search" type="search" placeholder="Recherche producteur" aria-label="Search" />
                                <span className="fas fa-search search-box-icon"></span>
                              </form>
                            </div>
                      </div> 
                      <div className="col-auto"><button className="btn btn-primary" onClick={()=>onPenModalProd()}><span className="fa-solid fa-plus me-2"></span>Ajouter</button></div>
                    </div>
                    <div className="border-top border-bottom border-200" id="leadDetailsTable" >
                      <div className="table-responsive scrollbar mx-n1 px-1">
                        <table className="table fs--1 mb-0">
                          <thead>
                            <tr className="bg-warning">
                              <th className="white-space-nowrap fs--1 align-middle ps-0" style={{"width":"26px"}}>
                                <div className="form-check mb-0 fs-0"><input className="form-check-input" type="checkbox" data-bulk-select='{"body":"lead-details-table-body"}' /></div>
                              </th>
                              <th className="sort white-space-nowrap align-middle pe-3 ps-0 text-uppercase" scope="col" data-sort="name" style={{"width":"40%", "min-width":"100px"}}>Nom et prénoms</th>
                              <th className="sort align-middle pe-6 text-uppercase" scope="col" data-sort="description" style={{"width":"10%", "max-width":"60px"}}>Code</th>
                              <th className="sort align-middle text-start text-uppercase" scope="col" data-sort="create_date" style={{"width":"10%", "min-width":"50px"}}>Nbre Parcelle</th>
                              <th className="sort align-middle text-start text-uppercase" scope="col" data-sort="create_by" style={{"width":"20%", "min-width":"150px"}}>Section</th>
                              <th className="sort align-middle ps-0  text-uppercase" scope="col" data-sort="last_activity" style={{"width":"10%", "max-width":"115px"}}>Contact</th>
                              <th className="align-middle pe-0 text-end" scope="col" style={{"width":"10%"}}></th>
                            </tr>
                          </thead>
                          <tbody className="list" id="lead-details-table-body">
                            {prodList.map((prod,index)=>
                              <tr className="hover-actions-trigger btn-reveal-trigger position-static">
                                <td className="fs--1 align-middle px-0 py-3">
                                  <div className="form-check mb-0 fs-0">
                                    <input className="form-check-input" type="checkbox" />
                                  </div>
                                </td>
                                <td className="name align-middle white-space-nowrap py-2 ps-0">
                                  <span className="d-flex align-items-center text-1000 cursor-pointer" >
                                    <div className="avatar avatar-m me-3 status-online">
                                      {prod.photo ?
                                        <img className="rounded-circle" src={prod.photo} alt="" />
                                        :
                                        <>
                                        <img className="rounded-circle" src={personIcon} alt="" />
                                          {/* {prod.groupe?.id == 1 && <img className="rounded-circle" src={peopleIcon} alt="" />} */}
                                          {/* {prod.groupe?.id == 2 && <img className="rounded-circle" src={personIcon} alt="" />} */}
                                        </>
                                      }
                                      
                                    </div>
                                    <h6 className="mb-0 text-1000 fw-bold text-primary" onClick={()=>ViewProducteur(prod.code)}>{prod.nomComplet}</h6>
                                  </span>
                                </td>
                                <td className="description align-middle white-space-nowrap text-start fw-bold text-700 py-2 pe-6">{prod.code}</td>
                                <td className="create_date text-end align-middle white-space-nowrap text-900 py-2 text-center">{prod.total_parcelle_prod}/{prod.nbParc}</td>
                                <td className="create_by align-middle white-space-nowrap fw-semi-bold text-1000">{prod.section.libelle}</td>
                                <td className="last_activity align-middle text-center py-2">
                                  <div className="d-flex align-items-center flex-1"><span className="fw-bold fs--1 text-900">{prod.contacts}</span></div>
                                </td>
                                <td className="align-middle text-end white-space-nowrap pe-0 action py-2">
                                  <div className="font-sans-serif btn-reveal-trigger position-static"><button className="btn btn-sm dropdown-toggle dropdown-caret-none transition-none btn-reveal" type="button" data-bs-toggle="dropdown" data-boundary="window" aria-haspopup="true" aria-expanded="false" data-bs-reference="parent"><span className="fas fa-ellipsis-h fs--2"></span></button>
                                    <div className="dropdown-menu dropdown-menu-end py-2">
                                      <a className="dropdown-item" onClick={()=>ViewProducteur(prod.code)}>Profil</a>
                                      <div className="dropdown-divider"></div>
                                      <a className="dropdown-item text-danger" href="#!">Suprimer</a>
                                    </div>
                                  </div>
                                </td>
                            </tr>
                            )}
                            
                          </tbody>
                        </table>
                      </div>
                      <div className="row align-items-center justify-content-between py-2 pe-0 fs--1">
                      {/*   <div className="col-auto d-flex">
                          <p className="mb-0 d-none d-sm-block me-3 fw-semi-bold text-900" data-list-info="data-list-info"></p><a className="fw-semi-bold" href="#!" data-list-view="*">View all<span className="fas fa-angle-right ms-1" data-fa-transform="down-1"></span></a><a className="fw-semi-bold d-none" href="#!" data-list-view="less">View Less<span className="fas fa-angle-right ms-1" data-fa-transform="down-1"></span></a>
                        </div>
                        <div className="col-auto d-flex"><button className="page-link" data-list-pagination="prev"><span className="fas fa-chevron-left"></span></button>
                          <ul className="mb-0 pagination"></ul><button className="page-link pe-0" data-list-pagination="next"><span className="fas fa-chevron-right"></span></button>
                        </div> */}
                      </div>
                    </div>
                  </div>

                              {/* modal create prod */}

                        <div className="modal fade" id="addEventModalProd" data-bs-backdrop="static" role="dialog" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                        <div className="modal-dialog modal-md">
                            <div className="modal-content border">
                            <div id="addEventForm" autoComplete="off">
                                <div className="modal-header px-card border-0">
                                <div className="w-100 d-flex justify-content-between align-items-start">
                                    <div>
                                    <h5 className="mb-0 lh-sm text-1000">Enregistrement d'un producteur</h5>
                                    </div><button className="btn p-1 fs--2 text-900" type="button" data-bs-dismiss="modal" aria-label="Close">Fermer </button>
                                </div>
                                </div>
                                <div className="modal-body p-card py-0">

                                <div className="row">
                                {/*  <div className="form-floating mb-5 col-md-6">
                                        <select className="form-select" id="categorie" name="groupe" onChange={handleChangeProd} value={producteurData.groupe}>
                                        <option selected="selected" value="">...</option>
                                        {groupeList.map((groupe,index)=>
                                            <option value={groupe.id}>{groupe.libelle}</option>
                                        )}
                                        </select>
                                        {errors.groupe && <span className="text-danger p-0 m-0">{errors.groupe}</span>}
                                        <label htmlFor="eventLabel" className="pb-2 text-warning">Groupe</label>
                                    </div> */}

                                    <div className="form-floating mb-5 col-md-12">
                                        <select className="form-select" id="categorie" name="section" onChange={handleChangeProd} value={producteurData.section}>
                                        <option selected="selected" value="">...</option>
                                        {sectionsList.map((section,index)=>
                                            <option value={section.id}>{section.libelle}</option>
                                        )}
                                        </select>
                                        {errors.section && <span className="text-danger p-0 m-0">{errors.section}</span>}
                                        <label htmlFor="eventLabel" className="pb-2 text-warning">Section</label>
                                    </div>
                                </div>

                                <div className="form-floating mb-3">
                                    <input className="form-control" id="sigle" type="text" name="nomComplet" onChange={handleChangeProd} value={producteurData.nomComplet}/>
                                    {errors.nomComplet && <span className="text-danger p-0 m-0">{errors.nomComplet}</span>}
                                    <label htmlFor="eventTitle" className="pb-2 text-warning">Nom complet</label>
                                </div>

                                {/*  {producteurData.groupe == "1" && 
                                    <div className="form-floating mb-3">
                                    <input className="form-control" id="chef" type="text" name="representant"  onChange={handleChangeProd} value={producteurData.representant}/>
                                    <label htmlFor="eventTitle" className="pb-2 text-warning">Nom complet du representant</label>
                                    </div>
                                } */}

                                <div className="form-floating mb-3">
                                    <input className="form-control" id="chef" type="text" name="lieu_habitation"  onChange={handleChangeProd} value={producteurData.lieu_habitation}/>
                                    <label htmlFor="eventTitle" className="pb-2 text-warning">Lieu d'habitation</label>
                                    </div>
                                

                                    <div className="row">
                                        <div className="form-floating mb-3 col-md-6">
                                            <input className="form-control" id="titre" type="number" name="nbParc"  onChange={handleChangeProd} value={producteurData.nbParc}/>
                                            <label htmlFor="eventTitle" className="pb-2 text-warning">Nombre de parcelle</label>
                                        </div>

                                        <div className="form-floating mb-3 col-md-6">
                                            <input className="form-control" id="titre" type="text" name="contacts"  onChange={handleChangeProd} value={producteurData.contacts}/>
                                            <label htmlFor="eventTitle" className="pb-2 text-warning">Contact</label>
                                        </div>
                                    </div>
                                

                                <div className="form-floating mb-3">
                                    <input className="form-control" id="titre" type="file" name="photo"  onChange={handleFileChangePhotoProd}/>
                                    <label htmlFor="eventTitle" className="pb-2 text-warning">Ma photo</label>
                                </div>
                                
                                
                                </div>
                                <div className="modal-footer d-flex justify-content-between align-items-center border-0">
                                    <button className="btn btn-primary px-4 form-control" type="button" onClick={submitProd}>Ajouter</button>
                                </div>
                            </div>
                            </div>
                        </div>
                        </div>
        </>
    )
}

export default ProducteurCoopList;