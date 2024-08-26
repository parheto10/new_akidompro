import { Link, useNavigate, useParams } from "react-router-dom";
import Content from "../../../Content";
import { useEffect, useState } from "react";
import axios from "axios";
import peopleIcon from '../../../assets/img/peopleicon.png';
import personIcon from '../../../assets/img/avatar.jpg';
import Swal from "sweetalert2";
import Validation from "../../../Validation";

import IconCooperative from '../../../assets/img/Cooperative.png'
import IconSection from '../../../assets/img/ri-survey-fill.png'
import IconParcelle from '../../../assets/img/Parcelle.png'
import { useTranslation } from "react-i18next";



import BaseUrl from '../../../config/baseUrl'

// const baseUrl = 'http://127.0.0.1:8000/api';
const url = BaseUrl();
function ProdCoopList(){
  const {t} = useTranslation();
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

    const navigate = useNavigate()
    const {coopID} = useParams();
    const [nextUrl,setnextUrl] = useState();
    const [prevUrl,setprevUrl] = useState();


    const [cooperative,setCooperative] = useState([]);
    const [prodList,setProdList] = useState([]);
    const campagne = localStorage.getItem('campagne');
    const currentDate = new Date();
    const year = currentDate.getFullYear();

    const [loading,setLoading] = useState(false);
    const [isDisabled, setIsDisabled] = useState(false);

    const [errors, setErrorM] = useState({});
    const [groupeList,setGroupeList] = useState([]);
    const [sectionsList,setSectionList] = useState([]);

    const [cultures,setCulutres] = useState([]);
    const [acquisitions,setModeAcquisitions] = useState([]);

    const [producteurData,setProducteurData] = useState({
        "code":"",
        "section":"",
        "nomComplet":"",
        "contacts":"",
        "photo":"",
        "nbParc":"1",
        "groupe":"",
        "representant":"",
        'lieu_habitation':""
    });

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


    const [anneeLists,setAnneeLists] = useState([]);
    const [campagneList,setCampagneList] = useState([]);
    const [totalProd,setTotalProd] = useState([]);
    const [certifications,setCertifications] = useState([]);
    

    useEffect(()=>{
      if(coopID){
        axios.get(url+'/cooperative-list/?coopID='+coopID).then((resp)=>{
          setCooperative(resp.data[0]);
      });

      axios.get(url+'/certification-list/').then((resp)=>{
        setCertifications(resp.data);
      });

  /* axios.get(baseUrl+'/producteurs-list/?coopID='+coopID).then((resp)=>{
        setTotalProd(resp.data);
    }); */

      fetchData();

      }
        
       
    },[campagne,coopID,totalPages]);

    const fetchData = () => {
      axios.get(url+'/producteurs-list-paginate/?coopID='+coopID)
        .then((resp) => {
          setnextUrl(resp.data.next);
          setprevUrl(resp.data.previous)
          setProdList(resp.data.results);
          setTotalPages(resp.data.count / resp.data.results.length);
          setTotalProd(resp.data.count)
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
              setProdList(resp.data.results);
              
          })
      } catch (error) {
          console.log(error)
      }
  }

    const ViewProducteur=(prodID)=>{
    
        navigate('/views-producteur/'+prodID+'/');
        //window.location.reload();
    }

      
     
  
      useEffect(()=>{
          try {
            axios.get(url+'/section-list/?coopID='+coopID).then((resp)=>{
              setSectionList(resp.data);
            });
          } catch (error) {
              console.log(error);
          }   
          
          try {
            if(cooperative && cooperative.projet?.id){
              axios.get(url+'/campagne-proj-list/?projId='+cooperative.projet?.id).then((resp)=>{
                setCampagneList(resp.data)
              });

            }
             
              axios.get(url+'/culture-list/?coopID='+coopID).then((resp)=>{
                setCulutres(resp.data);
              })

              axios.get(url+'/mode-acquisition-list/').then((resp)=>{
                setModeAcquisitions(resp.data);
              });
            } catch (error) {
              console.log(error);
          }   

      },[functAnneeList(),cooperative]) 


      const submitProd=()=>{
          setErrorM(Validation(producteurData));
          if( producteurData.nomComplet !="" && producteurData.section !="" )
          {
            
            const _formData = new FormData();
            _formData.append('code',producteurData.code);
            _formData.append('nomComplet',producteurData.nomComplet);
            _formData.append('section',producteurData.section);
            _formData.append('contacts',producteurData.contacts);
            _formData.append('nbParc',producteurData.nbParc);
            _formData.append('campagne',campagne);
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
      
                      axios.get(url+'/producteurs-list-paginate/?coopID='+coopID).then((resp)=>{
                        setnextUrl(resp.data.next);
                        setprevUrl(resp.data.previous)
                        setProdList(resp.data.results);
                        setTotalPages(resp.data.count / resp.data.results.length);
                        setTotalProd(resp.data.count)
                      });   
      
                    }
                  });
      
                  setProducteurData({
                    "code":"",
                    "nomComplet":"",
                    "groupe":"",
                    "nbParc":"1",
                    "section":"",
                    "representant":"",
                    "lieu_habitation":"",
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

      const onDeleteProd=(prodCode,nomComplet)=>{
        try {
          Swal.fire({
            title: 'Êtes-vous sûre?',
            html: "Cette action va supprimer le producteur <b>"+nomComplet+"</b> <br/> Code du producteur : <b>"+prodCode+"</b>",
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
                axios.get(url+'/producteurs-list-paginate/?code='+prodCode+'&coop='+coopID).then((resp)=>{
      
                  setnextUrl(resp.data.next);
                  setprevUrl(resp.data.previous)
                  setProdList(resp.data.results);
                  setTotalPages(resp.data.count / resp.data.results.length);
                  setTotalProd(resp.data.count)
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


      const onSearchProd=(event)=>{
        try {
          axios.get(url+'/producteurs-list-paginate/?q='+event.target.value+'&co='+coopID).then((resp)=>{
            
            setProdList(resp.data.results);
            //setTotalPages(resp.data.count / resp.data.results.length);
          
          });
        } catch (error) {
            console.log(error);
        }
      }

      //Update Producteur 

      const [producteurEditData,setProducteurEditData] = useState({
      
        "section_edit":"",
        "nomComplet_edit":"",
        "contacts_edit":"",
        "photo_edit":"",
        "nbParc_edit":"1",
        "groupe_edit":"",
        "representant_edit":"",
        "lieu_habitation_edit":""
    });

    const [prodEdit,setProdEdit] = useState([]);

    const handleChangeEditProd=(event)=>{
      setProducteurEditData({
        ...producteurEditData,
        [event.target.name]:event.target.value
      });
    }

    const handleFileChangeEditPhotoProd=(event)=>{
      setProducteurEditData({
          ...producteurEditData,
          [event.target.name]:event.target.files[0]
      });
    }
  

      const openModalUpdateProd=(code)=>{
        //console.log("Code:", code);
        window.$(`#editProdmodal-${code}`).modal("show");
        axios.get(url+'/producteurs-list-paginate/?prodCode='+code).then((resp)=>{
          
          setProdEdit(resp.data.results[0]);
          
          setProducteurEditData({
            "code":resp.data.results[0].code,
            "section_edit":resp.data.results[0].section?.id,
            "nomComplet_edit":resp.data.results[0].nomComplet,
            "contacts_edit":resp.data.results[0].contacts,
            "nbParc_edit":resp.data.results[0].nbParc,
            "lieu_habitation_edit":resp.data.results[0].lieu_habitation
          })
        }); 
      }

      const submitProdedit=()=>{
        //setErrorM(Validation(producteurEditData));
        if(producteurEditData.nomComplet_edit !="" && producteurEditData.section_edit !="" )
        {
    
          const _formData = new FormData();
          _formData.append('nomComplet',producteurEditData.nomComplet_edit);
          _formData.append('section',producteurEditData.section_edit);
          _formData.append('contacts',producteurEditData.contacts_edit);
          _formData.append('nbParc',producteurEditData.nbParc_edit);
          _formData.append('producteur',prodEdit.code);
          _formData.append('lieu_habitation',producteurEditData.lieu_habitation_edit);
          //console.log(producteurEditData.photo_edit)
          if(producteurEditData.photo_edit != undefined)
          {
            const currentTimeInSeconds = Math.floor(new Date().getTime() / 1000);
            const originalExtension = producteurEditData.photo_edit.name.split('.').pop();
            const newFileName = `${currentTimeInSeconds}_photo_${producteurEditData.nomComplet_edit}.${originalExtension}`;
            const photo = new File([producteurEditData.photo_edit], newFileName, { type: producteurEditData.photo_edit.type });
          _formData.append('photo',photo);
          }

          //console.log(_formData);
    
            Swal.fire({
            title: 'Modification en cours...',
            html: 'Veillez patientez...',
            allowEscapeKey: false,
            allowOutsideClick: false,
            didOpen: () => {
              Swal.showLoading()
            },
            
          });
    
          try {
            axios.post(url+'/coop-producteur-update/',_formData).then((resp)=>{

              Swal.close()
              if(resp.data.bool)
                {
                window.$(`#editProdmodal-${prodEdit.code}`).modal('hide');
                Swal.fire({
                  title: 'FELICITATION !',
                  html: " Modification effectuée avec succès ! ",
                  icon: 'success',
                  showCancelButton: false,
                  confirmButtonColor: '#3085d6',
                  confirmButtonText: 'OK'
                }).then((result) => {
                  if (result.isConfirmed) {
                    axios.get(url+'/producteurs-list-paginate/?coopID='+coopID).then((resp)=>{
                      setnextUrl(resp.data.next);
                      setprevUrl(resp.data.previous)
                      setProdList(resp.data.results);
                      setTotalPages(resp.data.count / resp.data.results.length);
                      setTotalProd(resp.data.count)
                    }); 
                  }
                });
    
                setProducteurEditData({
                  "code":"",
                  "section_edit":"",
                  "nomComplet_edit":"",
                  "contacts_edit":"",
                  "photo_edit":"",
                  "nbParc_edit":"1",
                  "groupe_edit":"",
                  "representant_edit":"",
                  'lieu_habitation_edit':""
                })
    
              setProdEdit([]);

              window.$("#phedit").val('');

              }else{
                Swal.fire({
                  // position: 'top-end',
                  icon: 'error',
                  title: "Oops ! une erreur s'est produite.",
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

      const modalOpenParc=(code)=>{
        window.$(`#addEventModalParc-${code}`).modal("show");
        axios.get(url+'/producteurs-list-paginate/?prodCode='+code).then((resp)=>{
          setProdEdit(resp.data.results[0]);
        }); 

      
      }
  
      const submitParc=()=>{
        setErrorM(Validation(parcelleData));
        if(  parcelleData.superficie !="" )
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
          _formData.append('prodCode',prodEdit.code);
          _formData.append('campagne',campagne);
          // _formData.append('code_certif',parcelleData.code_certif);
    
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
                window.$(`#addEventModalParc-${prodEdit.code}`).modal('hide');
                Swal.fire({
                  title: 'FELICITATION !',
                  html: "La parcelle a bien été enregistrée.Le code est <b>"+resp.data.code+"</b>",
                  icon: 'success',
                  showCancelButton: false,
                  confirmButtonColor: '#3085d6',
                  confirmButtonText: 'OK'
                }).then((result) => {
                  if (result.isConfirmed) {
                    axios.get(url+'/producteurs-list-paginate/?coopID='+coopID).then((resp)=>{
                      setnextUrl(resp.data.next);
                      setprevUrl(resp.data.previous)
                      setProdList(resp.data.results);
                      setTotalPages(resp.data.count / resp.data.results.length);
                      setTotalProd(resp.data.count)
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
                  "acquisition":""
                })

                setProdEdit([]);
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



    const handleChangeParcelle=(event)=>{
      setParcelleData({
          ...parcelleData,
          [event.target.name]:event.target.value
      });
    }

    const [campagne_exp,setCampagne_exp] = useState('');
    const [format_exp,setFormat_exp] = useState('');

    var fileDownload = require('js-file-download');

    const onSubmitExporteData=(e)=>{
      e.preventDefault()
      setLoading(true)
      try {
        axios.get(url+'/export-prod-cooperative/?format='+format_exp+'&campagne='+campagne_exp+'&coopID='+coopID,
          {responseType:'blob'}
        ).then((response)=>{
            if (format_exp ==='PDF'){   
              setLoading(true)           
              fileDownload(response.data,'producteurs.pdf');               
              setTimeout(() => {
                setLoading(false);
                setIsDisabled(true); 
              }, 2000);            
            }else{
              // setIsDisabled(true);
              setLoading(true) 
              fileDownload(response.data,'producteurs.xlsx');
              setTimeout(() => {
                setLoading(false);
                setIsDisabled(true); 
              }, 2000); 
              // setIsDisabled(true);
            }
            // setIsDisabled(true);
        })
      } catch (error) {
        console.error('Erreur lors de l\'export :', error);
      }

    }

    const viewParcelleProd=(code,parcTotal)=>{
      if (parcTotal > 0){
        navigate(`/carte-producteur-parcelle/${code}/`);
      }else{
        Swal.fire({
          title: 'Oops !',
          html: "Aucune parcelle enregistrée pour cet producteur",
          icon: 'error',
          showCancelButton: false,
          confirmButtonColor: '#ff3232',
          confirmButtonText: 'OK'
        })
      }
    }

   



    return (
        <>
    <Content sideID={"cooperatives"} parent={"generalite"}>
            <h2 className="text-bold text-1100 mb-5">{t("Liste des producteurs")} ({totalProd})</h2>
            <div className="mb-5 bg-white p-3 border-2 rounded-2 " >
            <div className="row">
                <div className="col-md-4">
                    <div className="card">
                        {/* <h5 className="card-header bg-info text-white p-2 text-center">
                            Coopérative
                        </h5> */}
                        <div className="card-body p-2">
                            <h5 class="card-title" style={{
                                    backgroundColor: "#fbffe9",
                                    // marginTop: "-15px",
                                    textAlign: "center",
                                    borderRadius: "10px",  
                                    paddingTop: "10px",                             
                                    height: "30px",  
                                    color: "#607929", 
                                    whiteSpace: "nowrap",
                                    fontFamily: "Inter, Helvetica",
                                    fontSize: "18px",
                                    fontWeight: "700",
                                    lineHeight: "normal",                             
                                }}>{t("Coopérative")}</h5>
                                <div className="row">
                                    <div className="row">
                                        <div className="col-xs-3">
                                            <i className="" >
                                                <img src={IconCooperative} width="50" height="50" alt=""/>
                                            </i>
                                        </div>
                                        <div className="col-xs-9" >                                                    
                                          <h3 className="card-title text-end" style={{marginTop: "-35px", fontWeight: "900", fontSize: "1.5rem"}}> <Link to={`/views-coop/${coopID}/`}>{cooperative.nomCoop}</Link> </h3>
                                        </div>
                                    </div>
                                </div>    
                            {/* <h3 className="card-title text-center text-black"><Link to={`/views-coop/${coopID}/`}>{cooperative.nomCoop}</Link></h3> */}
                        </div>
                    </div>
                </div>
                <div className="col-md-4">
                  <div className="card">
                          {/* <h5 className="card-header bg-info text-white p-2 text-center">
                              Section totale
                          </h5> */}
                          <div className="card-body p-2">
                                <h5 class="card-title" style={{
                                    backgroundColor: "#fbffe9",
                                    // marginTop: "-15px",
                                    textAlign: "center",
                                    borderRadius: "10px",  
                                    paddingTop: "10px",                             
                                    height: "30px",  
                                    color: "#607929", 
                                    whiteSpace: "nowrap",
                                    fontFamily: "Inter, Helvetica",
                                    fontSize: "18px",
                                    fontWeight: "700",
                                    lineHeight: "normal",                             
                                }}>{t("Section totale")}</h5>
                                <div className="row">
                                    <div className="row">
                                        <div className="col-xs-3">
                                            <i className="" >
                                                <img src={IconSection} width="50" height="50" alt=""/>
                                            </i>
                                        </div>
                                        <div className="col-xs-9" >                                                    
                                          <h3 className="card-title text-end" style={{marginTop: "-35px", fontWeight: "900", fontSize: "1.5rem"}}> {cooperative.total_sections_coop} </h3>
                                        </div>
                                    </div>
                                </div>    
                              {/* <h3 className= "card-title text-center text-black" >{cooperative.total_sections_coop}</h3> */}
                          </div>
                      </div>
                  </div> 
                  <div className="col-md-4">
                  <div className="card">
                          {/* <h5 className="card-header bg-success text-white p-2 text-center">
                              Nombre de parcelle
                          </h5> */}
                          <div className="card-body p-2">
                          <h5 class="card-title" style={{
                                    backgroundColor: "#fbffe9",
                                    // marginTop: "-15px",
                                    textAlign: "center",
                                    borderRadius: "10px",  
                                    paddingTop: "10px",                             
                                    height: "30px",  
                                    color: "#607929", 
                                    whiteSpace: "nowrap",
                                    fontFamily: "Inter, Helvetica",
                                    fontSize: "18px",
                                    fontWeight: "700",
                                    lineHeight: "normal",                             
                                }}>{t("Nombre de parcelle")}</h5>
                                <div className="row">
                                    <div className="row">
                                        <div className="col-xs-3">
                                            <i className="" >
                                                <img src={IconParcelle} width="50" height="50" alt=""/>
                                            </i>
                                        </div>
                                        <div className="col-xs-9" >                                                    
                                          {cooperative.total_parcelles_coop ? 
                                            <h3 className="card-title text-end" style={{marginTop: "-35px", fontWeight: "900", fontSize: "1.5rem"}}> <Link  to={`/coops/parcelles-list/${coopID}/`}>{cooperative.total_parcelles_coop.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")}</Link> </h3>:
                                            <h3 className="card-title text-end" style={{marginTop: "-35px", fontWeight: "900", fontSize: "1.5rem"}}> <Link  to={`/coops/parcelles-list/${coopID}/`}>0</Link> </h3>  
                                          }
                                        </div>
                                    </div>
                                </div> 
                              {/* <h3 className= "card-title text-center text-black">
                                <Link  to={`/coops/parcelles-list/${coopID}/`}>{cooperative.total_parcelles_coop}</Link>
                              </h3> */}
                          </div>
                      </div>
                  </div> 
            </div> 
            </div>
              <div id="members" >
                <div className="row align-items-center justify-content-between g-3 mb-4">
                  <div className="col col-auto">
                    <div className="search-box">
                      <div className="position-relative" data-bs-toggle="search" data-bs-display="static">
                          <input className="form-control search-input search" type="search" placeholder={t("Recherche un producteur")} aria-label="Search" onChange={onSearchProd} />
                        <span className="fas fa-search search-box-icon"></span>
                      </div>
                    </div>
                  </div>
                  <div className="col-auto">
                    <div className="d-flex align-items-center">
                         <button className="btn btn-link text-900 me-4 px-0" data-bs-toggle="modal" data-bs-target="#exampleModal" ><span className="fa-solid fa-file-export fs--1 me-2"></span>Export</button> 
                        <button className="btn btn-sm" type="button" style={{backgroundColor: "#94a91b", color: "#fff", fontWeight: "bold"}}  onClick={()=>onPenModalProd()}>
                          <span className="fas fa-plus pe-2 fs--2"></span>
                          {t("Ajouter un producteur")}
                        </button>
                    </div>
                  </div>
                </div>
                <div className="mx-n4 mx-lg-n6 px-4 px-lg-6 mb-9 bg-white border-y border-300 mt-2 position-relative top-1">
                  <div className="table-responsive scrollbar ms-n1 ps-1">
                    <table className="table fs--1 mb-0">
                          <thead>
                          <tr className="" style={{backgroundColor: "#EE9F27", color: "#fff", fontWeight: "bold"}}>
                              <th className="white-space-nowrap  align-middle ps-0" >
                              </th>
                              <th className="sort white-space-nowrap align-middle pe-3 ps-0 text-uppercase " scope="col">Photo & Code</th>
                              <th className="sort align-middle pe-6 text-uppercase text-center" scope="col" data-sort="amount" >{t("Nom et prénoms")}</th>
                              <th className="sort align-middle text-center text-uppercase" scope="col" data-sort="stage" >{t("Campagne")}</th>
                              <th className="sort align-middle text-center text-uppercase" scope="col" data-sort="probability" >{t("Nombre Parcelle")}</th>
                              <th className="sort align-middle ps-0 text-center text-uppercase" scope="col" data-sort="date" >{t("Section")}</th>
                              <th className="sort align-middle text-center text-uppercase" scope="col" data-sort="type" >{t("Contact")}</th>
                              <th className="sort align-middle text-center text-uppercase" scope="col" data-sort="type" >{t("Actions")}</th>
                          </tr>
                          </thead>
                          <tbody className="list" id="lead-details-table-body">
                              {prodList.map((prod,index)=>
                                  <tr className="hover-actions-trigger btn-reveal-trigger position-static">
                                  <td className="fs--1 align-middle px-0 py-3">
                                 {/*    <div className="form-check mb-0 fs-0">
                                      <input className="form-check-input" type="checkbox" />
                                    </div> */}
                                  </td>
                                  <td className="name align-middle white-space-nowrap py-2 ps-0">
                                    <span className="d-flex align-items-center text-1000 cursor-pointer" >
                                      <div className="avatar avatar-m me-3 status-online">
                                        {prod.photo ?
                                          <img className="rounded-circle" src={prod.photo} alt="" />
                                          :
                                          <>
                                          <img className="rounded-circle" src={personIcon} alt="" />
                                          </>
                                        }
                                        
                                      </div>
                                      <h6 className="mb-0 text-1000 fw-bold"  onClick={()=>ViewProducteur(prod.code)}>{prod.code}</h6>
                                    </span>
                                  </td>
                                  <td className="description align-middle white-space-nowrap text-center fw-bold text-700 py-2 pe-6">{prod.nomComplet}</td>
                                  <td className="create_date text-end align-middle white-space-nowrap text-900 py-2 text-center">{prod.campagne?.libelle}</td>
                                  <td className="create_by align-middle white-space-nowrap fw-semi-bold text-1000 text-center">{prod.total_parcelle_prod}/{prod.nbParc}</td>
                                  <td className="last_activity align-middle text-center py-2">
                                    <span className="fw-bold fs--1 text-900">{prod.section.libelle}</span>
                                  </td>
                                  <td className="align-middle text-center white-space-nowrap pe-0 action py-2 ">
                                  {prod.contacts}
                                  </td>
                                  <td className="align-middle text-center white-space-nowrap pe-0 action py-2 ">

                                    <button className="btn btn-default btn-sm p-2 mx-1" style={{backgroundColor: "#2ec27e", color: "#fff", fontWeight: "bold"}} onClick={()=>viewParcelleProd(prod.code,prod.total_parcelle_prod)}><i class="fa-sharp fa-solid fa-map-location text-white"></i></button>
                                    <button className="btn btn-default btn-sm p-2 mx-1" style={{backgroundColor: "#000", color: "#fff", fontWeight: "bold"}} onClick={()=>modalOpenParc(prod.code)}><i class="fa-sharp fa-solid fa-plus" style={{"color": "#fff", fontWeight: "bold"}}></i></button>
                                        {/* modal create parcelle */}
                                        <div className="modal fade" id={`addEventModalParc-${prod.code}`} data-bs-backdrop="static" role="dialog" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                                          <div className="modal-dialog modal-md">
                                            <div className="modal-content border">
                                              <div id="addEventForm" autoComplete="off">
                                                <div className="modal-header px-card border-0">
                                                  <div className="w-100 d-flex justify-content-between align-items-start">
                                                    <div>
                                                      <h5 className="mb-0 lh-sm text-1000">{t("Enregistrer une parcelle pour ")}<b className="text-success">{prod.nomComplet}</b></h5>
                                                    </div><button className="btn p-1 fs--2 text-900" type="button" data-bs-dismiss="modal" aria-label="Close">{t("Fermer")} </button>
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
                                                        <label htmlFor="eventLabel" className="pb-2 text-black">{t("Mode d'acquisition de la parcelle")}</label>
                                                    </div>

                                                    

                                                    <div className="form-floating mb-5 col-md-6">
                                                        <select className="form-select" id="categorie" name="annee_acquis" onChange={handleChangeParcelle} value={parcelleData.annee_acquis}>
                                                        <option selected="selected" value="">...</option>
                                                        {anneeLists.map((annee,index)=>
                                                            <option  value={annee}>{annee}</option>
                                                        )}
                                                        </select>
                                                        <label htmlFor="eventLabel" className="pb-2 text-black">{t("Année d'acquisition")}</label>
                                                    </div>
                                                </div>
                                                <div className="row">                                                    
                                                    {/* <div className="form-floating mb-3 col-md-4">
                                                        <select className="form-select" id="categorie" name="certification" onChange={handleChangeParcelle} value={parcelleData.certification}>
                                                        <option selected="selected" value="">...</option>
                                                        {certifications.map((certif,index)=>
                                                            <option  value={certif.id}>{certif.libelle}</option>
                                                        )}
                                                        </select>
                                                        <label htmlFor="eventLabel" className="pb-2 text-black">{t("Certification")}</label>
                                                    </div> */}

                                                  {/* <div className="form-floating mb-3 col-md-4">
                                                      <input className="form-control" id="sigle" type="text" name="code_certif" onChange={handleChangeParcelle} value={parcelleData.code_certif}/>
                                                      
                                                      <label htmlFor="eventTitle" className="pb-2 text-black">Code Certification</label>
                                                    </div> */}

                                                
                                                    {/* <div className="form-floating mb-3 col-md-4">
                                                        <select className="form-select" id="categorie" name="annee_certificat" onChange={handleChangeParcelle} value={parcelleData.annee_certificat}>
                                                        <option selected="selected" value="">...</option>
                                                        {anneeLists.map((annee,index)=>
                                                            <option  value={annee}>{annee}</option>
                                                        )}
                                                        </select>
                                                        <label htmlFor="eventLabel" className="pb-2 text-black">Année de Certification</label>
                                                    </div> */}

                                                </div>

                                                  <div className="row">

                                                    <div className="form-floating mb-3 col-md-6">
                                                      <input className="form-control" id="sigle" type="number" name="superficie" onChange={handleChangeParcelle} value={parcelleData.superficie}/>
                                                      {errors.superficie && <span className="text-danger">{errors.superficie}</span>}
                                                      <label htmlFor="eventTitle" className="pb-2 text-black">{t("Superficie")}</label>
                                                    </div> 
                                                    
                                                    <div className="form-floating mb-3 col-md-6">
                                                        <select className="form-select" id="categorie" name="culture" onChange={handleChangeParcelle} value={parcelleData.culture}>
                                                        <option selected="selected" value="">...</option>
                                                        {cultures.map((culture,index)=>
                                                            <option  value={culture.id}>{culture.libelle}</option>
                                                        )}
                                                        </select>
                                                        {/* {errors.culture && <span className="text-danger">{errors.culture}</span>} */}
                                                        <label htmlFor="eventLabel" className="pb-2 text-black">{t("Culture sur la parcelle")}</label>
                                                    </div>

                                                  </div>

                                                  <div className="position-relative">
                                                      <hr className="bg-200 mt-1" />
                                                      <div className="divider-content-center bg-white">{t("Localisation de la parcelle")}</div>
                                                    </div>

                                                  <div className="form-floating mb-3">
                                                    <input className="form-control" id="sigle" type="text" name="latitude" onChange={handleChangeParcelle} value={parcelleData.latitude}/>
                                                    <label htmlFor="eventTitle" className="pb-2 text-black">{t("Latitude")}</label>
                                                  </div>

                                                
                                                    <div className="form-floating mb-3">
                                                      <input className="form-control" id="chef" type="text" name="longitude" onChange={handleChangeParcelle} value={parcelleData.longitude} />
                                                      <label htmlFor="eventTitle" className="pb-2 text-black">{t("Longitude")}</label>
                                                    </div>
                                                  
                                                  

                                                  {/*  <div className="row">
                                                        <div className="form-floating mb-3 col-md-6">
                                                            <input className="form-control" id="titre" type="number" name="nbParc"  />
                                                            <label htmlFor="eventTitle" className="pb-2 text-black">Nombre de parcelle</label>
                                                        </div>

                                                        <div className="form-floating mb-3 col-md-6">
                                                            <input className="form-control" id="titre" type="text" name="contacts" />
                                                            <label htmlFor="eventTitle" className="pb-2 text-black">Contact</label>
                                                        </div>
                                                    </div> */}
                                                  

                                                  {/* <div className="form-floating mb-3">
                                                    <input className="form-control" id="titre" type="file" name="photo" />
                                                    <label htmlFor="eventTitle" className="pb-2 text-black">Ma photo</label>
                                                  </div> */}
                                                  
                                                  
                                                  </div>
                                                  <div className="modal-footer d-flex justify-content-between align-items-center border-0">
                                                    <button className="btn px-4 form-control" style={{backgroundColor: "#94a91b", color: "#fff", fontWeight: "bold"}} type="button" onClick={submitParc}>{t("Ajouter")}</button>
                                                  </div>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                        <button className="btn btn-default btn-sm p-2 mx-1" style={{backgroundColor: "#94a91b", color: "#fff", fontWeight: "bold"}} onClick={()=>openModalUpdateProd(prod.code)}><i class="fa-solid fa-pencil text-white"></i></button>

                                          <div class="modal fade" id={`editProdmodal-${prod.code}`} tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                                            <div className="modal-dialog modal-md">
                                                    <div className="modal-content border">
                                                    <div id="addEventForm" autoComplete="off">
                                                        <div className="modal-header px-card border-0">
                                                        <div className="w-100 d-flex justify-content-between align-items-start">
                                                            <div>
                                                            <h5 className="mb-0 lh-sm text-1000">{t("Modifier")} {prod.code}</h5>
                                                            </div><button className="btn p-1 fs--2 text-900" type="button" data-bs-dismiss="modal" aria-label="Close">{t("Fermer")} </button>
                                                        </div>
                                                        </div>
                                                        <div className="modal-body p-card py-0">

                                                        <div className="row">
                                                          <div className="form-floating mb-3">
                                                              <input className="form-control text-success" id="sigle" type="text" name="code" value={producteurEditData.code} disabled />
                                                              {errors.code && <span className="text-danger p-0 m-0">{errors.code}</span>}
                                                              <label htmlFor="eventTitle" className="pb-2 text-black">{t("Code du producteur")}</label>
                                                          </div>

                                                            <div className="form-floating mb-5 col-md-12">
                                                                <select className="form-select" id="categorie" name="section_edit" onChange={handleChangeEditProd} value={producteurEditData.section_edit}>
                                                                <option selected="selected" value="">...</option>
                                                                {sectionsList.map((section,index)=>
                                                                    <option value={section.id}>{section.libelle}</option>
                                                                )}
                                                                </select>
                                                                <label htmlFor="eventLabel" className="pb-2 text-black">{t("Section")}</label>
                                                            </div>
                                                        </div>

                                                        <div className="form-floating mb-3">
                                                            <input className="form-control" id="sigle" type="text" name="nomComplet_edit" onChange={handleChangeEditProd} value={producteurEditData.nomComplet_edit} />
                                                            <label htmlFor="eventTitle" className="pb-2 text-black">{t("Nom complet")}</label>
                                                        </div>

                                                        <div className="form-floating mb-3">
                                                            <input className="form-control" id="chef" type="text" name="lieu_habitation_edit"  onChange={handleChangeEditProd} value={producteurEditData.lieu_habitation_edit}/>
                                                            <label htmlFor="eventTitle" className="pb-2 text-black">{t("Lieu d'habitation")}</label>
                                                            </div>
                                                        

                                                            <div className="row">
                                                                <div className="form-floating mb-3 col-md-6">
                                                                    <input className="form-control" id="titre" type="number" name="nbParc_edit"  onChange={handleChangeEditProd} value={producteurEditData.nbParc_edit}/>
                                                                    <label htmlFor="eventTitle" className="pb-2 text-black">{t("Nombre de parcelle")}</label>
                                                                </div>

                                                                <div className="form-floating mb-3 col-md-6">
                                                                    <input className="form-control" id="titre" type="text" name="contacts_edit"  onChange={handleChangeEditProd} value={producteurEditData.contacts_edit}/>
                                                                    <label htmlFor="eventTitle" className="pb-2 text-black">{t("Contact")}</label>
                                                                </div>
                                                            </div>
                                                        

                                                        <div className="form-floating mb-3 row border-top mt-2">
                                                        
                                                            <span className="d-flex align-items-center text-1000 cursor-pointer" >
                                                                    <div className="avatar avatar-m me-3 status-online">
                                                                      {prodEdit.photo ?
                                                                        <img className="rounded-circle" src={prodEdit.photo} alt="" />
                                                                        :
                                                                        <>
                                                                          <img className="rounded-circle" src={personIcon} alt="" /> 
                                                                        </>
                                                                      }
                                                                      
                                                                    </div>
                                                                    
                                                              </span>
                                                          
                                                          <div className="col-md-10">
                                                          <label htmlFor="eventTitle" className="pb-2 text-black">{t("Modifier photo")}</label>
                                                          <input className="form-control" id="phedit" type="file" name="photo_edit" onChange={handleFileChangeEditPhotoProd}/>
                                                            
                                                          </div>
                                                            
                                                            
                                                        </div>
                                                        
                                                        
                                                        </div>
                                                        <div className="modal-footer d-flex justify-content-between align-items-center border-0">
                                                            <button className="btn px-4 form-control" style={{backgroundColor: "#94a91b", color: "#fff", fontWeight: "bold"}} type="button" onClick={submitProdedit}>{t("Modifier le producteur")}</button>
                                                        </div>
                                                    </div>
                                                    </div>
                                                </div>
                                          </div>

                                    {/* <button className="btn btn-default btn-sm p-2 " onClick={()=>onDeleteProd(prod.code,prod.nomComplet)}><i class="fa-solid fa-trash text-danger"></i></button> */}
                                  </td>
                              </tr>
                              )} 
                          </tbody>
            </table>
                  </div>
                  <div className="row align-items-end justify-content-end py-2 pe-0 fs--1">
                    <div className="col-auto d-flex">
                        {prevUrl && (
                          <button className="btn btn-primary btn-sm py-0 " onClick={() => paginationHandler(prevUrl,0)}>{t("Précédent")}</button>
                        )}
                        {t("Page")} {page} {t("sur")} {totalPages}
                        {nextUrl  && (
                          <button className="btn btn-primary btn-sm py-0 " onClick={() => paginationHandler(nextUrl,1)}>{t("Suivant")}</button>
                        )}
                      </div>
                    </div>
                  
                </div>
              </div>

                  
                        

            {/* modal de creation producteur */}
            <div className="modal fade" id="addEventModalProd" data-bs-backdrop="static" role="dialog" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                <div className="modal-dialog modal-md">
                    <div className="modal-content border">
                    <div id="addEventForm" autoComplete="off">
                        <div className="modal-header px-card border-0">
                        <div className="w-100 d-flex justify-content-between align-items-start">
                            <div>
                            <h5 className="mb-0 lh-sm text-1000">{t("Enregistrement d'un producteur")}</h5>
                            </div><button className="btn p-1 fs--2 text-900" type="button" data-bs-dismiss="modal" aria-label="Close">{t("Fermer")} </button>
                        </div>
                        </div>
                        <div className="modal-body p-card py-0">

                        <div className="row">
                        
                          <div className="form-floating mb-3">
                              <input className="form-control" id="sigle" type="text" name="code" onChange={handleChangeProd} value={producteurData.code}/>
                              {/* {errors.code && <span className="text-danger p-0 m-0">{errors.code}</span>} */}
                              <label htmlFor="eventTitle" className="pb-2 text-black">{t("Code du producteur")}</label>
                          </div>

                            <div className="form-floating mb-5 col-md-12">
                                <select className="form-select" id="categorie" name="section" onChange={handleChangeProd} value={producteurData.section}>
                                <option selected="selected" value="">...</option>
                                {sectionsList.map((section,index)=>
                                    <option value={section.id}>{section.libelle}</option>
                                )}
                                </select>
                                {errors.section && <span className="text-danger p-0 m-0">{errors.section}</span>}
                                <label htmlFor="eventLabel" className="pb-2 text-black">{t("Section")}</label>
                            </div>
                        </div>

                        <div className="form-floating mb-3">
                            <input className="form-control" id="sigle" type="text" name="nomComplet" onChange={handleChangeProd} value={producteurData.nomComplet}/>
                            {errors.nomComplet && <span className="text-danger p-0 m-0">{errors.nomComplet}</span>}
                            <label htmlFor="eventTitle" className="pb-2 text-black">{t("Nom complet")}</label>
                        </div>

                        {/*  {producteurData.groupe == "1" && 
                            <div className="form-floating mb-3">
                            <input className="form-control" id="chef" type="text" name="representant"  onChange={handleChangeProd} value={producteurData.representant}/>
                            <label htmlFor="eventTitle" className="pb-2 text-black">Nom complet du representant</label>
                            </div>
                        } */}

                        <div className="form-floating mb-3">
                            <input className="form-control" id="chef" type="text" name="lieu_habitation"  onChange={handleChangeProd} value={producteurData.lieu_habitation}/>
                            <label htmlFor="eventTitle" className="pb-2 text-black">{t("Lieu d'habitation")}</label>
                            </div>
                        

                            <div className="row">
                                <div className="form-floating mb-3 col-md-6">
                                    <input className="form-control" id="titre" type="number" name="nbParc"  onChange={handleChangeProd} value={producteurData.nbParc}/>
                                    <label htmlFor="eventTitle" className="pb-2 text-black">{t("Nombre de parcelle")}</label>
                                </div>

                                <div className="form-floating mb-3 col-md-6">
                                    <input className="form-control" id="titre" type="text" name="contacts"  onChange={handleChangeProd} value={producteurData.contacts}/>
                                    <label htmlFor="eventTitle" className="pb-2 text-black">{t("Contact")}</label>
                                </div>
                            </div>
                        

                        <div className="form-floating mb-3">
                            <input className="form-control" id="titre" type="file" name="photo"  onChange={handleFileChangePhotoProd}/>
                            <label htmlFor="eventTitle" className="pb-2 text-black">{t("Photo")}</label>
                        </div>
                        
                        
                        </div>
                        <div className="modal-footer d-flex justify-content-between align-items-center border-0">
                            <button className="btn px-4 form-control" style={{backgroundColor: "#94a91b", color: "#fff", fontWeight: "bold"}} type="button" onClick={submitProd}>{t("Ajouter")}</button>
                        </div>
                    </div>
                    </div>
                </div>
            </div>

            {/* update modal */}
        {/* exportation modal */}

        <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div class="modal-dialog">
              <div class="modal-content">
                <div class="modal-header">
                  <h6 class="modal-title" id="exampleModalLabel">{t("Exporter la liste")}</h6>
                  <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                  <form 
                    // onSubmit={onSubmitExporteData}                    
                  >
                    <div class="mb-1">
                      <label for="recipient-name" class="col-form-label">{t("Format")}</label>
                      <select className="form-control" name="format_exp" onChange={(e)=>setFormat_exp(e.target.value)}>
                        <option value="" selected disabled>{t("Choisir un format")}</option>
                        <option value="PDF">{t("FORMAT PDF")}</option>
                        <option value="EXCEL">{t("FORMAT EXCEL")}</option>
                      </select>
                    </div>
                    <div class="mb-1">
                      <label for="recipient-name" class="col-form-label">{t("Campagne")}</label>
                      <select className="form-control" name="campagne_exp" onChange={(e)=>setCampagne_exp(e.target.value)}>
                        <option value="" selected>{t("Toutes les campagnes")}</option>
                        {campagneList.map((camp,index)=>
                          <option value={camp.campagne?.id}>{camp.campagne?.libelle}</option>
                        )}
                        
                     </select>
                    </div>
                     <button 
                        //type="submit" 
                        class="btn btn-primary float-end"
                        onClick={onSubmitExporteData}
                        // loading={loading}
                        disabled={loading}
                        style={isDisabled ? styles.buttonDisabled : styles.button}
                      >
                        {loading ? (
                          <span>
                            <i className="fas fa-spinner fa-spin"></i> {t("Téléchanrgement en cours")} ...
                          </span>
                        ) : (
                          <span>
                            <i class="fa fa-cloud-download" aria-hidden="true">{t("Exporter")}</i> {t("Téléchanrgement en cours")}  ...
                          </span>
                      
                        )}
                        {/* Exporter */}
                      </button>
                  </form>
                </div>
                
              </div>
            </div>
          </div>

                    
            </Content>
        </>
    )
}

const styles = {
  container: {
    width: '100vw',
    height: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    padding: '10px 30px',
    cursor: 'pointer',
  },
  buttonDisabled: {
    padding: '10px 30px',
    cursor: 'not-allowed',
  },
};

export default ProdCoopList;