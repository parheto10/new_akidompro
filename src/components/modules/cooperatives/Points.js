import React, { Fragment, useEffect, useRef, useState } from 'react';
import NavBar from '../Navbar';
import osm from '../../osm-google-providers'
import limit_ci from '../../data/limite_ci.json'

//Map Icons
import EcoleIcon from '../../assets/img/Mapicons/university.png';
import HopitalIcon from '../../assets/img/Mapicons/hospital.png';
import loader from '../../assets/loading.gif'

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
import L from "leaflet";
import { Icon } from 'leaflet';


import axios from 'axios';
import MarkerClusterGroup from 'react-leaflet-cluster';
import { useParams } from 'react-router-dom';

import {useImmerReducer} from "use-immer";
import { LeafletElement } from '@react-leaflet/core';

import BaseUrl from '../../config/baseUrl';

// const baseUrl = 'http://127.0.0.1:8000/api';
const url = BaseUrl();




function Points() {
    const [points, SetPoints] = useState([]);
    const [totalPoints, setTotalPoints] = useState([]);
    const [dataIsloading, setDataIsLoading] = useState(false);
    const [progress, setProgress] = React.useState(0);  
    const [activeNav,setActiveNav] = useState('tous');
    const center = [5.316667, -4.033333]

    const mapRef =useRef();
      const [map, setMap] = useState(null);

    function onClickNewYork(lg,long) {
        mapRef.current.leafletElement.flyTo([lg, long], 22);
    }

    const ecoleIcon = new Icon({
        iconUrl: EcoleIcon,
        iconSize: [40, 40]  
    });

    const hopitalIcon = new Icon({
        iconUrl: HopitalIcon,
        iconSize: [40, 40]
    });

    const countryStyle = {
        fillColor: "",
        fillOpacity: 0,
        color: "black",
        weight: 2.5,
        opacity: 0.5,
    };

    // console.log(myListings);
    useEffect(() => {
        const source = axios.CancelToken.source();
        async function GetPoints() {
            try {
            const response = await axios
                .get
                (url+"/points/",
                {cancelToken: source.token}
                );
            // console.log(response.data);
            SetPoints(response.data);
            setTotalPoints(response.data.count)
            console.log(response.data);
            setDataIsLoading(false);
            } catch (e) {
                console.log(e.response);
            }
        }
        GetPoints();
         return () => {
            source.cancel();
        }
    }, [])


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
                        <a className={activeNav == 'tous' ? "nav-link active" : "nav-link"} href="#" data-bs-toggle="" aria-expanded="false">
                            <div className="d-flex align-items-center">
                                <span className="" style={{fontWeight: "bold", fontSize: 28}}>TOUS <span className="text-white" style={{backgroundColor: 'red', borderRadius: 15}}>({points.length})</span> </span>
                            </div>
                        </a>  
                        {points.map((point,index)=>
                                <li className="nav-item ">
                                <a className={activeNav == point.code ? "nav-link active" : "nav-link"} data-bs-toggle="" aria-expanded="false"
                                    onClick={()=>{
                                        setActiveNav(point.code)
                                        map.flyTo([point.latitude,point.longitude], 15)
                                
                                }}
                                >
                                    <div className="d-flex align-items-center">
                                        <span className="">{point.libelle}</span>
                                    </div>
                                </a>
                            </li>
                        )}                  
                    </ul>
                </div>
                {/* <div className="parent-wrapper label-1">
                        <ul className="nav collapse parent show" data-bs-parent="#navbarVerticalCollapse" id="nv-home">
                        
                        
                        </ul>
                </div> */}
                </div>
            </nav>
            <NavBar />
            <div className="content" style={{backgroundColor: "#d3d3d7"}}>
                <div style={{marginLeft: "-37px", marginTop: "-35px",marginRight:"-35px"}}>               
                        <MapContainer center={center}
                            zoom={6.4}
                            style={{ height: '840px', width: '100%'}}
                            scrollWheelZoom={true}
                            ref={setMap}
                        >
                            <TileLayer
                                url={osm.googleMap.url}
                                attribution={osm.googleMap.attribution}
                                subdomains={osm.googleMap.subdomains}
                            />
                             <GeoJSON
                                style={countryStyle}
                                data={limit_ci}
                            />  
                            {points.map((point) => {
                              function IconDisplay() {
                                if (point.point_type === 'ECOLE') {
                                    return ecoleIcon;
                                } else if (point.point_type === "HOPITAL") {
                                    return hopitalIcon;
                                }
                              }
                              return (
                                  <Marker
                                      key={point.id}
                                      icon = {IconDisplay()}
                                      position={[
                                        point.latitude,
                                        point.longitude]
                                      }
                                  >
                                  <Popup className="p-4">
                                    <table class="table table-striped table-bordered">
                                    <thead style={{"align-items": "center"}}>                                        
                                        <tr>
                                            <th scope="col" class="center">ID</th>
                                            <th scope="col" class="center">INFORMATIONS</th>
                                        </tr>
                                    </thead>
                                    <tbody style={{"align-items": "center"}}>
                                        <tr>
                                            <th scope="col"><b>SECTION</b></th>
                                            <td class="text-uppercase">
                                                <strong>{point.section?.libelle}</strong>
                                            </td>
                                        </tr>
                                        <tr>
                                            <th scope="col"><b>TYPE</b></th>
                                            <td class="text-uppercase"><strong>{point.point_type}</strong></td>
                                        </tr>
                                        <tr>
                                            <th scope="col"><b>NOM</b></th>
                                            <td class="text-uppercase text-center"><strong>{point.libelle}</strong></td>
                                        </tr>
                                        <tr>
                                            <th scope="col"><b>COORDONNEES</b></th>
                                            <td class="text-uppercase">({point.latitude},{point.longitude})</td>
                                        </tr>
                                        <tr>
                                            <th scope="col"><b>CONTACTS</b></th>
                                            <td class="text-uppercase text-center">{point.contacts}</td>
                                        </tr>                                    
                                    </tbody>
                                    </table>


                                </Popup>

                                  </Marker>
                              )
                          })}
                        </MapContainer>
                </div>
            </div>
        </main>
    </Fragment>
  )
}

export default Points;
