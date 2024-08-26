import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import Sidebar from "./modules/Sidebar";
import NavBar from "./modules/Navbar";
import UserContext from "./context/useContext";

import BaseUrl from "./config/baseUrl";

// const baseUrl = 'http://127.0.0.1:8000/api';
const url = BaseUrl();
function Content({children,sideID,parent}){
  
    const user = UserContext();
    useEffect(()=>{
        if(user){
            try {
                axios.get(url+'/campagnes-list/?resp='+user?.id+'&open').then((resp)=>{
                    if(resp.data.length > 0){
                        localStorage.setItem('campagne',resp.data[0]?.id);
                    }
                    
                })
            } catch (error) {
                console.log(error);
            }
        }
    },[user]);

    

    return (
       
            <main className="main" id="top">
                <Sidebar sideID={sideID} parent={parent}/>
                <NavBar user={user}/>
                <div className="content">
                    {children}

                    <footer className="footer position-absolute">
                        <div className="row g-0 justify-content-between align-items-center h-100">
                            <div className="col-12 col-sm-auto text-center">
                            <p className="mb-0 mt-2 mt-sm-0 text-900">AKIDOMPRO
                                <span className="d-none d-sm-inline-block"></span>
                                <span className="d-none d-sm-inline-block mx-1">|</span>
                                <br className="d-sm-none" />2023 &copy;<a className="mx-1" href="https://agro-map.com/">Agromap</a> Tous droits réservés
                            </p>
                            </div>
                            <div className="col-12 col-sm-auto text-center">
                            <p className="mb-0 text-600">v1.13.0</p>
                            </div>
                        </div>
                        </footer>
                </div>
            </main>
        

    )
}

export default Content;