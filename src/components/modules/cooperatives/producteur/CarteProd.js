import React, { useEffect, useRef, useState } from 'react';
import { extractShapes } from '../../utils';
import markerIcon from '../../../assets/marker-icon.png';
import loader from '../../../assets/loading.gif';
import limit_ci from '../../../data/limite_ci.json';

import { 
    Circle,
    FeatureGroup,
    LayerGroup,
    LayersControl,
    MapContainer,
    Marker,
    Popup, Rectangle,
    TileLayer,
    useMap, GeoJSON
} from 'react-leaflet';
import Content from '../../../Content';
import osm from '../../../osm-providers';
import forets from '../../../data/SHAPE.json';
import Shapefile from '../../shapefiles';
import toGeoJSON from 'togeojson';
import L from "leaflet";
import { Icon } from 'leaflet';
import Sidebar from '../../Sidebar';
import NavBar from '../../Navbar';

import agroforest from '../../../data/foret_Agro.json';
import classe from '../../../data/foret_classées.json';
import parc from '../../../data/parcs.json';


import UserContext from '../../../context/useContext';
import axios from 'axios';
import MarkerClusterGroup from 'react-leaflet-cluster';
import { useParams } from 'react-router-dom';

import {useImmerReducer} from "use-immer";
import { LeafletElement } from '@react-leaflet/core';

import BaseUrl from "../../../config/baseUrl";

// const baseUrl = 'http://127.0.0.1:8000/api';
const url = BaseUrl();

