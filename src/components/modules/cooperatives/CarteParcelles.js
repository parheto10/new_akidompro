import React, {Fragment, useEffect, useState} from 'react';
import { extractShapes } from '../utils';
import markerIcon from '../../assets/marker-icon.png';
import loader from '../../assets/loading.gif';
import limit_ci from '../../data/limite_ci.json';

import {
    Circle,
    FeatureGroup,
    LayerGroup,
    LayersControl,
    MapContainer,
    Marker,
    Popup, Rectangle,
    TileLayer,
    useMap, GeoJSON, Tooltip
} from 'react-leaflet';
import Content from '../../Content';
import osm from '../../osm-providers';
import forets from '../../data/SHAPE.json';
import Shapefile from '../shapefiles';
import toGeoJSON from 'togeojson';
import L from "leaflet";
import { Icon } from 'leaflet';
import Sidebar from '../Sidebar';
import NavBar from '../Navbar';

import agroforest from '../../data/foret_Agro.json';
import classe from '../../data/foret_classées.json';
import parc from '../../data/parcs.json';

import Parcelle_Buffer from '../../data/Buffer_AGRIAL.json';
import Risque_Zero from '../../data/risque_zero.json';
import Data_Invalid from '../../data/DATA_INVALIDE.json';
import TAMPON from '../../data/Zone_tampon_Agrial.json';


import UserContext from '../../context/useContext';
import axios from 'axios';
import MarkerClusterGroup from 'react-leaflet-cluster';
import moment from 'moment';
import {useParams} from "react-router-dom";

const baseUrl = "http://127.0.0.1:8000/api";

