import { useEffect, useState } from "react";
import Content from "../../Content";
import UserContext from "../../context/useContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import Validation from "../../Validation";


import BaseUrl from "../../config/baseUrl";

// const baseUrl = 'http://127.0.0.1:8000/api';
const url = BaseUrl();
function ListeProj(){
    const user = UserContext();
    const [projets,setProjets] = useState([]);
    const navigate = useNavigate();
    const [countriLists,setCountrieLists] = useState([]);
    const [errors, setErrorM] = useState({});

    const [projetData,setProjetData] = useState({
      "nomProjet":"",
      "countrie":"",
      "description":"",
      "dateDebut":"",
      "dateFin":"",
      "objectif":"",
      "plant_aproduit":"0",
      "carbon_astock":"0",
      "emp_engageof_proj":"0",
     
  });

    useEffect(()=>{

        if(user && user.id){
            try {
                axios.get(url+'/proj-list/?userID='+user.id).then((resp)=>{
                    setProjets(resp.data)
                })
            } catch (error) {
                console.log(error);
            }
        }

        axios.get(url+'/countries-list/').then((resp)=>{
          setCountrieLists(resp.data);
      })
      
    },[user]);

    const handleChange=(event)=>{
      setProjetData({
          ...projetData,
          [event.target.name] : event.target.value
      })
  }

  const validateCreationProj=(e)=>{
    e.preventDefault();
    setErrorM(Validation(projetData));
    if(projetData.nomProjet !="" && projetData.dateDebut !="" && projetData.dateFin !="" && projetData.objectif !="" && projetData.description !=""){
      const _formData = new FormData();

      _formData.append('nomProjet',projetData.nomProjet);
      _formData.append('countrieID',projetData.countrie);
      _formData.append('description',projetData.description);
      _formData.append('dateDebut',projetData.dateDebut);
      _formData.append('dateFin',projetData.dateFin);
      _formData.append('objectif',projetData.objectif);
      _formData.append('plant_aproduit',projetData.plant_aproduit);
      _formData.append('carbon_astock',projetData.carbon_astock);
      _formData.append('emp_engageof_proj',projetData.emp_engageof_proj);
      _formData.append('userID',user.id);
      _formData.append('campagne',localStorage.getItem('campagne'));
  
      try {
          axios.post(url+'/create-projet-users/',_formData).then((resp)=>{
              if(resp.data.bool)
              {
                  Swal.fire({
                      title: 'FELICITATION !',
                      text: 'Projet crée avec succès !',
                      icon: 'success',
                      showCancelButton: false,
                      confirmButtonColor: '#3085d6',
                      confirmButtonText: 'OK'
                    }).then((result) => {
                      if (result.isConfirmed) {
                        axios.get(url+'/proj-users-list/?userID='+user.id).then((resp)=>{
                          setProjets(resp.data)
                      })
                      }
                    });
              }
          })
      } catch (error) {
          console.log(error);
      }
    }


}

    const viewProjDetail=(projId)=>{
        navigate('/views-projet/'+projId+'/');
        //window.location.reload();
    }


    return (
        <>
            <Content sideID={'projets'}  parent={"params"}>
          
                    <h2 className="text-bold text-1100 mb-5">Mes Projets</h2>
                    <div id="members" >
                      <div className="row align-items-center justify-content-between g-3 mb-4">
                        <div className="col col-auto">
                          <div className="search-box">
                            <form className="position-relative" data-bs-toggle="search" data-bs-display="static">
                                <input className="form-control search-input search" type="search" placeholder="Search members" aria-label="Search" />
                              <span className="fas fa-search search-box-icon"></span>
                            </form>
                          </div>
                        </div>
                        <div className="col-auto">
                          <div className="d-flex align-items-center">
                              {/* <button className="btn btn-link text-900 me-4 px-0"><span className="fa-solid fa-file-export fs--1 me-2"></span>Export</button> */}
                              <button className="btn btn-primary btn-sm" type="button" data-bs-toggle="modal" data-bs-target="#addEventModal">
                                <span className="fas fa-plus pe-2 fs--2"></span>
                                Créer un Projet
                              </button>
                          </div>
                        </div>
                      </div>
                      <div className="mx-n4 mx-lg-n6 px-4 px-lg-6 mb-9 bg-white border-y border-300 mt-2 position-relative top-1">
                        <div className="table-responsive scrollbar ms-n1 ps-1">
                          <table className="table table-striped table-sm fs--1 mb-0 ">
                            <thead>
                              <tr className="bg-warning">
                                <th className="sort align-middle text-center" scope="col" data-sort="customer" style={{width:"20%"}}>Nom projet</th>
                                <th className="sort align-middle text-center" scope="col" data-sort="email" style={{width:"20%"}}>Pays</th>
                                <th className="sort align-middle text-center pe-3" scope="col" data-sort="mobile_number" style={{width:"20%"}}>Catégories</th>
                                <th className="sort align-middle text-center" scope="col" data-sort="email" style={{width:"20%"}}>Status</th>
                                <th className="sort align-middle text-center" scope="col" data-sort="last_active" style={{width:"21%",  minWidth:"200px"}}>Action</th>
                              </tr>
                            </thead>
                            <tbody className="list" id="members-table-body">
                             
                                   {projets &&
                                    projets.map((projet,index)=>
                                        <tr className="hover-actions-trigger btn-reveal-trigger position-static" >
                                            
                                        <td className="email align-middle white-space-nowrap text-center">
                                            {projet?.nomProjet}
                                        </td>
                                        <td className="email align-middle white-space-nowrap text-center">
                                            {projet?.countrie?.libelle}        
                                        </td>
                                        <td className="city align-middle white-space-nowrap text-900 text-center">{projet?.objectif}</td>
                                        <td className="city align-middle white-space-nowrap text-900 text-center">
                                            {projet?.etat && <span className="badge bg-success">en cours</span>}
                                            {!projet?.etat && <span className="badge bg-warning">Terminé</span>}
                                        </td>
                                        <td className="last_active align-middle text-center white-space-nowrap text-700">
                                            <button className="btn btn-success btn-sm mx-1" onClick={()=>viewProjDetail(projet?.id)}><i className="fas fa-eye"></i></button>
                                           {/*  <button className="btn btn-primary btn-sm" ><i className="fas fa-pencil"></i></button> */}
                                        </td>
                                    </tr>
                                    )
                                   }

                              
                            </tbody>
                          </table>
                        </div>
                        
                      </div>
                    </div>

                {/* modal add Projet */}
                <div className="modal fade" id="addEventModal" data-bs-backdrop="static" role="dialog" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                  <div className="modal-dialog modal-md">
                    <div className="modal-content border">
                      <form id="addEventForm" autoComplete="off" onSubmit={validateCreationProj}>
                        <div className="modal-header px-card border-0">
                          <div className="w-100 d-flex justify-content-between align-items-start">
                            <div>
                              <h5 className="mb-0 lh-sm text-1000">Enregistrement de projet</h5>
                            </div><button className="btn p-1 fs--2 text-900" type="button" data-bs-dismiss="modal" aria-label="Close">Fermer </button>
                          </div>
                        </div>
                        <div className="modal-body p-card py-0">
                          <div className="row">
                            <div className="form-floating mb-5 col-md-6">
                              <select className="form-select" id="categorie" name="countrie" onChange={handleChange} value={projetData.countrie}>
                                <option selected="selected" value="">...</option>
                                 {countriLists.map((countrie,index)=>
                                  <option value={countrie.id}>{countrie.libelle}</option>
                                )} 
                              </select>
                              {errors.countrie && <span className="text-danger">{errors.countrie}</span>}
                              <label htmlFor="eventLabel" className="pb-2 text-warning">Pays</label>
                            </div>

                            <div className="form-floating mb-3 col-md-6">
                            <input className="form-control" id="sigle" type="text" name="nomProjet" onChange={handleChange} value={projetData.nomProjet}/>
                            {errors.nomProjet && <span className="text-danger">{errors.nomProjet}</span>}
                            <label htmlFor="eventTitle" className="pb-2 text-warning">Nom du projet</label>
                          </div>

                          </div>
                          <div className="row">
                            <div className="form-floating mb-3 col-md-6">
                              <input className="form-control" id="sigle" type="date" name="dateDebut"  onChange={handleChange} value={projetData.dateDebut}/>
                              {errors.dateDebut && <span className="text-danger">{errors.dateDebut}</span>}
                              <label htmlFor="eventTitle" className="pb-2 text-warning">Date de debut</label>
                            </div>


                            <div className="form-floating mb-3 col-md-6">
                              <input className="form-control" id="chef" type="date" name="dateFin"  onChange={handleChange} value={projetData.dateFin} />
                              {errors.dateFin && <span className="text-danger">{errors.dateFin}</span>}
                              <label htmlFor="eventTitle" className="pb-2 text-warning">Date de fin</label>
                            </div>
                          </div>
                        
                          <div className="form-floating mb-5 col-md-12">
                              <select className="form-select" id="categorie" name="objectif"  onChange={handleChange} value={projetData.objectif}>
                                <option selected="selected" value="">...</option>
                                <option value="AGROFORESTERIE">Agroforesteries</option>
                                <option value="REFORESTATION">Reforestations</option>
                                <option value="AGROFORESTERIE ET REFORESTATION">Agroforesteries et Reforestations</option>
                                <option value="MANGROVE">Mangroves</option>
                                <option value="AUTRES">Autres</option>
                              </select>
                              {errors.objectif && <span className="text-danger">{errors.objectif}</span>}
                              <label htmlFor="eventLabel" className="pb-2 text-warning">Objectifs</label>
                            </div>

                            <div className="form-floating mb-3">
                            <textarea className="form-control" name="description" onChange={handleChange} value={projetData.description}></textarea>
                            {errors.description && <span className="text-danger">{errors.description}</span>}
                            <label htmlFor="eventTitle" className="pb-2 text-warning">Description du projet</label>
                          </div>
                            
                            <div className="row">
                              <div className="form-floating mb-3 col-md-4">
                                <input className="form-control" id="chef" type="text" name="plant_aproduit" onChange={handleChange} value={projetData.plant_aproduit} />
                                <label htmlFor="eventTitle" className="pb-2 text-warning">Plants a produire</label>
                              </div>

                              <div className="form-floating mb-3 col-md-4">
                                <input className="form-control" id="titre" type="text" name="carbon_astock" onChange={handleChange} value={projetData.carbon_astock}/>
                                <label htmlFor="eventTitle" className="pb-2 text-warning">Carbone(CO2) Espéré</label>
                              </div>

                              <div className="form-floating mb-3 col-md-4">
                                <input className="form-control" id="titre" type="text" name="emp_engageof_proj" onChange={handleChange} value={projetData.emp_engageof_proj}/>
                                <label htmlFor="eventTitle" className="pb-2 text-warning">Nombre de personnes engagées</label>
                              </div>
                            </div>
                          </div>
                          <div className="modal-footer d-flex justify-content-between align-items-center border-0">
                            <button className="btn btn-primary px-4 form-control" type="submit" >Ajouter</button>
                          </div>
                      </form>
                    </div>
                  </div>
                </div>
               
            </Content>
        </>
    )
}

export default ListeProj;