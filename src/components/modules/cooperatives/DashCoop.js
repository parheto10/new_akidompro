import { useEffect, useState } from "react";
import Content from "../../Content";
import UserContext from "../../context/useContext";
import Chart from 'react-apexcharts';
import axios from "axios";
import {Link} from "react-router-dom";

import IconProducteur from '../../assets/img/Paysan.png'
import IconParcelle from '../../assets/img/Parcelle.png'
import IconSuperficie from '../../assets/img/Superficie.png'
import IconCO2 from '../../assets/img/IconCO2.png'
import IconSup4Ha from '../../assets/img/Icon4Ha.png'
import IconRisque from '../../assets/img/IconRisque.png'
import IconArbres from '../../assets/img/IconArbres.png'
import IconProduction from '../../assets/img/Production.png'
import { useTranslation } from "react-i18next";



import BaseUrl from "../../config/baseUrl";

// const baseUrl = 'http://127.0.0.1:8000/api';
const url = BaseUrl();
function DashCoop(){
    const {t} = useTranslation();
    const user = UserContext();
    const [cooperative,setCooperative] = useState([]);
    const [sectionProd,setSectionProd] = useState([]);
    const [totalPoint,setTotalPoint] = useState([]);
    const [allpoints, setAllpoints] = useState([]);
    const [sectionStateData,SetSectionStateData] = useState({series: [],labels: []})
    const [risqueStateData,SetRisqueStateData] = useState({series: [],labels: []})

    const [firstChart,setFirstChart] = useState({
      options: { 
        chart: {
          id: "basic-bar"
        },
        xaxis: {
          categories: [1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998, 1999]
        }
      },
      series: [
        {
          name: "series-1",
          data: [30, 40, 45, 50, 49, 60, 70, 91]
        },
        {
          name: "series-2",
          data: [3, 50, 405, 10, 19, 80, 30, 21]
        },
        //on peut creer plusieur series
      ]
    });



    useEffect(()=>{
      if(user && user?.id){
          // console.log(user.id)
        try {
            axios.get(url+'/cooperative-list/?userID='+user.id).then((resp)=>{
            setCooperative(resp.data[0]);
            // console.log(resp.data[0]);

            axios.get(url+'/producteurs-by-section/?cooperative='+resp.data[0]?.id).then((response)=>{
              const states = Object.keys(response.data.dataSection).map(key=> response.data.dataSection[key]);
              // console.log(states)
               SetSectionStateData(
                {
                  series: Object.values(response.data.dataSection),
                  labels: states.map((lab)=>lab.libelle)
                }
              ) 

            });

            // Parcelles Par Risque
            axios.get(url+'/parcelle_by_risque/?cooperative='+resp.data[0]?.id).then((response)=>{
              const states2 = Object.keys(response.data.dataRisque).map(key=> response.data.dataRisque[key]);
              // console.log(states2)
               SetRisqueStateData(
                {
                  series: Object.values(response.data.dataRisque),
                  labels: states2.map((lab)=>lab.libelle)
                }
              )

            });

            axios.get(url+'/parcelles-carte/?manager='+user.id).then((resp)=>{
                //setDataIsLoading(false);
                setAllpoints(resp.data.results);
                setTotalPoint(resp.data.count)
                console.log(resp.data)
              })

          });
        } catch (error) {
          console.log(error);
        }
      }
    },[user]);

    const options3 = {
        colors: ["#607929"],
      // colors: ['#FF9800'],
      xaxis: {
          categories: sectionStateData.labels
      }
    }

    const optionsPlantingEspèce = {
        colors: ["#607929"],
      // colors: ['#FF9800'],
      xaxis: {
          categories: [
              "ACAJOU",
              "CEDRELA",
              "BETE",
              "FRAKE",
              "FRAMIRE",
              "PETIT COLA",
          ]
      }
    }

     const seriePlantingEspèce = [
      {
        colors: ["#607929"],
          name: "Espèce",
          data: [0, 0, 0, 0, 0 , 0]
      },
    ]

    const serie2 = [
      {
        colors: ["#607929"],
          name: "Section",
          data: sectionStateData.series.map((serie)=>serie.prod_num)
      },
    ]

    const seriePlantingSection = [
      {
        colors: ["#607929"],
          name: "Section",
          data: [0, 0, 0, 0, 0 , 0]
      },
    ]

    const seriesPie= [{
        name: "Risque",
        data: risqueStateData.series.map((serie)=>serie.parcelle_num)
    }]

    const optionsPie= {
      colors: ['#93C3EE', '#E5C6A0', '#669DB5', '#94A74A'],
      chart: {
        width: "100%",
        type: 'pie',
      },
      labels: [risqueStateData.labels],
      responsive: [{
        breakpoint: 480,
        options: {
          chart: {
            width: 200
          },
          legend: {
            position: 'bottom'
          }
        }
      }]
    }

    const options4 = {
      // colors: ['#008000'],
      colors: ['#E4C470'],
      //   colors: ['#93C3EE', '#E5C6A0', '#669DB5', '#94A74A'],
    //   colors: ["#d5d5d5"],
        labels: risqueStateData.labels
      // xaxis: {
      //     categories: risqueStateData.labels
      // }
    }
    const labels = risqueStateData.labels
    // const responsive: {
    //     breakpoint: "480",
    //     options: {
    //       chart: {
    //         width: "200",
    //       },
    //       legend: {
    //         position: 'bottom'
    //       }
    //     }
    // }
    const serie4 = [
      {
          colors: ["#f4f4f4"],
          name: "Risque",
          data: risqueStateData.series.map((serie)=>serie.parcelle_num)
      },
    ]
    return (
        <Content sideID={"dash-coop"} parent={""}>
          <h2 className="mt-5">{t("Bienvenue")} | {user?.nom} {user?.prenom} (225) {cooperative.contacts}</h2>
        <div className="mx-n4 px-4 mx-lg-n6 px-lg-6 pt-3 pb-2 border-top border-300">
            <div className="row">
                <div className="col-md-6">
                    <div class="card">                        
                        <div class="card-body" style={{marginBottom : "-20px"}}>
                            <h5 class="card-title" style={{
                                backgroundColor: "#fbffe9",
                                marginTop: "-15px",
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
                            }}>{t("Vue Principale")}</h5>
                            <div className="row">
                                <div className="col-md-6">
                                    <div class="card mb-2">
                                            <div class="card-body" style={{marginBottom: "-20px"}}>
                                                <div className="row">
                                                    <div className="col-xs-3">
                                                        <i className="" >
                                                            <img style={{marginLeft: "-20px", marginTop: "-20px", marginTop: "-20px"}} src={IconProduction} width="50" height="50" alt=""/>
                                                        </i>
                                                    </div>
                                                    <div className="col-xs-9">                                                    
                                                    {cooperative.total_production_coop > 0 
                                                            ? <h2 className="card-title text-end text-primary"
                                                                style={{marginTop: "-50px", fontWeight: "700", fontSize: "1.2rem"}}>
                                                                <h2 style={{
                                                                    color: "#000",                                                                
                                                                    whiteSpace: "nowrap",
                                                                    fontFamily: "Inter, Helvetica",
                                                                    fontSize: "16px",
                                                                    fontWeight: "400",
                                                                    lineHeight: "normal",
                                                                }}>{t("Production")} (Kg)</h2>    
                                                                <Link style={{color: "#000"}}
                                                                    to={`/coops/productions-list/${cooperative.id}`}>
                                                                    {cooperative.total_production_coop.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")} &#160;
                                                                    <i className="fa-solid fa-1x fa-arrow-circle-right"
                                                                    style={{color: "#000"}}></i>
                                                                </Link>
                                                            </h2>
                                                            : <h2 className="card-title text-end text-primary"
                                                                style={{marginTop: "-35px", fontWeight: "900"}}>0</h2>
                                                        }
                                                    </div>
                                                </div>
                                            </div>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div class="card mb-2">
                                            <div class="card-body" style={{marginBottom: "-20px"}}>
                                                <div className="row">
                                                    <div className="col-xs-3">
                                                        <i className="" >
                                                            <img style={{marginLeft: "-20px", marginTop: "-20px", marginTop: "-20px"}} src={IconProducteur} width="50" height="50" alt=""/>
                                                        </i>
                                                    </div>
                                                    <div className="col-xs-9">                                                    
                                                        {cooperative.total_producteurs_coop
                                                            ? <h2 className="card-title text-end text-primary"
                                                                style={{marginTop: "-50px", fontWeight: "700", fontSize: "1.2rem"}}>
                                                                <h2 style={{
                                                                    color: "#000",                                                                
                                                                    whiteSpace: "nowrap",
                                                                    fontFamily: "Inter, Helvetica",
                                                                    fontSize: "16px",
                                                                    fontWeight: "400",
                                                                    lineHeight: "normal",
                                                                }}>{t("Producteurs")}</h2>    
                                                                <Link style={{color: "#000"}}
                                                                    to={`/coops/producteur-list/${cooperative.id}`}>
                                                                        <span style={{
                                                                            color: "#000",                                                                        
                                                                            // textAlign: "right",
                                                                            // whiteSpace: "nowrap",
                                                                            // fontFamily: "Inter, Helvetica",
                                                                            // fontSize: "25px",
                                                                            // fontWeight: "700",
                                                                            // lineHeight: "normal",                                                                       
                                                                            
                                                                        }} 
                                                                        >{cooperative.total_producteurs_coop.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")}</span> &#160;
                                                                    <i className="fa-solid fa-1x fa-arrow-circle-right"
                                                                    style={{color: "#000"}}></i>
                                                                </Link>
                                                            </h2>
                                                            : <h2 className="card-title text-end text-primary"
                                                                style={{marginTop: "-35px", fontWeight: "900"}}>0</h2>
                                                        }
                                                    </div>
                                                </div>
                                            </div>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                <div class="card mb-2">
                                            <div class="card-body" style={{marginBottom: "-20px"}}>
                                                <div className="row">
                                                    <div className="col-xs-3">
                                                        <i className="" >
                                                            <img style={{marginLeft: "-20px", marginTop: "-20px", marginTop: "-20px"}} src={IconParcelle} width="50" height="50" alt=""/>
                                                        </i>
                                                    </div>
                                                    <div className="col-xs-9">                                                    
                                                        {cooperative.total_producteurs_coop
                                                            ? <h2 className="card-title text-end text-primary"
                                                                style={{marginTop: "-50px", fontWeight: "700", fontSize: "1.2rem"}}>
                                                                <h2 style={{
                                                                    color: "#000",                                                                
                                                                    whiteSpace: "nowrap",
                                                                    fontFamily: "Inter, Helvetica",
                                                                    fontSize: "16px",
                                                                    fontWeight: "400",
                                                                    lineHeight: "normal",
                                                                }}>{t("Parcelles")}</h2>    
                                                                <Link style={{color: "#000"}}
                                                                    to={`/coops/parcelles-list/${cooperative.id}`}>
                                                                    {totalPoint.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")} &#160;
                                                                    <i className="fa-solid fa-1x fa-arrow-circle-right"
                                                                    style={{color: "#000"}}></i>
                                                                </Link>
                                                            </h2>
                                                            : <h2 className="card-title text-end text-primary"
                                                                style={{marginTop: "-35px", fontWeight: "900"}}>0</h2>
                                                        }
                                                    </div>
                                                </div>
                                            </div>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                <div class="card mb-2">
                                            <div class="card-body" style={{marginBottom: "-20px"}}>
                                                <div className="row">
                                                    <div className="col-xs-3">
                                                        <i className="" >
                                                            <img style={{marginLeft: "-20px", marginTop: "-20px", marginTop: "-20px"}} src={IconSuperficie} width="50" height="50" alt=""/>
                                                        </i>
                                                    </div>
                                                    <div className="col-xs-9">                                                    
                                                        {cooperative.sumSuperficie?.total > 0
                                                            ? <h2 className="card-title text-end text-primary"
                                                                style={{marginTop: "-50px", fontWeight: "700", fontSize: "1.2rem"}}>
                                                                <h2 style={{
                                                                    color: "#000",                                                                
                                                                    whiteSpace: "nowrap",
                                                                    fontFamily: "Inter, Helvetica",
                                                                    fontSize: "16px",
                                                                    fontWeight: "400",
                                                                    lineHeight: "normal",
                                                                }}>{t("Superficie")}(Ha)</h2>    
                                                                
                                                                <span style={{
                                                                color: "#000",                                                                        
                                                                // textAlign: "right",
                                                                // whiteSpace: "nowrap",
                                                                // fontFamily: "Inter, Helvetica",
                                                                // fontSize: "25px",
                                                                // fontWeight: "700",
                                                                // lineHeight: "normal",                                                                       
                                                                
                                                            }} 
                                                            >{cooperative.sumSuperficie?.total.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, " ")}</span>
                                                                    
                                                            </h2>
                                                            : <h2 className="card-title text-end text-primary"
                                                                style={{marginTop: "-35px", fontWeight: "900"}}>0</h2>
                                                        }
                                                    </div>
                                                </div>
                                            </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-md-6">
                    <div class="card">                        
                        <div class="card-body" style={{marginBottom : "-20px"}}>
                            <h5 class="card-title" style={{
                                backgroundColor: "#fbffe9",
                                marginTop: "-15px",
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
                            }}>{t("CO2 & Conformité RDUE")}</h5>
                            <div className="row">
                                <div className="col-md-6">
                                    <div class="card mb-2">
                                        <div class="card-body" style={{marginBottom: "-20px"}}>
                                            <div className="row">
                                                <div className="col-xs-3">
                                                    <i className="" >
                                                        <img style={{marginLeft: "-20px", marginTop: "-20px", marginTop: "-20px"}} src={IconCO2} width="50" height="50" alt=""/>
                                                        {/* <i className="fa-solid fa-4x fa-smog" style={{color: "#92ACF0", marginLeft: "-20px", marginTop: "-10px"}}></i> */}
                                                    </i>
                                                </div>
                                                <div className="col-xs-9">                                                    
                                                {cooperative.carbonStockeCoop > 0
                                                        ? <h2 className="card-title text-end text-primary"
                                                            style={{marginTop: "-50px", fontWeight: "700", fontSize: "1.2rem"}}>
                                                            <h2 style={{
                                                                color: "#000",                                                                
                                                                whiteSpace: "nowrap",
                                                                fontFamily: "Inter, Helvetica",
                                                                fontSize: "16px",
                                                                fontWeight: "400",
                                                                lineHeight: "normal",
                                                            }}>{t("CO2 éq(T)")}</h2>    
                                                            <span style={{
                                                                color: "#000",                                                                        
                                                                // textAlign: "right",
                                                                // whiteSpace: "nowrap",
                                                                // fontFamily: "Inter, Helvetica",
                                                                // fontSize: "25px",
                                                                // fontWeight: "700",
                                                                // lineHeight: "normal",                                                                       
                                                                
                                                            }} 
                                                            >{cooperative.carbonStockeCoop.toFixed(2)} </span>
                                                        </h2>
                                                        : <h2 className="card-title text-end text-primary"
                                                            style={{marginTop: "-35px", fontWeight: "900"}}>0</h2>
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div class="card mb-2">
                                            <div class="card-body" style={{marginBottom: "-20px"}}>
                                                <div className="row">
                                                    <div className="col-xs-3">
                                                        <i className="" >
                                                            <img style={{marginLeft: "-20px", marginTop: "-20px", marginTop: "-20px"}} src={IconSup4Ha} width="50" height="50" alt=""/>
                                                        </i>
                                                    </div>
                                                    <div className="col-xs-9">                                                    
                                                        {cooperative.total_parcelles_sup_4ha
                                                            ? <h2 className="card-title text-end text-primary"
                                                                style={{marginTop: "-50px", fontWeight: "700", fontSize: "1.2rem"}}>
                                                                <h2 style={{
                                                                    color: "#000",                                                                
                                                                    whiteSpace: "nowrap",
                                                                    fontFamily: "Inter, Helvetica",
                                                                    fontSize: "16px",
                                                                    fontWeight: "400",
                                                                    lineHeight: "normal",
                                                                }}>{t("Parcelles > à (4Ha)")}</h2>    
                                                                <Link style={{color: "#000"}}
                                                                    to={`/coops/parcelles-list-sup-4ha/${cooperative.id}`}>
                                                                    {cooperative.total_parcelles_sup_4ha.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")} &#160;
                                                                    <i className="fa-solid fa-1x fa-arrow-circle-right"
                                                                    style={{color: "#000"}}></i>
                                                                </Link>
                                                            </h2>
                                                            : <h2 className="card-title text-end text-primary"
                                                                style={{marginTop: "-35px", fontWeight: "900"}}>0</h2>
                                                        }
                                                    </div>
                                                </div>
                                            </div>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                <div class="card mb-2">
                                            <div class="card-body" style={{marginBottom: "-20px"}}>
                                                <div className="row">
                                                    <div className="col-xs-3">
                                                        <i className="" >
                                                            <img style={{marginLeft: "-20px", marginTop: "-20px", marginTop: "-20px"}} src={IconArbres} width="50" height="50" alt=""/>
                                                        </i>
                                                    </div>
                                                    <div className="col-xs-9">                                                    
                                                    {cooperative.sumPlantCoop?.total > 0
                                                            ? <h2 className="card-title text-end text-primary"
                                                                style={{marginTop: "-50px", fontWeight: "700", fontSize: "1.2rem"}}>
                                                                <h2 style={{
                                                                    color: "#000",                                                                
                                                                    whiteSpace: "nowrap",
                                                                    fontFamily: "Inter, Helvetica",
                                                                    fontSize: "16px",
                                                                    fontWeight: "400",
                                                                    lineHeight: "normal",
                                                                }}>{t("Arbres plantés")}</h2>   
                                                              
                                                                    <span style={{
                                                                        color: "#000",                                                                        
                                                                        // textAlign: "right",
                                                                        // whiteSpace: "nowrap",
                                                                        // fontFamily: "Inter, Helvetica",
                                                                        // fontSize: "25px",
                                                                        // fontWeight: "700",
                                                                        // lineHeight: "normal",                                                                       
                                                                        
                                                                    }}>
                                                                        {cooperative.sumPlantCoop?.total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")} &#160;
                                                                    </span>
                                                                   
                                                            </h2>
                                                            : <h2 className="card-title text-end text-primary"
                                                                style={{marginTop: "-35px", fontWeight: "900"}}>0</h2>
                                                        }
                                                    </div>
                                                </div>
                                            </div>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                <div class="card mb-2">
                                        <div class="card-body" style={{marginBottom: "-20px"}}>
                                            <div className="row">
                                                <div className="col-xs-3">
                                                    <i className="" >
                                                        <img style={{marginLeft: "-20px", marginTop: "-20px", marginTop: "-20px"}} src={IconRisque} width="50" height="50" alt=""/>
                                                    </i>
                                                </div>
                                                <div className="col-xs-9">                                                    
                                                    {cooperative.total_parcelles_coop_risk_modere
                                                        ? <h2 className="card-title text-end text-primary"
                                                            style={{marginTop: "-50px", fontWeight: "700", fontSize: "1.2rem"}}>
                                                            <h2 style={{
                                                                color: "#000",                                                                
                                                                whiteSpace: "nowrap",
                                                                fontFamily: "Inter, Helvetica",
                                                                fontSize: "16px",
                                                                fontWeight: "400",
                                                                lineHeight: "normal",
                                                            }}>{t("Parcelles à risque")}</h2>    
                                                            <Link style={{color: "#000"}}
                                                                to={`/coops/parcelles-list-modere/${cooperative.id}`}>
                                                                <span style={{
                                                                    color: "#000",                                                                        
                                                                    // textAlign: "right",
                                                                    // whiteSpace: "nowrap",
                                                                    // fontFamily: "Inter, Helvetica",
                                                                    // fontSize: "25px",
                                                                    // fontWeight: "700",
                                                                    // lineHeight: "normal",                                                                       
                                                                    
                                                                }} 
                                                                >{cooperative.total_parcelles_coop_risk_modere.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")}</span> &#160;
                                                                <i className="fa-solid fa-1x fa-arrow-circle-right" style={{color: "#000"}}></i>
                                                            </Link>
                                                        </h2>
                                                        : <h2 className="card-title text-end text-primary"
                                                            style={{marginTop: "-35px", fontWeight: "900"}}>0</h2>
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
          
            <div className="mb-5 bg-opacity-50 border-2 rounded-2">
                {user &&
                    <>
                        <hr/>
                        <div className="row">
                            <div className="col-md-6 col-xs-12">
                                <div className="card text-center mb-3" style={{backgroundColor: "#f4f4f4"}}>                                    
                                    <div className="card-body">  
                                        <h4 class="card-title" style={{
                                            backgroundColor: "#fbffe9",
                                            marginTop: "-15px",
                                            textAlign: "center",
                                            borderRadius: "10px",  
                                            paddingTop: "10px", 
                                            paddingBottom: "10px",                            
                                            height: "30px",  
                                            color: "#607929", 
                                            whiteSpace: "nowrap",
                                            fontFamily: "Inter, Helvetica",
                                            fontSize: "18px",
                                            fontWeight: "700",
                                            lineHeight: "normal",                             
                                        }}>{t("Producteurs / sections")}</h4>                              
                                        <Chart
                                            options={options3}
                                            series={serie2}
                                            type="bar"
                                            width="100%"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="col-6 col-xs-12">
                                <div className="card text-center mb-3" style={{backgroundColor: "#f4f4f4"}}>                                    
                                    <div className="card-body" id="chart">                                     
                                        <h4 class="card-title" style={{
                                            backgroundColor: "#fbffe9",
                                            marginTop: "-15px",
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
                                        }}>{t("Parcelles / risque modéré")}</h4>  
                                        <Chart
                                            options={options4}
                                            series={serie4}
                                            type="bar"
                                            width="100%"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="col-6 col-xs-12">
                                <div className="card text-center mb-3" style={{backgroundColor: "#f4f4f4"}}>                                    
                                    <div className="card-body">
                                        <h4 class="card-title" style={{
                                            backgroundColor: "#fbffe9",
                                            marginTop: "-15px",
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
                                        }}>{t("Parcelles / Sections")}</h4>
                                        <Chart
                                            options={options3}
                                            series={serie2}
                                            type="bar"
                                            width="100%"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="col-6 col-xs-12">
                                <div className="card text-center mb-3" style={{backgroundColor: "#f4f4f4"}}>                                   
                                    <div className="card-body">
                                    <h4 class="card-title" style={{
                                            backgroundColor: "#fbffe9",
                                            marginTop: "-15px",
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
                                        }}>{t("Production / section")}</h4>                                    
                                        <Chart
                                            options={options3}
                                            series={serie2}
                                            type="bar"
                                            width="100%"
                                        />
                                    </div>
                                </div>
                            </div>  

                            <div className="col-6 col-xs-12">
                                <div className="card text-center mb-3" style={{backgroundColor: "#f4f4f4"}}>                                    
                                    <div className="card-body">
                                        <h4 class="card-title" style={{
                                            backgroundColor: "#fbffe9",
                                            marginTop: "-15px",
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
                                        }}>{t("Plantings / sections")}</h4>
                                        <Chart
                                            options={options3}
                                            series={serie2}
                                            type="bar"
                                            width="100%"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="col-6 col-xs-12">
                                <div className="card text-center mb-3" style={{backgroundColor: "#f4f4f4"}}>                                   
                                    <div className="card-body">
                                    <h4 class="card-title" style={{
                                            backgroundColor: "#fbffe9",
                                            marginTop: "-15px",
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
                                        }}>{t("Planting / espece")}</h4>                                    
                                        <Chart
                                            options={options3}
                                            series={serie2}
                                            type="bar"
                                            width="100%"
                                        />
                                    </div>
                                </div>
                            </div>    
                        </div>
                    </>
                }
            </div>
        </div>
        </Content>

    )
}

export default DashCoop;