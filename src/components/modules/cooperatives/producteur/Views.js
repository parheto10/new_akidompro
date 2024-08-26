import { useEffect, useState } from "react";
import Content from "../../../Content";
import { Form, Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import UserContext from "../../../context/useContext";
import personIcon from '../../../assets/img/avatar.jpg';
import peopleIcon from '../../../assets/img/peopleicon.png';
import Swal from "sweetalert2";
import Validation from "../../../Validation";
import PlantingActitvity from "./parcelles/Planting";
import MonitoringActivity from "./parcelles/Monitoring";
import { useTranslation } from "react-i18next";

import BaseUrl from "../../../config/baseUrl";

// const baseUrl = 'http://127.0.0.1:8000/api';
const url = BaseUrl();
function ViewsProd(){
  const {t} = useTranslation();
  const user = UserContext();
  const navigate = useNavigate();
  const [errors, setErrorM] = useState({});
  const [errorNameCoop,setErrorNameCoop] = useState('');
  const {prodID} = useParams();
  const currentDate = new Date();
  const year = currentDate.getFullYear();

  const [producteur,setProducteur] = useState([]);
  const [parcelleList,setParcelleList] = useState([]);
  const [plantingList,setPlantingList] = useState([]);

  const [campagne,setCampagne] = useState(localStorage.getItem('campagne'));
  const [componentActivityName,setComponentActivityName] = useState('planting');


  const [anneeLists,setAnneeLists] = useState([]);
  const [nameComponent,setNameComponent] = useState('');
  const [targetID,setTargetID] = useState('');
  const [cultures,setCulutres] = useState([]);
  const [acquisitions,setModeAcquisitions] = useState([]);
  const [parc,setParc] = useState([]);

  const [tabOne,setTabOne] = useState(1);
  const [tabTwo,setTabTwo] = useState(2);
  const [tabThree,setTabThree] = useState(3);
  const [tabNumber,setTabNumber] = useState(tabOne);
  const [ageList,setAgeLists] = useState([]);

  const [enqueteData,setEnqueteData] = useState({
        "producteur" : "",
        "nb_epouse" : "",
        "enfant_mineur" : "",
        "enfant_majeur" : "",
        "nb_enfant" : "",
        "enfant_scolarise" : "",
        "nb_personne" : "",
        "is_manoeuvre" : "",
        "is_manoeuvre_femme" : "",
        "nb_manoeuvre_femme" : "",
        "type_manoeuvre" : "",
        "nb_manoeuvre" : "",
        "is_ouvrier_mineur" : "",
        "nb_ouvrier_mineur" : "",
        "salaire_ouvrier" : "",
        "utilisation_produit_phyto" : "",
        "is_eau_potable" : "",
        "is_electricite" : "",
        "is_soins" : "",
        "nb_dispensaire" : "",
        "dtce_dispensaire" : "",
        "nb_ecole_primaire" : "",
        "dtce_ecole_primaire" : "",
        "is_college" : "",
        "nb_college" : "",
        "dtce_college" : "",
        "is_banque" : "",
        "nb_banque" : "",
        "dtce_banque" : "",
    });

  useEffect(()=>{
        try {
            axios.get(url+'/ages_liste/').then((resp)=>{
                setAgeLists(resp.data);
                console.log(resp.data);
            })
        } catch (error) {

        }
  },[]);
  const onclickTabTwo=()=>{
        setErrorM(Validation());
        // if(projetData.nomProjet !="" && projetData.dateDebut !="" && projetData.dateFin !="" && projetData.objectif !="" && projetData.description !="")
        {
            setTabNumber(tabTwo);
        }

    }
  const onclickTabThree=()=>{
        setErrorM(Validation());
        // if(projetData.countrie !="" && projetData.dateDebutc !="" && projetData.DateFinc !="")
        {
            setTabNumber(tabThree);
        }

    }
  // const onClickPrevouis=()=>{
  //       if(tabNumber != 1) {
  //           setTabNumber(tabNumber - 1);
  //       }
  //   }

  const style = {"backgroundColor":"greenyellow","color":"white","border":"greenyellow"}

   const submitEnquete=()=>{
    setErrorM(Validation(enqueteData));
      const _formData = new FormData();

        _formData.append('nb_epouse',enqueteData.nb_epouse);
        _formData.append('enfant_mineur',enqueteData.enfant_mineur);
        _formData.append('enfant_majeur',enqueteData.enfant_majeur);
        _formData.append('nb_enfant',enqueteData.nb_enfant);
        _formData.append('enfant_scolarise',enqueteData.enfant_scolarise);
        _formData.append('nb_personne',enqueteData.nb_personne);
        _formData.append('is_manoeuvre',enqueteData.is_manoeuvre);
        _formData.append('is_manoeuvre_femme',enqueteData.is_manoeuvre_femme);
        _formData.append('nb_manoeuvre_femme',enqueteData.nb_manoeuvre_femme);
        _formData.append('type_manoeuvre',enqueteData.type_manoeuvre);
        _formData.append('nb_manoeuvre',enqueteData.nb_manoeuvre);
        _formData.append('is_ouvrier_mineur',enqueteData.is_ouvrier_mineur);
        _formData.append('salaire_ouvrier',enqueteData.salaire_ouvrier);
        _formData.append('utilisation_produit_phyto',enqueteData.utilisation_produit_phyto);
        _formData.append('is_eau_potable',enqueteData.is_eau_potable);
        _formData.append('is_electricite',enqueteData.is_electricite);
        _formData.append('is_soins',enqueteData.is_soins);
        _formData.append('nb_dispensaire',enqueteData.nb_dispensaire);
        _formData.append('dtce_dispensaire',enqueteData.dtce_dispensaire);
        _formData.append('nb_ecole_primaire',enqueteData.nb_ecole_primaire);
        _formData.append('dtce_ecole_primaire',enqueteData.dtce_ecole_primaire);
        _formData.append('is_college',enqueteData.is_college);
        _formData.append('nb_college',enqueteData.nb_college);
        _formData.append('dtce_college',enqueteData.dtce_college);
        _formData.append('is_banque',enqueteData.is_banque);
        _formData.append('nb_banque',enqueteData.nb_banque);
        _formData.append('dtce_banque',enqueteData.dtce_banque);
        _formData.append('producteur',prodID);

      //console.log(_formData);

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
        axios.post(url+'/create_enquete/',_formData).then((resp)=>{
          Swal.close()
          if(resp.data.bool)
          {
            window.$('#addEventModalEnquete').modal('hide');
            Swal.fire({
              title: 'FELICITATION !',
              html: "Enquete Enregistrée avec Succès",
              icon: 'success',
              showCancelButton: false,
              confirmButtonColor: '#3085d6',
              confirmButtonText: 'OK'
            })
          }
          else
          {
            Swal.fire({
              title: 'ATTENTION !',
              html: resp.data.msg,
              icon: 'error',
              showCancelButton: false,
              confirmButtonColor: 'red',
              confirmButtonText: 'OK'
            })
          }
        })
      } catch (error) {
        console.log(error);
      }

  }

  const validateCreationEnquete=()=>{
        const _formData = new FormData();
        _formData.append('nb_epouse',enqueteData.nb_epouse);
        _formData.append('enfant_mineur',enqueteData.enfant_mineur);
        _formData.append('enfant_majeur',enqueteData.enfant_majeur);
        _formData.append('nb_enfant',enqueteData.nb_enfant);
        _formData.append('enfant_scolarise',enqueteData.enfant_scolarise);
        _formData.append('nb_personne',enqueteData.nb_personne);
        _formData.append('is_manoeuvre',enqueteData.is_manoeuvre);
        _formData.append('is_manoeuvre_femme',enqueteData.is_manoeuvre_femme);
        _formData.append('nb_manoeuvre_femme',enqueteData.nb_manoeuvre_femme);
        _formData.append('type_manoeuvre',enqueteData.type_manoeuvre);
        _formData.append('nb_manoeuvre',enqueteData.nb_manoeuvre);
        _formData.append('is_ouvrier_mineur',enqueteData.is_ouvrier_mineur);
        _formData.append('salaire_ouvrier',enqueteData.salaire_ouvrier);
        _formData.append('utilisation_produit_phyto',enqueteData.utilisation_produit_phyto);
        _formData.append('is_eau_potable',enqueteData.is_eau_potable);
        _formData.append('is_electricite',enqueteData.is_electricite);
        _formData.append('is_soins',enqueteData.is_soins);
        _formData.append('nb_dispensaire',enqueteData.nb_dispensaire);
        _formData.append('dtce_dispensaire',enqueteData.dtce_dispensaire);
        _formData.append('nb_ecole_primaire',enqueteData.nb_ecole_primaire);
        _formData.append('dtce_ecole_primaire',enqueteData.dtce_ecole_primaire);
        _formData.append('is_college',enqueteData.is_college);
        _formData.append('nb_college',enqueteData.nb_college);
        _formData.append('dtce_college',enqueteData.dtce_college);
        _formData.append('is_banque',enqueteData.is_banque);
        _formData.append('nb_banque',enqueteData.nb_banque);
        _formData.append('dtce_banque',enqueteData.dtce_banque);
        _formData.append('producteur',prodID);

        try {
            axios.post(url+'/create_enquete/',_formData).then((resp)=>{
                if(resp.data.bool)
                {
                    Swal.fire({
                        title: 'FELICITATION !',
                        text: resp.data.msg,
                        icon: 'success',
                        showCancelButton: false,
                        confirmButtonColor: '#3085d6',
                        confirmButtonText: 'OK'
                      }).then((result) => {
                        if (result.isConfirmed) {
                            navigate('/dash-coop/');
                            //window.location.reload();
                        }
                      });
                }
            })
        } catch (error) {
            console.log(error);
        }

    }

  const onClickPrevouis=()=>{
        if(tabNumber != 1) {
            setTabNumber(tabNumber - 1);
        }
    }

    const handleChange=(event)=>{
        // setProjetData({
        //     ...projetData,
        //     [event.target.name] : event.target.value
        // })
    }


  const [loadingDetailParc,setLoadingDetailParc] = useState(false);

  const [parcelleData,setParcelleData] = useState({
    "latitude":"",
    "longitude":"",
    "superficie":"0",
    // "certification":"",
    // "annee_certificat":"",
    "annee_acquis":"",
    "culture":"",
    "acquisition":"",
    // "code_certif":""
  });


  const [especeList,setEspeceList] = useState([])
  const [campagneList,setCampagneList] = useState([]);
  const [certifications,setCertifications] = useState([]);


  const modalOpenParc=()=>{
    window.$("#addEventModalParc").modal("show");
  }

    const modalOpenEnquete=()=>{
    window.$("#addEventModalEnquete").modal("show");
  }

  const modalOpenPlanting=()=>{
    window.$("#addEventModalPlanting").modal("show");
  }

  useEffect(()=>{
    if(prodID){
      try {
        axios.get(url+'/producteurs-list-paginate/?prodCode='+prodID).then((resp)=>{
          setProducteur(resp.data.results[0]);
        });

        axios.get(url+'/parcelles-list/?prodCode='+prodID).then((resp)=>{
          setParcelleList(resp.data.results);
        });
        


      } catch (error) {
        console.log(error);
      }
    }

    try {
      axios.get(url+'/especes/').then((resp)=>{
        setEspeceList(resp.data);
      })
    } catch (error) {
      console.log(error);
    }

    
  },[prodID,parc]);


  const handleChangeParcelle=(event)=>{
    setParcelleData({
        ...parcelleData,
        [event.target.name]:event.target.value
    });
  }




  useEffect(()=>{
    try {
      

      axios.get(url+'/mode-acquisition-list/').then((resp)=>{
        setModeAcquisitions(resp.data);
      });

      axios.get(url+'/certification-list/').then((resp)=>{
        setCertifications(resp.data);
      });

    } catch (error) {
      console.log(error);
    }

    if(user && user?.id){
      axios.get(url+'/campagnes-list/?userID='+user?.id).then((resp)=>{
        setCampagneList(resp.data)
      });

     
  }

    if(producteur && producteur.section && producteur.section?.cooperative?.id)
    {
      axios.get(url+'/culture-list/?coopID='+producteur.section?.cooperative?.id).then((resp)=>{
        setCulutres(resp.data);
      })
    }

  },[functAnneeList(),producteur,user]);


  function functAnneeList(){
        
    for (let i = year; i >= year - 60; i--) {
         anneeLists.push(`${i}`)
    }

 }

 const showActivityParcelle=(targetId)=>{
  setLoadingDetailParc(true);
  setParc([]);
  setTargetID('')
  setNameComponent('activity');
  const targetElement = document.getElementById(targetId);
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth' });
    }

    try {
      axios.get(url+'/parcelles-list/?parcId='+targetId).then((resp)=>{
        setParc(resp.data.results[0])
      });
      axios.get(url+'/planting-list/?parcId='+targetId).then((resp)=>{
        setPlantingList(resp.data);
      })

    } catch (error) {
      console.log(error)
    }

    setTargetID(targetId);
    setLoadingDetailParc(false);
 }

 const goToViewCooperative=(coopID)=>{
  navigate('/views-coop/'+coopID+'/');
  //window.location.reload();
}

  const submitParc=()=>{
    setErrorM(Validation(parcelleData));
    if(parcelleData.superficie !="")
    {
      const _formData = new FormData();
      _formData.append('latitude',parcelleData.latitude);
      _formData.append('longitude',parcelleData.longitude);
      _formData.append('superficie',parcelleData.superficie);
      // _formData.append('certification',parcelleData.certification);
      _formData.append('acquisition',parcelleData.acquisition);
      // _formData.append('annee_certificat',parcelleData.annee_certificat);
      _formData.append('annee_acquis',parcelleData.annee_acquis);
      _formData.append('culture',parcelleData.culture);
      // _formData.append('code_certif',parcelleData.code_certif);
      _formData.append('prodCode',prodID);
      _formData.append('campagne',campagne);

      //console.log(_formData);

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
        axios.post(url+'/create-new-parcelle/',_formData).then((resp)=>{
          Swal.close()

          if(resp.data.bool)
          {
            window.$('#addEventModalParc').modal('hide');
            Swal.fire({
              title: 'FELICITATION !',
              html: "La parcelle a bien été enregistrée.Le code est <b>"+resp.data.code+"</b>",
              icon: 'success',
              showCancelButton: false,
              confirmButtonColor: '#3085d6',
              confirmButtonText: 'OK'
            }).then((result) => {
              if (result.isConfirmed) {
                  axios.get(url+'/parcelles-list/?prodCode='+prodID).then((resp)=>{
                    setParcelleList(resp.data.results);
                  });

              }
            });

            setParcelleData({
              "latitude":"",
              "longitude":"",
              "superficie":"0",
              // "certification":"",
              // "annee_certificat":"",
              "annee_acquis":"",
              "culture":"",
              "acquisition":"",
              // "code_certif":""
            })
          }
          else
          {
            Swal.fire({
              title: 'ATTENTION !',
              html: resp.data.msg,
              icon: 'error',
              showCancelButton: false,
              confirmButtonColor: 'red',
              confirmButtonText: 'OK'
            })
          }
        })
      } catch (error) {
        console.log(error);
      }  
      
    }
  } 






