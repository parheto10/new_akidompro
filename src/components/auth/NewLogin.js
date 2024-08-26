import { useEffect, useState } from "react";
import {Link, useNavigate} from "react-router-dom";
import axios from "axios";
import BackgroundImage from '../assets/img/cover.png'
import LogoImage from '../assets/img/Logo.jpg';
import logAkidom from '../assets/img/logo_agromap.png'
import UserContext from "../context/useContext";
import BaseUrl from "../config/baseUrl";
import Swal from "sweetalert2";

const url = BaseUrl();
function NewConnexion(){
const user = UserContext();

const [isAuthToken, setIsAuthToken] = useState(localStorage.getItem('_token_ucl'));
const [msgerrorAlert,setMsgerrorAlert] = useState('');
const navigate = useNavigate();

const [loginData,setLoginData] = useState({
    'email':'',
    'password':''
});

useEffect(()=>{
    if(isAuthToken !== null){
      if(user && user.is_responsable){
        navigate('/list-projets/');
      }

      if(user && user.is_adg){
        navigate('/list-coop/');
      }
        
    }
},[isAuthToken,user]);

const handleChange=(event)=>{
    setLoginData({
        ...loginData,
        [event.target.name] : event.target.value
    });
}

const submitLogin=()=>{
     setMsgerrorAlert('');
    if(loginData.email !== "" && loginData.password !==""){
        const _formData = new FormData();
        _formData.append('email',loginData.email);
        _formData.append('password',loginData.password);

        try {
            axios.post(url+'/login/',_formData).then((resp)=>{
                if(resp.data.bool == true){
                    localStorage.setItem('_token_ucl',resp.data.token);
                    Swal.fire({
                        title: 'Connexion...',
                        html: 'Veillez patientez...',
                        allowEscapeKey: false,
                        allowOutsideClick: false,
                        didOpen: () => {
                          Swal.showLoading()
                        },
                    });
                    if(resp.data.role == "responsable"){
                      //localStorage.setItem('_token_ucl',resp.data.token);
                      
                      if(resp.data.proj){
                        navigate('/list-projets/');
                        window.location.reload();
                      }else{
                        navigate('/create-projets/');
                        window.location.reload();
                      }
                      
                    }

                    if (resp.data.role == "adg"){
                        navigate('/dash-coop/');
                        // navigate('/list-coop/');
                        window.location.reload();
                    }
                    
                }else{
                  setMsgerrorAlert(resp.data.msg);
                }
            })
        } catch (error) {
            console.log(error);
        }

    } 

   // console.log(loginData.email)
}

    return (
        <main className="main" id="top">
        <div className="container-fluid" style={{backgroundColor: "#EEF1DE"}}>
            <div className="row flex-center min-vh-100">
                <div className="col col-md-5">
                    <img style={{
                                    objectFit: "cover",
                                    width: "588px",
                                    height: "763px",
                                    borderRadius: "15px",
                                  }} src={BackgroundImage} width="" height="" alt="" />
                </div>
                <div className="col col-md-7" style={{marginLeft: "-170px", height: "763px", paddingBottom: "500px", justifyContent: "center", alignItems: "center"}}>
                    <div className="card border border-200 auth-card">
                    <div className="col flex-center" style={{marginBottom: "200px"}}>
                      <div className="auth-form-box">
                          <div className="text-center mb-1 mt-10">
                              <a className="d-flex flex-center text-decoration-none mb-1" href="#">
                                <div className="d-flex align-items-center fw-bolder fs-5 d-inline-block">
                                  <img src={logAkidom} alt="phoenix" width="" />
                                </div>
                              </a>
                            <h3 className="text-1000">AUTHENTIFICATION</h3>
                            <p className="text-700">AKIDOMPRO V.1</p>
                          </div>
                          {msgerrorAlert !=="" &&
                            <div class="alert alert-danger" role="alert">
                                <h4 class="alert-heading">Attention !</h4>
                                <p>{msgerrorAlert}</p>
                            </div>
                            }
                          <div className="position-relative">
                            <hr className="bg-200 mt-1" />
                            <div className="divider-content-center bg-white">{/* AKIDOMPRO - NBS */}</div>
                          </div>
                          <div >
                              <div className="mb-3 text-start">
                                  <label className="form-label" htmlFor="email">Email</label>
                              <div className="form-icon-container">
                                <input
                                    className="form-control form-icon-input"
                                    id="email"
                                    type="email"
                                    placeholder="Adresse Email"
                                    name="email"
                                    onChange={handleChange}
                                   
                                />
                                <span className="fas fa-lock text-900 fs--1 form-icon"></span>
                              </div>
                              </div>
                              <div className="mb-3 text-start"><label className="form-label" htmlFor="password">Mot de Passe</label>
                              <div className="form-icon-container">
                                <input
                                    className="form-control form-icon-input"
                                    id="password"
                                    type="password"
                                    name="password"
                                    placeholder="Mot de Passe"
                                    onChange={handleChange}
                                />
                                <span className="fas fa-key text-900 fs--1 form-icon"></span>
                              </div>
                              </div>
                              <div className="row flex-between-center mb-4">
                                  <div className="col-auto">
                                    {/*<a className="fs--1 fw-semi-bold text-center" href="#">Mot de Passe Oublié ?</a>*/}
                                  </div>
                              </div>
                              <button  className="btn btn-success w-100 mb-3" style={{padding: "10px", borderRadius: "32px", fontWeight: "bold", fontSize: "26px"}} onClick={submitLogin}>Connexion</button>
                          </div>
                      </div>
                    </div>
                    </div>
                </div>
            </div>
            </div>
      </main>
    )
}

export default NewConnexion;