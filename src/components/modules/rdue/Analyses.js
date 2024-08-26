import { useEffect, useState } from "react";
import Content from "../../Content";
import UserContext from "../../context/useContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import Validation from "../../Validation";
import carteCoop from "../cooperatives/CarteCoop";
import moment from "moment";


import BaseUrl from "../../config/baseUrl";

// const baseUrl = 'http://127.0.0.1:8000/api';
const url = BaseUrl();
function Analyse(){
    const user = UserContext();
    const [mesanalyses,setMesanalyses] = useState([]);
    const navigate = useNavigate();
    const [errors, setErrorM] = useState({});

    const CoopOption = [
        {
            value: '',
            label: '',
        },
        {
            value: 'AGRIAL',
            label: 'AGRIAL',
        },
        {
            value: 'COOPAA-HS',
            label: 'COOPAA-HS',
        },
    ]

    const YesOption = [
        {
            value: '',
            label: '',
        },
        {
            value: 'OUI',
            label: 'OUI',
        },
        {
            value: 'NON',
            label: 'NON',
        },
    ]

    const [analyseData,setAnalyses] = useState({
        "entite": "",
        "produits": "",
        "chaine_appro": "",
        "pays_origine": "",
        "fournisseur": "",
        "zone_arisque": "",
        "liste_zone": "",
        "exp_illegale": "",
        "mesure_preventives": "",
        "suivi_mesure": "",
        "efficacite_mesure": "",
        "communication": "",
        "action_comm": "",
        "action_non_conformite": "",
  });

    useEffect(()=>{
        try {
            axios.get(url+'/analyses_rdue/').then((resp)=>{
                setMesanalyses(resp.data)
                console.log(resp.data)
            })
        } catch (error) {
            console.log(error);
        }

    },[]);

    const handleChange=(event)=>{
      setAnalyses({
          ...analyseData,
          [event.target.name] : event.target.value
      })
  }

  const validateCreationProj=(e)=>{
    e.preventDefault();
    setErrorM(Validation(analyseData));
    if(analyseData.entite !=""){
      const _formData = new FormData();

      _formData.append('entite',analyseData.entite);
      _formData.append('produits',analyseData.produits);
      _formData.append('chaine_appro',analyseData.chaine_appro);
      _formData.append('pays_origine',analyseData.pays_origine);
      _formData.append('fournisseur',analyseData.fournisseur);
      _formData.append('zone_arisque',analyseData.zone_arisque);
      _formData.append('liste_zone',analyseData.liste_zone);
      _formData.append('exp_illegale',analyseData.exp_illegale);
      _formData.append('mesure_preventives',analyseData.mesure_preventives);
      _formData.append('suivi_mesure',analyseData.suivi_mesure);
      _formData.append('efficacite_mesure',analyseData.efficacite_mesure);
      _formData.append('communication',analyseData.communication);
      _formData.append('action_comm',analyseData.action_comm);
      _formData.append('action_non_conformite',analyseData.action_non_conformite);
      // _formData.append('userID',user.id);
      // _formData.append('campagne',localStorage.getItem('campagne'));

      try {
          axios.post(url+'/create_analyse/',_formData).then((resp)=>{
              if(resp.data.bool)
              {
                  Swal.fire({
                      title: 'FELICITATION !',
                      text: 'Evaluation RDUE créée avec succès !',
                      icon: 'success',
                      showCancelButton: false,
                      confirmButtonColor: '#3085d6',
                      confirmButtonText: 'VALIDER'
                    }).then((result) => {
                        if (result.isConfirmed) {
                            window.location.reload();
                            // axios.get(baseUrl+'/analyses_rdue/').then((resp)=>{
                            //   setMesanalyses(resp.data)
                            //     console.log(resp.data)
                            // });
                            // navigate("/analyses")
                        }
                    });
                  // navigate('/analyses')
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

    // const date = new Date(state.annonceInfo.add_le)
    // const FormattedDate = `${date.getDate() + 1}/${date.getMonth()}/${date.getFullYear()}`


    return (
        <>
            <Content sideID={'analyses'}  parent={"params"}>

                    <h2 className="text-bold text-1100 mb-5">EVALUATIONS RDUE</h2>
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
                                Nouvelle Analyse
                              </button>
                          </div>
                        </div>
                      </div>
                      <div className="mx-n4 mx-lg-n6 px-4 px-lg-6 mb-9 bg-white border-y border-300 mt-2 position-relative top-1">
                        <div className="table-responsive scrollbar ms-n1 ps-1">
                          <table className="table table-striped table-sm fs--1 mb-0 ">
                            <thead>
                              <tr className="bg-warning">
                                <th className="sort align-middle text-center" scope="col" data-sort="customer" style={{width:"20%"}}>Coopérative / Entité</th>
                                <th className="sort align-middle text-center" scope="col" data-sort="email" style={{width:"20%"}}>Date</th>
                                {/*<th className="sort align-middle text-center pe-3" scope="col" data-sort="mobile_number" style={{width:"20%"}}>Catégories</th>*/}
                                {/*<th className="sort align-middle text-center" scope="col" data-sort="email" style={{width:"20%"}}>Status</th>*/}
                                <th className="sort align-middle text-center" scope="col" data-sort="last_active" style={{width:"21%",  minWidth:"200px"}}>Action</th>
                              </tr>
                            </thead>
                            <tbody className="list" id="members-table-body">

                                   {mesanalyses &&
                                    mesanalyses.map((analyse,index)=>
                                        <tr className="hover-actions-trigger btn-reveal-trigger position-static" >

                                        <td className="email align-middle white-space-nowrap text-center">
                                            {analyse?.entite}
                                        </td>
                                        <td className="email align-middle white-space-nowrap text-center">
                                            {moment(analyse?.add_le).format('DD/MM/YYYY')}
                                        </td>
                                        {/*<td className="city align-middle white-space-nowrap text-900 text-center">*/}
                                        {/*    {projet?.etat && <span className="badge bg-success">en cours</span>}*/}
                                        {/*    {!projet?.etat && <span className="badge bg-warning">Terminé</span>}*/}
                                        {/*</td>*/}
                                        <td className="last_active align-middle text-center white-space-nowrap text-700">
                                            <button className="btn btn-success btn-sm mx-1"><i className="fas fa-eye"></i></button>
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
                            <div className="form-floating mb-5 col-md-12">
                              <select className="form-select" id="entite" name="entite" onChange={handleChange} value={analyseData.entite}>
                                 {CoopOption.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                              </select>
                              {errors.entite && <span className="text-danger">{errors.entite}</span>}
                              <label htmlFor="eventLabel" className="pb-2 text-black-500">Nom de l'Entreprise</label>
                            </div>

                            <div className="form-floating mb-3 col-md-12">
                            <input className="form-control" id="produits" type="text" name="produits" onChange={handleChange} value={analyseData.produits}/>
                            {errors.produits && <span className="text-danger">{errors.produits}</span>}
                            <label htmlFor="eventTitle" className="pb-2 text-black-500">Produits concernés par la réglementation sur la déforestation</label>
                          </div>

                          </div>
                          <div className="row">
                            <div className="form-floating mb-3 col-md-12">
                              <input className="form-control" id="chaine_appro" type="text" name="chaine_appro"  onChange={handleChange} value={analyseData.chaine_appro}/>
                              {errors.chaine_appro && <span className="text-danger">{errors.chaine_appro}</span>}
                              <label htmlFor="eventTitle" className="pb-2 text-black-500">Description de la chaîne d'approvisionnement (du producteur au client final ou à la coopérative)</label>
                            </div>


                            <div className="form-floating mb-3 col-md-12">
                              <input className="form-control" id="pays_origine" type="text" name="pays_origine"  onChange={handleChange} value={analyseData.pays_origine} />
                              {errors.pays_origine && <span className="text-danger">{errors.pays_origine}</span>}
                              <label htmlFor="eventTitle" className="pb-2 text-black-500">Pays d'origine des produits</label>
                            </div>
                          </div>

                          <div className="form-floating mb-3 col-md-12">
                            <input className="form-control" id="fournisseur" type="text" name="fournisseur" onChange={handleChange} value={analyseData.fournisseur} />
                            <label htmlFor="eventTitle" className="pb-2 text-black-500">Liste des Fournisseurs</label>
                          </div>

                          <div className="form-floating mb-3 col-md-12">
                              <select className="form-select" id="zone_arisque" name="zone_arisque" onChange={handleChange} value={analyseData.zone_arisque}>
                                 {YesOption.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                              </select>
                            {/*<input className="form-control" id="zone_arisque" type="text" name="zone_arisque" onChange={handleChange} value={analyseData.zone_arisque}/>*/}
                            <label htmlFor="eventTitle" className="pb-2 text-black-500">Avez-vous identifié des régions ou zones d'origine à haut risque de déforestation ?</label>
                          </div>

                          <div className="form-floating mb-3 col-md-12">
                            <input className="form-control" id="liste_zone" type="text" name="liste_zone" onChange={handleChange} value={analyseData.liste_zone}/>
                            <label htmlFor="eventTitle" className="pb-2 text-black-500">Liste des régions ou zones d'origine à haut risque de déforestation</label>
                          </div>

                          <div className="form-floating mb-5 col-md-12">
                              <select className="form-select" id="exp_illegale" name="exp_illegale" onChange={handleChange} value={analyseData.exp_illegale}>
                                 {YesOption.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                              </select>
                              {errors.exp_illegale && <span className="text-danger">{errors.exp_illegale}</span>}
                              <label htmlFor="eventLabel" className="pb-2 text-black-500">
                                  Avez-vous connaissance de problèmes de déforestation ou de dégradation de l'habitat naturel dans ces zones d'origine de vos produits ?
                              </label>
                          </div>

                          <div className="form-floating mb-3 col-md-12">
                            <input className="form-control" id="mesure_preventives" type="text" name="mesure_preventives" onChange={handleChange} value={analyseData.mesure_preventives}/>
                            <label htmlFor="eventTitle" className="pb-2 text-black-500">
                                Décrivez les mesures que vous avez mises en place pour prévenir et atténuer les risques de déforestation dans votre chaîne d'approvisionnement
                            </label>
                          </div>

                           <div className="form-floating mb-3 col-md-12">
                            <input className="form-control" id="suivi_mesure" type="text" name="suivi_mesure" onChange={handleChange} value={analyseData.suivi_mesure}/>
                            <label htmlFor="eventTitle" className="pb-2 text-black-500">
                                Comment surveillez-vous la conformité de vos fournisseurs aux mesures de prévention de la déforestation ?
                            </label>
                          </div>

                          <div className="form-floating mb-3 col-md-12">
                            <input className="form-control" id="efficacite_mesure" type="text" name="efficacite_mesure" onChange={handleChange} value={analyseData.efficacite_mesure}/>
                            <label htmlFor="eventTitle" className="pb-2 text-black-500">Comment assurez-vous le suivi de l'efficacité de vos mesures de surveillance ?</label>
                          </div>

                           <div className="form-floating mb-3 col-md-12">
                            <input className="form-control" id="communication" type="text" name="communication" onChange={handleChange} value={analyseData.communication}/>
                            <label htmlFor="eventTitle" className="pb-2 text-black-900">Comment communiquez-vous vos actions en matière de diligence raisonnée ou de surveillance en lien avec la déforestation ?</label>
                          </div>

                          <div className="form-floating mb-3 col-md-12">
                            <input className="form-control" id="action_comm" type="text" name="action_comm" onChange={handleChange} value={analyseData.action_comm}/>
                            <label htmlFor="eventTitle" className="pb-2 text-black-500">Publiez-vous des rapports périodiques sur vos efforts en matière de surveillance en lien avec déforestation ?</label>
                          </div>


                            <div className="form-floating mb-3 col-md-12">
                            <input className="form-control" id="action_non_conformite" type="text" name="action_non_conformite" onChange={handleChange} value={analyseData.action_non_conformite}/>
                            <label htmlFor="eventTitle" className="pb-2 text-black-500">
                                Quelles mesures prenez-vous en cas de non-conformité ou de violations des normes de déforestation par vos fournisseurs ?
                            </label>
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

export default Analyse;