function CarteProducteur(){
   /*  constructor() {
        super();
        this.onClickNewYork = this.onClickNewYork.bind(this);
      } */

      const mapRef =useRef();
      const [map, setMap] = useState(null);

      function onClickNewYork(lg,long) {
        mapRef.current.leafletElement.flyTo([lg, long], 15);
      }


    const {prodCode} = useParams();
    const user = UserContext();
    const [allpoints, setAllpoints] = useState([]);
    const [dataIsloading, setDataIsLoading] = useState(false);
    const [activeNav,setActiveNav] = useState('tous');
    const [producteur,setProducteur] = useState([]);

    const center = [5.316667, -4.033333]

    let DefaultIcon = L.icon({
      iconUrl: markerIcon,
      iconSize: [15, 20],
      iconAnchor: [15, 20],
      popupAnchor: [2, -41],
    });

    L.Marker.prototype.options.icon = DefaultIcon;

    useEffect(()=>{
        fetchDataProducteur()
    },[user,map]);

    function fetchDataProducteur(){
        // setDataIsLoading(true);

        try {
            axios.get(url+'/parcelles-list/?prodCode='+prodCode).then((resp)=>{
                // setDataIsLoading(false);
                setAllpoints(resp.data.results);
                setProducteur(resp.data.results[0]?.producteur?.nomComplet);
              })

        } catch (error) {
            console.log(error);
        }
    }

    const OnEachCountry = (country, layer) => {
        const countryName = country.properties.NAME+ ',' +(+country.properties.SUP_HA);
        // const countryName = country.properties.NAME;
        // console.log(countryName);
        layer.bindPopup(countryName);
    
        //layer.options.fillOpacity = Math.random(); //0-1 (0.1, 0.2, 0.3)
        // const colorIndex = Math.floor(Math.random() * this.colors.length);
        // layer.options.fillColor = this.colors[colorIndex]; //0
    
        /* layer.on({
          click: changeCountryColor,
        }); */
      };

      const countryStyle = {
        fillColor: "",
        fillOpacity: 0,
        color: "black",
        weight: 2,
        opacity: 0.5,
        // color: "blue",
        // dashArray: "1",
        // fillOpacity: 0.7
    };
    function ReducerFunction (draft, action) {
        switch(action.type) {
          case "getMap":
              draft.mapInstance = action.mapData;
          break;
        }
    }
    const initialState = {
        mapInstance : null,
        // geodata: null,
        increment: 0
    }

    const [state, dispatch] =useImmerReducer(ReducerFunction, initialState)

    const localisationParc = ()=>{

    }


   

    // if (dataIsloading === true) {
    //     return (
  
    //     <div id="preloader-active bg-white">
    //       <div className="preloader d-flex align-items-center justify-content-center">
    //         <div className="preloader-inner position-relative">
    //           <div className="text-center">
    //               <img src={loader} alt="jobBox" width={100} className='bg-transparent ' style={{marginTop:"50%"}}/> 
    //               <h1 className="text-center text-1100 text-danger-600">AKIDOMPRO MAP LOADING ...</h1>
    //           </div>
    //         </div>
    //       </div>
    //     </div>
    //     );
    //   } 


    return (
        <>
        <main className="main" id="top" style={{backgroundColor: "#EEF1DE"}}>
            <nav className="navbar navbar-vertical navbar-expand-lg" >
            <div className="collapse navbar-collapse mt-5" id="navbarVerticalCollapse">
            <div className="navbar-vertical-content" style={{backgroundColor: "#EEF1DE"}}>
                <ul className="navbar-nav flex-column" id="navbarVerticalNav">              
                    <a className="nav-link fs-1 border-bottom card">
                        <div className="d-flex align-items-left">
                            <span className="" style={{marginLeft: "-15px"}}>{producteur}</span>
                        </div>
                    </a>
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
                            Liste des parcelles ({allpoints.length})
                        </span>
                        </div>
                    </a>
                    <div className="parent-wrapper label-1">
                        <ul className="nav collapse parent show" data-bs-parent="#navbarVerticalCollapse" id="nv-home">
                        {allpoints.map((point,index)=>
                                <li className="nav-item ">
                                <a className={activeNav == point.code ? "nav-link active" : "nav-link"} data-bs-toggle="" aria-expanded="false"
                                    onClick={()=>{
                                        setActiveNav(point.code)
                                        map.flyTo([point.latitude,point.longitude], 15)
                                
                                }}
                                >
                                    <div className="d-flex align-items-center">
                                        <span className="">{point.code}</span>
                                    </div>
                                </a>
                            </li>
                        )}
                        
                        </ul>
                    </div>
                    </div>
                </li>
                </ul>
            </div>
            </div>
        </nav>
        <NavBar />


        <div className="content" >
        <div style={{marginLeft: "-37px", marginTop: "0px",marginRight:"-35px"}}>
       
        <MapContainer
        center={center}
        zoom={6.4}
        style={{ height: '840px', width: '100%'}}
        scrollWheelZoom={true}
        ref={setMap}
        
        >
        <TileLayer
                url={osm.googleMap.url}
                attribution={osm.googleMap.attribution}
            />
            <LayersControl position="topright">
                <LayersControl.Overlay checked name="Agro-foret (Rouge)">
                    <GeoJSON
                        style={{"color":"#FFFF00"}}
                        data={agroforest}
                        onEachFeature={OnEachCountry}
                    />
                </LayersControl.Overlay>

                <LayersControl.Overlay checked name="Foret classée (Vert)">
                    <GeoJSON

                        style={{"color":"#3AF24B"}}
                        data={classe}
                        onEachFeature={OnEachCountry}
                />  
                </LayersControl.Overlay>

                <LayersControl.Overlay checked name="Parc national (Gris)">
                    <GeoJSON

                        style={{"color":"#95A595"}}
                        data={parc}
                        onEachFeature={OnEachCountry}
                />  
                </LayersControl.Overlay>

            
                
            </LayersControl>
            <GeoJSON

                style={countryStyle}
                data={limit_ci}
                //onEachFeature={OnEachCountry}
                />  
            <MarkerClusterGroup chunkedLoading >
                        {allpoints.map((point) => {
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
                        {/* 
                                        <tr>
                                            <th scope="col"><b>SUIVIS</b></th>
                                            <td class="text-uppercase text-center">
                                                <a class="btn btn-default " style={{"padding": "1px 8px 1px 8px"}} href="#" title="voir"  ><i class="fa-solid fa-eye text-primary "></i></a>
                                            </td>
                                        </tr> */}
                                    </tbody>
                                    </table>
                                
                                
                                </Popup>
                            </Marker>
                        )
                        }
                            
                        })}
                    </MarkerClusterGroup> 
               

        </MapContainer>
        {/*<div className="legend" style={{listStyle: null}}>*/}
        {/*    <div style={{float: "left", marginRight: "10px"}}><span className="superawesome" style={{border: "1px", solid: "#ccc", float: "left", width: "40px", height: "22px", margin: "2px", backgroundColor: "#FFFF00"}}></span> <span style={{fontWeight: "bold", fontSize: "20px"}}><i> Agro-Forêt</i></span></div>*/}
        {/*    <div style={{float: "left", marginRight: "10px"}}><span className="awesome" style={{border: "1px", solid: "#ccc", float: "left", width: "40px", height: "22px", margin: "2px", backgroundColor: "#18bd38"}}></span> <span style={{fontWeight: "bold", fontSize: "20px"}}><i> Forêt Classée</i></span></div>*/}
        {/*    <div style={{float: "left", marginRight: "10px"}}><span className="kindaawesome" style={{border: "1px", solid: "#ccc", float: "left", width: "40px", height: "22px", margin: "2px", backgroundColor: "#95A595"}}></span> <span style={{fontWeight: "bold", fontSize: "20px"}}><i> Parc & Réserve</i></span></div>*/}
        {/*    /!*<li style={{float: "left", marginRight: "10px"}}><span className="notawesome" style={{border: "1px", solid: "#ccc", float: "left", width: "12px", height: "12px", margin: "2px", backgroundColor: "#000000"}}></span> Not Awesome</li>*!/*/}
        {/*</div>*/}
        </div>
        </div>
        </main>
        </>
    )

}

export default CarteProducteur;