return (
        <Content sideID={"cooperatives"} parent={"generalite"}>
        <div className="pb-9"> 
          <div className="row">
            <div className="col-12">
              <div className="row align-items-center justify-content-between g-3 mb-3">
                <div className="col-12 col-md-auto">
                  <h2 className="mb-0">{producteur.nomComplet} | {producteur.code}</h2>
                </div>
                <div className="col-12 col-md-auto">
                  <div className="d-flex">
                    <div className="flex-1 d-md-none">
                      <button className="btn px-3 btn-phoenix-secondary text-700 me-2" data-phoenix-toggle="offcanvas"
                              data-phoenix-target="#productFilterColumn">
                        <span className="fa-solid fa-bars"></span>
                      </button>
                    </div>
                    {/* <button className="btn btn-primary me-2"><span className="fa-solid fa-envelope me-2">
                            </span><span>Envoyer SMS</span>
                    </button> */}

                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="row g-0 g-md-4 g-xl-6">
            <div className="col-md-5 col-lg-5 col-xl-4">
              <div className="sticky-leads-sidebar">
                <div className="lead-details-offcanvas bg-soft scrollbar phoenix-offcanvas phoenix-offcanvas-fixed" id="productFilterColumn">
                 {/*  <div className="d-flex justify-content-between align-items-center mb-2 d-md-none">
                    <h3 className="mb-0">Lead Details</h3><button className="btn p-0" data-phoenix-dismiss="offcanvas"><span className="uil uil-times fs-1"></span></button>
                  </div> */}
                  <div className="card mb-3">
                    <div className="card-body">
                      <div className="row align-items-center g-3 text-center text-xxl-start">
                        <div className="col-12 col-xxl-auto">
                          <div className="avatar avatar-5xl">
                          {producteur.photo ?
                                <img className="rounded-circle" src={producteur.photo} alt="" />
                                :
                                <>
                                <img className="rounded-circle" src={personIcon} alt="" />
                                 {/*  {producteur.groupe?.id == 1 && <img className="rounded-circle" src={peopleIcon} alt="" />}
                                  {producteur.groupe?.id == 2 && <img className="rounded-circle" src={personIcon} alt="" />} */}
                                </>
                              }
                            
                            </div>
                        </div>
                        <div className="col-12 col-sm-auto flex-1">
                          <h3 className="fw-bolder mb-2">{producteur.nomComplet}</h3>
                           <u className="mb-0">{t("Lieu")} : </u><a className="fw-bold" href="#!">{producteur.lieu_habitation}</a>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="card mb-3">
                    <div className="card-body">
                      <div className="d-flex align-items-center mb-5">
                        <Link className="btn px-3" style={{backgroundColor: "#94a91b", color: "#fff", fontWeight: "bold"}} to={`/producteur-recoltes-views/${prodID}/`}> {t("Livraisons")}</Link>
                      </div>
                      {/*<div className="mb-4">*/}
                      {/*  <div className="d-flex align-items-center mb-1"><span className="me-2 uil uil-envelope-alt">  </span>*/}
                      {/*    <h5 className="text-1000 mb-0 text-warning">Nom complet</h5>*/}
                      {/*  </div>  <p className="mb-0 text-800">{producteur.nomComplet}</p>*/}
                      {/*</div>*/}
                      <div className="mb-4">
                        <div className="d-flex align-items-center mb-1"><span className="me-2 uil uil-phone"> </span>
                          <h5 className="text-1000 mb-0 text-warning">{t("Contact")}</h5>
                        </div>  <p className="mb-0 text-800">{producteur.contacts}</p>
                      </div>
                      <div className="mb-4">
                        <div className="d-flex align-items-center mb-1"><span className="me-2 uil uil-globe"></span>
                          <h5 className="text-1000 mb-0 text-warning">{t("Coopérative")}</h5>
                        </div>  <p className="mb-0 text-800 cursor-pointer text-primary" onClick={()=>goToViewCooperative(producteur.section?.cooperative?.id)}>{producteur.section?.cooperative?.nomCoop}</p>
                      </div>
                      <div className="mb-4">
                        <div className="d-flex align-items-center mb-1"><span className="me-2 uil uil-building"></span>
                          <h5 className="text-1000 mb-0 text-warning">{t("Section")}</h5>
                        </div>
                        <p className="mb-0 text-800">{producteur.section?.libelle}</p>
                      
                      </div>
                      <div className="mb-4">
                        <div className="d-flex align-items-center mb-1"><span className="me-2 uil uil-postcard"></span>
                          <h5 className="text-1000 mb-0 text-warning">{t("Nombre de parcelle")}</h5>
                        </div>
                        <p className="mb-0 text-800">{parcelleList.length}/{producteur.nbParc}</p>
                      </div>
                      <div className="mb-4">
                        <div className="d-flex align-items-center mb-1"><span className="me-2 uil uil-dollar-alt"></span>
                          <h5 className="text-1000 mb-0 text-warning">{t("Campagne d'enrolement")}</h5>
                        </div>
                        <p className="mb-0 text-800">2023-2024 </p>
                      </div>
                      <div className="mb-4">
                        <div className="d-flex align-items-center mb-1"><span className="me-2 uil uil-clock"></span>
                          <h5 className="text-1000 mb-0 text-warning">{t("Localité")}</h5>
                        </div>
                        <p className="mb-0 text-800">{producteur.lieu_habitation}</p>
                      </div>
                      {/* <div className="mb-4">
                        <div className="d-flex align-items-center mb-1"><span className="me-2 uil uil-file-check-alt"></span>
                          <h5 className="text-1000 mb-0">Lead source</h5>
                        </div>
                        <p className="mb-0 text-800">Advertisement</p>
                      </div> */}
                      <div>
                        <div className="d-flex align-items-center mb-1"><span className="me-2 uil uil-check-circle"></span>
                          <h5 className="text-1000 mb-0 text-warning">{t("statut")}</h5>
                        </div><span className="badge badge-phoenix badge-phoenix-success">{t("Actif")}</span>
                      </div>
                    </div>
                  </div>
                {/*   <div className="card mb-3">
                    <div className="card-body">
                      <div className="d-flex align-items-center mb-5">
                        <h3>Address</h3><button className="btn btn-link" type="button">Edit</button>
                      </div>
                      <div className="mb-4">
                        <div className="d-flex align-items-center mb-1"><span className="me-2 uil uil-estate"></span>
                          <h5 className="mb-0">Street</h5>
                        </div>
                        <p className="mb-0 text-800">38/2 Penelope street</p>
                      </div>
                      <div className="mb-4">
                        <div className="d-flex align-items-center mb-1"><span className="me-2 uil uil-map-pin-alt"></span>
                          <h5 className="mb-0 text-1000">Zip code</h5>
                        </div>
                        <p className="mb-0 text-800">1425</p>
                      </div>
                      <div className="mb-4">
                        <div className="d-flex align-items-center mb-1"><span className="me-2 uil uil-map"></span>
                          <h5 className="mb-0 text-1000">City</h5>
                        </div>
                        <p className="mb-0 text-800">Qualimando</p>
                      </div>
                      <div>
                        <div className="d-flex align-items-center mb-1"><span className="me-2 uil uil-windsock"></span>
                          <h5 className="mb-0 text-1000">Country</h5>
                        </div>
                        <p className="mb-0 text-800">United Empire of Brekania</p>
                      </div>
                    </div>
                  </div> */}
                </div>
                <div className="phoenix-offcanvas-backdrop d-lg-none top-0" data-phoenix-backdrop="data-phoenix-backdrop"></div>
              </div>
            </div>
            <div className="col-md-7 col-lg-7 col-xl-8">
              <div className="lead-details-container">
                <nav className="navbar pb-1 px-0 sticky-top bg-soft bg-secondary bg-opacity-10 rounded nav-underline-scrollspy" id="navbar-deals-detail">
                  <ul className="nav nav-underline rounded" style={{backgroundColor: "#94a91b", color: "#fff", fontWeight: "bold"}}>
                   {/*  <li className="nav-item"><a className="nav-link pe-3" href="#scrollspyTask">Task</a></li> */}
                    <li className="nav-item text-white text-center"><a className="nav-link pe-3 text-white text-center" href="#scrollspyDeals">{t("Mes Parcelles")}</a></li>
                      {/*<li className="nav-item"><a className="nav-link pe-3" href="#scrollspyEmails">Mes Enquêtes</a></li>*/}
                  {/*   <li className="nav-item"><a className="nav-link" href="#scrollspyAttachments">Attachments </a></li> */}
                  </ul>
                </nav>
                <div className="scrollspy-example bg-body-tertiary rounded-2" data-bs-spy="scroll" data-bs-offset="0" data-bs-target="#navbar-deals-detail" data-bs-root-margin="0px 0px -40%" data-bs-smooth-scroll="true" tabindex="0">
              
                  <div className="mb-8 mt-3">
                    <div className="d-flex justify-content-between align-items-center mb-4" id="scrollspyDeals">
                      <h2 className="mb-0">{t("Parcelles")}({parcelleList.length})</h2>
                      <div className="col-auto">
                          <div className="search-box">
                            <form className="position-relative" data-bs-toggle="search" data-bs-display="static">
                                <input className="form-control search-input search" type="search" placeholder={t("Recherche parcelle")} aria-label="Search" />
                              <span className="fas fa-search search-box-icon"></span>
                            </form>
                          </div>
                    </div>
                      <button className="btn btn-sm" style={{backgroundColor: "#94a91b", color: "#fff", fontWeight: "bold"}} onClick={()=>modalOpenParc()}><span className="fa-solid fa-plus me-2"></span>{t("Ajouter une parcelle")}</button>
                    </div>
                    <div className="border-top border-bottom border-200" id="leadDetailsTable" >
                      <div className="table-responsive scrollbar mx-n1 px-1">
                        <table className="table fs--1 mb-0">
                          <thead>
                            <tr className="rounded-3" style={{backgroundColor: "#94a91b", color: "#fff", fontWeight: "bold"}}>
                              <th className="sort white-space-nowrap align-middle pe-3 ps-0 text-center text-uppercase" scope="col" data-sort="dealName" >Code</th>
                              <th className="sort align-middle pe-6 text-uppercase text-end" scope="col" data-sort="amount" >{t("Producteur")}</th>
                              <th className="sort align-middle text-start text-uppercase" scope="col" data-sort="stage" >{t("CO2")}(eq T)</th>
                              <th className="sort align-middle text-start text-uppercase" scope="col" data-sort="probability" >{t("Latitude")}</th>
                              <th className="sort align-middle ps-0 text-end text-uppercase" scope="col" data-sort="date" >{t("Longitude")}</th>
                              <th className="sort align-middle text-center text-uppercase" scope="col" data-sort="type" >{t("Superficie")} (ha)</th>
                              <th className="align-middle pe-0 text-end" scope="col" > </th>
                            </tr>
                          </thead>
                          <tbody className="list" id="lead-details-table-body">
                              {parcelleList.map((parcelle,index)=>
                                   <tr className="hover-actions-trigger btn-reveal-trigger position-static"  style={targetID===parcelle.code ? {"backgroundColor":"#E6CA83", fontWeight: "bold"} : {}}>
                                   <td className="dealName align-middle white-space-nowrap py-2 ps-0 text-center"><a className="fw-semi-bold text-primary cursor-pointer" onClick={()=>showActivityParcelle(parcelle.code)}>{parcelle.code}</a></td>
                                   <td className="amount align-middle white-space-nowrap text-start fw-bold text-700 py-2 text-end pe-6">{parcelle.producteur?.nomComplet}</td>
                                   <td className="stage align-middle white-space-nowrap text-900 py-2"><span className="badge badge-phoenix fs--2 badge-phoenix-success">0</span></td>
                                   <td className="probability align-middle white-space-nowrap">
                                     {parcelle.latitude}
                                   </td>
                                   <td className="date align-middle text-700 text-center py-2 white-space-nowrap">{parcelle.longitude}</td>
                                   <td className="type align-middle fw-semi-bold py-2 text-center" >{parcelle.superficie}</td>
                                   <td className="type align-middle fw-semi-bold py-2 text-center" ></td>
                                 </tr>
                              )}
                          </tbody>
                        </table>
                      </div>
                    {/*   <div className="row align-items-center justify-content-between py-2 pe-0 fs--1">
                        <div className="col-auto d-flex">
                          <p className="mb-0 d-none d-sm-block me-3 fw-semi-bold text-900" data-list-info="data-list-info"></p><a className="fw-semi-bold" href="#!" data-list-view="*">View all<span className="fas fa-angle-right ms-1" data-fa-transform="down-1"></span></a><a className="fw-semi-bold d-none" href="#!" data-list-view="less">View Less<span className="fas fa-angle-right ms-1" data-fa-transform="down-1"></span></a>
                        </div>
                        <div className="col-auto d-flex"><button className="page-link" data-list-pagination="prev"><span className="fas fa-chevron-left"></span></button>
                          <ul className="mb-0 pagination"></ul><button className="page-link pe-0" data-list-pagination="next"><span className="fas fa-chevron-right"></span></button>
                        </div>
                      </div> */}
                    </div>
                  </div>

                      
                        
                         {nameComponent === 'activity' &&
                         <>
                            {!loadingDetailParc ?
                             <div className="mb-8 bg-white p-3 border-2 rounded-3" id={`${targetID}`} aria-hidden="true">
                             <h2 className="mb-2 placeholder-glow" >{t("Activités de la parcelle")} <span style={{"backgroundColor":"#E6CA83"}}>{targetID}</span>{/* <button className="btn btn-primary btn-sm float-end ">Modifier</button> */}</h2>
                              <div class="card-body bg-white p-3 rounded-2 border-top border-300 row">
                                <div class="vstack gap-1 col-md-6">
                                  <div class="bg-light border">{t("Code")} : <b>{targetID}</b></div>
                                  <div class="bg-light border">{t("Culture")}: <b>{parc.culture?.libelle}</b></div>
                                  <div class="bg-light border">{t("Latitude")}: <b>{parc.latitude}</b></div>
                                  <div class="bg-light border">{t("Longitude")}: <b>{parc.longitude}</b></div>
                                </div>
                                <div class="vstack gap-1 col-md-6">
                                  <div class="bg-light border">{t("Superficie")} : <b>{parc.superficie} Ha</b></div>
                                  <div class="bg-light border">{t("Mode acquisition")} : <b>{parc.acquisition?.libelle}</b></div>
                                   <div class="bg-light border">{t("Certification")}: {parc.certificat?.libelle}</div>
                                  {/*<div class="bg-light border">Longitude: </div> */}
                                </div>
                                
                              </div>
                    
                             <div className="border-top border-300">
                               <div className="scrollbar bg-light mb-2">
                                 <ul className="nav nav-underline flex-nowrap mb-1" id="emailTab" role="tablist">
                                   <li className="nav-item me-3"><a className={componentActivityName === "planting" ? "nav-link text-nowrap border-0 cursor-pointer active" : "nav-link text-nowrap border-0 cursor-pointer"} id="mail-tab" onClick={()=>setComponentActivityName('planting')} role="tab" aria-selected="true">Plantings <span className="text-700 fw-normal"></span></a></li>
                                   <li className="nav-item me-3"><a className={componentActivityName === "monitoring" ? "nav-link text-nowrap border-0 cursor-pointer active" : "nav-link text-nowrap border-0 cursor-pointer"} id="drafts-tab" onClick={()=>setComponentActivityName('monitoring')} role="tab" aria-selected="true">Monitorings <span className="text-700 fw-normal"></span></a></li>
                                  {/*  <li className="nav-item me-3"><a className={componentActivityName == "remplacement" ? "nav-link text-nowrap border-0 cursor-pointer active" : "nav-link text-nowrap border-0 cursor-pointer"} id="schedule-tab" onClick={()=>setComponentActivityName('remplacement')} role="tab" aria-selected="true">Remplacements </a></li> 
                                   <li className="nav-item me-3"><a className={componentActivityName == "recolte" ? "nav-link text-nowrap border-0 cursor-pointer active" : "nav-link text-nowrap border-0 cursor-pointer"} id="schedule-tab1" onClick={()=>setComponentActivityName('recolte')} role="tab" aria-selected="true">Recoltes </a></li>*/}
                                 </ul>
                               </div>
                               {componentActivityName === "planting" &&
                                  <>
                                      <button className="btn btn-sm float-end" style={{backgroundColor: "#94a91b", color: "#fff", fontWeight: "bold"}} onClick={modalOpenPlanting}>{t("Faire planting")}</button>
                                      <div className="search-box row mb-3">
                                        <form className="position-relative " data-bs-toggle="search" data-bs-display="static"><input className="form-control search-input search" type="search" placeholder={t("Recherche de planting")} aria-label="Search" />
                                          <span className="fas fa-search search-box-icon"></span>
                                        </form>
                                      </div>
                                  </>
                               }
                           
                               <div className="tab-content" id="profileTabContent">
                                {componentActivityName === "planting" &&
                                
                                  <PlantingActitvity especeList={especeList} campagneList={campagneList} parc={parc.code}/>
                                }

                                {componentActivityName === "monitoring" &&
                                  <MonitoringActivity parc={parc.code} />
                                }
                               </div>
                               
                             </div>
                             </div>
                             : 
                             <div className="mb-8 bg-white p-3 border-2 rounded-2 "  aria-hidden="true">
                             <h2 className="mb-2 placeholder-glow " ><span className="placeholder" style={{"backgroundColor":"#FFDB58"}}>{t("En cours de chargement")}...</span> <button className="btn btn-primary btn-sm float-end placeholder">{t("Modifier")}</button></h2>
                              <div class="card-body bg-white p-3 rounded-2 border-top border-300 row placeholder-glow">
                                <div class="vstack gap-1 col-md-6 placeholder">
                                  <div class="bg-light border placeholder"></div>
                                  <div class="bg-light border placeholder"></div>
                                  <div class="bg-light border placeholder"></div>
                                  <div class="bg-light border placeholder"></div>
                                </div>
                                <div class="vstack gap-1 col-md-6 placeholder">
                                  <div class="bg-light border placeholder"></div>
                                  <div class="bg-light border placeholder"></div>
                                  
                                </div>
                                
                              </div>
                    
                             </div>
                         }
                         

                        
                         </>
                         }
                       
                      
                 
                  
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* modal create parcelle */}
        <div className="modal fade" id="addEventModalParc" data-bs-backdrop="static" role="dialog" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
          <div className="modal-dialog modal-md">
            <div className="modal-content border">
              <div id="addEventForm" autoComplete="off">
                <div className="modal-header px-card border-0">
                  <div className="w-100 d-flex justify-content-between align-items-start">
                    <div>
                      <h5 className="mb-0 lh-sm text-1000">Enregistrement d'une parcelle</h5>
                    </div><button className="btn p-1 fs--2 text-900" type="button" data-bs-dismiss="modal" aria-label="Close">Fermer </button>
                  </div>
                </div>
                <div className="modal-body p-card py-0">

                <div className="row">
                    <div className="form-floating mb-5 col-md-6">
                        <select className="form-select" id="categorie" name="acquisition" onChange={handleChangeParcelle} value={parcelleData.acquisition}>
                        <option selected="selected" value="">...</option>
                        {acquisitions.map((acquisition,index)=>
                          <option value={acquisition.id}>{acquisition.libelle}</option>
                        )}
                        </select>
                       {/*  {errors.acquisition && <span className="text-danger">{errors.acquisition}</span>} */}
                        <label htmlFor="eventLabel" className="pb-2 text-warning">Mode d'acquisition de la parcelle</label>
                    </div>

                    

                    <div className="form-floating mb-5 col-md-6">
                        <select className="form-select" id="categorie" name="annee_acquis" onChange={handleChangeParcelle} value={parcelleData.annee_acquis}>
                        <option selected="selected" value="">...</option>
                        {anneeLists.map((annee,index)=>
                            <option  value={annee}>{annee}</option>
                        )}
                        </select>
                        <label htmlFor="eventLabel" className="pb-2 text-warning">Année d'acquisition</label>
                    </div>
                </div>
                <div className="row">
                                                    
                          <div className="form-floating mb-3 col-md-4">
                              <select className="form-select" id="categorie" name="certification" onChange={handleChangeParcelle} value={parcelleData.certification}>
                              <option selected="selected" value="">...</option>
                              {certifications.map((certif,index)=>
                                  <option  value={certif.id}>{certif.libelle}</option>
                              )}
                              </select>
                              <label htmlFor="eventLabel" className="pb-2 text-warning">Certification</label>
                          </div>

                        <div className="form-floating mb-3 col-md-4">
                            <input className="form-control" id="sigle" type="text" name="code_certif" onChange={handleChangeParcelle} value={parcelleData.code_certif}/>
                            
                            <label htmlFor="eventTitle" className="pb-2 text-warning">Code Certification</label>
                          </div>

                      
                          <div className="form-floating mb-3 col-md-4">
                              <select className="form-select" id="categorie" name="annee_certificat" onChange={handleChangeParcelle} value={parcelleData.annee_certificat}>
                              <option selected="selected" value="">...</option>
                              {anneeLists.map((annee,index)=>
                                  <option  value={annee}>{annee}</option>
                              )}
                              </select>
                              <label htmlFor="eventLabel" className="pb-2 text-warning">Année de Certification</label>
                          </div>

                      </div>

                  <div className="row">

                    <div className="form-floating mb-3 col-md-6">
                      <input className="form-control" id="sigle" type="number" name="superficie" onChange={handleChangeParcelle} value={parcelleData.superficie}/>
                      {errors.superficie && <span className="text-danger">{errors.superficie}</span>}
                      <label htmlFor="eventTitle" className="pb-2 text-warning">Superficie</label>
                    </div> 
                    
                    <div className="form-floating mb-3 col-md-6">
                        <select className="form-select" id="categorie" name="culture" onChange={handleChangeParcelle} value={parcelleData.culture}>
                        <option selected="selected" value="">...</option>
                        {cultures.map((culture,index)=>
                            <option  value={culture.id}>{culture.libelle}</option>
                        )}
                        </select>
                        {/* {errors.culture && <span className="text-danger">{errors.culture}</span>} */}
                        <label htmlFor="eventLabel" className="pb-2 text-warning">Culture sur la parcelle</label>
                    </div>

                  </div>

                  <div className="position-relative">
                      <hr className="bg-200 mt-1" />
                      <div className="divider-content-center bg-white">Localisation de la parcelle</div>
                    </div>

                  <div className="form-floating mb-3">
                    <input className="form-control" id="sigle" type="text" name="latitude" onChange={handleChangeParcelle} value={parcelleData.latitude}/>
                    <label htmlFor="eventTitle" className="pb-2 text-warning">Latitude</label>
                  </div>
                 
                    <div className="form-floating mb-3">
                      <input className="form-control" id="chef" type="text" name="longitude" onChange={handleChangeParcelle} value={parcelleData.longitude} />
                      <label htmlFor="eventTitle" className="pb-2 text-warning">Longitude</label>
                    </div>

                   {/*  <div className="row">
                        <div className="form-floating mb-3 col-md-6">
                            <input className="form-control" id="titre" type="number" name="nbParc"  />
                            <label htmlFor="eventTitle" className="pb-2 text-warning">Nombre de parcelle</label>
                        </div>

                        <div className="form-floating mb-3 col-md-6">
                            <input className="form-control" id="titre" type="text" name="contacts" />
                            <label htmlFor="eventTitle" className="pb-2 text-warning">Contact</label>
                        </div>
                    </div> */}
                  

                  {/* <div className="form-floating mb-3">
                    <input className="form-control" id="titre" type="file" name="photo" />
                    <label htmlFor="eventTitle" className="pb-2 text-warning">Ma photo</label>
                  </div> */}
                  
                  
                  </div>
                  <div className="modal-footer d-flex justify-content-between align-items-center border-0">
                    <button className="btn px-4 form-control" style={{backgroundColor: "#94a91b", color: "#fff", fontWeight: "bold"}} type="button" onClick={submitParc}>Ajouter</button>
                  </div>
              </div>
            </div>
          </div>
        </div>

        {/* modal create Enquetes */}
            <div className="modal fade" id="addEventModalEnquete" data-bs-backdrop="static" role="dialog"
                 data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                <div className="card theme-wizard mb-5">
                    <div className="card-header bg-100 pt-3 pb-2 border-bottom-0">
                        <ul className="nav justify-content-between nav-wizard" role="tablist">
                            <li className="nav-item" role="presentation">
                                <a className={tabNumber === 1 ? "nav-link active fw-semi-bold" : "nav-link fw-semi-bold disabled"}
                                   href={`#bootstrap-wizard-tab${tabOne}`} data-bs-toggle="tab" aria-selected="true"
                                   role="tab">
                                    <div className="text-center d-inline-block">
                                    <span className="nav-item-circle-parent">
                                        <span className="nav-item-circle" style={tabNumber === 2 | tabNumber === 3 ? style : {}}>
                                            <svg className="svg-inline--fa fa-lock" aria-hidden="true" focusable="false"
                                                 data-prefix="fas" data-icon="lock" role="img"
                                                 xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" data-fa-i2svg="">
                                                <path fill="currentColor"
                                                      d="M80 192V144C80 64.47 144.5 0 224 0C303.5 0 368 64.47 368 144V192H384C419.3 192 448 220.7 448 256V448C448 483.3 419.3 512 384 512H64C28.65 512 0 483.3 0 448V256C0 220.7 28.65 192 64 192H80zM144 192H304V144C304 99.82 268.2 64 224 64C179.8 64 144 99.82 144 144V192z"></path>
                                            </svg>
                                        </span>
                                    </span>
                                        <span className="d-none d-md-block mt-1 fs--1">Info Famille</span>
                                    </div>
                                </a>
                            </li>

                            <li className="nav-item" role="presentation">
                                <a className={tabNumber === 2 ? "nav-link active fw-semi-bold" : "nav-link fw-semi-bold disabled"}
                                   href={`#bootstrap-wizard-tab${tabTwo}`} data-bs-toggle="tab" aria-selected="false"
                                   tabIndex="-1" role="tab">
                                    <div className="text-center d-inline-block ">
                                        <span className="nav-item-circle-parent">
                                            <span className="nav-item-circle" style={tabNumber === 3 ? style : {}}>
                                                <svg className="svg-inline--fa fa-file-lines" aria-hidden="true" focusable="false"
                                                     data-prefix="fas" data-icon="file-lines" role="img"
                                                     xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" data-fa-i2svg=""><path
                                                    fill="currentColor"
                                                    d="M256 0v128h128L256 0zM224 128L224 0H48C21.49 0 0 21.49 0 48v416C0 490.5 21.49 512 48 512h288c26.51 0 48-21.49 48-48V160h-127.1C238.3 160 224 145.7 224 128zM272 416h-160C103.2 416 96 408.8 96 400C96 391.2 103.2 384 112 384h160c8.836 0 16 7.162 16 16C288 408.8 280.8 416 272 416zM272 352h-160C103.2 352 96 344.8 96 336C96 327.2 103.2 320 112 320h160c8.836 0 16 7.162 16 16C288 344.8 280.8 352 272 352zM288 272C288 280.8 280.8 288 272 288h-160C103.2 288 96 280.8 96 272C96 263.2 103.2 256 112 256h160C280.8 256 288 263.2 288 272z"></path>
                                                </svg>
                                            </span>
                                        </span>
                                        <span className="d-none d-md-block mt-1 fs--1">Info Infrastructures</span>
                                    </div>
                                </a>
                            </li>
                            <li className="nav-item" role="presentation">
                                <a className={tabNumber === 3 ? "nav-link active fw-semi-bold" : "nav-link fw-semi-bold disabled"}
                                   href={`#bootstrap-wizard-tab${tabThree}`} data-bs-toggle="tab" aria-selected="false"
                                   tabIndex="-1" role="tab">
                                    <div className="text-center d-inline-block">
                                        <span className="nav-item-circle-parent">
                                            <span className="nav-item-circle">
                                                <svg className="svg-inline--fa fa-check" aria-hidden="true" focusable="false"
                                                     data-prefix="fas" data-icon="check" role="img"
                                                     xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" data-fa-i2svg="">
                                                    <path fill="currentColor"
                                                          d="M438.6 105.4C451.1 117.9 451.1 138.1 438.6 150.6L182.6 406.6C170.1 419.1 149.9 419.1 137.4 406.6L9.372 278.6C-3.124 266.1-3.124 245.9 9.372 233.4C21.87 220.9 42.13 220.9 54.63 233.4L159.1 338.7L393.4 105.4C405.9 92.88 426.1 92.88 438.6 105.4H438.6z"></path>
                                                </svg>
                                            </span>
                                        </span>
                                        <span className="d-none d-md-block mt-1 fs--1">Vérification</span>
                                    </div>
                                </a>
                            </li>

                        </ul>
                    </div>
                    <div className="card-body pt-4 pb-0">
                        <div className="tab-content">
                            <div className={tabNumber === 1 ? "tab-pane active" : "tab-pane"} role="tabpanel"
                                 aria-labelledby={`bootstrap-wizard-tab${1}`} id={`bootstrap-wizard-tab${1}`}>
                                <div id="wizardForm1" novalidate="novalidate" data-wizard-form="1">
                                    <div className="mb-2">
                                        <label className="form-label text-900">Nombre Epouse</label>
                                        <input className="form-control" type="text" name="nb_epouse"
                                               onChange={handleChange} value={enqueteData.nb_epouse}/>
                                                {/*{errors.nomProjet && <span className="text-danger">{errors.nomProjet}</span>}*/}
                                    </div>

                                    <div className="row g-3 mb-3">
                                        <div className="col-sm-4">
                                            <div className="mb-2 mb-sm-0">
                                                <label className="form-label text-900" htmlFor="bootstrap-wizard-wizard-password">Nombre Enfant Mineur</label>
                                                <input className="form-control" type="number" name="enfant_mineur"
                                                       id="bootstrap-wizard-wizard-password" onChange={handleChange}
                                                       value={enqueteData.enfant_mineur}/>
                                                {/*{errors.dateDebut &&*/}
                                                {/*    <span className="text-danger">{errors.dateDebut}</span>}*/}
                                            </div>
                                        </div>
                                        <div className="col-sm-4">
                                            <div className="mb-2">
                                                <label className="form-label text-900" htmlFor="bootstrap-wizard-wizard-confirm-password">Enfant Majeur</label>
                                                <input
                                                    className="form-control"
                                                    type="number"
                                                    name="enfant_majeur"
                                                    id="bootstrap-wizard-wizard-confirm-password"
                                                    onChange={handleChange}
                                                    value={enqueteData.enfant_majeur}
                                                />
                                                {/*{errors.dateFin && <span className="text-danger">{errors.dateFin}</span>}*/}
                                            </div>
                                        </div>

                                        <div className="col-4">
                                            <label className="form-label" htmlFor="bootstrap-wizard-card-holder-country">Nombre Enfants Scolarisés</label>
                                            <input
                                                className="form-control"
                                                type="number"
                                                name="enfant_scolarise"
                                                id="bootstrap-wizard-wizard-confirm-password"
                                                onChange={handleChange}
                                                value={enqueteData.enfant_scolarise}
                                            />
                                            {/*{errors.objectif && <span className="text-danger">{errors.objectif}</span>}*/}
                                        </div>
                                    </div>
                                    <div className="mb-2">
                                        <label className="form-label" htmlFor="bootstrap-wizard-wizard-email">Personne à
                                            Charge </label>
                                        <input
                                            className="form-control"
                                            type="number"
                                            name="nb_personne"
                                            id="bootstrap-wizard-wizard-confirm-password"
                                            onChange={handleChange}
                                            value={enqueteData.nb_personne}
                                        />
                                    </div>

                                </div>
                            </div>
                            <div className={tabNumber === 2 ? "tab-pane active" : "tab-pane"} role="tabpanel"
                                 aria-labelledby={`bootstrap-wizard-tab${2}`} id={`bootstrap-wizard-tab${2}`}>
                                <div className="mb-2" id="wizardForm3">

                                    <div className="row gx-3 gy-2">
                                        <div className="col-6">
                                            <label className="form-label" htmlFor="bootstrap-wizard-card-holder-country">Nombre Enfants Scolarisés</label>
                                            <input
                                                className="form-control"
                                                type="number"
                                                name="enfant_scolarise"
                                                id="bootstrap-wizard-wizard-confirm-password"
                                                onChange={handleChange}
                                                value={enqueteData.is_manoeuvre}
                                            />
                                            {/*{errors.countrie && <span className="text-danger">{errors.countrie}</span>}*/}
                                        </div>
                                        <div className="position-relative mt-2">
                                            <hr className="bg-200"/>
                                            <div className="divider-content-center bg-white text-warning">Ajouter une nouvelle campagne</div>
                                        </div>
                                        <div className="col-6">
                                            <label className="form-label" htmlFor="bootstrap-wizard-card-number">Date debut de campagne</label>
                                            <input className="form-control" type="date"
                                                   id="bootstrap-wizard-card-number" name="dateDebutc"
                                                   onChange={handleChange} value={enqueteData.dateDebutc}/>
                                            {/*{errors.dateDebutc &&*/}
                                            {/*    <span className="text-danger">{errors.dateDebutc}</span>}*/}
                                        </div>
                                        <div className="col-6">
                                            <label className="form-label" htmlFor="bootstrap-wizard-card-name">Date fin
                                                de campagne</label>
                                            <input className="form-control" name="DateFinc" type="date"
                                                   id="bootstrap-wizard-card-name" onChange={handleChange}
                                                   value={enqueteData.DateFinc}/>
                                            {errors.DateFinc && <span className="text-danger">{errors.DateFinc}</span>}
                                        </div>

                                        {/*  <div className="col-6">
                                <label className="form-label" for="bootstrap-wizard-card-holder-zip-code">Durée de la campagne</label>
                                <input className="form-control" placeholder="Ex: 1 ans" name="duree_campagne" type="text" id="bootstrap-wizard-card-holder-zip-code" onChange={handleChange} value={projetData.duree_campagne} />
                            </div> */}

                                        <div className="position-relative mt-2">
                                            <hr className="bg-200"/>
                                            <div className="divider-content-center bg-white text-warning">Objectif du
                                                projet ( facultatif )
                                            </div>
                                        </div>

                                        <div className="row g-3 mb-3">
                                            <div className="col-sm-4">
                                                <div className="mb-2 mb-sm-0">
                                                    <label className="form-label text-900"
                                                           htmlFor="bootstrap-wizard-wizard-password">Plants Totals à
                                                        produire</label>
                                                    <input className="form-control" type="number" name="plant_aproduit"
                                                           id="bootstrap-wizard-wizard-password" onChange={handleChange}
                                                           value={enqueteData.plant_aproduit}/>
                                                </div>
                                            </div>
                                            <div className="col-sm-4">
                                                <div className="mb-2">
                                                    <label className="form-label text-900"
                                                           htmlFor="bootstrap-wizard-wizard-confirm-password">Carbone(CO2)
                                                        Espéré</label>
                                                    <input className="form-control" type="number" name="carbon_astock"
                                                           id="bootstrap-wizard-wizard-confirm-password"
                                                           onChange={handleChange} value={enqueteData.carbon_astock}/>
                                                </div>
                                            </div>

                                            <div className="col-4">
                                                <label className="form-label"
                                                       htmlFor="bootstrap-wizard-card-holder-country">Nombre de
                                                    personnes engagées </label>
                                                <input className="form-control" type="number" name="emp_engageof_proj"
                                                       id="bootstrap-wizard-wizard-confirm-password"
                                                       onChange={handleChange} value={enqueteData.emp_engageof_proj}/>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className={tabNumber === 3 ? "tab-pane active" : "tab-pane"} role="tabpanel"
                                 aria-labelledby={`bootstrap-wizard-tab${tabThree}`}
                                 id={`bootstrap-wizard-tab${tabThree}`}>
                                <div className="row flex-center pb-8 pt-4 gx-3 gy-4">

                                    <div className="col-12 col-sm-auto">
                                        <div className="text-center text-sm-start">
                                            <h5 className="mb-3">TERMINER !</h5>
                                            <p className="text-1100 fs--1">Vous pouvez maintenant valider la creation du
                                                projet <b>{enqueteData.producteur}</b><br/></p>
                                            <button className="btn btn-primary px-6" href="wizard.html"
                                                    onClick={validateCreationEnquete}>Valider
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="card-footer border-top-0">
                        <div className="d-flex pager wizard list-inline mb-0">
                            {tabNumber !== 1 &&
                                <button className="btn btn-link ps-0" type="button" onClick={onClickPrevouis}>
                                    <svg className="svg-inline--fa fa-chevron-left me-1" data-fa-transform="shrink-3"
                                         aria-hidden="true" focusable="false" data-prefix="fas" data-icon="chevron-left"
                                         role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"
                                         data-fa-i2svg="" style={{"transformOrigin": "0.3125em 0.5em"}}>

                                        <g transform="translate(160 256)">
                                            <g transform="translate(0, 0)  scale(0.8125, 0.8125)  rotate(0 0 0)">
                                                <path fill="currentColor"
                                                      d="M224 480c-8.188 0-16.38-3.125-22.62-9.375l-192-192c-12.5-12.5-12.5-32.75 0-45.25l192-192c12.5-12.5 32.75-12.5 45.25 0s12.5 32.75 0 45.25L77.25 256l169.4 169.4c12.5 12.5 12.5 32.75 0 45.25C240.4 476.9 232.2 480 224 480z"
                                                      transform="translate(-160 -256)"></path>
                                            </g>
                                        </g>
                                    </svg>
                                    Précédent
                                </button>
                            }

                            {tabNumber === 1 &&
                                <div className="flex-1 text-end">
                                    <button className="btn btn-primary px-6 px-sm-6" type="button"
                                            onClick={onclickTabTwo}>Suivant
                                        <svg className="svg-inline--fa fa-chevron-right ms-1"
                                             data-fa-transform="shrink-3" aria-hidden="true" focusable="false"
                                             data-prefix="fas" data-icon="chevron-right" role="img"
                                             xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" data-fa-i2svg=""
                                             style={{"transformOrigin": "0.3125em 0.5em"}}>
                                            <g transform="translate(160 256)">
                                                <g transform="translate(0, 0)  scale(0.8125, 0.8125)  rotate(0 0 0)">
                                                    <path fill="currentColor"
                                                          d="M96 480c-8.188 0-16.38-3.125-22.62-9.375c-12.5-12.5-12.5-32.75 0-45.25L242.8 256L73.38 86.63c-12.5-12.5-12.5-32.75 0-45.25s32.75-12.5 45.25 0l192 192c12.5 12.5 12.5 32.75 0 45.25l-192 192C112.4 476.9 104.2 480 96 480z"
                                                          transform="translate(-160 -256)">
                                                    </path>
                                                </g>
                                            </g>
                                        </svg>
                                    </button>
                                </div>
                            }

                            {tabNumber === 2 &&
                                <div className="flex-1 text-end">
                                    <button className="btn btn-primary px-6 px-sm-6" type="button"
                                            onClick={onclickTabThree}>Suivant
                                        <svg className="svg-inline--fa fa-chevron-right ms-1"
                                             data-fa-transform="shrink-3" aria-hidden="true" focusable="false"
                                             data-prefix="fas" data-icon="chevron-right" role="img"
                                             xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" data-fa-i2svg=""
                                             style={{"transformOrigin": "0.3125em 0.5em"}}>
                                            <g transform="translate(160 256)">
                                                <g transform="translate(0, 0)  scale(0.8125, 0.8125)  rotate(0 0 0)">
                                                    <path fill="currentColor"
                                                          d="M96 480c-8.188 0-16.38-3.125-22.62-9.375c-12.5-12.5-12.5-32.75 0-45.25L242.8 256L73.38 86.63c-12.5-12.5-12.5-32.75 0-45.25s32.75-12.5 45.25 0l192 192c12.5 12.5 12.5 32.75 0 45.25l-192 192C112.4 476.9 104.2 480 96 480z"
                                                          transform="translate(-160 -256)">
                                                    </path>
                                                </g>
                                            </g>
                                        </svg>
                                    </button>
                                </div>
                            }
                        </div>
                    </div>
                </div>
            </div>

        </Content>
)
}

export default ViewsProd;