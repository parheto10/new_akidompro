import { Link, useNavigate, useParams } from "react-router-dom";
import Content from "../../../Content";
import {Fragment, useEffect, useState} from "react";
import personIcon from '../../../assets/img/avatar.jpg';
import axios from "axios";
import Swal from "sweetalert2";
import Validation from "../../../Validation";

import BaseUrl from "../../../config/baseUrl";

// const baseUrl = 'http://127.0.0.1:8000/api';
const url = BaseUrl();
function ParcListModere(){
    const {coopID} = useParams();
    const navigate = useNavigate();
    const [cooperative,setCooperative] = useState([]);
    const campagne = localStorage.getItem('campagne');
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const [errors, setErrorM] = useState({});
    const [anneeLists,setAnneeLists] = useState([]);
    const [totalParc,setTotalParc] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [nextUrl,setnextUrl] = useState();
    const [prevUrl,setprevUrl] = useState();

    const [parcelleList,setParcelleList] = useState([]);
    const [parcelleData,setParcelleData] = useState({
      "latitude":"",
      "longitude":"",
      "superficie":"0",
      "certification":"",
      "annee_certificat":"",
      "annee_acquis":"",
      "culture":"",
      "acquisition":"",
      "code_certif":""
    });
    const [cultures,setCulutres] = useState([]);
    const [acquisitions,setModeAcquisitions] = useState([]);
    const [campagneList,setCampagneList] = useState([]);
    const [certifications,setCertifications] = useState([]);



    useEffect(()=>{
        if(coopID){
            try {

                axios.get(url+'/cooperative-list/?coopID='+coopID).then((resp)=>{
                    setCooperative(resp.data[0]);
                });
                axios.get(url+'/culture-list/?coopID='+coopID).then((resp)=>{
                  setCulutres(resp.data);
                })

                axios.get(url+'/mode-acquisition-list/').then((resp)=>{
                  setModeAcquisitions(resp.data);
                });

                axios.get(url+'/certification-list/').then((resp)=>{
                  setCertifications(resp.data);
                });
            } catch (error) {
                console.log(error)
            }
            fetchData();
        }
    },[functAnneeList(),coopID,totalPages]);

    useEffect(()=>{

      try {
        if(cooperative && cooperative.projet?.id){
          axios.get(url+'/campagne-proj-list/?projId='+cooperative.projet?.id).then((resp)=>{
            setCampagneList(resp.data);
          });

        }


        } catch (error) {
          console.log(error);
      }

  },[functAnneeList(),cooperative])

    const fetchData = () => {
        axios.get(url+'/parcelles-list-modere/?coopID='+coopID)
          .then((resp) => {
            setnextUrl(resp.data.next);
            setprevUrl(resp.data.previous)
            setParcelleList(resp.data.results);
            setTotalPages(resp.data.count / resp.data.results.length);
            setTotalParc(resp.data.count)
          })
          .catch((error) => {
            console.error(error);
          });
      };

      const paginationHandler=(url,ls)=>{
        if(ls==0){
          setPage(page - 1);
        }else{
          setPage(page + 1);
        }
        try {
            axios.get(url).then((resp)=>{
                setnextUrl(resp.data.next);
                setprevUrl(resp.data.previous)
                setParcelleList(resp.data.results);

            })
        } catch (error) {
            console.log(error)
        }
    }

    const onSearchParcelle=(event)=>{
        try {
          axios.get(url+'/parcelles-list-modere/?q='+event.target.value+'&co='+coopID).then((resp)=>{

            setParcelleList(resp.data.results);
          });
        } catch (error) {
            console.log(error);
        }
      }

    const ViewProducteur=(prodID)=>{

        navigate('/views-producteur/'+prodID+'/');
        //window.location.reload();
    }

    const onDeleteParc=(Code,nomComplet)=>{
      try {
        Swal.fire({
          title: 'Êtes-vous sûre?',
          html: "Cette action va supprimer la parcelle de <b>"+nomComplet+"</b> <br/> Code parcelle : <b>"+Code+"</b>",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Confirmer',
          cancelButtonText: "Refuser",
          showLoaderOnConfirm:true
        }).then((result) => {
          if (result.isConfirmed) {
            try {
              axios.get(url+'/parcelles-list/?code='+Code+'&coop='+coopID).then((resp)=>{

                setParcelleList(resp.data.results);
                setTotalPages(resp.data.count / resp.data.results.length);
                setTotalParc(resp.data.count)
                Swal.fire(
                  'Supprimé',
                  'Producteur supprimé avec succès',
                  'success'
                )
              })
            } catch (error) {

            }

          }
        })
      } catch (error) {
        console.log(error);
      }
    }

    // UPDATE PARCELLE
    const [parcEdit,setParcEdit] = useState([]);

    const modalOpenParc=(code)=>{
      window.$(`#addEventModalParc-${code}`).modal("show");
      axios.get(url+'/parcelles-list/?parcId='+code).then((resp)=>{
        setParcEdit(resp.data.results[0]);

        setParcelleData({
          "longitude":resp.data.results[0].longitude,
          "latitude":resp.data.results[0].latitude,
          "annee_acquis":resp.data.results[0].annee_acquis,
          "acquisition":resp.data.results[0].acquisition?.id,
          "annee_certificat":resp.data.results[0].annee_certificat,
          "culture":resp.data.results[0].culture?.id,
          "superficie":resp.data.results[0].superficie,
          "certification":resp.data.results[0].certificat?.id,
          "code_certif":resp.data.results[0].code_certif

        })
      });

    }

    //console.log(parcelleData);

    const handleChangeParcelle=(event)=>{
      setParcelleData({
          ...parcelleData,
          [event.target.name]:event.target.value
      });
    }

    const submitParc=()=>{
      setErrorM(Validation(parcelleData));
      if( parcelleData.acquisition !="" && parcelleData.superficie !="" && parcelleData.culture !="" )
      {
        const _formData = new FormData();
        _formData.append('latitude',parcelleData.latitude);
        _formData.append('longitude',parcelleData.longitude);
        _formData.append('superficie',parcelleData.superficie);
        _formData.append('certification',parcelleData.certification);
        _formData.append('acquisition',parcelleData.acquisition);
        _formData.append('annee_certificat',parcelleData.annee_certificat);
        _formData.append('annee_acquis',parcelleData.annee_acquis);
        _formData.append('culture',parcelleData.culture);
        _formData.append('code_certif',parcelleData.code_certif);
        _formData.append('code',parcEdit.code);

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
          axios.post(url+'/update-coop-parcelle/',_formData).then((resp)=>{
            Swal.close()

            if(resp.data.bool)
            {
              window.$(`#addEventModalParc-${parcEdit.code}`).modal('hide');
              Swal.fire({
                title: 'FELICITATION !',
                html: "La parcelle a bien été modifiée.",
                icon: 'success',
                showCancelButton: false,
                confirmButtonColor: '#3085d6',
                confirmButtonText: 'OK'
              }).then((result) => {
                if (result.isConfirmed) {
                  axios.get(url+'/parcelles-list/?coopID='+coopID).then((resp)=>{
                    setnextUrl(resp.data.next);
                    setprevUrl(resp.data.previous)
                    setParcelleList(resp.data.results);
                    setTotalPages(resp.data.count / resp.data.results.length);
                    setTotalParc(resp.data.count)
                  });


                }
              });

              setParcelleData({
                "latitude":"",
                "longitude":"",
                "superficie":"0",
                "certification":"",
                "annee_certificat":"",
                "annee_acquis":"",
                "culture":"",
                "acquisition":"",
                "code_certif":""
              })

              setParcEdit([]);
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

    function functAnneeList(){

      for (let i = year; i >= year - 60; i--) {
           anneeLists.push(`${i}`)
      }

   }

   const [campagne_exp,setCampagne_exp] = useState('');
   const [format_exp,setFormat_exp] = useState('');

   var fileDownload = require('js-file-download');

   const onSubmitExporteData=(e)=>{
     e.preventDefault()

     try {
       axios.get(url+'/export-parcelle-cooperative-a-risque/?format='+format_exp+'&campagne='+campagne_exp+'&coopID='+coopID,
         {responseType:'blob'}
       ).then((response)=>{
           if (format_exp == 'PDF'){
             fileDownload(response.data,'liste_parcelles.pdf');
           }else{
             fileDownload(response.data,'liste_parcelles.xlsx')
           }


       })
     } catch (error) {
       console.error('Erreur lors de l\'export :', error);
     }

   }


//console.log(parcelleList);


    return(
        <Fragment>
            <Content sideID={"cooperatives"} parent={"generalite"}>
            {/*<h2 className="text-bold text-1100 mb-5">Liste des Parcelles Inférieur à 4ha ({totalParc})</h2>*/}
                <div className="mb-5 bg-white p-3 border-2 rounded-2 ">
                <div className="row">
                        <div className="col-md-4">
                            <div className="card">
                                <h5 className="card-header bg-info text-white p-2 text-center">
                                    Coopérative
                                </h5>
                                <div className="card-body p-2">
                                    <h3 className="card-title text-center text-warning"><Link
                                        to={`/views-coop/${coopID}/`}>{cooperative.nomCoop}</Link></h3>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="card">
                                <h5 className="card-header bg-success text-white p-2 text-center">
                                    Nb Parcelles à Rsique Modéré
                                </h5>
                                <div className="card-body p-2">
                                    <h3 className="card-title text-center text-success">{totalParc}</h3>
                                </div>
                            </div>
                        </div>

                        <div className="col-md-4">
                            <div className="card">
                                <h5 className="card-header bg-info text-white p-2 text-center">
                                    Superficie totale Parcelles à Rsique Modéré
                                </h5>
                                <div className="card-body p-2">
                                    <h3 className="card-title text-center text-warning">{cooperative.sumSuperficieRisqueModere?.total.toFixed(2)}</h3>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div id="members">
                    <div className="row align-items-center justify-content-between g-3 mb-4">
                        <div className="col col-auto">
                            <div className="search-box">
                                <div className="position-relative" data-bs-toggle="search" data-bs-display="static">
                                    <input className="form-control search-input search" type="search"
                                           placeholder="Recherche une parcelle" aria-label="Search"
                                           onChange={onSearchParcelle}/>
                                    <span className="fas fa-search search-box-icon"></span>
                                </div>
                            </div>
                        </div>
                        <div className="col-auto">
                            <div className="d-flex align-items-center">
                                <button className="btn btn-link text-900 me-4 px-0" data-bs-toggle="modal"
                                        data-bs-target="#exampleModal"><span
                                    className="fa-solid fa-file-export fs--1 me-2"></span>Export
                                </button>
                                {/*<button className="btn btn-primary btn-sm" type="button"  onClick={()=>modalOpenParc()}>*/}
                                {/*  <span className="fas fa-plus pe-2 fs--2"></span>*/}
                                {/*  Ajouter une parcelle*/}
                                {/*</button>*/}
                                {/*<Link className="btn btn-primary btn-sm" to={`/coops/producteur-list/${coopID}/`} >*/}
                                {/*  <span className="fas fa-plus pe-2 fs--2"></span>*/}
                                {/*  Ajouter une parcelle*/}
                                {/*</Link>*/}
                            </div>
                        </div>
                    </div>
                    <div
                        className="mx-n4 mx-lg-n6 px-4 px-lg-6 mb-9 bg-white border-y border-300 mt-2 position-relative top-1">
                        <div className="table-responsive scrollbar ms-n1 ps-1">
                            <table className="table fs--1 mb-0">
                            <thead>
                          <tr className="bg-warning">

                              <th className="sort white-space-nowrap align-middle pe-3 ps-0 text-uppercase text-center" scope="col"  >Code</th>
                              <th className="sort align-middle pe-6 text-uppercase " scope="col" data-sort="amount" >Producteur</th>
                              <th className="sort align-middle pe-6 text-uppercase " scope="col" data-sort="amount" >Section</th>
                              <th className="sort align-middle text-center text-uppercase" scope="col" data-sort="stage" >Campagne</th>
                              <th className="sort align-middle text-center text-uppercase" scope="col" data-sort="probability" >Certification</th>
                              <th className="sort align-middle text-center text-uppercase" scope="col" data-sort="probability" >Code Certificat</th>
                              <th className="sort align-middle ps-0 text-center text-uppercase" scope="col" data-sort="date" >Latitude</th>
                              <th className="sort align-middle text-center text-uppercase" scope="col" data-sort="type" >Longitude</th>
                              <th className="sort align-middle text-center text-uppercase" scope="col" data-sort="type" >Culture</th>
                              <th className="sort align-middle text-center text-uppercase" scope="col" data-sort="type" >Superficie (ha)</th>
                              <th className="sort align-middle text-center text-uppercase" scope="col" data-sort="type" >RISQUE</th>
                              {/*<th className="sort align-middle text-center text-uppercase" scope="col" data-sort="type" >Actions</th>*/}
                          </tr>
                          </thead>
                          <tbody className="list" id="lead-details-table-body">
                               {parcelleList.map((parc,index)=>
                            <tr className="hover-actions-trigger btn-reveal-trigger position-static">
                                  <td className="description align-middle white-space-nowrap text-primary text-center fw-bold text-700 py-2 pe-6" onClick={()=>ViewProducteur(parc.producteur?.code)}>{parc.code}</td>
                                  <td className="name align-middle white-space-nowrap py-2 ps-0 ">
                                    <span className="d-flex align-items-center text-1000 cursor-pointer" >
                                      <div className="avatar avatar-m me-3 status-online">
                                        {parc.producteur?.photo ?
                                          <img className="rounded-circle" src={parc.producteur?.photo} alt="" />
                                          :
                                          <>
                                          <img className="rounded-circle" src={personIcon} alt="" />
                                          </>
                                        }

                                      </div>
                                      <h6 className="mb-0 text-1000 fw-bold " >{parc.producteur?.nomComplet}</h6>
                                    </span>

                                  </td>

                                  <td className="description align-middle white-space-nowrap fw-bold text-700 py-2 pe-6">{parc.producteur?.section?.libelle}</td>
                                  <td className="description align-middle white-space-nowrap text-center fw-bold text-700 py-2 pe-6">{parc.campagne?.libelle}</td>
                                  <td className="create_date text-end align-middle white-space-nowrap text-900 py-2 text-center">{parc.code_certif ? <b className="text-success">CERTIFIE</b> : <b className="text-danger"></b>}</td>
                                  <td className="create_by align-middle white-space-nowrap fw-semi-bold text-1000 text-center"><b className="text-success">{parc.code_certif}</b></td>
                                  <td className="create_by align-middle white-space-nowrap fw-semi-bold text-1000 text-center">{parc.latitude}</td>
                                  <td className="last_activity align-middle text-center py-2">
                                    <span className="fw-bold fs--1 text-900">{parc.longitude}</span>
                                  </td>
                                  <td className="align-middle text-center white-space-nowrap pe-0 action py-2 ">
                                  {parc.culture?.libelle}
                                  </td>
                                  <td className="align-middle text-center white-space-nowrap pe-0 action py-2 ">
                                  {parc.superficie}
                                  </td>
                                  <td className="align-middle text-center white-space-nowrap pe-0 action py-2 ">
                                  {parc.risque?.libelle}
                                  </td>
                                  {/*<td className="align-middle text-center white-space-nowrap pe-0 action py-2 ">*/}

                                  {/*  <button className="btn btn-default btn-sm p-2 mx-1" onClick={()=>modalOpenParc(parc.code)}><i class="fa-solid fa-pencil text-primary"></i></button>*/}
                                  {/*      /!* modal create parcelle *!/*/}
                                  {/*      <div className="modal fade" id={`addEventModalParc-${parc.code}`} data-bs-backdrop="static" role="dialog" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">*/}
                                  {/*        <div className="modal-dialog modal-md">*/}
                                  {/*          <div className="modal-content border">*/}
                                  {/*            <div id="addEventForm" autoComplete="off">*/}
                                  {/*              <div className="modal-header px-card border-0">*/}
                                  {/*                <div className="w-100 d-flex justify-content-between align-items-start">*/}
                                  {/*                  <div>*/}
                                  {/*                    <h5 className="mb-0 lh-sm text-1000">Modifier la parcelle <b className="text-success">{parc.producteur?.nomComplet}</b></h5>*/}
                                  {/*                  </div><button className="btn p-1 fs--2 text-900" type="button" data-bs-dismiss="modal" aria-label="Close">Fermer </button>*/}
                                  {/*                </div>*/}
                                  {/*              </div>*/}
                                  {/*              <div className="modal-body p-card py-0">*/}

                                  {/*              <div className="row">*/}
                                  {/*                  <div className="form-floating mb-5 col-md-6">*/}
                                  {/*                      <select className="form-select" id="categorie" name="acquisition" onChange={handleChangeParcelle} value={parcelleData.acquisition}>*/}
                                  {/*                      <option selected="selected" value="">...</option>*/}
                                  {/*                      {acquisitions.map((acquisition,index)=>*/}
                                  {/*                        <option value={acquisition.id}>{acquisition.libelle}</option>*/}
                                  {/*                      )}*/}
                                  {/*                      </select>*/}
                                  {/*                      {errors.acquisition && <span className="text-danger">{errors.acquisition}</span>}*/}
                                  {/*                      <label htmlFor="eventLabel" className="pb-2 text-warning">Mode d'acquisition de la parcelle</label>*/}
                                  {/*                  </div>*/}

                                  {/*                  */}

                                  {/*                  <div className="form-floating mb-5 col-md-6">*/}
                                  {/*                      <select className="form-select" id="categorie" name="annee_acquis" onChange={handleChangeParcelle} value={parcelleData.annee_acquis}>*/}
                                  {/*                      <option selected="selected" value="">...</option>*/}
                                  {/*                      {anneeLists.map((annee,index)=>*/}
                                  {/*                          <option  value={annee}>{annee}</option>*/}
                                  {/*                      )}*/}
                                  {/*                      </select>*/}
                                  {/*                      <label htmlFor="eventLabel" className="pb-2 text-warning">Année d'acquisition</label>*/}
                                  {/*                  </div>*/}
                                  {/*              </div>*/}
                                  {/*              <div className="row">*/}
                                  {/*                  */}
                                  {/*                  <div className="form-floating mb-3 col-md-4">*/}
                                  {/*                      <select className="form-select" id="categorie" name="certification" onChange={handleChangeParcelle} value={parcelleData.certification}>*/}
                                  {/*                      <option selected="selected" value="">...</option>*/}
                                  {/*                      {certifications.map((certif,index)=>*/}
                                  {/*                          <option  value={certif.id}>{certif.libelle}</option>*/}
                                  {/*                      )}*/}
                                  {/*                      </select>*/}
                                  {/*                      <label htmlFor="eventLabel" className="pb-2 text-warning">Certification</label>*/}
                                  {/*                  </div>*/}

                                  {/*                <div className="form-floating mb-3 col-md-4">*/}
                                  {/*                    <input className="form-control" id="sigle" type="text" name="code_certif" onChange={handleChangeParcelle} value={parcelleData.code_certif}/>*/}
                                  {/*                    */}
                                  {/*                    <label htmlFor="eventTitle" className="pb-2 text-warning">Code Certification</label>*/}
                                  {/*                  </div>*/}

                                  {/*              */}
                                  {/*                  <div className="form-floating mb-3 col-md-4">*/}
                                  {/*                      <select className="form-select" id="categorie" name="annee_certificat" onChange={handleChangeParcelle} value={parcelleData.annee_certificat}>*/}
                                  {/*                      <option selected="selected" value="">...</option>*/}
                                  {/*                      {anneeLists.map((annee,index)=>*/}
                                  {/*                          <option  value={annee}>{annee}</option>*/}
                                  {/*                      )}*/}
                                  {/*                      </select>*/}
                                  {/*                      <label htmlFor="eventLabel" className="pb-2 text-warning">Année de Certification</label>*/}
                                  {/*                  </div>*/}

                                  {/*              </div>*/}

                                  {/*                <div className="row">*/}

                                  {/*                  <div className="form-floating mb-3 col-md-6">*/}
                                  {/*                    <input className="form-control" id="sigle" type="number" name="superficie" onChange={handleChangeParcelle} value={parcelleData.superficie}/>*/}
                                  {/*                    {errors.superficie && <span className="text-danger">{errors.superficie}</span>}*/}
                                  {/*                    <label htmlFor="eventTitle" className="pb-2 text-warning">Superficie</label>*/}
                                  {/*                  </div> */}
                                  {/*                  */}
                                  {/*                  <div className="form-floating mb-3 col-md-6">*/}
                                  {/*                      <select className="form-select" id="categorie" name="culture" onChange={handleChangeParcelle} value={parcelleData.culture}>*/}
                                  {/*                      <option selected="selected" value="">...</option>*/}
                                  {/*                      {cultures.map((culture,index)=>*/}
                                  {/*                          <option  value={culture.id}>{culture.libelle}</option>*/}
                                  {/*                      )}*/}
                                  {/*                      </select>*/}
                                  {/*                      {errors.culture && <span className="text-danger">{errors.culture}</span>}*/}
                                  {/*                      <label htmlFor="eventLabel" className="pb-2 text-warning">Culture sur la parcelle</label>*/}
                                  {/*                  </div>*/}

                                  {/*                </div>*/}

                                  {/*                <div className="position-relative">*/}
                                  {/*                    <hr className="bg-200 mt-1" />*/}
                                  {/*                    <div className="divider-content-center bg-white">Localisation de la parcelle</div>*/}
                                  {/*                  </div>*/}

                                  {/*                <div className="form-floating mb-3">*/}
                                  {/*                  <input className="form-control" id="sigle" type="text" name="latitude" onChange={handleChangeParcelle} value={parcelleData.latitude}/>*/}
                                  {/*                  <label htmlFor="eventTitle" className="pb-2 text-warning">Latitude</label>*/}
                                  {/*                </div>*/}

                                  {/*              */}
                                  {/*                  <div className="form-floating mb-3">*/}
                                  {/*                    <input className="form-control" id="chef" type="text" name="longitude" onChange={handleChangeParcelle} value={parcelleData.longitude} />*/}
                                  {/*                    <label htmlFor="eventTitle" className="pb-2 text-warning">Longitude</label>*/}
                                  {/*                  </div>*/}
                                  {/*                */}
                                  {/*                */}

                                  {/*                /!*  <div className="row">*/}
                                  {/*                      <div className="form-floating mb-3 col-md-6">*/}
                                  {/*                          <input className="form-control" id="titre" type="number" name="nbParc"  />*/}
                                  {/*                          <label htmlFor="eventTitle" className="pb-2 text-warning">Nombre de parcelle</label>*/}
                                  {/*                      </div>*/}

                                  {/*                      <div className="form-floating mb-3 col-md-6">*/}
                                  {/*                          <input className="form-control" id="titre" type="text" name="contacts" />*/}
                                  {/*                          <label htmlFor="eventTitle" className="pb-2 text-warning">Contact</label>*/}
                                  {/*                      </div>*/}
                                  {/*                  </div> *!/*/}
                                  {/*                */}

                                  {/*                /!* <div className="form-floating mb-3">*/}
                                  {/*                  <input className="form-control" id="titre" type="file" name="photo" />*/}
                                  {/*                  <label htmlFor="eventTitle" className="pb-2 text-warning">Ma photo</label>*/}
                                  {/*                </div> *!/*/}
                                  {/*                */}
                                  {/*                */}
                                  {/*                </div>*/}
                                  {/*                <div className="modal-footer d-flex justify-content-between align-items-center border-0">*/}
                                  {/*                  <button className="btn btn-primary px-4 form-control" type="button" onClick={submitParc}>Modifier</button>*/}
                                  {/*                </div>*/}
                                  {/*            </div>*/}
                                  {/*          </div>*/}
                                  {/*        </div>*/}
                                  {/*      </div>*/}
                                  {/*  <button className="btn btn-default btn-sm p-2 " onClick={()=>onDeleteParc(parc.code,parc.producteur?.nomComplet)}><i class="fa-solid fa-trash text-danger"></i></button>*/}
                                  {/*</td>*/}
                              </tr>
                              )}
                          </tbody>
            </table>
                  </div>
                  <div className="row align-items-end justify-content-end py-2 pe-0 fs--1">
                    <div className="col-auto d-flex">
                         {prevUrl && (
                          <button className="btn btn-primary btn-sm py-0 " onClick={() => paginationHandler(prevUrl,0)}>Précédent</button>
                        )}
                        Page {page} sur {totalPages}
                        {nextUrl  && (
                          <button className="btn btn-primary btn-sm py-0 " onClick={() => paginationHandler(nextUrl,1)}>Suivant</button>
                        )}
                      </div>
                    </div>

                </div>
              </div>



                {/* exportation modal */}

                <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div class="modal-dialog">
              <div class="modal-content">
                <div class="modal-header">
                  <h6 class="modal-title" id="exampleModalLabel">Exporter la liste</h6>
                  <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                  <form onSubmit={onSubmitExporteData}>
                    <div class="mb-1">
                      <label for="recipient-name" class="col-form-label">Format</label>
                      <select className="form-control" name="format_exp" onChange={(e)=>setFormat_exp(e.target.value)}>
                        <option value="" selected disabled>Choisir un format</option>
                        <option value="PDF">FORMAT PDF</option>
                        <option value="EXCEL">FORMAT EXCEL</option>
                     </select>
                    </div>
                    <div class="mb-1">
                      <label for="recipient-name" class="col-form-label">Campagne</label>
                      <select className="form-control" name="campagne_exp" onChange={(e)=>setCampagne_exp(e.target.value)}>
                        <option value="" selected>Toutes les campagnes</option>
                        {campagneList.map((camp,index)=>
                          <option value={camp.campagne?.id}>{camp.campagne?.libelle}</option>
                        )}

                     </select>
                    </div>
                     <button type="submit" class="btn btn-primary float-end" >Exporter</button>
                  </form>
                </div>

              </div>
            </div>
          </div>
            </Content>
        </Fragment>
    )
}

export default ParcListModere;