function CarteParcelle(){
    const user = UserContext();
    const [kmlData, setKMLData] = useState(null);
    const [cooperativeList,setCooperativeList] = useState([]);
    const [prodList,setProdList] = useState([]);
    const [search, setSearch] = useState("");
    const [totalPoint,setTotalPoint] = useState([]);
    const [totalSectPoint,setTotalSectPoint] = useState([]);
    // const {coopID} = useParams();const {coopID} = useParams();
    const [allpoints, setAllpoints] = useState([]);
    const [dataIsloading, setDataIsLoading] = useState(false);
    const [activeNav,setActiveNav] = useState('tous');
    const [idIndex,setIdIndex] = useState({
        'code':'',
        'index':''
    });
    const [plantingList,setPlantingList] = useState([]);
    const [detailPlantingList,setDetailPlantingList] = useState([]);
    const [sectionList,setSectionList] = useState([]);
    const [color, setColor] = useState("#ffff00");

    const center = [5.316667, -4.033333]

    let DefaultIcon = L.icon({
      iconUrl: markerIcon,
      iconSize: [15, 20],
      iconAnchor: [15, 20],
      popupAnchor: [2, -41],
    });

    L.Marker.prototype.options.icon = DefaultIcon;

    useEffect(()=>{
        if(user){
            fetchDataCoop();
        }
    },[user,idIndex]);

    function fetchDataCoop(){
        //setDataIsLoading(true);
        setActiveNav('tous');
        try {
            axios.get(baseUrl+'/cooperative-list/?userID='+user.id).then((resp)=>{
                setCooperativeList(resp.data);
                console.log(resp.data)
                axios.get(baseUrl+'/section-list/?coopID='+resp.data[0].id).then((reponse)=>
                    {
                        setSectionList(reponse.data);
                        console.log(reponse.data)
                    }
                )
            });

            axios.get(baseUrl+'/parcelles-carte/?manager='+user.id).then((resp)=>{
                //setDataIsLoading(false);
                setAllpoints(resp.data.results);
                setTotalPoint(resp.data.count)
                console.log(resp.data)
              })

        } catch (error) {
            console.log(error);
        }
    }

    const handleFileUpload = (e) => {
        setDataIsLoading(true);
        const file = e.target.files[0];
        
        if (file) {
          const reader = new FileReader();
          reader.onload = (event) => {
            const kmlText = event.target.result;
            const kmlDom = new DOMParser().parseFromString(kmlText, 'text/xml');
            const geoJSON = toGeoJSON.kml(kmlDom);
           // console.log(geoJSON)
            setKMLData(geoJSON);
          };
          reader.readAsText(file);
        }
        setDataIsLoading(false);
    };


    const OnEachCountry = (country, layer) => {
        const countryName = country.properties.NAME;
        // const countryName = country.properties.NAME;
        // console.log(countryName);
        layer.bindPopup(countryName);
    
        //layer.options.fillOpacity = Math.random(); //0-1 (0.1, 0.2, 0.3)
        // const colorIndex = Math.floor(Math.random() * this.colors.length);
        // layer.options.fillColor = this.colors[colorIndex]; //0
    
        // layer.on({
        //   click: changeCountryColor,
        // });
    };

    const OnEachCountryBuffer = (country, layer) => {
        const countryName = country.properties.Name;
        // const countryName = country.properties.NAME;
        // console.log(countryName);
        layer.bindPopup(countryName);

        //layer.options.fillOpacity = Math.random(); //0-1 (0.1, 0.2, 0.3)
        // const colorIndex = Math.floor(Math.random() * this.colors.length);
        // layer.options.fillColor = this.colors[colorIndex]; //0

        // layer.on({
        //   click: changeCountryColor,
        // });
    };


    const OnEachCountryTampon = (country, layer) => {
        // const countryName = country.coordinates.NAME;
        const countryName = country.properties.NAME;
        // console.log(countryName);
        layer.bindPopup(countryName);

        //layer.options.fillOpacity = Math.random(); //0-1 (0.1, 0.2, 0.3)
        // const colorIndex = Math.floor(Math.random() * this.colors.length);
        // layer.options.fillColor = this.colors[colorIndex]; //0

        // layer.on({
        //   click: changeCountryColor,
        // });
    };

     const changeCountryColor = (event) => {
        event.target.setStyle({
          color: color,
          // color: "green",
          // fillColor: state.color,
          fillColor: setColor(color),
          fillOpacity: 1,
        });
      };

      const countryStyle = {
        fillColor: "",
        fillOpacity: 0,
        color: "black",
        weight: 2.5,
        opacity: 0.5,
      //   weight: 2,
      // opacity: 1,
      // color: "blue",
      // dashArray: "3",
      // fillOpacity: 0.7
        // color: "blue",
        // dashArray: "1",
        // fillOpacity: 0.7
    };

    const allPointSection=(id,lib)=>{
        setDataIsLoading(true);
        setActiveNav(lib);
        try {
            axios.get(baseUrl+'/parcelles-carte/?sectionID='+id).then((resp)=>{
              setDataIsLoading(false);
              setAllpoints(resp.data.results);
              setTotalSectPoint(resp.data.count)
            })
          } catch (error) {
            console.log(error);
          }
    }




    const voirSuiviofParc=(code,idx)=>{

        //setIdIndex(idx);
        window.$(`#openModalPlanting${idx}`).modal('show');
         try {
            axios.get(baseUrl+'/planting-list/?parcId='+code).then((resp)=>{
                setPlantingList(resp.data);
            });
        } catch (error) {
            console.log(error);
        } 
    }

    const DetailPlantModal=(plant,i)=>{
        setIdIndex({
            'code':plant,
            'index':i
        });
        setDetailPlantingList([]);
        
        window.$(`#addEventModalDetailPlant${i}`).modal('show');

        try {
          axios.get(baseUrl+'/detail-planting-list/?plantCode='+plant).then((resp)=>{
            setDetailPlantingList(resp.data);
          })
        } catch (error) {
          console.log(error);
        }
    }


      if (dataIsloading === true) {
        return (
  
        <div id="preloader-active bg-white">
          <div className="preloader d-flex align-items-center justify-content-center">
            <div className="preloader-inner position-relative">
              <div className="text-center">
                  <img src={loader} alt="jobBox" width={100} className='bg-transparent ' style={{marginTop:"50%"}}/>
                  <h1 className="text-center text-1100 text-danger-600">AKIDOMPRO MAP LOADING ...</h1>
              </div>
            </div>
          </div>
        </div>
        );
      }  


   return (
    <Fragment>
        <main className="main" id="top">
            <nav className="navbar navbar-vertical navbar-expand-lg" >
            <div className="collapse navbar-collapse" id="navbarVerticalCollapse">
            <div className="navbar-vertical-content">
                <ul className="navbar-nav flex-column" id="navbarVerticalNav">
                <a className={activeNav == 'tous' ? "nav-link active" : "nav-link"} href="#" data-bs-toggle="" aria-expanded="false" onClick={()=>fetchDataCoop()}>
                    <div className="d-flex align-items-center">
                        <span className="" style={{fontWeight: "bold", fontSize: 28}}>TOUS <span className="text-white" style={{backgroundColor: 'red', borderRadius: 15}}>({totalPoint})</span> </span>
                    </div>
                </a>
                {cooperativeList.map((cooperative,index)=> 
                    <li className="nav-item" >
                    <div className="nav-item-wrapper">
                    <a className="nav-link dropdown-indicator label-1" href="#nv-home" role="button" data-bs-toggle="collapse" aria-expanded="true" aria-controls="nv-home">
                        <div className="d-flex align-items-center">
                        <div className="dropdown-indicator-icon">
                            <span className="fas fa-caret-right"></span>
                        </div>
                        <span className="nav-link-icon">
                            <span data-feather="pie-chart"></span>
                        </span>
                        <span className="nav-link-text text-1000 text-uppercase">
                            {cooperative.nomCoop} 
                        </span>
                        </div>
                    </a>
                    <div className="parent-wrapper label-1">
                        <ul className="nav collapse parent show" data-bs-parent="#navbarVerticalCollapse" id="nv-home">
                        {sectionList.map((section,index)=>
                                <li className="nav-item ">
                                <a className={activeNav == section.libelle ? "nav-link active" : "nav-link"} data-bs-toggle="" aria-expanded="false" onClick={()=>allPointSection(section.id,section.libelle)}>
                                    <div className="d-flex align-items-center">
                                        <span className="">{section.libelle}</span>
                                    </div>
                                </a>
                            </li>
                        )}
                        
                        </ul>
                    </div>
                    </div>
                </li>
                )} 
                
                
                </ul>
            </div>
            </div>
        </nav>
        <NavBar />


        <div className="content" style={{backgroundColor: "#d3d3d7"}}>
        <div style={{marginLeft: "-37px", marginTop: "-35px",marginRight:"-35px"}}>
        <div className="row">
            <div className="col-sm-8">
                <div className="mb-1">
                    <label className="form-label" htmlFor="customFile">Importer un fichier KML.</label>
                    <input onChange={handleFileUpload} className="form-control" id="customFile" type="file" />
                </div>
            </div>
            <div className="col-sm-4 flex-end-center">
                <label className="form-label" htmlFor="customFile">Trouver un Producteur</label>
                <div className="col col-auto">
                    <div className="search-box">
                      <form>
                          <input className="form-control search-input search" type="text" aria-label="Search"
                                 onChange={(e) => setSearch(e.target.value)}
                                 placeholder="Recherche un producteur........ "
                          />
                          <span className="fas fa-search search-box-icon"></span>
                          {/*<button className="btn btn-default btn-find font-sm">Rechercher</button>*/}
                      </form>
                      {/*<div className="position-relative" data-bs-toggle="search" data-bs-display="static">*/}
                      {/*    <input className="form-control search-input search" type="search" placeholder="Recherche un producteur" aria-label="Search" />*/}
                      {/*  <span className="fas fa-search search-box-icon"></span>*/}
                      {/*</div>*/}
                    </div>
                </div>
                {/*<label className="form-label" htmlFor="customFile">Trouver un Producteur</label>*/}
            </div>
        </div>
        <MapContainer
        center={center}
        zoom={6.4}
        style={{ height: '840px', width: '100%'}}
        scrollWheelZoom={true}
        
        >
        <TileLayer
                url={osm.googleMap.url}
                attribution={osm.googleMap.attribution}
            />
            {/*<LayersControl>*/}
            {/*    <LayersControl.Overlay checked name="Agroforêts">*/}
            {/*        <GeoJSON*/}
            {/*            // style={{"color":"#FFFF00"}}*/}
            {/*            style={{border: "1px", solid: "#ccc", float: "left", width: "40px", height: "22px", margin: "2px", color: "#FFFF00"}}*/}
            {/*            data={agroforest}*/}
            {/*            onEachFeature={OnEachCountry}*/}
            {/*        />*/}
            {/*    </LayersControl.Overlay>*/}

            {/*    <LayersControl.Overlay checked name="Forêts classées">*/}
            {/*        <GeoJSON*/}
            {/*            // style={{"color":"#3AF24B"}}*/}
            {/*            style={{border: "1px", solid: "#ccc", float: "left", width: "40px", height: "22px", margin: "2px", color: "#18bd38"}}*/}
            {/*            data={classe}*/}
            {/*            onEachFeature={OnEachCountry}*/}
            {/*        />*/}
            {/*    </LayersControl.Overlay>*/}

            {/*    <LayersControl.Overlay checked name="Parcs & Réserves nationals">*/}
            {/*        <GeoJSON*/}
            {/*            // style={{"color":"#95A595"}}*/}
            {/*            style={{border: "1px", solid: "#ccc", float: "left", width: "40px", height: "22px", margin: "2px", color: "#95A595"}}*/}
            {/*            data={parc}*/}
            {/*            onEachFeature={OnEachCountry}*/}
            {/*        />*/}

            {/*    </LayersControl.Overlay>*/}

            {/*    <LayersControl.Overlay name="Risque Modéré">*/}
            {/*        <GeoJSON*/}
            {/*            style={{"color":"#D56E1BFF"}}*/}
            {/*            data={Parcelle_Buffer}*/}
            {/*            onEachFeature={OnEachCountryBuffer}*/}
            {/*        />*/}
            {/*    </LayersControl.Overlay>*/}

            {/*    <LayersControl.Overlay name="Risque Zéro">*/}
            {/*        <GeoJSON*/}
            {/*            style={{"color":"#fff"}}*/}
            {/*            data={Risque_Zero}*/}
            {/*            onEachFeature={OnEachCountryBuffer}*/}
            {/*        />*/}
            {/*    </LayersControl.Overlay>*/}

            {/*    <LayersControl.Overlay name="Données Invalides AGRIAL">*/}
            {/*        <GeoJSON*/}
            {/*            style={{"color":"#ee6b6e"}}*/}
            {/*            data={Data_Invalid}*/}
            {/*            onEachFeature={OnEachCountryBuffer}*/}
            {/*        />*/}
            {/*    </LayersControl.Overlay>*/}

            {/*    <LayersControl.Overlay name="Zone tampon à 2 Km">*/}
            {/*        <GeoJSON*/}
            {/*            style={{"color":"#fff"}}*/}
            {/*            data={TAMPON}*/}
            {/*            onEachFeature={OnEachCountryTampon}*/}
            {/*        />*/}
            {/*    </LayersControl.Overlay>*/}

            {/*</LayersControl>*/}
            <GeoJSON

                style={countryStyle}
                data={limit_ci}
                //onEachFeature={OnEachCountry}
                />  
            <MarkerClusterGroup chunkedLoading >
                        {allpoints.filter((point) => {
                            return search.toLowerCase() === ""
                              ? point
                              : point.code.toLowerCase().includes(search) || point.producteur?.nomComplet.toLowerCase().includes(search);
                        }).map((point,index) => {
                        if(point.latitude && point.longitude)
                        {
                            return (
                            <Marker
                                key={point.id}
                                icon = {DefaultIcon}
                                position={[
                                    point.latitude,
                                    point.longitude
                                ]}
                            >
                                <Popup className="p-4">
                                    <table class="table table-striped table-bordered">
                                    <thead style={{"align-items": "center"}}>
                                        {point.code_certif &&
                                        <tr className='bg-success'>
                                            <b className='text-center'>CERTIFIE</b>
                                        </tr>
                                        }
                                        
                                        <tr>
                                            <th scope="col" class="center">ID</th>
                                            <th scope="col" class="center">INFORMATIONS</th>
                                        </tr>
                                    </thead>
                                    <tbody style={{"align-items": "center"}}>
                                        <tr>
                                            <th scope="col"><b>CODE</b></th>
                                            <td class="text-uppercase"><strong>{point.code}</strong></td>
                                        </tr>
                                        <tr>
                                            <th scope="col"><b>PRODUCTEUR</b></th>
                                            <td class="text-uppercase"><strong>{point.producteur?.photo && <img src={point.producteur?.photo} width={30} className='rounded-circle'/> } {point.producteur?.nomComplet}</strong></td>
                                        </tr>
                                        <tr>
                                            <th scope="col"><b>SECTION</b></th>
                                            <td class="text-uppercase text-center"><strong>{point.producteur?.section?.libelle}</strong></td>
                                        </tr>
                                        <tr>
                                            <th scope="col"><b>COORDONNEES</b></th>
                                            <td class="text-uppercase">({point.latitude},{point.longitude})</td>
                                        </tr>
                                        
                                        <tr>
                                            <th scope="col"><b>CULTURE</b></th>
                                            <td class="text-uppercase text-center">{point.culture?.libelle}</td>
                                        </tr>
                                        <tr>
                                            <th scope="col"><b>SUPERFICIE</b></th>
                                            <td class="text-uppercase text-center">{point.superficie} (Ha)</td>
                                        </tr>
                        
                                        <tr>
                                            <th scope="col"><b>SUIVIS</b></th>
                                            <td class="text-uppercase text-center">
                                                <button class="btn btn-default " style={{"padding": "1px 8px 1px 8px"}} title="voir"  onClick={()=>voirSuiviofParc(point.code,index)}><i class="fa-solid fa-eye text-primary "></i></button>
                                                
                                            </td>
                                        </tr>
                                    </tbody>
                                    </table>
                                
                                
                                </Popup>

                                    {/* modal */}
                                    <div class="modal fade" id={`openModalPlanting${index}`} data-bs-backdrop="static" role="dialog" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                                        <div class="modal-dialog modal-md" role="document">
                                        <div class="modal-content">
                                            <div class="modal-header">
                                                <h5 class="modal-title" id="exampleModalLabel">Liste plantings {point?.producteur?.nomComplet}</h5>
                                                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                            </div>
                                            <div class="modal-body">
                                            <div className="tab-pane fade show active" id="tab-mail" role="tabpanel" aria-labelledby="mail-tab">
                                                <div className="border-top border-bottom border-200" id="allEmailsTable" >
                                                    <div className="table-responsive scrollbar mx-n1 px-1">
                                                    <table className="table fs--1 mb-0">
                                                        <thead>
                                                        <tr className="bg-warning">
                                                            <th className="sort white-space-nowrap align-middle  text-uppercase mr-2" scope="col"  style={{"width":"10%"}}>Code</th>
                                                            <th className="sort white-space-nowrap align-middle  text-uppercase mr-2" scope="col"  style={{"width":"10%"}}>Date</th>
                                                            <th className="sort align-middle pe-3 text-uppercase" scope="col"  style={{"width":"15%"}}>Parcelle</th>
                                                            <th className="sort align-middle pe-3 text-uppercase" scope="col"  style={{"width":"10%"}}>Especes</th>
                                                            <th className="sort align-middle  text-uppercase text-center" scope="col"  style={{"width":"10%", "min-width":"50px"}}>Monitoring</th>
                                                            <th className="sort align-middle pe-0 text-uppercase text-center" scope="col" style={{"width":"25%", "min-width":"100px"}}>Total Plantés</th>
                                                            <th className="sort align-middle pe-0 text-uppercase text-center" scope="col" style={{"width":"15%", "min-width":"100px"}}>Action</th>
                                                        </tr>
                                                        </thead>
                                                        <tbody className="list" id="all-email-table-body">
                                                            {
                                                            plantingList.map((planting,index)=>
                                                            <tr className="hover-actions-trigger btn-reveal-trigger position-static">
                                                                <td className="subject order align-middle white-space-nowrap py-2 ps-0 ">
                                                                <b>{planting.code}</b>
                                                                </td>
                                                                <td className="subject order align-middle white-space-nowrap py-2 ps-0 ">
                                                                {moment(planting.date).format('Do MMMM yyyy')}
                                                                </td>
                                                                <td className="sent align-middle white-space-nowrap  fw-bold text-700 py-2">{planting.parcelle?.code}</td>
                                                                <td className="date align-middle white-space-nowrap text-900 py-2 text-center"><span className="text-primary cursor-pointer">{planting.total_espece_plante}</span></td>
                                                                <td className="date align-middle white-space-nowrap text-900 py-2 text-center"><span className="text-success cursor-pointer">{planting.total_monitoring}</span></td>
                                                                <td className="align-middle white-space-nowrap ps-3 text-center"><b>{planting.plant_recus}</b></td>
                                                                <td className="status align-middle fw-semi-bold  py-2 text-center">
                                                                
                                                                <button className="btn btn-sm p-0" onClick={()=>DetailPlantModal(planting.code,index)}><i class="fa-solid fa-eye text-primary "></i></button>
                                                               
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
                                            </div>
                                            <div class="modal-footer">
                                                <button type="button" class="btn btn-danger" data-bs-dismiss="modal">Fermer</button>
                                            </div>
                                            </div>
                                        </div>
                                    </div> 
                            </Marker>
                        )
                        }
                        })}
                    </MarkerClusterGroup> 
                {kmlData && <MarkerClusterGroup chunkedLoading ><GeoJSON data={kmlData}  /></MarkerClusterGroup> }

        </MapContainer>
            {/*<div className="legend" style={{listStyle: null, marginBottom: "10px"}}>*/}
            {/*    <h4 style={{marginTop: "5px"}}>STATUT FONCIER</h4>*/}
            {/*    <div style={{float: "left", marginRight: "10px"}}><span className="superawesome" style={{border: "1px", solid: "#ccc", float: "left", width: "40px", height: "22px", margin: "2px", backgroundColor: "#FFFF00"}}></span> <span style={{fontWeight: "bold", fontSize: "20px"}}><i> Agroforêt</i></span></div>*/}
            {/*    <div style={{float: "left", marginRight: "10px"}}><span className="awesome" style={{border: "1px", solid: "#ccc", float: "left", width: "40px", height: "22px", margin: "2px", backgroundColor: "#18bd38"}}></span> <span style={{fontWeight: "bold", fontSize: "20px"}}><i> Forêt classée</i></span></div>*/}
            {/*    <div style={{float: "left", marginRight: "10px"}}><span className="kindaawesome" style={{border: "1px", solid: "#ccc", float: "left", width: "40px", height: "22px", margin: "2px", backgroundColor: "#95A595"}}></span> <span style={{fontWeight: "bold", fontSize: "20px"}}><i> Parc & réserve</i></span></div>*/}
            {/*    /!*<div style={{float: "left", marginRight: "10px"}}><span className="kindaawesome" style={{border: "1px", solid: "#ccc", float: "left", width: "40px", height: "22px", margin: "2px", backgroundColor: "#a20317"}}></span> <span style={{fontWeight: "bold", fontSize: "20px"}}><i> Risque élevé</i></span></div>*!/*/}
            {/*    /!*<div style={{float: "left", marginRight: "10px"}}><span className="kindaawesome" style={{border: "1px", solid: "#ccc", float: "left", width: "40px", height: "22px", margin: "2px", backgroundColor: "#D56E1B"}}></span> <span style={{fontWeight: "bold", fontSize: "20px"}}><i> Risque modéré</i></span></div>*!/*/}
            {/*    /!*<div style={{float: "left", marginRight: "10px"}}><span className="kindaawesome" style={{border: "1px", solid: "#ccc", float: "left", width: "40px", height: "22px", margin: "2px", backgroundColor: "#fff"}}></span> <span style={{fontWeight: "bold", fontSize: "20px"}}><i> Risque zéro</i></span></div>*!/*/}
            {/*    /!*<div style={{float: "left", marginRight: "10px"}}><span className="kindaawesome" style={{border: "1px", solid: "#ccc", float: "left", width: "40px", height: "22px", margin: "2px", backgroundColor: "#ee6b6e"}}></span> <span style={{fontWeight: "bold", fontSize: "20px"}}><i> Données invalides</i></span></div>*!/*/}
            {/*    /!*<li style={{float: "left", marginRight: "10px"}}><span className="notawesome" style={{border: "1px", solid: "#ccc", float: "left", width: "12px", height: "12px", margin: "2px", backgroundColor: "#000000"}}></span> Not Awesome</li>*!/*/}
            {/*</div>*/}
            {/*<br/>*/}
            {/*<div className="legend" style={{listStyle: null, marginTop: "10px"}}>*/}
            {/*    /!*<div style={{float: "left", marginRight: "10px"}}><span className="superawesome" style={{border: "1px", solid: "#ccc", float: "left", width: "40px", height: "22px", margin: "2px", backgroundColor: "#FFFF00"}}></span> <span style={{fontWeight: "bold", fontSize: "20px"}}><i> Agroforêt</i></span></div>*!/*/}
            {/*    /!*<div style={{float: "left", marginRight: "10px"}}><span className="awesome" style={{border: "1px", solid: "#ccc", float: "left", width: "40px", height: "22px", margin: "2px", backgroundColor: "#18bd38"}}></span> <span style={{fontWeight: "bold", fontSize: "20px"}}><i> Forêt classée</i></span></div>*!/*/}
            {/*    /!*<div style={{float: "left", marginRight: "10px"}}><span className="kindaawesome" style={{border: "1px", solid: "#ccc", float: "left", width: "40px", height: "22px", margin: "2px", backgroundColor: "#95A595"}}></span> <span style={{fontWeight: "bold", fontSize: "20px"}}><i> Parc & réserve</i></span></div>*!/*/}
            {/*    <h4 style={{marginTop: "10px"}}>NIVEAU DE RISQUE</h4>*/}
            {/*    <div style={{float: "left", marginRight: "10px"}}><span className="kindaawesome" style={{*/}
            {/*        border: "1px",*/}
            {/*        solid: "#ccc",*/}
            {/*        float: "left",*/}
            {/*        width: "40px",*/}
            {/*        height: "22px",*/}
            {/*        margin: "2px",*/}
            {/*        backgroundColor: "#ee6b6e"*/}
            {/*    }}></span> <span style={{fontWeight: "bold", fontSize: "20px"}}><i> Données invalides</i></span></div>*/}
            {/*    <div style={{float: "left", marginRight: "10px"}}><span className="kindaawesome" style={{*/}
            {/*        border: "1px",*/}
            {/*        solid: "#ccc",*/}
            {/*        float: "left",*/}
            {/*        width: "40px",*/}
            {/*        height: "22px",*/}
            {/*        margin: "2px",*/}
            {/*        backgroundColor: "#fff"*/}
            {/*    }}></span> <span style={{fontWeight: "bold", fontSize: "20px"}}><i> Risque zéro</i></span></div>*/}
            {/*    <div style={{float: "left", marginRight: "10px"}}><span className="kindaawesome" style={{*/}
            {/*        border: "1px",*/}
            {/*        solid: "#ccc",*/}
            {/*        float: "left",*/}
            {/*        width: "40px",*/}
            {/*        height: "22px",*/}
            {/*        margin: "2px",*/}
            {/*        backgroundColor: "#D56E1B"*/}
            {/*    }}></span> <span style={{fontWeight: "bold", fontSize: "20px"}}><i> Risque modéré</i></span></div>*/}
            {/*    <div style={{float: "left", marginRight: "10px"}}><span className="kindaawesome" style={{*/}
            {/*        border: "1px",*/}
            {/*        solid: "#ccc",*/}
            {/*        float: "left",*/}
            {/*        width: "40px",*/}
            {/*        height: "22px",*/}
            {/*        margin: "2px",*/}
            {/*        backgroundColor: "#a20317"*/}
            {/*    }}></span> <span style={{fontWeight: "bold", fontSize: "20px"}}><i> Risque élevé</i></span></div>*/}
            {/*    /!*<li style={{float: "left", marginRight: "10px"}}><span className="notawesome" style={{border: "1px", solid: "#ccc", float: "left", width: "12px", height: "12px", margin: "2px", backgroundColor: "#000000"}}></span> Not Awesome</li>*!/*/}
            {/*</div>*/}
            {/*<br/>*/}
            {/*<br/>*/}
            {/*<div>*/}
            {/*    <ul style={{marginTop: "-10px"}}>*/}
            {/*        <li>Parcelles à Risque Elevé : Ensemble des parcelles qui chevauchent d'une Forêt classée / Parc &*/}
            {/*            Réserve*/}
            {/*        </li>*/}
            {/*        <li>Parcelles à Risque Modéré : Ensemble des parcelles situé à moins de 2 Km d'une forêt classée /*/}
            {/*            parc & réserve*/}
            {/*        </li>*/}
            {/*        <li>Parcelles à Risque zéro : Ensemble des parcelles situé à plus de 2 Km d'une forêt classée / parc & réserve</li>*/}
            {/*        <li>Données Invalides : Ensemble des parcelles ayant des irrégularités de polygones et de positionnement</li>*/}
            {/*    </ul>*/}
            {/*</div>*/}
        </div>
        </div>
        </main>


 {/* modal detail plant */}
 <div class="modal fade" id={`addEventModalDetailPlant${idIndex.index}`} data-bs-backdrop="static" role="dialog" data-bs-keyboard="false" tabindex="-1" aria-labelledby={`staticBackdropLabel`} aria-hidden="true">
    <div class="modal-dialog modal-md" role="document">
        <div>
        
            <div class="modal-content border p-3">
        <div className="modal-header px-card border-bottom ">
            <div className="w-100 d-flex justify-content-between align-items-start">
            <div>
                <h5 className="mb-0 lh-sm text-1000">Les details du planting {idIndex.code} </h5>
            </div>
            <button className="btn p-2 fs--2 text-900 text-danger" type="button" data-bs-dismiss="modal" aria-label="Close">Fermer </button>
            </div>
        </div>
            <div class="panel-body">
                <fieldset>
                    <legend class=" mb-2 mt-3 card mr-2 bg-success p-2 text-dark bg-opacity-25" style={{"margin-bottom": "0px"}}>
                    Liste epèces plantés

                    </legend>
                <table id="emptbl" class="table table-bordered border-primary ">
                    <thead class="table-dark ">
                        <tr>
                            <th className="text-center" style={{"width":"45%"}}>Espece</th>
                            <th className="text-center" style={{"width":"15%"}}>Plants recus</th>
                            <th className="text-center" style={{"width":"15%"}}>Carbone stocké</th>
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

                        <td  className="text-center">
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
    </Fragment>
   )


}

export default CarteParcelle;