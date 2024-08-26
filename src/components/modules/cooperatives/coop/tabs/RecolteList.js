import axios from "axios";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import Select from "react-select";
import Validation from "../../../../Validation";


import BaseUrl from "../../../../config/baseUrl";

// const baseUrl = 'http://127.0.0.1:8000/api';
const url = BaseUrl();
function RecolteCoopList({coopID,campagne,campagneList}){
    const [errors, setErrorM] = useState({});
    const [recoltes,setRecoltes] = useState([]);
    const [prodList,setProdList] = useState([]);
    const [selectOptionProd,setSelectOptionProd] = useState(null);
    const [cultures,setCultures] = useState([]);
    const [saisons,setSaisons] = useState([]);

    const [recolteData,setRecolteData] = useState({
      "campagne":`${campagne.id}`,
      "saison":"",
      "culture":"",
      "lieu_production":"",
      "nbre_sacs":"",
      "poids_total":"",
      "prix_total":"",
      "prix_kilo":""
    });

    const [poidsTotal,setPoidsTotal] = useState(null);
    const [prixTotal,setPrixTotal]= useState(null);
    const [prixU,setPrixU]= useState(null);

    function separateNumber(number) {
      // Vérifier si le nombre est un entier positif
      if (Number.isInteger(number) && number >= 0) {
        // Convertir le nombre en chaîne de caractères
        var numberString = number.toString();
    
        // Séparer les chiffres en centaines
        var separatedNumber = '';
        for (var i = numberString.length - 1; i >= 0; i--) {
          separatedNumber = numberString.charAt(i) + separatedNumber;
          if (i > 0 && (numberString.length - i) % 3 === 0) {
            separatedNumber = ' ' + separatedNumber;
          }
        }
    
        return separatedNumber;
      } else {
        return 'Veuillez fournir un entier positif.';
      }
  }


    useEffect(()=>{
        if(coopID){
            try {
                axios.get(url+'/recoltes-producteurs-list/?coopID='+coopID).then((resp)=>{
                    setRecoltes(resp.data)
                })

                axios.get(url+'/producteurs-list/?coopID='+coopID).then((resp)=>{
                  setProdList(resp.data);
                }); 

               axios.get(url+'/culture-list/?coopID='+coopID).then((resp)=>{
                setCultures(resp.data);
              }) 
    
               axios.get(url+'/saison-recoltes-list/?coopID='+coopID).then((resp)=>{
                setSaisons(resp.data);
              }) 
            } catch (error) {
                console.log(error)
            }
        }
    },[coopID,campagne,campagneList]);


    useEffect(()=>{
      //functCultureValue()
    },[])

    const handleChangeRecolte=(event)=>{
      setRecolteData({
        ...recolteData,
        [event.target.name]:event.target.value
      })
    }

    const handleChangeCulture=(event)=>{
      recolteData.culture = event.target.value

      setPrixU(cultures.find((opt)=>opt.id == recolteData.culture).prix_unitaire_culture)
    }

    const handleChangeRecolteCalculPrix=(event)=>{
        const poids = event.target.value
        const prixT = prixU*poids

        setPoidsTotal(poids);
        setPrixTotal(separateNumber(prixT));

    }

    const handleChangeSelectOptionProd=(SelectOption)=>{
      setSelectOptionProd(SelectOption.value)
    }

    const options = prodList.map((option)=>(({
      label:`${option.nomComplet}`,
      value:`${option.code}`
    })))

    //console.log(prixU)

    const onPenModalRecolte=()=>{
      if(cultures.length==0)
      {
        Swal.fire({
          title: 'ATTENTION !',
          html: "Aucune culture de production pour la coopérative",
          icon: 'error',
          showCancelButton: false,
          confirmButtonColor: 'red',
          confirmButtonText: 'OK'
        })
        
      }else if(saisons.length == 0){
        Swal.fire({
          title: 'ATTENTION !',
          html: "Aucune saison de production pour la coopérative",
          icon: 'error',
          showCancelButton: false,
          confirmButtonColor: 'red',
          confirmButtonText: 'OK'
        })
      }
      else 
      {
        window.$('#addEventModalRecolte').modal('show')
      }
      
    }

    const submitRecolte=()=>{
      setErrorM(Validation(recolteData));
      const _formData = new FormData();

       if(selectOptionProd != null && recolteData.campagne !="" && recolteData.saison !="" && recolteData.culture !="" && poidsTotal != null)
      { 
        _formData.append("producteur",selectOptionProd);
        _formData.append("campagne",recolteData.campagne);
        _formData.append("saison",recolteData.saison);
        _formData.append("culture",recolteData.culture);
        _formData.append("lieu_production",recolteData.lieu_production);
        _formData.append("nbre_sacs",recolteData.nbre_sacs);
        _formData.append("poids_total",poidsTotal);
        _formData.append("prix_total",prixTotal.toString().replace(/\s/g, ''));

        try {
          axios.post(url+'/create-new-recolte/',_formData).then((resp)=>{
            if(resp.data.bool)
            {
                window.$('#addEventModalRecolte').modal('hide');
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

                axios.get(url+'/recoltes-producteurs-list/?coopID='+coopID).then((resp)=>{
                  setRecoltes(resp.data);
                });

                setRecolteData({
                  "campagne":`${campagne.id}`,
                  "culture":"",
                  "saison":"",
                  "lieu_production":"",
                  "nbre_sacs":"",
                  "poids_total":"",
                  "prix_total":""
                });

                setPoidsTotal(null);
                setPrixTotal(null);
                setPrixU(null);
            }
          })
        } catch (error) {
          console.log(error);
        }

        //console.log(_formData);
       } 
    }

    //console.log(recolteData.pr)


    return (
        <>
          <div className="tab-pane fade active show" id="notes-tab" role="tabpanel" aria-labelledby="activity-tab">
            <div className="row align-items-center gx-4 gy-3 flex-wrap mb-3">
                <div className="col-auto d-flex flex-1">
                  <h2 className="mb-0">Recoltes ({recoltes.length})</h2>
                </div>
                <div className="col-auto">
                      <div className="search-box">
                        <form className="position-relative" data-bs-toggle="search" data-bs-display="static">
                            <input className="form-control search-input search" type="search" placeholder="Recherche recolte de producteur" aria-label="Search" />
                          <span className="fas fa-search search-box-icon"></span>
                        </form>
                      </div>
                </div> 
                <div className="col-auto"><button className="btn btn-primary" onClick={()=>onPenModalRecolte()}><span className="fa-solid fa-plus me-2"></span>Ajouter</button></div>
              </div>
              <div className="border-top border-bottom border-200" id="leadDetailsTable" >
              <div className="table-responsive scrollbar mx-n1 px-1">
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
                              <td className="align-middle text-end white-space-nowrap pe-0 action py-2 text-center">{recolte.poids_total}</td>
                              <td className="align-middle text-end white-space-nowrap pe-0 action py-2 text-center">{recolte.prix_total}</td>
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

        {/* Modal de creation de production */}      
        <div className="modal fade" id="addEventModalRecolte" data-bs-backdrop="static" role="dialog" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
            <div className="modal-dialog modal-md">
                <div className="modal-content border">
                <div id="addEventForm" autoComplete="off">
                    <div className="modal-header px-card border-0">
                    <div className="w-100 d-flex justify-content-between align-items-start">
                        <div>
                        <h5 className="mb-0 lh-sm text-1000">Enregistrement d'une recolte</h5>
                        </div><button className="btn p-1 fs--2 text-900" type="button" data-bs-dismiss="modal" aria-label="Close">Fermer </button>
                    </div>
                    </div>
                    <div className="modal-body p-card py-0">

                    <div className="row">
                    
                        <div className="form-floating mb-3 col-md-12">
                              <Select placeholder="Nom et prénoms du producteur" options={options}  onChange={handleChangeSelectOptionProd}/>
                             {selectOptionProd == null && <span className="text-danger p-0 m-0">Choisir un producteur</span>}
                            
                        </div>
                    </div>
                    <div className="row">
                        <div className="form-floating mb-3 col-md-4">
                            <select className="form-select" id="categorie" name="campagne" value={recolteData.campagne} onChange={handleChangeRecolte}>
                                  <option selected="selected" value="">...</option>
                                  {campagneList.map((campagne,index)=>
                                      <option value={campagne.campagne?.id}>{campagne.campagne?.libelle}</option>
                                  )}
                            </select>
                              {errors.campagne && <span className="text-danger p-0 m-0">{errors.campagne}</span>}
                              <label htmlFor="eventLabel" className="pb-2 text-warning">Campagnes</label>
                        </div>

                        <div className="form-floating mb-3 col-md-4">
                            <select className="form-select" id="categorie" name="saison" value={recolteData.saison} onChange={handleChangeRecolte}>
                                  <option selected="selected" value="">...</option>
                                  {saisons.map((saison,index)=>
                                      <option value={saison.id}>{saison.libelle}</option>
                                  )}
                            </select>
                              {errors.campagne && <span className="text-danger p-0 m-0">{errors.saison}</span>}
                              <label htmlFor="eventLabel" className="pb-2 text-warning">Saisons</label>
                        </div>

                        <div className="form-floating mb-3 col-md-4">
                            <select className="form-select" id="categorie" name="culture" value={recolteData.culture} onChange={handleChangeCulture}>
                                  <option selected="selected" value="">...</option>
                                  {cultures.map((culture,index)=>
                                      <option value={culture.id}>{culture.libelle}</option>
                                  )}
                            </select>
                              {errors.culture && <span className="text-danger p-0 m-0">{errors.culture}</span>}
                              <label htmlFor="eventLabel" className="pb-2 text-warning">Culture</label>
                        </div>
                    </div>

                    {/*  {producteurData.groupe == "1" && 
                        <div className="form-floating mb-3">
                        <input className="form-control" id="chef" type="text" name="representant"  onChange={handleChangeProd} value={producteurData.representant}/>
                        <label htmlFor="eventTitle" className="pb-2 text-warning">Nom complet du representant</label>
                        </div>
                    } */}
                  <div className="row">
                    <div className="form-floating mb-3 col-md-2">
                        <input className="form-control text-danger" id="chef" type="text" name="prix_kilo" value={prixU}   disabled/>
                        <label htmlFor="eventTitle" className="pb-2 text-warning">Prix du Kilo (Fcfa)</label>
                    </div>
                    <div className="form-floating mb-3 col-md-3">
                          <input className="form-control" id="titre" type="number" name="nbre_sacs"  onChange={handleChangeRecolte} value={recolteData.nbre_sacs}/>
                          <label htmlFor="eventTitle" className="pb-2 text-warning">Nombre de Sacs</label>
                      </div>

                      <div className="form-floating mb-3 col-md-3">
                          <input className="form-control" id="titre" type="number" name="poids_total"  onChange={(e)=>handleChangeRecolteCalculPrix(e)} value={poidsTotal}/>
                          <label htmlFor="eventTitle" className="pb-2 text-warning">Poids Total (Kg)</label>
                      </div>

                      <div className="form-floating mb-3 col-md-4">
                          <input className="form-control text-success" id="titre" type="text" name="prix_total"  value={prixTotal}  disabled/>
                          <label htmlFor="eventTitle" className="pb-2 text-warning">Montant Total (Fcfa)</label>
                      </div>
                  </div>
                    

                    <div className="row">
                    
                        <div className="form-floating mb-3 col-md-12">
                            <input className="form-control" id="titre" type="text" name="lieu_production" onChange={handleChangeRecolte} value={recolteData.lieu_production} />
                            <label htmlFor="eventTitle" className="pb-2 text-warning">Lieu de production</label>
                        </div>
                    </div>
                    

                  {/*   <div className="form-floating mb-3">
                        <input className="form-control" id="titre" type="file" name="photo"  />
                        <label htmlFor="eventTitle" className="pb-2 text-warning">Ma photo</label>
                    </div> */}
                    
                    
                    </div>
                    <div className="modal-footer d-flex justify-content-between align-items-center border-0">
                        <button className="btn btn-primary px-4 form-control" type="button" onClick={submitRecolte}>Ajouter</button>
                    </div>
                </div>
                </div>
            </div>
        </div>             
        </>
    )
}

export default RecolteCoopList;