import { useEffect, useState } from "react";
import Content from "../../Content";
import UserContext from "../../context/useContext";
import axios from "axios";
import Validation from "../../Validation";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

import BaseUrl from "../../config/baseUrl";

// const baseUrl = 'http://127.0.0.1:8000/api';
const url = BaseUrl();
function CreateProjet(){
    const user = UserContext();
    const [errors, setErrorM] = useState({});
    const navigate = useNavigate();

    const [projetData,setProjetData] = useState({
        "nomProjet":"",
        "countrie":"",
        "description":"",
        "dateDebut":"",
        "dateFin":"",
        "objectif":"",
        "plant_aproduit":"0",
        "carbon_astock":"0",
        "emp_engageof_proj":"0",
        "dateDebutc":"",
        "DateFinc":"",
        /* "duree_campagne":"" */
       
    });

    /* const [campagneData,setCampagneData] = useState({
        "dateDebutc":"",
        "DateFinc":"",
        "duree_campagne":""
    }); */
    

    const [tabOne,setTabOne] = useState(1);
    const [tabTwo,setTabTwo] = useState(2);
    const [tabThree,setTabThree] = useState(3);
    const [tabNumber,setTabNumber] = useState(tabOne);

    const [countriLists,setCountrieLists] = useState([]);

    const style = {"backgroundColor":"greenyellow","color":"white","border":"greenyellow" }

    useEffect(()=>{
        try {
            axios.get(url+'/countries-list/').then((resp)=>{
                setCountrieLists(resp.data);
            })
        } catch (error) {
            
        }
    },[]);

   /*  const onclickTabOne=()=>{
        setTabNumber(tabOne);
    } */
    const onclickTabTwo=()=>{
        setErrorM(Validation(projetData));

        if(projetData.nomProjet !="" && projetData.dateDebut !="" && projetData.dateFin !="" && projetData.objectif !="" && projetData.description !="")
        {
            setTabNumber(tabTwo);
        }
        
    }
    const onclickTabThree=()=>{
        setErrorM(Validation(projetData));
        if(projetData.countrie !="" && projetData.dateDebutc !="" && projetData.DateFinc !="")
        {
            setTabNumber(tabThree);
        }
        
    }

    const onClickPrevouis=()=>{
        if(tabNumber != 1) {
            setTabNumber(tabNumber - 1);
        }
    }

    const handleChange=(event)=>{
        setProjetData({
            ...projetData,
            [event.target.name] : event.target.value
        })
    }

    const validateCreationProj=()=>{
        const _formData = new FormData();

        _formData.append('nomProjet',projetData.nomProjet);
        _formData.append('countrieID',projetData.countrie);
        _formData.append('description',projetData.description);
        _formData.append('dateDebut',projetData.dateDebut);
        _formData.append('dateFin',projetData.dateFin);
        _formData.append('objectif',projetData.objectif);
        _formData.append('plant_aproduit',projetData.plant_aproduit);
        _formData.append('carbon_astock',projetData.carbon_astock);
        _formData.append('emp_engageof_proj',projetData.emp_engageof_proj);
        _formData.append('dateDebutc',projetData.dateDebutc);
        _formData.append('DateFinc',projetData.DateFinc);
        _formData.append('userID',user.id);

        try {
            axios.post(url+'/create-new-proj/',_formData).then((resp)=>{
                if(resp.data.bool)
                {
                    Swal.fire({
                        title: 'FELICITATION !',
                        text: resp.data.msg,
                        icon: 'success',
                        showCancelButton: false,
                        confirmButtonColor: '#3085d6',
                        confirmButtonText: 'OK'
                      }).then((result) => {
                        if (result.isConfirmed) {
                            navigate('/dash-coop/');
                            //window.location.reload();
                        }
                      });
                }
            })
        } catch (error) {
            console.log(error);
        }

    }
    


    return (
        <Content sideID={'projets'}  parent={"params"}>
            <div className="card theme-wizard mb-5" >
                <div className="card-header bg-100 pt-3 pb-2 border-bottom-0">
                    <ul className="nav justify-content-between nav-wizard" role="tablist">
                    <li className="nav-item" role="presentation">
                        <a className={tabNumber == 1 ? "nav-link active fw-semi-bold" : "nav-link fw-semi-bold disabled"} href={`#bootstrap-wizard-tab${tabOne}`} data-bs-toggle="tab"  aria-selected="true" role="tab" >
                        <div className="text-center d-inline-block" >
                            <span className="nav-item-circle-parent">
                                <span className="nav-item-circle" style={tabNumber == 2 | tabNumber == 3 ? style : {}}  >
                                    <svg className="svg-inline--fa fa-lock" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="lock" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" data-fa-i2svg="">
                                        <path fill="currentColor" d="M80 192V144C80 64.47 144.5 0 224 0C303.5 0 368 64.47 368 144V192H384C419.3 192 448 220.7 448 256V448C448 483.3 419.3 512 384 512H64C28.65 512 0 483.3 0 448V256C0 220.7 28.65 192 64 192H80zM144 192H304V144C304 99.82 268.2 64 224 64C179.8 64 144 99.82 144 144V192z"></path>
                                    </svg>
                                </span>
                            </span>
                            <span className="d-none d-md-block mt-1 fs--1">Info Projets</span>
                        </div>
                        </a>
                    </li>

                    <li className="nav-item" role="presentation">
                        <a className={tabNumber == 2 ? "nav-link active fw-semi-bold" : "nav-link fw-semi-bold disabled"} href={`#bootstrap-wizard-tab${tabTwo}`} data-bs-toggle="tab"  aria-selected="false" tabindex="-1" role="tab">
                        <div className="text-center d-inline-block ">
                            <span className="nav-item-circle-parent">
                                <span className="nav-item-circle" style={tabNumber == 3 ? style : {}}>
                                    <svg className="svg-inline--fa fa-file-lines" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="file-lines" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" data-fa-i2svg=""><path fill="currentColor" d="M256 0v128h128L256 0zM224 128L224 0H48C21.49 0 0 21.49 0 48v416C0 490.5 21.49 512 48 512h288c26.51 0 48-21.49 48-48V160h-127.1C238.3 160 224 145.7 224 128zM272 416h-160C103.2 416 96 408.8 96 400C96 391.2 103.2 384 112 384h160c8.836 0 16 7.162 16 16C288 408.8 280.8 416 272 416zM272 352h-160C103.2 352 96 344.8 96 336C96 327.2 103.2 320 112 320h160c8.836 0 16 7.162 16 16C288 344.8 280.8 352 272 352zM288 272C288 280.8 280.8 288 272 288h-160C103.2 288 96 280.8 96 272C96 263.2 103.2 256 112 256h160C280.8 256 288 263.2 288 272z"></path>
                                    </svg>
                                </span>
                            </span>
                            <span className="d-none d-md-block mt-1 fs--1">Paramètres</span>
                        </div>
                        </a>
                    </li>
                    <li className="nav-item" role="presentation">
                        <a className={tabNumber == 3 ? "nav-link active fw-semi-bold" : "nav-link fw-semi-bold disabled"} href={`#bootstrap-wizard-tab${tabThree}`} data-bs-toggle="tab"  aria-selected="false" tabindex="-1" role="tab">
                        <div className="text-center d-inline-block">
                            <span className="nav-item-circle-parent">
                                <span className="nav-item-circle">
                                    <svg className="svg-inline--fa fa-check" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="check" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" data-fa-i2svg="">
                                        <path fill="currentColor" d="M438.6 105.4C451.1 117.9 451.1 138.1 438.6 150.6L182.6 406.6C170.1 419.1 149.9 419.1 137.4 406.6L9.372 278.6C-3.124 266.1-3.124 245.9 9.372 233.4C21.87 220.9 42.13 220.9 54.63 233.4L159.1 338.7L393.4 105.4C405.9 92.88 426.1 92.88 438.6 105.4H438.6z"></path>
                                    </svg>
                                </span>
                            </span>
                            <span className="d-none d-md-block mt-1 fs--1">Vérification</span>
                        </div>
                        </a>
                    </li>
                    </ul>
                </div>
                <div className="card-body pt-4 pb-0">
                    <div className="tab-content">
                    <div className={tabNumber == 1 ? "tab-pane active" : "tab-pane"} role="tabpanel" aria-labelledby={`bootstrap-wizard-tab${1}`} id={`bootstrap-wizard-tab${1}`}>
                        <div id="wizardForm1" novalidate="novalidate" data-wizard-form="1">
                        <div className="mb-2">
                            <label className="form-label text-900" >Nom du projet</label>
                            <input className="form-control" type="text" name="nomProjet"  onChange={handleChange} value={projetData.nomProjet} />
                            {errors.nomProjet && <span className="text-danger">{errors.nomProjet}</span>}
                        </div>

                        <div className="row g-3 mb-3">
                            <div className="col-sm-4">
                                <div className="mb-2 mb-sm-0">
                                    <label className="form-label text-900" for="bootstrap-wizard-wizard-password">Date de debut du projet</label>
                                    <input className="form-control" type="date" name="dateDebut"  id="bootstrap-wizard-wizard-password" onChange={handleChange} value={projetData.dateDebut}  />
                                    {errors.dateDebut && <span className="text-danger">{errors.dateDebut}</span>}
                                </div>
                            </div>
                            <div className="col-sm-4">
                                <div className="mb-2">
                                    <label className="form-label text-900" for="bootstrap-wizard-wizard-confirm-password">Date de Fin</label>
                                    <input
                                        className="form-control"
                                        type="date"
                                        name="dateFin"
                                        id="bootstrap-wizard-wizard-confirm-password"
                                        onChange={handleChange}
                                        value={projetData.dateFin}
                                    />
                                    {errors.dateFin && <span className="text-danger">{errors.dateFin}</span>}
                                </div>
                            </div>

                            <div className="col-4">
                                <label className="form-label" for="bootstrap-wizard-card-holder-country">Catégories du projet</label>
                                <select className="form-select" name="objectif" id="bootstrap-wizard-card-holder-country" onChange={handleChange} value={projetData.objectif}>
                                    <option value="">...</option>
                                    <option value="AGROFORESTERIE">Agroforesteries</option>
                                    <option value="REFORESTATION">Reforestations</option>
                                    <option value="AGROFORESTERIE ET REFORESTATION">Agroforesteries et Reforestations</option>
                                    <option value="MANGROVE">Mangroves</option>
                                    <option value="AUTRES">Autres</option>
                                </select>
                                {errors.objectif && <span className="text-danger">{errors.objectif}</span>}
                            </div>
                        </div>
                        <div className="mb-2">
                            <label className="form-label" for="bootstrap-wizard-wizard-email">Desciption du projet </label>
                            <textarea className="form-control" name="description" onChange={handleChange} value={projetData.description}></textarea>
                            {errors.description && <span className="text-danger">{errors.description}</span>}
                        </div>

                        </div>
                    </div>
                    <div className={tabNumber == 2 ? "tab-pane active" : "tab-pane"} role="tabpanel" aria-labelledby={`bootstrap-wizard-tab${2}`} id={`bootstrap-wizard-tab${2}`}>
                        <div className="mb-2" id="wizardForm3">

                        <div className="row gx-3 gy-2">

                            <div className="col-6">
                                <label className="form-label" for="bootstrap-wizard-card-holder-country">Pays d'exécution du projet</label>
                                <select className="form-select" name="countrie" id="bootstrap-wizard-card-holder-country" onChange={handleChange} value={projetData.countrie}>
                                    <option value="" selected disabled>Select un pays ...</option>
                                    {countriLists.map((countrie,index)=>
                                        <option value={countrie.id}>{countrie.libelle}</option>
                                    )}
                                </select>
                                {errors.countrie && <span className="text-danger">{errors.countrie}</span>}
                            </div>
                            <div className="position-relative mt-2">
                                <hr className="bg-200" />
                                <div className="divider-content-center bg-white text-warning">Ajouter une nouvelle campagne</div>
                            </div>
                            <div className="col-6">
                                <label className="form-label" for="bootstrap-wizard-card-number">Date debut de campagne</label>
                                <input className="form-control"  type="date" id="bootstrap-wizard-card-number" name="dateDebutc" onChange={handleChange} value={projetData.dateDebutc}/>
                                {errors.dateDebutc && <span className="text-danger">{errors.dateDebutc}</span>}
                            </div>
                            <div className="col-6">
                                <label className="form-label" for="bootstrap-wizard-card-name">Date fin de campagne</label>
                                <input className="form-control"  name="DateFinc" type="date" id="bootstrap-wizard-card-name" onChange={handleChange} value={projetData.DateFinc} />
                                {errors.DateFinc && <span className="text-danger">{errors.DateFinc}</span>}
                            </div>

                           {/*  <div className="col-6">
                                <label className="form-label" for="bootstrap-wizard-card-holder-zip-code">Durée de la campagne</label>
                                <input className="form-control" placeholder="Ex: 1 ans" name="duree_campagne" type="text" id="bootstrap-wizard-card-holder-zip-code" onChange={handleChange} value={projetData.duree_campagne} />
                            </div> */}

                            <div className="position-relative mt-2">
                                <hr className="bg-200" />
                                <div className="divider-content-center bg-white text-warning">Objectif du projet ( facultatif )</div>
                            </div>

                            <div className="row g-3 mb-3">
                            <div className="col-sm-4">
                                <div className="mb-2 mb-sm-0">
                                    <label className="form-label text-900" for="bootstrap-wizard-wizard-password">Plants Totals à produire</label>
                                    <input className="form-control" type="number" name="plant_aproduit"  id="bootstrap-wizard-wizard-password"  onChange={handleChange} value={projetData.plant_aproduit} />
                                </div>
                            </div>
                            <div className="col-sm-4">
                                <div className="mb-2">
                                    <label className="form-label text-900" for="bootstrap-wizard-wizard-confirm-password">Carbone(CO2) Espéré</label>
                                    <input className="form-control" type="number" name="carbon_astock"  id="bootstrap-wizard-wizard-confirm-password"  onChange={handleChange} value={projetData.carbon_astock}/>
                                </div>
                            </div>

                            <div className="col-4">
                                <label className="form-label" for="bootstrap-wizard-card-holder-country">Nombre de personnes engagées </label>
                                <input className="form-control" type="number" name="emp_engageof_proj"  id="bootstrap-wizard-wizard-confirm-password"  onChange={handleChange} value={projetData.emp_engageof_proj}/>
                            </div>
                        </div>
                        </div>
                        </div>
                    </div>
                    <div className={tabNumber == 3 ? "tab-pane active" : "tab-pane"} role="tabpanel" aria-labelledby={`bootstrap-wizard-tab${tabThree}`} id={`bootstrap-wizard-tab${tabThree}`}>
                        <div className="row flex-center pb-8 pt-4 gx-3 gy-4">

                        <div className="col-12 col-sm-auto">
                            <div className="text-center text-sm-start">
                            <h5 className="mb-3">TERMINER !</h5>
                            <p className="text-1100 fs--1">Vous pouvez maintenant valider la creation du projet  <b>{projetData.nomProjet}</b><br /></p>
                            <button className="btn btn-primary px-6" href="wizard.html" onClick={validateCreationProj}>Valider</button>
                            </div>
                        </div>
                        </div>
                    </div>
                    </div>
                </div>
                <div className="card-footer border-top-0" >
                    <div className="d-flex pager wizard list-inline mb-0">
                        {tabNumber != 1 &&
                            <button className="btn btn-link ps-0" type="button" onClick={onClickPrevouis}>
                            <svg className="svg-inline--fa fa-chevron-left me-1" data-fa-transform="shrink-3" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="chevron-left" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" data-fa-i2svg="" style={{"transformOrigin": "0.3125em 0.5em"}}>

                            <g transform="translate(160 256)"><g transform="translate(0, 0)  scale(0.8125, 0.8125)  rotate(0 0 0)"><path fill="currentColor" d="M224 480c-8.188 0-16.38-3.125-22.62-9.375l-192-192c-12.5-12.5-12.5-32.75 0-45.25l192-192c12.5-12.5 32.75-12.5 45.25 0s12.5 32.75 0 45.25L77.25 256l169.4 169.4c12.5 12.5 12.5 32.75 0 45.25C240.4 476.9 232.2 480 224 480z" transform="translate(-160 -256)"></path>
                            </g></g></svg>Précédent
                            </button>
                        }

                        {tabNumber == 1 &&
                            <div className="flex-1 text-end">
                            <button className="btn btn-primary px-6 px-sm-6" type="button" onClick={onclickTabTwo}>Suivant
                                <svg className="svg-inline--fa fa-chevron-right ms-1" data-fa-transform="shrink-3" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="chevron-right" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" data-fa-i2svg="" style={{"transformOrigin": "0.3125em 0.5em"}}><g transform="translate(160 256)"><g transform="translate(0, 0)  scale(0.8125, 0.8125)  rotate(0 0 0)"><path fill="currentColor" d="M96 480c-8.188 0-16.38-3.125-22.62-9.375c-12.5-12.5-12.5-32.75 0-45.25L242.8 256L73.38 86.63c-12.5-12.5-12.5-32.75 0-45.25s32.75-12.5 45.25 0l192 192c12.5 12.5 12.5 32.75 0 45.25l-192 192C112.4 476.9 104.2 480 96 480z" transform="translate(-160 -256)">
                                </path></g></g></svg>
                            </button>
                        </div>
                        }

                        {tabNumber == 2 &&
                            <div className="flex-1 text-end">
                            <button className="btn btn-primary px-6 px-sm-6" type="button" onClick={onclickTabThree}>Suivant
                                <svg className="svg-inline--fa fa-chevron-right ms-1" data-fa-transform="shrink-3" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="chevron-right" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" data-fa-i2svg="" style={{"transformOrigin": "0.3125em 0.5em"}}><g transform="translate(160 256)"><g transform="translate(0, 0)  scale(0.8125, 0.8125)  rotate(0 0 0)"><path fill="currentColor" d="M96 480c-8.188 0-16.38-3.125-22.62-9.375c-12.5-12.5-12.5-32.75 0-45.25L242.8 256L73.38 86.63c-12.5-12.5-12.5-32.75 0-45.25s32.75-12.5 45.25 0l192 192c12.5 12.5 12.5 32.75 0 45.25l-192 192C112.4 476.9 104.2 480 96 480z" transform="translate(-160 -256)">
                                </path></g></g></svg>
                            </button>
                        </div>
                        }
                    </div>
                </div>
            </div>
        </Content>
    )
}

export default CreateProjet;