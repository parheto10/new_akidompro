import { Link } from "react-router-dom";
import UserContext from "../context/useContext";
import {useEffect, useState} from "react";

import IconDashboard from '../assets/img/dashboard.png'
import IconAdminBar from '../assets/img/AdminBar.png'
import IconParcelle from '../assets/img/coopIcon.png'
import IconPlanting from '../assets/img/mapPlanting.png'
import IconRDUE from '../assets/img/MapRdue.png'
import IconEnquetes from '../assets/img/Enquete.png'
import IconCampagne from '../assets/img/campagneIcon.png'
import IconProjet from '../assets/img/projetIcon.png'
import IconAgroforet from '../assets/img/agroforetIcon.png'
import BackgroundImage from '../assets/img/bg-2.jpg'
import { useTranslation } from "react-i18next";



function Sidebar({sideID,parent}){
  const {t} = useTranslation();
  const [cooperatives,setCooperatives] = useState([]);
  const user =  UserContext();

    useEffect(()=>{

    },[user,sideID])


    return(
        <nav className="navbar navbar-vertical navbar-expand-lg" style={{backgroundColor: "#eef1de"}} >
        <div className="collapse navbar-collapse" id="navbarVerticalCollapse" style={{backgroundColor: "#eef1de", backgroundImage: `url(${BackgroundImage})`, backgroundSize: "100%", objectFit: "cover"}}>
          <div className="navbar-vertical-content" style={{backgroundColor: "#eef1de"}}>
            <ul className="navbar-nav flex-column " id="navbarVerticalNav">
                 <li className="nav-item">
                    <p className="navbar-vertical-label logo-text text-center ms-2 d-none d-sm-block mt-5" style={{fontSize: "22px", fontWeight: "700", color: "#94a91b"}}>
                      AKIDOMPRO
                    </p>
                     {/* {
                         user?.is_adg ?
                             <p className="navbar-vertical-label">BIENVENU - {user?.nom} {user?.prenom}</p> :
                             <p className="navbar-vertical-label">MENU {user?.nom}</p>
                     } */}
                     {/* <p className="logo-text text-center ms-2 d-none d-sm-block" style={{fontWeight: 'bolder'}}>
                      
                    </p> */}
                     <hr className="navbar-vertical-line"/>

                     <div className="nav-item-wrapper mt-3">
                        <Link className={sideID == "dash-coop" ? "nav-link label-1 bg-info bg-opacity-25" : "nav-link label-1"} to="/dash-coop/"  role="button" data-bs-toggle="" aria-expanded="false">
                          <div className="d-flex align-items-center">
                            <span className="">
                              <span></span>
                            </span><span className="nav-link-text-wrapper"><span className="nav-link-text" 
                                        style={{
                                          // color: "#94a91b",                                        
                                          // fontFamily: "Inter, Helvetica",
                                          // fontSize: "16px",
                                          // fontWeight: "400",
                                          // lineHeight: "normal", 
                                          color: "#e9a800",                                        
                                          whiteSpace: "nowrap",
                                          fontFamily: "Inter, Helvetica",
                                          fontSize: "17px",
                                          fontWeight: "700",
                                          lineHeight: "normal",
                                        }}>
                                <i className="text-start" style={{marginLeft: "-20px", marginRight: "10px"}}>
                                    <img src={IconDashboard} width="12%" height="100%" alt=""/>
                                </i>{t("Tableau de bord")}</span></span>
                            </div>
                          </Link>
                      </div>
                      <div className="nav-item-wrapper">
                          <div className="d-flex align-items-center mt-3">
                            <span className="">
                              <span></span>
                            </span><span className="nav-link-text-wrapper"><span className="nav-link-text"  style={{
                              marginLeft: "20px",
                              marginRight: "",
                              marginTop: "15px",                              
                              color: "#e9a800",                              
                              fontFamily: 'Inter, Helvetica',
                              fontSize: '18px',
                              fontWeight: "700",
                              lineHeight: "normal",                                                        
                              }}
                            >    
                              {t("ADMINISTRATION")} </span></span>
                            </div>
                      </div>
                      <div className="nav-item-wrapper">
                          {user?.is_adg ?                                        
                              <Link
                                  className={sideID == 'cooperatives' ? "nav-link bg-info bg-opacity-25 active" : "nav-link"}to={`/list-coop/`} data-bs-toggle="" aria-expanded="false">
                                  <div className="d-flex align-items-center"><span
                                      className="nav-link-text" style={{
                                        color: "#94a91b",                                        
                                        fontFamily: "Inter, Helvetica",
                                        fontSize: "16px",
                                        fontWeight: "400",
                                        lineHeight: "normal", 
                                      }}>
                                        <i className="text-start" style={{marginLeft: "-20px", marginRight: "10px"}}>
                                            <img src={IconParcelle} width="30%" height="100%" alt=""/>
                                        </i> {t("Profil")} 
                                        {/* Profil */}
                                      </span>
                                    </div>
                              </Link>
                              :
                              <Link
                                  className={sideID == 'cooperatives' ? "nav-link bg-info bg-opacity-25 active" : "nav-link"}to={`/list-coop/`} data-bs-toggle="" aria-expanded="false">
                                  <div className="d-flex align-items-center"><span
                                      className="nav-link-text" style={{
                                        color: "#94a91b",                                        
                                        fontFamily: "Inter, Helvetica",
                                        fontSize: "16px",
                                        fontWeight: "400",
                                        lineHeight: "normal", 
                                      }}>
                                        <i className="text-start" style={{marginLeft: "-20px", marginRight: "10px"}}>
                                            <img src={IconParcelle} width="30%" height="100%" alt=""/>
                                        </i>
                                        {t("Coopératives")}
                                        {/* Coopératives   */}
                                        </span></div>
                              </Link>
                            }
                      </div>

                      <div className="nav-item-wrapper">
                          <Link target='_blank' className="nav-link" to="/carte-parcelles/" data-bs-toggle="" aria-expanded="false">
                                <div className="d-flex align-items-center"><span className="nav-link-text" style={{
                                        color: "#94a91b",                                        
                                        fontFamily: "Inter, Helvetica",
                                        fontSize: "16px",
                                        fontWeight: "400",
                                        lineHeight: "normal", 
                                      }}>
                                <i className="text-start" style={{marginLeft: "-20px", marginRight: "10px"}}>
                                    <img src={IconPlanting} width="12%" height="100%" alt=""/>
                                </i> {t("Géoportail planting")}
                                  {/* Géoportail planting */}
                                  </span></div>
                            </Link>
                      </div>
                      {/* {user && user?.id === 8 ? 
                        <div className="nav-item-wrapper">
                            <Link target='_blank' className="nav-link" to="/points/" data-bs-toggle="" aria-expanded="false">
                                <div className="d-flex align-items-center"><span className="nav-link-text" style={{
                                          color: "#94a91b",                                        
                                          fontFamily: "Inter, Helvetica",
                                          fontSize: "16px",
                                          fontWeight: "400",
                                          lineHeight: "normal", 
                                        }}>
                                <i className="text-start" style={{marginLeft: "-20px", marginRight: "10px"}}>
                                    <img src={IconPlanting} width="15%" height="100%" alt=""/>
                                </i>
                                  Points d'intérêt</span></div>
                            </Link>
                        </div> : ""
                      }   */}

                      {/* <div className="nav-item-wrapper">
                          <Link className="nav-link" to="" data-bs-toggle="" aria-expanded="false">
                              <div className="d-flex align-items-center"><span className="nav-link-text" style={{
                                        color: "#94a91b",                                        
                                        fontFamily: "Inter, Helvetica",
                                        fontSize: "16px",
                                        fontWeight: "400",
                                        lineHeight: "normal", 
                                      }}>
                              <i className="text-start" style={{marginLeft: "-25px", marginRight: "10px"}}>
                                  <img src={IconEnquetes} width="30%" height="100%" alt=""/>
                              </i>
                                Enquêtes</span></div>
                          </Link>
                      </div>                    */}
                  </li>

                      <div className="nav-item-wrapper">
                          <div className="d-flex align-items-center mt-3">
                            <span className="">
                              <span></span>
                            </span><span className="nav-link-text-wrapper"><span className="nav-link-text"  style={{
                              marginLeft: "20px",
                              marginRight: "",
                              marginTop: "15px",                              
                              color: "#e9a800",                              
                              fontFamily: 'Inter, Helvetica',
                              fontSize: '18px',
                              fontWeight: "700",
                              lineHeight: "normal",                                                        
                              }}
                            > {t("RDUE")}   
                              {/* RDUE  */}
                              </span></span>
                          </div>
                      </div>
                      <div className="nav-item-wrapper">
                          <Link target='_blank' className="nav-link" to="/carte-coops/" data-bs-toggle="" aria-expanded="false">
                              <div className="d-flex align-items-center"><span className="nav-link-text" style={{
                                        color: "#94a91b",                                        
                                        fontFamily: "Inter, Helvetica",
                                        fontSize: "16px",
                                        fontWeight: "400",
                                        lineHeight: "normal", 
                                      }}>
                              <i className="text-start" style={{marginLeft: "-20px", marginRight: "10px"}}>
                                  <img src={IconRDUE} width="15%" height="100%" alt=""/>
                              </i> {t("Géoportail RDUE")}
                              {/* Géoportail RDUE */}
                                </span></div>
                          </Link>
                      </div>    

                      <div className="nav-item-wrapper">
                          <Link target='_blank' className="nav-link" to="/analyseAGRIAL/" data-bs-toggle="" aria-expanded="false">
                              <div className="d-flex align-items-center"><span className="nav-link-text" style={{
                                        color: "#94a91b",                                        
                                        fontFamily: "Inter, Helvetica",
                                        fontSize: "16px",
                                        fontWeight: "400",
                                        lineHeight: "normal", 
                                      }}>
                              <i className="text-start" style={{marginLeft: "-20px", marginRight: "10px"}}>
                                  <img src={IconRDUE} width="15%" height="100%" alt=""/>
                              </i>
                                Rapport d'analyse</span></div>
                          </Link>
                      </div>

                      <div className="nav-item-wrapper">
                          <div className="d-flex align-items-center mt-3">
                            <span className="">
                              <span></span>
                            </span><span className="nav-link-text-wrapper"><span className="nav-link-text"  style={{
                              marginLeft: "20px",
                              marginRight: "",
                              marginTop: "15px",                              
                              color: "#e9a800",                              
                              fontFamily: 'Inter, Helvetica',
                              fontSize: '18px',
                              fontWeight: "700",
                              lineHeight: "normal",                                                        
                              }}
                            >  {t("PARAMETRES")}  
                              {/* PARAMETRES  */}
                              </span></span>
                          </div>
                      </div>

                      <div className="nav-item-wrapper">
                          <Link  className={sideID == 'campagne' ? "nav-link bg-info bg-opacity-25 active" : "nav-link"}to='/list-campagnes/' data-bs-toggle="" aria-expanded="false">                                            
                              <div className="d-flex align-items-center"><span className="nav-link-text" style={{
                                        color: "#94a91b",                                        
                                        fontFamily: "Inter, Helvetica",
                                        fontSize: "16px",
                                        fontWeight: "400",
                                        lineHeight: "normal", 
                                      }}>
                              <i className="text-start" style={{marginLeft: "-20px", marginRight: "10px"}}>
                                  <img src={IconCampagne} width="20%" height="100%" alt=""/>
                              </i> {t("Campagnes")}  
                                {/* Campagnes */}
                                </span></div>
                          </Link>
                      </div>   

                      <div className="nav-item-wrapper">
                          <div className="d-flex align-items-center mt-3">
                            <span className="">
                              <span></span>
                            </span><span className="nav-link-text-wrapper"><span className="nav-link-text"  style={{
                              marginLeft: "20px",
                              marginRight: "",
                              marginTop: "15px",                              
                              color: "#e9a800",                              
                              fontFamily: 'Inter, Helvetica',
                              fontSize: '18px',
                              fontWeight: "700",
                              lineHeight: "normal",                                                        
                              }}
                            > {t("DECRETS AGROFORETS")}    
                              {/* DECRETS AGROFORETS  */}
                            </span></span>
                          </div>
                      </div>

                      <div className="nav-item-wrapper">
                            <a className="nav-link" target='_blank' href="/decret-rapide-grah" data-bs-toggle=""
                                aria-expanded="false">
                                  <div className="d-flex align-items-center"><span className="nav-link-text" style={{
                                        color: "#94a91b",                                        
                                        fontFamily: "Inter, Helvetica",
                                        fontSize: "16px",
                                        fontWeight: "400",
                                        lineHeight: "normal", 
                                      }}>
                                    <i className="text-start" style={{marginLeft: "-20px", marginRight: "10px"}}>
                                        <img src={IconAgroforet} width="20%" height="100%" alt=""/>
                                    </i> {t("Décret rapide grah")}                                    
                                      </span>
                                  </div>
                            </a>
                      </div>  

                      <div className="nav-item-wrapper">
                            <a className="nav-link" target='_blank' href="/decret-haut-dodo" data-bs-toggle=""
                                aria-expanded="false">
                                  <div className="d-flex align-items-center"><span className="nav-link-text" style={{
                                        color: "#94a91b",                                        
                                        fontFamily: "Inter, Helvetica",
                                        fontSize: "16px",
                                        fontWeight: "400",
                                        lineHeight: "normal", 
                                      }}>
                                    <i className="text-start" style={{marginLeft: "-20px", marginRight: "10px"}}>
                                        <img src={IconAgroforet} width="20%" height="100%" alt=""/>
                                    </i>
                                      Décret haute dodo
                                      </span>
                                  </div>
                            </a>
                      </div>  

                      <div className="nav-item-wrapper">
                            <a className="nav-link" target='_blank' href="/decret-scio" data-bs-toggle=""
                                aria-expanded="false">
                                  <div className="d-flex align-items-center"><span className="nav-link-text" style={{
                                        color: "#94a91b",                                        
                                        fontFamily: "Inter, Helvetica",
                                        fontSize: "16px",
                                        fontWeight: "400",
                                        lineHeight: "normal", 
                                      }}>
                                    <i className="text-start" style={{marginLeft: "-20px", marginRight: "10px"}}>
                                        <img src={IconAgroforet} width="30%" height="100%" alt=""/>
                                    </i>
                                    Décret scio
                                      </span>
                                  </div>
                            </a>
                      </div>  

                      

                              
              


                  {/* <li className="nav-item">
                        <div className="nav-item-wrapper">
                            <a className="nav-link dropdown-indicator label-1" href="#nv-carbone" role="button" data-bs-toggle="collapse" aria-expanded="true" aria-controls="nv-carbone">
                                <div className="d-flex align-items-center">
                                    <div className="dropdown-indicator-icon">
                                        <span className="fas fa-caret-right"></span>
                                    </div>
                                      <span className="nav-link-icon"><span data-feather="pie-chart"></span>
                                      </span><span className="nav-link-text">DECRETS AGROFORETS</span>
                                  </div>
                              </a>
                              <div className="parent-wrapper label-1">
                                  <ul className={parent == "" ? "nav collapse parent show" : "nav collapse parent"}
                                      data-bs-parent="#navbarVerticalCollapse" id="nv-carbone">
                                      <li className="collapsed-nav-item-title d-none">RAPIDE GRAH</li>
                                      <li className="nav-item">
                                          <a className="nav-link" target='_blank' href="/decret-rapide-grah" data-bs-toggle=""
                                            aria-expanded="false">
                                              <div className="d-flex align-items-center"><span className="nav-link-text">Décret Rapide Grah</span>
                                              </div>
                                          </a>
                                      </li>
                                      <li className="collapsed-nav-item-title d-none">HAUTE DODO</li>
                                      <li className="nav-item">
                                          <a className="nav-link" target='_blank' href="/decret-haut-dodo" data-bs-toggle=""
                                            aria-expanded="false">
                                              <div className="d-flex align-items-center"><span className="nav-link-text">Décret Haute Dodo</span>
                                              </div>
                                          </a>
                                      </li>
                                      <li className="collapsed-nav-item-title d-none">SCIO</li>
                                      <li className="nav-item">
                                          <a className="nav-link" target='_blank' href="/decret-scio" data-bs-toggle=""
                                            aria-expanded="false">
                                              <div className="d-flex align-items-center"><span className="nav-link-text">Décret Scio</span>
                                              </div>
                                          </a>
                                      </li>
                                  </ul>
                              </div>
                        </div>
                  </li> */}
                {/*   <li className="nav-item">
                
                <p className="navbar-vertical-label">CLIENTS</p>
                <hr className="navbar-vertical-line" />
       
                <div className="nav-item-wrapper"><a className="nav-link label-1" href="apps/calendar.html" role="button" data-bs-toggle="" aria-expanded="false">
                    <div className="d-flex align-items-center"><span className="nav-link-icon"><span data-feather="calendar"></span></span><span className="nav-link-text-wrapper"><span className="nav-link-text">Dashbord</span></span></div>
                    </a>
                </div>

                <div className="nav-item-wrapper"><a className="nav-link dropdown-indicator label-1" href="#nv-CRM1" role="button" data-bs-toggle="collapse" aria-expanded="false" aria-controls="nv-CRM">
                    <div className="d-flex align-items-center">
                      <div className="dropdown-indicator-icon"><span className="fas fa-caret-right"></span></div><span className="nav-link-icon"><span data-feather="calendar"></span></span><span className="nav-link-text">Généralités</span>
                    </div>
                  </a>
                  <div className="parent-wrapper label-1">
                    <ul className="nav collapse parent" data-bs-parent="#navbarVerticalCollapse" id="nv-CRM1">
                      <li className="collapsed-nav-item-title d-none">Généralités</li>
                      <li className="nav-item"><a className="nav-link" href="apps/crm/analytics.html" data-bs-toggle="" aria-expanded="false">
                          <div className="d-flex align-items-center"><span className="nav-link-text">Gestion producteurs</span></div>
                        </a>
                      </li>
                      <li className="nav-item"><a className="nav-link" href="apps/crm/deals.html" data-bs-toggle="" aria-expanded="false">
                          <div className="d-flex align-items-center"><span className="nav-link-text">Gestion Parcelles</span></div>
                        </a>
                      </li>

                    </ul>
                  </div>
                </div>
                <div className="nav-item-wrapper"><a className="nav-link dropdown-indicator label-1" href="#nv-project-management1" role="button" data-bs-toggle="collapse" aria-expanded="false" aria-controls="nv-project-management">
                    <div className="d-flex align-items-center">
                      <div className="dropdown-indicator-icon"><span className="fas fa-caret-right"></span></div><span className="nav-link-icon"><span data-feather="clipboard"></span></span><span className="nav-link-text">Cartographies</span>
                    </div>
                  </a>
                  <div className="parent-wrapper label-1">
                    <ul className="nav collapse parent" data-bs-parent="#navbarVerticalCollapse" id="nv-project-management1">
                      <li className="collapsed-nav-item-title d-none">Cartographies</li>
                     
                      <li className="nav-item"><a className="nav-link" href="apps/project-management/project-list-view.html" data-bs-toggle="" aria-expanded="false">
                          <div className="d-flex align-items-center"><span className="nav-link-text">Carte simple</span></div>
                        </a>
                      </li>
                      <li className="nav-item"><a className="nav-link" href="apps/project-management/project-card-view.html" data-bs-toggle="" aria-expanded="false">
                          <div className="d-flex align-items-center"><span className="nav-link-text">Carte contours</span></div>
                        </a>
                      </li>

                      <li className="nav-item"><a className="nav-link" href="apps/project-management/project-card-view.html" data-bs-toggle="" aria-expanded="false">
                          <div className="d-flex align-items-center"><span className="nav-link-text">Carte pépinières</span></div>
                        </a>
                      </li>
                    
                    </ul>
                  </div> 
                </div>
                <div className="nav-item-wrapper"><a className="nav-link label-1" href="apps/chat.html" role="button" data-bs-toggle="" aria-expanded="false">
                    <div className="d-flex align-items-center"><span className="nav-link-icon"><span data-feather="message-square"></span></span><span className="nav-link-text-wrapper"><span className="nav-link-text">Statistiques</span></span></div>
                  </a></div>
            
              </li>
              <li className="nav-item">
                
                <p className="navbar-vertical-label">PEPINIERES</p>
                <hr className="navbar-vertical-line" />
                <div className="nav-item-wrapper"><a className="nav-link label-1" href="pages/starter.html" role="button" data-bs-toggle="" aria-expanded="false">
                    <div className="d-flex align-items-center"><span className="nav-link-icon"><span data-feather="compass"></span></span><span className="nav-link-text-wrapper"><span className="nav-link-text">Dashbord</span></span></div>
                  </a></div>
                <div className="nav-item-wrapper"><a className="nav-link dropdown-indicator label-1" href="#nv-faq" role="button" data-bs-toggle="collapse" aria-expanded="false" aria-controls="nv-faq">
                    <div className="d-flex align-items-center">
                      <div className="dropdown-indicator-icon"><span className="fas fa-caret-right"></span></div><span className="nav-link-icon"><span data-feather="help-circle"></span></span><span className="nav-link-text">Gestions des sites</span>
                    </div>
                  </a>
                  <div className="parent-wrapper label-1">
                    <ul className="nav collapse parent" data-bs-parent="#navbarVerticalCollapse" id="nv-faq">
                      <li className="collapsed-nav-item-title d-none">Gestions</li>
                      <li className="nav-item"><a className="nav-link" href="pages/faq/faq-accordion.html" data-bs-toggle="" aria-expanded="false">
                          <div className="d-flex align-items-center"><span className="nav-link-text">Sites</span></div>
                        </a>
                      </li>
                      <li className="nav-item"><a className="nav-link" href="pages/faq/faq-tab.html" data-bs-toggle="" aria-expanded="false">
                          <div className="d-flex align-items-center"><span className="nav-link-text">Comptes rendu</span></div>
                        </a>
                      </li>

                      <li className="nav-item"><a className="nav-link" href="pages/faq/faq-tab.html" data-bs-toggle="" aria-expanded="false">
                          <div className="d-flex align-items-center"><span className="nav-link-text">Carte des sites</span></div>
                        </a>
                      </li>

                    </ul>
                  </div>
                </div>
            
              </li>
              <li className="nav-item">
                
                <p className="navbar-vertical-label">ENQUETES SOCIALES</p>
                <hr className="navbar-vertical-line" />
                <li className="nav-item"><a className="nav-link" href="apps/social/feed.html" data-bs-toggle="" aria-expanded="false">
                      <div className="d-flex align-items-center"><span className="nav-link-text">Productions</span></div>
                    </a>
                </li>

                <li className="nav-item"><a className="nav-link" href="apps/social/feed.html" data-bs-toggle="" aria-expanded="false">
                      <div className="d-flex align-items-center"><span className="nav-link-text">Familles</span></div>
                    </a>
                </li>

                <li className="nav-item"><a className="nav-link" href="apps/social/feed.html" data-bs-toggle="" aria-expanded="false">
                      <div className="d-flex align-items-center"><span className="nav-link-text">Infrastructures</span></div>
                    </a>
                </li>
               
              </li>*/}

           
            </ul>
          </div>
        </div>
        {/* <div className="navbar-vertical-footer"><button className="btn navbar-vertical-toggle border-0 fw-semi-bold w-100 white-space-nowrap d-flex align-items-center"><span className="uil uil-left-arrow-to-left fs-0"></span><span className="uil uil-arrow-from-right fs-0"></span><span className="navbar-vertical-footer-text ms-2">Collapsed View</span></button></div> */}
      </nav>
    )
}

export default Sidebar;