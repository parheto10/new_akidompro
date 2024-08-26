import axios from "axios";
import moment from "moment";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { useTranslation } from "react-i18next";

import BaseUrl from "../../../../config/baseUrl";

// const baseUrl = 'http://127.0.0.1:8000/api';
const url = BaseUrl();
function MonitoringActivity({parc}){
  const {t} = useTranslation();
  const [monitoringList,setMonitoringList] = useState([]);
  const [detailMonitoringList,setDetailMonitoringList] = useState([]);
  const [plantCode,setPlantCode] = useState(null);
  const [indexI,setIndexI] = useState(null);

  const [TotalDenombre,setTotalDenombre] = useState(null);
  const [TauxReussite,setTauxReussite] = useState(null);
  const [TotalRecus,setTotalRecus] = useState(null);

  useEffect(()=>{

    MonitoringListe(parc);
  },[parc])

  function MonitoringListe(parc){
      try {
        axios.get(url+'/monitoring-list/?parcId='+parc).then((resp)=>{
          setMonitoringList(resp.data);
        })
      } catch (error) {
        console.log(error);
      }
  }

  const DetailPlantModal=(plant,i,den,reu,plt)=>{
    setIndexI(null);
    setPlantCode(null);
    setTotalDenombre(null);
    setTauxReussite(null);
    setTotalRecus(null);


    window.$(`#addEventModalDetailMonitoring${i}`).modal('show');
  setIndexI(i);
    setPlantCode(plant);
    setTotalDenombre(den);
    setTauxReussite(reu);
    setTotalRecus(plt);
    try {
      axios.get(url+'/detail-monitoring-list/?code='+plant).then((resp)=>{
        setDetailMonitoringList(resp.data);
      })
    } catch (error) {
      console.log(error);
    }
}

const DeleteMonitoring=(date,code)=>{
  try {
    Swal.fire({
      title: 'Êtes-vous sûre?',
      html: "Cette action va supprimer le monitoring du <b>"+moment(date).format('Do MMMM yyyy')+"</b> <br/> de la parcelle <b>"+parc+"</b>",
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
          axios.get(url+'/monitoring-list/?parc='+parc+'&code='+code).then((resp)=>{

            MonitoringListe(parc)
            Swal.fire(
              'Supprimé',
              'Monitoring supprimé avec succès',
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


    return ( 
        <>
             <div className="pt-2">
                <div className="border-top border-bottom border-200" id="draftsEmailsTable" >
                  <div className="table-responsive scrollbar mx-n1 px-1">
                  <table className="table fs--1 mb-0">
                        <thead>
                          <tr className="" style={{backgroundColor: "#E6CA83", color: "#fff", fontWeight: "bold"}}>
                            {/*<th className="sort white-space-nowrap align-middle  text-uppercase mr-2 text-center" scope="col"  style={{"width":"10%"}}>Code</th>*/}
                            <th className="sort white-space-nowrap align-middle  text-uppercase mr-2 text-center" scope="col"  style={{"width":"10%"}}>{t("Date")}</th>
                            <th className="sort align-middle pe-3 text-uppercase text-center" scope="col"  style={{"width":"15%"}}>{t("Parcelle")}</th>
                            <th className="sort align-middle pe-3 text-uppercase text-center" scope="col"  style={{"width":"10%"}}>{t("Campagne")}</th>
                            <th className="sort align-middle  text-uppercase text-center" scope="col"  style={{"width":"10%", "min-width":"50px"}}>{t("Taux de réussite")}</th>
                            <th className="sort align-middle pe-0 text-uppercase text-center" scope="col" style={{"width":"25%", "min-width":"100px"}}>{t("Plants Vivants/Plantés")}</th>
                            <th className="sort align-middle pe-0 text-uppercase text-center" scope="col" style={{"width":"15%", "min-width":"100px"}}>{t("Action")}</th>
                          </tr>
                        </thead>
                          <tbody className="list" id="all-email-table-body">
                            {
                            monitoringList.map((moni,index)=>
                            <tr className="hover-actions-trigger btn-reveal-trigger position-static">
                                {/*<td className="subject order align-middle white-space-nowrap py-2 ps-0 text-center">*/}
                                {/*<b>{moni.code}</b>*/}
                                {/*</td>*/}
                                <td className="subject order align-middle white-space-nowrap py-2 ps-0 text-center">
                                {moment(moni.date).format('Do MMMM yyyy')} 
                                </td>
                                <td className="sent align-middle white-space-nowrap  fw-bold text-700 py-2 text-center">{moni.planting?.parcelle?.code}</td>
                                <td className="date align-middle white-space-nowrap text-900 py-2 text-center"><span className="text-primary cursor-pointer">{moni.campagne?.libelle}</span></td>
                                <td className="date align-middle white-space-nowrap text-900 py-2 text-center"><span className={moni.taux_reussite > 50 ? "text-success cursor-pointer " : "text-danger cursor-pointer"}>{moni.taux_reussite} %</span></td>
                                <td className="align-middle white-space-nowrap ps-3 text-center"><b>{moni.sumPlantEspece?.total}/{moni.planting?.plant_recus}</b></td>
                                <td className="status align-middle fw-semi-bold  py-2 text-center">
                                <button className="btn btn-sm p-0" onClick={()=>DetailPlantModal(moni.code,index,moni.sumPlantEspece?.total,moni.taux_reussite,moni.planting?.plant_recus)}><i class="fa-solid fa-eye text-primary "></i></button>
                                  {/* Detail MOnitoring */}

                                  <div class="modal fade" id={`addEventModalDetailMonitoring${index}`} data-bs-backdrop="static" role="dialog" data-bs-keyboard="false" tabindex="-1" aria-labelledby={`staticBackdropLabel${indexI}`} aria-hidden="true">
                                          <div class="modal-dialog modal-md" role="document">
                                              <div>
                                                
                                                  <div class="modal-content border p-3">
                                                <div className="modal-header px-card border-bottom ">
                                                  <div className="w-100 d-flex justify-content-between align-items-start">
                                                    <div>
                                                      <h5 className="mb-0 lh-sm text-1000">{t("Les details du Monitoring")} {moni.code} </h5>
                                                    </div><button className="btn p-1 fs--2 text-900" type="button" data-bs-dismiss="modal" aria-label="Close">Fermer </button>
                                                  </div>
                                                </div>
                                                  <div class="panel-body">
                                                    <div className="row">
                                                        <div className="col-md-4">
                                                            <div className="card">
                                                                <h5 className="card-header bg-primary text-white p-2">
                                                                    {t("Plants Total denombré")}
                                                                </h5>
                                                                <div className="card-body p-2">
                                                                    <h3 className="card-title text-center text-secondary">{TotalDenombre}</h3>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="col-md-4">
                                                        <div className="card">
                                                                <h5 className="card-header bg-success text-white p-2">
                                                                    {t("Taux de reussite")}
                                                                </h5>
                                                                <div className="card-body p-2">
                                                                    <h3 className={TauxReussite > 50 ? "card-title text-center text-success" : "card-title text-center text-danger"}>{TauxReussite} %</h3>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="col-md-4">
                                                            <div className="card">
                                                                <h5 className="card-header bg-info text-white p-2">
                                                                    {t("Plants reçus")}
                                                                </h5>
                                                                <div className="card-body p-2">
                                                                    <h3 className="card-title text-center text-warning">{TotalRecus}</h3>
                                                                </div>
                                                            </div>
                                                        </div>
                                                  </div> 
                                                      {/* <hr style={{"margin": "0px"}} className=""/> */}
                                                      <fieldset>
                                                          <legend class=" mb-2 mt-3 card mr-2 bg-success p-2 text-dark bg-opacity-25" style={{"margin-bottom": "0px"}}>
                                                            {t("Détails Monitoring")}
                                                          </legend>
                                                      <table id="emptbl" class="table table-bordered border-primary ">
                                                          <thead class="table-dark ">
                                                              <tr>
                                                                  <th className="text-center" style={{"width":"45%"}}>{t("Especes")}</th>
                                                                  <th className="text-center" style={{"width":"15%"}}>{t("Plants Vivants")}</th>
                                                                  <th className="text-center" style={{"width":"15%"}}>{t("Taux/Espèce")}</th>
                                                                  <th className="text-center" style={{"width":"15%"}}>{t("Carbone stocké")}</th>
                                                              </tr>
                                                          </thead>
                                                          <tbody>
                                                            
                                                          {
                                                            detailMonitoringList.map((plant,index)=>
                                                                <tr>
                                                                  <td className="text-center">

                                                                    <b>{plant.espece?.libelle}({plant.espece?.accronyme})</b>
                                                                  </td>
                                                                  <td className="text-center">
                                                                    <b className="text-warning">{plant.plant_denombre}</b>
                                                                  </td>

                                                                  <td className="text-center">
                                                                    <b className={plant.taux_reussite > 50 ? "text-success" : "text-danger"}>{plant.taux_reussite} %</b>
                                                                  </td>

                                                                  <td className="text-center">
                                                                    <b className="text-success">0</b>
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
                                <button className="btn btn-sm p-0" onClick={()=>DeleteMonitoring(moni.date,moni.code)}><i className="fa-solid fa-trash text-danger mx-2"></i></button>
                                
                              </td>
                          </tr>
                            )
                            }
                              
                            
                        </tbody> 
                    </table>
                  </div>
                  {/* <div className="row align-items-center justify-content-between py-2 pe-0 fs--1">
                    <div className="col-auto d-flex">
                      <p className="mb-0 d-none d-sm-block me-3 fw-semi-bold text-900" data-list-info="data-list-info"></p><a className="fw-semi-bold" href="#!" data-list-view="*">View all<span className="fas fa-angle-right ms-1" data-fa-transform="down-1"></span></a><a className="fw-semi-bold d-none" href="#!" data-list-view="less">View Less<span className="fas fa-angle-right ms-1" data-fa-transform="down-1"></span></a>
                    </div>
                    <div className="col-auto d-flex"><button className="page-link" data-list-pagination="prev"><span className="fas fa-chevron-left"></span></button>
                      <ul className="mb-0 pagination"></ul><button className="page-link pe-0" data-list-pagination="next"><span className="fas fa-chevron-right"></span></button>
                    </div>
                  </div> */}
                </div>
              </div>


              
        </>
    )
}

export default MonitoringActivity;