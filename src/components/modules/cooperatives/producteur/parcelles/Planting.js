import axios from "axios";
import moment from "moment";
import { useEffect, useState } from "react";
import Select from "react-select";
import Swal from "sweetalert2";
import { useTranslation } from "react-i18next";

import BaseUrl from "../../../../config/baseUrl";

// const baseUrl = 'http://127.0.0.1:8000/api';
const url = BaseUrl();
function PlantingActitvity({campagneList,parc,especeList}){
    const {t} = useTranslation();
    const [plantCode,setPlantCode] = useState(null);
    const [indexI,setIndexI] = useState(null);
    const [observationList,setObservationList] = useState([]);
    const [causeGroupe,setCauseGroupe] = useState([]);
    const [detailPlantingList,setDetailPlantingList] = useState([]);

    const [especePlantes,setEspecePlantes] = useState([]);
    const [nbrePlantes,setNbrePlantes] = useState([]);

    const [monitoringData,setMonitoringData] = useState({
      "date":"",
      "campagne":""
    });

    const [plantingList,setPlantingList] = useState([]);

    const handleChangeEspecePlantes=(event,i)=>{
      const especeTab = [...especePlantes];
      especeTab[i] = event.target.value;
      setEspecePlantes(especeTab);
    }

    const handleChangePlantDenombre=(event,i)=>{
      const plantTab = [...nbrePlantes]
      plantTab[i] = event.target.value;
      setNbrePlantes(plantTab);
    }

    //console.log(plantingList)

    useEffect(()=>{
      
      try {
        axios.get(url+'/obervation-list/').then((resp)=>{
          setObservationList(resp.data)
        })
      } catch (error) {
        console.log(error)
      }
      plantingListes(parc);
      
    },[campagneList,parc,especeList]);

    function plantingListes(parcID){
      
        axios.get(url+'/planting-list/?parcId='+parcID).then((resp)=>{
          setPlantingList(resp.data);
        })
      
    }

    const OpenModalMonito=(plant,index)=>{
      window.$(`#addEventModalMonito${index}`).modal('show');
        setIndexI(null);
        setPlantCode(null); 
        setEspecePlantes([])
        setNbrePlantes([]);
        setDetailPlantingList([])
        setMonitoringData({
          "campagne":"",
          "date":""
        });

        setIndexI(index);
        setPlantCode(plant);
        try {
          axios.get(url+'/detail-planting-list/?plantCode='+plant).then((resp)=>{
            setDetailPlantingList(resp.data);
          })
        } catch (error) {
          console.log(error);
        }
    }

    const handleChangeMonitoring=(event)=>{
      setMonitoringData({
        ...monitoringData,
        [event.target.name]:event.target.value
      })
    }

    const options = observationList.map((option=>({
      label:`${option.libelle}`,
      value:`${option.id}`
    })));

    const handleChangeCauseGroupe=(selectOption)=>{
      setCauseGroupe(selectOption);
    }

    const submitFormMonitoring=()=>{
      const _formData = new FormData();
      
      if(monitoringData.date !="" && monitoringData.campagne !=""){
          if( especePlantes.length < detailPlantingList.length || especePlantes.includes("")){
            Swal.fire({
              // position: 'top-end',
              icon: 'error',
              title: "Attention ! Veillez choisir une espèce.",
              showConfirmButton: false,
              timer: 3000,
              toast:true,
              position:'top-right',
              timerProgressBar:true
            });
          }else if(nbrePlantes.length < detailPlantingList.length){
            Swal.fire({
              // position: 'top-end',
              icon: 'error',
              title: "Attention ! Vous n'avez pas compté les plants d'une espèce.",
              showConfirmButton: false,
              timer: 3000,
              toast:true,
              position:'top-right',
              timerProgressBar:true
            });
          }
          else
          {
            const causes = causeGroupe.map((option)=>option.value)
            _formData.append("date",monitoringData.date);
            _formData.append("campagne",monitoringData.campagne);
            _formData.append("planting",plantCode);

            Array.from(especePlantes).forEach((item,index)=> {
              _formData.append("especes",item);
            });

            Array.from(detailPlantingList).forEach((item,index)=> {
              _formData.append("plant_recus",item.plants);
            });

            Array.from(nbrePlantes).forEach((item,index)=> {
              if(item ==""){
                item = 0;
              }
              _formData.append("plants",item);
            });

            Array.from(causes).forEach((item,index)=> {
              _formData.append("observations",item);
            });

            console.log(_formData)
            try {
              axios.post(url+'/create-new-monitoring/',_formData).then((resp)=>{
                Swal.fire({
                  // position: 'top-end',
                  icon: 'success',
                  title: "Monitoring effectué avec succès !",
                  showConfirmButton: false,
                  timer: 3000,
                  toast:true,
                  position:'top-right',
                  timerProgressBar:true
                });
                axios.get(url+'/planting-list/?parcId='+parc).then((resp)=>{
                  setPlantingList(resp.data);
                })
                window.$(`#addEventModalMonito${indexI}`).modal('hide');

                setMonitoringData({
                  "campagne":"",
                  "date":""
                });
                setCauseGroupe([])
                setDetailPlantingList([])
                setEspecePlantes([])
                setNbrePlantes([]);
              })
            } catch (error) {
              console.log(error)
            }
          }
      }

    }

    const DetailPlantModal=(plant,i)=>{
        setIndexI(null);
        setPlantCode(null);


        window.$(`#addEventModalDetailPlant${i}`).modal('show');
      setIndexI(i);
        setPlantCode(plant);
        try {
          axios.get(url+'/detail-planting-list/?plantCode='+plant).then((resp)=>{
            setDetailPlantingList(resp.data);
          })
        } catch (error) {
          console.log(error);
        }
    }

    const DeleteDetailPlanting=(code,especes,monitoring)=>{
      try {
        Swal.fire({
          title: 'Êtes-vous sûre?',
          html: "Cette action va supprimer le planting <b>"+code+"</b> <br/> <u>Résumé</u><br/>Espèce plantées : <b>"+especes+"</b> <br/> Monitoring Effectué : <b style='color:green'>"+monitoring+"</b> ",
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
              axios.get(url+'/planting-list/?delete='+code+'&parc='+parc).then((resp)=>{

                plantingListes(parc)
                Swal.fire(
                  'Supprimé',
                  'Planting supprimé avec succès',
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

    const submitFormPlanting=()=>{
      const _formData = new FormData();
      //const plants = nbrePlants.map((option)=>option);
      //console.log(especePlanting);
      if(plantingData.date !="" && plantingData.campagne !="")
      {
  
        if(especePlanting.length == 0)
        {
          Swal.fire({
            // position: 'top-end',
            icon: 'error',
            title: "Désolé ! Aucune espèce choisi.",
            showConfirmButton: false,
            timer: 3000,
            toast:true,
            position:'top-right',
            timerProgressBar:true
          });
        }else if(nbrePlants.length == 0)
        {
          Swal.fire({
            // position: 'top-end',
            icon: 'error',
            title: "Désolé ! Les espèces choisi n'ont aucune valeur.",
            showConfirmButton: false,
            timer: 3000,
            toast:true,
            position:'top-right',
            timerProgressBar:true
          });
        }else if(especePlanting.length > 0 && nbrePlants.length > 0 && !nbrePlants.includes("")){
            //console.log(true)
            _formData.append("date",plantingData.date);
            _formData.append("campagne",plantingData.campagne);
            _formData.append("plant_existant",plantingData.plant_existant);
            _formData.append("parcID",parc);
            _formData.append("note",plantingData.note);
  
            Array.from(especePlanting).forEach((item,index)=> {
              _formData.append("especes",item);
            });
            Array.from(nbrePlants).forEach((item,index)=> {
              _formData.append("plants",item);
            });
  
            try {
              axios.post(url+'/new-planting-save/',_formData).then((resp)=>{
                if(resp.data.bool)
                {
                  Swal.fire({
                    // position: 'top-end',
                    icon: 'success',
                    title: "Planting effectué avec succès !",
                    showConfirmButton: false,
                    timer: 3000,
                    toast:true,
                    position:'top-right',
                    timerProgressBar:true
                  });
  
                  setPlantingData({
                    "campagne":"",
                    "date":"",
                    "note":"",
                    "plant_existant":"0"
                  });
  
                  axios.get(url+'/planting-list/?parcId='+resp.data.parc).then((resp)=>{
                    setPlantingList(resp.data);
                  })
  
                  setChamps([]);
                  setNbrePlants([])
                  setEspecePlanting([]);
                  //window.$("addEventModalPlanting").modal('hide');
                }
              })
            } catch (error) {
              console.log(error);
            }
      
          }else{
            Swal.fire({
              // position: 'top-end',
              icon: 'error',
              title: "Attention! vérifez vos valeurs.",
              showConfirmButton: false,
              timer: 3000,
              toast:true,
              position:'top-right',
              timerProgressBar:true
            });
          }
  
      }
  
  
     
      //console.log(_formData);
  
    }

    const [plantingData,setPlantingData] = useState({
      "date":"",
      "plant_existant":"0",
      "campagne":"",
      "note":""
    });
    const [especePlanting,setEspecePlanting] = useState([]);
    const [nbrePlants,setNbrePlants] = useState([]);
  
    const [errorIdEspece,setErrorIdEspece] = useState('');
    const [errorNbrePlant,setErrorNbrePlant] = useState('');
    const [especeErrorValue,setEspeceErrorValue] = useState(null);


  const [champs,setChamps] = useState([]);
  
  const addChampsPlanting=()=>{
    const addchamps = [...champs,[]]
    setChamps(addchamps)
  }

  const deleteRowChamps=(i)=>{
    
    const deleteData = [...champs];
    
    deleteData.splice(i,1);

    setChamps(deleteData);
    //console.log(champs)
    const especeData = [...especePlanting]
    const plantData = [...nbrePlants]
    especeData.splice(i,1);
    plantData.splice(i,1);
    
    
    setEspecePlanting(especeData);
    setNbrePlants(plantData); 
    setErrorIdEspece('');
  }

  const handleChangeEspecePlanting=(event,i)=>{
    setErrorIdEspece('');
    const newValue = event.target.value;

    setEspeceErrorValue(i);
    if(!especePlanting.includes(newValue)){
      const especeData = [...especePlanting]
      especeData[i] = newValue
      setEspecePlanting(especeData)
    }else{
      setErrorIdEspece('Cette espèce existe deja dans la liste');
    }

  }

  const handleChangeNbrePlant=(event,i)=>{
    const plantData = [...nbrePlants]
      plantData[i] = event.target.value
      
      setNbrePlants(plantData)
  }
  const handleChangePlanting=(event)=>{
    setPlantingData({
      ...plantingData,
      [event.target.name]:event.target.value
    })
  }
    

    return (
        <>
            <div className="tab-pane fade show active" id="tab-mail" role="tabpanel" aria-labelledby="mail-tab">
              <div className="border-top border-bottom border-200" id="allEmailsTable" >
                <div className="table-responsive scrollbar mx-n1 px-1">
                  <table className="table fs--1 mb-0">
                    <thead>
                      <tr className="" style={{backgroundColor: "#E6CA83", color: "#fff", fontWeight: "bold"}}>
                        {/*<th className="sort white-space-nowrap align-middle  text-uppercase mr-2" scope="col"  style={{"width":"10%"}}>Code</th>*/}
                        <th className="sort white-space-nowrap align-middle  text-uppercase mr-2" scope="col"  style={{"width":"10%"}}>{t("Date")}</th>
                        <th className="sort align-middle pe-3 text-uppercase" scope="col"  style={{"width":"15%"}}>{t("Parcelle")}</th>
                        <th className="sort align-middle pe-3 text-uppercase" scope="col"  style={{"width":"10%"}}>{t("Especes")}</th>
                        <th className="sort align-middle  text-uppercase text-center" scope="col"  style={{"width":"10%", "min-width":"50px"}}>Monitoring</th>
                        <th className="sort align-middle pe-0 text-uppercase text-center" scope="col" style={{"width":"25%", "min-width":"100px"}}>{t("Total plantés")}</th>
                        <th className="sort align-middle pe-0 text-uppercase text-center" scope="col" style={{"width":"15%", "min-width":"100px"}}>{t("Action")}</th>
                      </tr>
                    </thead>
                      <tbody className="list text-center" id="all-email-table-body">
                        {
                          plantingList.map((planting,index)=>
                          <tr className="hover-actions-trigger btn-reveal-trigger position-static">
                              {/*<td className="subject order align-middle white-space-nowrap py-2 ps-0 ">*/}
                              {/*<b>{planting.code}</b>*/}
                              {/*</td>*/}
                              <td className="subject order align-center white-space-nowrap py-2 ps-0 ">
                              {moment(planting.date).format('Do MMMM yyyy')}
                              </td>
                              <td className="sent align-center white-space-nowrap  fw-bold text-700 py-2">{planting.parcelle?.code}</td>
                              <td className="date align-center white-space-nowrap text-900 py-2 text-center"><span className="text-primary cursor-pointer">{planting.total_espece_plante}</span></td>
                              <td className="date align-center white-space-nowrap text-900 py-2 text-center"><span className="text-success cursor-pointer">{planting.total_monitoring}</span></td>
                              <td className="align-center white-space-nowrap ps-3 text-center"><b>{planting.plant_recus}</b></td>
                              <td className="status align-center fw-semi-bold  py-2 text-center">
                              <button className="btn btn-sm btn-success py-1 px-1 mx-2" onClick={()=>OpenModalMonito(planting.code,index)}>monitoring</button>
                                 {/* modal create Moni */}
                                  <div class="modal fade" id={`addEventModalMonito${index}`} data-bs-backdrop="static" role="dialog" data-bs-keyboard="false" tabindex="-1" aria-labelledby={`staticBackdropLabel${indexI}`} aria-hidden="true">
                                              <div class="modal-dialog modal-md" role="document">
                                                  <div  >
                                                    
                                                      <div class="modal-content border p-3">
                                                    <div className="modal-header px-card border-bottom">
                                                      <div className="w-100 d-flex justify-content-between align-items-start">
                                                        <div>
                                                          <h5 className="mb-0 lh-sm text-1000">{t("Monitoring du planting")} {planting.code} </h5>
                                                        </div><button className="btn p-1 fs--2 text-900" type="button" data-bs-dismiss="modal" aria-label="Close">Fermer </button>
                                                      </div>
                                                    </div>
                                                      <div class="panel-body">
                                                          <div class="row">
                                                                
                                                                  <div class="col-sm-4 mb-2">
                                                                      <div class="form-group">
                                                                          <label>{t("Date de monitoring")}</label>
                                                                          <input className="form-control" type="date" name="date" onChange={handleChangeMonitoring} value={monitoringData.date}/>
                                                                      </div>
                                                                  </div>
                                                                  <div class="col-sm-4 mb-2">
                                                                      <div class="form-group">
                                                                          <label>{t("Campagne")}</label>
                                                                          <select class="form-control" id="dept" name="campagne" onChange={handleChangeMonitoring} value={monitoringData.campagne}>
                                                                              <option selected value="">-- Select --</option>
                                                                              {campagneList.map((camp,index)=>
                                                                                <option value={camp.id}>{camp.libelle}</option>
                                                                              )}
                                                                          </select>

                                                                      </div>
                                                                  </div>

                                                                  <div class="col-lg-4">
                                                                      
                                                                    <div class="form-group">
                                                                            <label>{t("Causes de mortalité")}</label>
                                                                              <Select isMulti options={options} onChange={handleChangeCauseGroupe}/>
                                                                        </div>
                                                                  </div>
                                                                  
                                                                
                                                              </div>

                                                          
                                                          
                                                          <hr style={{"margin": "0px"}} className=""/>
                                                          <fieldset>
                                                              <legend class="border-top mb-2 mt-3" style={{"margin-bottom": "0px"}}>
                                                                {t("Liste des espèces reçues et plantés")}
                                                              </legend>
                                                          <table id="emptbl" class="table table-bordered border-primary ">
                                                              <thead class="table-dark ">
                                                                  <tr>
                                                                      <th className="text-center" style={{"width":"45%"}}>{t("Espece")}</th>
                                                                      <th className="text-center" style={{"width":"15%"}}>{t("Plants recus")}</th>
                                                                      <th className="text-center">{t("Plants dénombré")}</th>
                                                                  </tr>
                                                              </thead>
                                                              <tbody>
                                                                  {
                                                                    detailPlantingList.map((plant,index)=>
                                                                    <tr >
                                                                    <td >
                                                                      
                                                                        <select class="form-control" name="espece" id="dept" onChange={(e)=>handleChangeEspecePlantes(e,index)} value={especePlantes[index]}>
                                                                        <option selected value="" disabled>-- Select --</option>
                                                                            <option value={plant.espece?.id} >{plant.espece?.libelle}</option>
                                                                        </select> 
                                                                    </td>
                                                                    <td className="text-center"><b className="text-success">{plant.plants}</b></td>
                                                                    <td >
                                                                      <input type="number" class="form-control"  placeholder="Entrer le nombre de plants" name="plants"   onChange={(e)=>handleChangePlantDenombre(e,index)} value={nbrePlantes[index]}/>
                                                                      {nbrePlantes[index] > plant.plants && <span className="text-info">{t("Avertissement ! plants denombré supérieur aux plants recus.")}</span>}
                                                                    </td>
                            
                                                                  
                            
                                                                    </tr>
                                                                    )
                                                                  }
                                                                
                                                              
                                                              </tbody>
                                                          </table>

                                                        
                                                              <button  class="btn btn-sm btn-success" style={{"float": "right"}} onClick={submitFormMonitoring}>{t("Enregistrer Monitoring")}</button>

                                                      </fieldset>
                                                      </div>

                                                  </div>
                                                  </div>
                                              </div>
                                  </div>
                              <button className="btn btn-sm p-0" onClick={()=>DetailPlantModal(planting.code,index)}><i class="fa-solid fa-eye text-primary "></i></button>
                               {/* modal detail plant */}

                                <div class="modal fade" id={`addEventModalDetailPlant${index}`} data-bs-backdrop="static" role="dialog" data-bs-keyboard="false" tabindex="-1" aria-labelledby={`staticBackdropLabel${indexI}`} aria-hidden="true">
                                        <div class="modal-dialog modal-md" role="document">
                                            <div>
                                              
                                                <div class="modal-content border p-3">
                                              <div className="modal-header px-card border-bottom ">
                                                <div className="w-100 d-flex justify-content-between align-items-start">
                                                  <div>
                                                    <h5 className="mb-0 lh-sm text-1000">{t("Les details du planting")} {planting.code} </h5>
                                                  </div><button className="btn p-1 fs--2 text-900" type="button" data-bs-dismiss="modal" aria-label="Close">{t("Fermer")} </button>
                                                </div>
                                              </div>
                                                <div class="panel-body">
                                                {/*  <div className="row">
                                                      <div className="col-md-4">
                                                          <div className="card">
                                                              <h5 className="card-header bg-primary text-white">
                                                                  Total Students
                                                              </h5>
                                                              <div className="card-body">
                                                                  <h3 className="card-title">1</h3>
                                                              </div>
                                                          </div>
                                                      </div>
                                                      <div className="col-md-4">
                                                      <div className="card">
                                                              <h5 className="card-header bg-success text-white">
                                                                  Total Courses
                                                              </h5>
                                                              <div className="card-body">
                                                                  <h3 className="card-title">032</h3>
                                                              </div>
                                                          </div>
                                                      </div>
                                                      <div className="col-md-4">
                                                          <div className="card">
                                                              <h5 className="card-header bg-info text-white">
                                                                  Total Chapters
                                                              </h5>
                                                              <div className="card-body">
                                                                  <h3 className="card-title">12</h3>
                                                              </div>
                                                          </div>
                                                      </div>
                                                </div> */}
                                                    {/* <hr style={{"margin": "0px"}} className=""/> */}
                                                    <fieldset>
                                                        <legend class=" mb-2 mt-3 card mr-2 bg-success p-2 text-dark bg-opacity-25" style={{"margin-bottom": "0px"}}>
                                                          {t("Liste des espèces reçues et plantés")}

                                                        </legend>
                                                    <table id="emptbl" class="table table-bordered border-primary ">
                                                        <thead class="table-dark ">
                                                            <tr>
                                                                <th className="text-center" style={{"width":"45%"}}>{t("Espece")}</th>
                                                                <th className="text-center" style={{"width":"15%"}}>{t("Plants recus")}</th>
                                                                {/*<th className="text-center" style={{"width":"15%"}}>Carbone stocké</th>*/}
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                          
                                                        {
                                                          detailPlantingList.map((plant,index)=>
                                                          <tr >
                                                          <td className="text-center">
                                                            
                                                          <b>{plant.espece?.libelle}({plant.espece?.accronyme})</b>
                                                          </td>
                                                            <td  className="text-center">
                                                              <b className="text-warning">{plant.plants}</b>
                                                            </td>
                                                          </tr>
                                                          )
                                                        }
                      
                                                        
                                                        </tbody>
                                                    </table>

                                                </fieldset>
                                                </div>

                                            </div>
                                            </div>
                                        </div>
                                </div>

                              <button className="btn btn-sm p-0" onClick={()=>DeleteDetailPlanting(planting.code,planting.total_espece_plante,planting.total_monitoring)}><i className="fa-solid fa-trash text-danger mx-2"></i></button>
                              
                            </td>
                        </tr>
                          )
                        }
                    </tbody> 
                  </table>
                </div>
                {/*  <div className="row align-items-center justify-content-between py-2 pe-0 fs--1">
                  <div className="col-auto d-flex">
                    <p className="mb-0 d-none d-sm-block me-3 fw-semi-bold text-900" data-list-info="data-list-info"></p><a className="fw-semi-bold" href="#!" data-list-view="*">View all<span className="fas fa-angle-right ms-1" data-fa-transform="down-1"></span></a><a className="fw-semi-bold d-none" href="#!" data-list-view="less">View Less<span className="fas fa-angle-right ms-1" data-fa-transform="down-1"></span></a>
                  </div>
                  <div className="col-auto d-flex"><button className="page-link" data-list-pagination="prev"><span className="fas fa-chevron-left"></span></button>
                    <ul className="mb-0 pagination"></ul><button className="page-link pe-0" data-list-pagination="next"><span className="fas fa-chevron-right"></span></button>
                  </div>
                </div> */}
              </div>
            </div>


           

             

              {/* modal create planting */}
        <div class="modal fade" id="addEventModalPlanting" data-bs-backdrop="static" role="dialog" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                    <div class="modal-dialog modal-md" role="document">
                        <div id="form" >
                          
                            <div class="modal-content border p-3">
                          <div className="modal-header px-card border-bottom">
                            <div className="w-100 d-flex justify-content-between align-items-start">
                              <div>
                                <h5 className="mb-0 lh-sm text-1000">{t("Faire planting sur la parcelle")} <b>{parc}</b></h5>
                              </div><button className="btn p-1 fs--2 text-900" type="button" data-bs-dismiss="modal" aria-label="Close">{t("Fermer")} </button>
                            </div>
                          </div>
                            <div class="panel-body">
                                <div class="row">
                                      
                                        <div class="col-sm-4 mb-2">
                                            <div class="form-group">
                                                <label>{t("Date de planting")}</label>
                                                <input className="form-control" type="date" name="date" onChange={handleChangePlanting} value={plantingData.date}/>
                                            </div>
                                        </div>
                                        <div class="col-sm-4 mb-2">
                                            <div class="form-group">
                                                <label>{t("Campagne")}</label>
                                                <select class="form-control" id="dept" name="campagne" onChange={handleChangePlanting} value={plantingData.campagne}>
                                                    <option selected value="">-- Select --</option>
                                                    {campagneList.map((camp,index)=>
                                                      <option value={camp.id}>{camp.libelle}</option>
                                                    )}
                                                </select>

                                            </div>
                                        </div>

                                        <div class="col-lg-4">
                                             
                                          <div class="form-group">
                                                  <label>{t("Plants existant sur la parcelle")}</label>
                                                    <input type="number" className="form-control" name="plant_existant" onChange={handleChangePlanting} value={plantingData.plant_existant}/>
                                              </div>
                                        </div>
                                        
                                      
                                    </div>

                                    <div class="col-lg-12">
                                             
                                          <div class="form-group">
                                                    <label>{t("Decrire les plants existants sur la parcelle")}</label>
                                                    <textarea className="form-control" name="note" onChange={handleChangePlanting}></textarea>
                                              </div>
                                        </div>
                                
                                <hr style={{"margin": "0px"}} className=""/>
                                <fieldset>
                                    <legend class="border-top mb-2 mt-3" style={{"margin-bottom": "0px"}}>
                                      {t("Ajouter des especes")}
                                     {/* <button type="button" class="btn btn-sm btn-danger float-end mt-2" onClick={deleteRows}>Retirer</button> */}
                                     <button type="button" class="btn btn-sm btn-info mx-2 float-end mt-2" onClick={errorIdEspece ===""  ? addChampsPlanting: null}>{t("Ajouter")}</button>
                                     </legend>
                                <table id="emptbl" class="table table-bordered border-primary ">
                                    <thead class="table-dark ">
                                        <tr>
                                            <th>{t("Espece")}</th>
                                            <th>{t("Nombres de plants")}</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                      {
                                        champs.map((champ,index)=>
                                        <tr key={index}>
                                        <td >
                                            <select class="form-control" name="espece" id="dept" onChange={(e)=>handleChangeEspecePlanting(e,index)} value={especePlanting[index]}>
                                                <option selected value="" disabled>-- Select --</option>
                                                {especeList.map((espece,index)=>
                                                  <option value={espece.id}>{espece.libelle}</option>
                                                )}
                                            </select>
                                             {index === especeErrorValue && errorIdEspece !=="" && <span className="text-danger" >{errorIdEspece}</span>} 
                                        </td>
                                        <td >
                                          <input type="number" class="form-control"  placeholder="Entrer le nombre de plants" name="plants"   onChange={(e=>handleChangeNbrePlant(e,index))} value={nbrePlants[index]}/>
                                           {index === especeErrorValue && errorNbrePlant !=="" && <span className="text-danger" >{errorNbrePlant}</span>} 
                                        </td>

                                        <td  className="text-center">
                                          <button className="btn btn-danger btn-sm " onClick={()=>deleteRowChamps(index)}>
                                          <svg class="svg-inline--fa fa-trash me-1" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="trash" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" data-fa-i2svg=""><path fill="currentColor" d="M135.2 17.69C140.6 6.848 151.7 0 163.8 0H284.2C296.3 0 307.4 6.848 312.8 17.69L320 32H416C433.7 32 448 46.33 448 64C448 81.67 433.7 96 416 96H32C14.33 96 0 81.67 0 64C0 46.33 14.33 32 32 32H128L135.2 17.69zM394.8 466.1C393.2 492.3 372.3 512 346.9 512H101.1C75.75 512 54.77 492.3 53.19 466.1L31.1 128H416L394.8 466.1z"></path></svg>
                                          </button>
                                        </td>

                                    </tr>
                                        )
                                      }
                                       
                                    </tbody>
                                </table>

                               
                                     <button  class="btn btn-sm btn-success" style={{"float": "right"}} onClick={submitFormPlanting}>{t("Enregistrer Planting")}</button>

                            </fieldset>
                            </div>



                             

                        </div>
                        </div>
                    </div>
        </div>
        </>
    )
}

export default PlantingActitvity;