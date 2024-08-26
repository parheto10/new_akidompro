import { Link, useNavigate, useParams } from "react-router-dom";
import Content from "../../Content";
import { useEffect, useState } from "react";
import axios from "axios";
import UserContext from "../../context/useContext";
import Validation from "../../Validation";
import Swal from "sweetalert2";
import person from '../../assets/img/avatar.jpg';

import BaseUrl from "../../config/baseUrl";

// const baseUrl = 'http://127.0.0.1:8000/api';
const url = BaseUrl();
function ViewProj(){

  const user = UserContext();
  const [errors, setErrorM] = useState({});
  const navigate = useNavigate();

  const {projetID} = useParams();
  const [proj,setProj] = useState([]);
  const [regionList,setRegionList] = useState([]);
  const [coopData,setCoopData] = useState({
    "region":"",
    "respCoop":"",
    "nomCoop":"",
    "contacts":"",
    "logo":"",
    "siege":""
  });
  const [errorNameCoop,setErrorNameCoop] = useState('');
  const [coopList,setCoopList] = useState([]);

  useEffect(()=>{
    try {
      axios.get(url+'/proj-list/?projID='+projetID).then((resp)=>{
          setProj(resp.data[0]);
      })
    } catch (error) { 
      console.log(error);
    }

    try {
      axios.get(url+'/cooperative-list/?projID='+projetID).then((resp)=>{
        setCoopList(resp.data);
      });
    } catch (error) {
      console.log(error);
    }
    


    try {
      axios.get(url+'/region-list/').then((resp)=>{
        setRegionList(resp.data);
      })
    } catch (error) { 
      console.log(error);
    }
  },[user]);

  const handleChangeCoop=(event)=>{
    setCoopData({
      ...coopData,
      [event.target.name]: event.target.value
    })
  }

  const handleFileChangeCoop=(event)=>{
    setCoopData({
        ...coopData,
        [event.target.name]:event.target.files[0]
    });
}

  function generateUniqueID() {
    const timestamp = new Date().getTime().toString(); 
    const randomNum = Math.random().toString(36).substr(2, 9); 

    return timestamp + randomNum; 
  }

  const submitCoop=()=>{
    setErrorM(Validation(coopData));

    if(coopData.siege !="" && coopData.region !="" && coopData.nomCoop !="" && coopData.respCoop !="" && coopData.contacts !="" )
    {
      const _formData = new FormData();
      _formData.append('region',coopData.region);
      _formData.append('respCoop',coopData.respCoop);
      _formData.append('nomCoop',coopData.nomCoop);
      _formData.append('contacts',coopData.contacts);
      _formData.append('siege',coopData.siege);
      _formData.append('projetID',projetID);
      _formData.append('userID',user.id);

      if (coopData.logo !=""){

          const currentTimeInSeconds = Math.floor(new Date().getTime() / 1000);
          const originalExtension = coopData.logo.name.split('.').pop();
          const newFileName = `${currentTimeInSeconds}_logo_${coopData.nomCoop}_${generateUniqueID()}.${originalExtension}`;
          const photo = new File([coopData.logo], newFileName, { type: coopData.logo.type });
        _formData.append('logo',photo);

      }

      setErrorNameCoop('');

      Swal.fire({
        title: 'Enregistrement...',
        html: 'Veillez patientez...',
        allowEscapeKey: false,
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading()
        },
        
      });

       try {
        axios.post(url+'/create-new-cooperative/',_formData).then((resp)=>{
          Swal.close()

          if(resp.data.bool)
          {
            window.$('#addEventModal').modal('hide');
            Swal.fire({
              title: 'FELICITATION !',
              html: "La coopérative <b>"+coopData.nomCoop+"</b> a bien été enregistrée.",
              icon: 'success',
              showCancelButton: false,
              confirmButtonColor: '#3085d6',
              confirmButtonText: 'OK'
            }).then((result) => {
              if (result.isConfirmed) {

                  axios.get(url+'/cooperative-list/?projID='+projetID).then((resp)=>{
                    setCoopList(resp.data);
                  });

              }
            });

            setCoopData({
              "region":"",
              "respCoop":"",
              "logo":"",
              "nomCoop":"",
              "contacts":""
            })
          }
          else
          {
            setErrorNameCoop(resp.data.msg);
          }
        })
      } catch (error) {
        console.log(error);
      } 
      
    } 
  }

  const goToViewCooperative=(coopID)=>{
    navigate('/views-coop/'+coopID+'/');
    //window.location.reload();
  }

    return (
        <>
            <Content sideID={'projets'} parent={"params"}>

 
        
        <div className="mb-9">
          <div className="row align-items-center justify-content-between g-3 mb-4">
            <div className="col-auto">
              <h2 className="mb-0">{proj?.nomProjet}</h2>
            </div>
           {/*  <div className="col-auto">
              <div className="row g-3">
                <div className="col-auto"><button className="btn btn-phoenix-danger"><span className="fa-solid fa-trash-can me-2"></span>Delete customer</button></div>
                <div className="col-auto"><button className="btn btn-phoenix-secondary"><span className="fas fa-key me-2"></span>Reset password</button></div>
              </div>
            </div> */}
          </div>
          <div className="row g-5">
            <div className="col-12 col-xxl-4">
              <div className="row g-3 g-xxl-0 h-10">
                <div className="col-12 col-md-7 col-xxl-12 mb-xxl-3">
                  <div className="card h-100">
                    <div className="card-body d-flex flex-column justify-content-between pb-3">
                      <div className="row align-items-center g-5 mb-3 text-center text-sm-start">
                        <div className="col-12 col-sm-auto mb-sm-2">
                          <div className="avatar avatar-5xl">
                            {
                              proj.logo
                                  ? <img className="rounded-circle" src={proj.logo} alt={proj.nomProjet}/>
                                  : <img className="rounded-circle" src={person} alt=""/>
                            }
                          </div>
                        </div>
                        <div className="col-12 col-sm-auto flex-1">
                          <h3>{user?.nom} {user?.prenom}</h3>
                          <p className="text-800">{user?.email}</p>
                         {/*  <div><a className="me-2" href="#!"><span className="fab fa-linkedin-in text-400 hover-primary"></span></a><a className="me-2" href="#!"><span className="fab fa-facebook text-400 hover-primary"></span></a><a href="#!"><span className="fab fa-twitter text-400 hover-primary"></span></a></div> */}
                        </div>
                      </div>
                      <div className="d-flex flex-between-center border-top border-dashed border-300 pt-4">
                        <div>
                          <h6>Coopératives</h6>
                          {
                            proj.total_coop_projet
                                ? <p className="fs-1 text-800 mb-0 text-warning text-center">{proj.total_coop_projet}</p>
                                : <p className="fs-1 text-800 mb-0 text-warning text-center">0</p>
                          }
                          {/*<p className="fs-1 text-800 mb-0 text-warning text-center">{coopList?.length}</p>*/}
                        </div>
                        <div>
                          <h6>Producteurs</h6>
                          {
                            proj.total_producteurs_projet
                                ? <p className="fs-1 text-800 mb-0 text-warning text-center">{proj.total_producteurs_projet}</p>
                                : <p className="fs-1 text-800 mb-0 text-warning text-center">0</p>
                          }
                        </div>
                        <div>
                        <h6>Parcelles</h6>
                          {
                            proj.total_parcelles_projet
                                ? <p className="fs-1 text-800 mb-0 text-warning text-center">{proj.total_parcelles_projet}</p>
                                : <p className="fs-1 text-800 mb-0 text-warning text-center">0</p>
                          }
                          {/*<p className="fs-1 text-800 mb-0 text-warning text-center">0</p>*/}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-12 col-md-5 col-xxl-12 mb-xxl-3">
                  <div className="card h-10">
                    <div className="card-body pb-3">
                      <div className="d-flex align-items-center mb-3">
                        <h3 className="me-1">Information du projet</h3><button className="btn btn-link p-0"><span className="fas fa-pen fs-0 ms-3 text-500"></span></button>
                      </div>
                      <h5 className="text-800 border-bottom pb-2">{proj?.nomProjet}</h5>
                      <p className="text-800 pt-3">Catégorie : <b>{proj?.objectif}</b>
                      </p>
                      <div className="mb-3">
                        <h5 className="text-800">Pays</h5><a href="#"><b>{proj?.countrie?.libelle}</b></a>
                      </div>
                      <h5 className="text-800 border-top pt-3" >Objectif</h5>
                        <a className="text-800 text-success" href="#">Planting : <b>{proj?.plant_aproduit} Plants</b></a><br/>
                        <a className="text-800 text-success" href="#">Carbone : <b>{proj?.carbon_astock} eq(T)</b></a><br/>

                       {/*  <Link className="btn btn-warning btn-sm mt-2 form-control" to="http://192.168.1.14:3000/carte">CARTE(AIRE PROTEGE)</Link> */}
                        <Link className="btn btn-warning btn-sm mt-2 form-control" to="/carte-coops/">CARTE PARCELLE</Link>
                    </div>
                  </div>
                </div>
              {/*  <div className="col-12">
                  <div className="card h-100">
                    <div className="card-body">
                      <h3 className="mb-4">Notes on Customer</h3><textarea className="form-control mb-3" rows="4"></textarea><button className="btn btn-phoenix-primary w-100 mb-4">Add Note</button>
                      <div className="fs--1 fw-semi-bold pb-3 mb-4 border-bottom border-dashed border-300">
                        <p className="text-1000 mb-1">Gave us a nice feedback</p>
                        <div className="text-end">
                          <p className="text-600 mb-0">12 Nov, 2020</p>
                        </div>
                      </div>
                      <div className="fs--1 fw-semi-bold pb-3 mb-4 border-bottom border-dashed border-300">
                        <p className="text-1000 mb-1">Customer added product to cart and then forgot to checkout. Later knocked the customer support to ask about update on shipping. Later, settled on “One day Shipping” though “Free delivery” was preferred. Overall good behavior.</p>
                        <div className="text-end">
                          <p className="text-600 mb-0">23 Dec, 2019</p>
                        </div>
                      </div>
                      <div className="fs--1 fw-semi-bold pb-3 mb-4 border-bottom border-dashed border-300">
                        <p className="text-1000 mb-1">User of this support ticket won a 100% off coupon and received top-notch service from the technical support engineer. Along with providing a good review, user highly appreciated the team.</p>
                        <div className="text-end">
                          <p className="text-600 mb-0">2 Oct, 2019</p>
                        </div>
                      </div>
                      <div className="fs--1 fw-semi-bold">
                        <p className="text-1000 mb-1">Customer returned and bought 2 related items, which is currently being shipped. Customer chose “One day Shipping”. Additional notes were added regarding customised wrapping. Customer submitted positive review.</p>
                        <div className="text-end">
                          <p className="text-600 mb-0">26 Apr, 2019</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div> */} 
              </div>
            </div>
            <div className="col-12 col-xxl-8">
              <div className="mb-6">
                <h3 className="mb-4">COOPERATIVES <span className="text-700 fw-normal">({coopList.length})</span> <button className="btn btn-primary btn-sm float-end" type="button" data-bs-toggle="modal" data-bs-target="#addEventModal">Ajouter une cooperative</button></h3>
                <div className="border-top border-bottom border-200" id="customerOrdersTable" >
                  <div className="table-responsive scrollbar">
                    <table className="table table-sm fs--1 mb-0">
                      <thead>
                        <tr className="bg-warning">
                          <th className="sort white-space-nowrap align-middle ps-0 pe-3 text-center" scope="col" data-sort="order" style={{"width":"30%"}}>Nom de la Coopérative</th>
                          <th className="sort align-middle text-end pe-7 text-center" scope="col" data-sort="total" style={{"width":"20%"}}>Pays</th>
                          <th className="sort align-middle white-space-nowrap text-center pe-3" scope="col" data-sort="payment_status" style={{"width":"20%"}}>Region</th>
                          <th className="sort align-middle white-space-nowrap text-center pe-3" scope="col" data-sort="fulfilment_status" style={{"width":"15%"}}>Producteurs</th>
                          <th className="sort align-middle white-space-nowrap text-center " scope="col" data-sort="delivery_type" style={{"width":"15%"}}>Sections</th>
                          {/* <th className="sort align-middle text-end pe-0" scope="col" data-sort="date">DATE</th> */}
                          <th className="sort text-end align-middle pe-0 ps-5 text-center" scope="col"> Action</th>
                        </tr>
                      </thead>
                      <tbody className="list" id="customer-order-table-body">
                      {coopList.map((coop,index)=>
                      <tr className="hover-actions-trigger btn-reveal-trigger position-static">
                         <td className="order align-middle white-space-nowrap ps-0 text-center"><span className="fw-semi-bold text-primary cursor-pointer"  onClick={()=>goToViewCooperative(coop.id)}>{coop.nomCoop}</span></td>
                         <td className="total align-middle text-center fw-semi-bold pe-7 text-1000">
                          {coop.region?.countrie?.libelle}
                          </td>
                         <td className="payment_status align-middle white-space-nowrap text-center fw-bold text-700">
                          {coop.region?.libelle}
                        </td>
                         <td className="fulfilment_status align-middle white-space-nowrap text-center fw-bold text-700">
                            {coop.total_producteurs_coop}
                         </td>
                         <td className="delivery_type align-middle white-space-nowrap text-900 fs--1 text-center">{coop.total_sections_coop}</td>
                        {/*  <td className="date align-middle white-space-nowrap text-700 fs--1 ps-4 text-end">Dec 12, 12:56 PM</td> */}
                         <td className="align-middle white-space-nowrap text-center pe-0 ps-5">
                           <div className="font-sans-serif btn-reveal-trigger position-static"><button className="btn btn-sm dropdown-toggle dropdown-caret-none transition-none btn-reveal fs--2" type="button" data-bs-toggle="dropdown" data-boundary="window" aria-haspopup="true" aria-expanded="false" data-bs-reference="parent"><span className="fas fa-ellipsis-h fs--2"></span></button>
                             <div className="dropdown-menu dropdown-menu-end py-2">
                              <a className="dropdown-item" href="#!" onClick={()=>goToViewCooperative(coop.id)}>Detail</a>
                              {/* <a className="dropdown-item" href="#!">Export</a> */}
                               <div className="dropdown-divider"></div>
                                <a className="dropdown-item text-danger" href="#!">Supprimer</a>
                             </div>
                           </div>
                         </td>
                       </tr>
                      )}
                       
                      </tbody>
                    </table>
                  </div>
                  <div className="row align-items-center justify-content-between py-2 pe-0 fs--1">
                   {/*  <div className="col-auto d-flex">
                      <p className="mb-0 d-none d-sm-block me-3 fw-semi-bold text-900" data-list-info="data-list-info"></p><a className="fw-semi-bold" href="#!" data-list-view="*">View all<span className="fas fa-angle-right ms-1" data-fa-transform="down-1"></span></a><a className="fw-semi-bold d-none" href="#!" data-list-view="less">View Less<span className="fas fa-angle-right ms-1" data-fa-transform="down-1"></span></a>
                    </div>
                    <div className="col-auto d-flex"><button className="page-link" data-list-pagination="prev"><span className="fas fa-chevron-left"></span></button>
                      <ul className="mb-0 pagination"></ul><button className="page-link pe-0" data-list-pagination="next"><span className="fas fa-chevron-right"></span></button>
                    </div> */}
                  </div>
                </div>
              </div>
              {/* <div className="mb-6">
                <h3 className="mb-4">SITES DE PEPINIERES <span className="text-700 fw-normal">(43)</span><button className="btn btn-primary btn-sm float-end">Ajouter un site</button></h3>
                <div className="border-200 border-top border-bottom" id="customerWishlistTable" data-list='{"valueNames":["products","color","size","price","quantity","total"],"page":5,"pagination":true}'>
                  <div className="table-responsive scrollbar">
                    <table className="table fs--1 mb-0">
                      <thead>
                        <tr>
                          <th className="sort white-space-nowrap align-middle fs--2" scope="col" style={{"width":"5%"}}></th>
                          <th className="sort white-space-nowrap align-middle" scope="col" style={{"width":"35%", "min-width":"250px"}} data-sort="products">PRODUCTS</th>
                          <th className="sort align-middle" scope="col" data-sort="color" style={{"width":"15%"}}>COLOR</th>
                          <th className="sort align-middle" scope="col" data-sort="size" style={{"width":"10%"}}>SIZE</th>
                          <th className="sort align-middle text-end" scope="col" data-sort="price" style={{"width":"15%"}}>PRICE</th>
                          <th className="sort align-middle text-end" scope="col" data-sort="total" style={{"width":"15%"}}>TOTAL</th>
                        </tr>
                      </thead>
                      <tbody className="list" id="customer-wishlist-table-body">
                        <tr className="hover-actions-trigger btn-reveal-trigger position-static">
                          <td className="align-middle white-space-nowrap py-1"><a className="border rounded-2 d-inline-block" href="../landing/product-details.html"><img src="../../../assets/img/products/8.png" alt="" width="40" height="40" /></a></td>
                          <td className="products align-middle"><a className="fw-semi-bold mb-0" href="../landing/product-details.html">Amazon Basics Matte Black Wired Keybo...</a></td>
                          <td className="color align-middle white-space-nowrap fs--1 text-900">Black</td>
                          <td className="size align-middle white-space-nowrap text-700 fs--1 fw-semi-bold">MD</td>
                          <td className="price align-middle text-900 fs--1 fw-semi-bold text-end">$40</td>
                          <td className="total align-middle fw-bold text-1000 text-end">$40</td>
                        </tr>
                        <tr className="hover-actions-trigger btn-reveal-trigger position-static">
                          <td className="align-middle white-space-nowrap py-1"><a className="border rounded-2 d-inline-block" href="../landing/product-details.html"><img src="../../../assets/img/products/12.png" alt="" width="40" height="40" /></a></td>
                          <td className="products align-middle"><a className="fw-semi-bold mb-0" href="../landing/product-details.html">HORI Racing Wheel Apex for PlayStation...</a></td>
                          <td className="color align-middle white-space-nowrap fs--1 text-900">Black</td>
                          <td className="size align-middle white-space-nowrap text-700 fs--1 fw-semi-bold">45</td>
                          <td className="price align-middle text-900 fs--1 fw-semi-bold text-end">$130</td>
                          <td className="total align-middle fw-bold text-1000 text-end">$130</td>
                        </tr>
                        <tr className="hover-actions-trigger btn-reveal-trigger position-static">
                          <td className="align-middle white-space-nowrap py-1"><a className="border rounded-2 d-inline-block" href="../landing/product-details.html"><img src="../../../assets/img/products/17.png" alt="" width="40" height="40" /></a></td>
                          <td className="products align-middle"><a className="fw-semi-bold mb-0" href="../landing/product-details.html">Xbox Series S</a></td>
                          <td className="color align-middle white-space-nowrap fs--1 text-900">Space Gray</td>
                          <td className="size align-middle white-space-nowrap text-700 fs--1 fw-semi-bold">sm</td>
                          <td className="price align-middle text-900 fs--1 fw-semi-bold text-end">$99</td>
                          <td className="total align-middle fw-bold text-1000 text-end">$99</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div className="row align-items-center justify-content-between py-2 pe-0 fs--1">
                    <div className="col-auto d-flex">
                      <p className="mb-0 d-none d-sm-block me-3 fw-semi-bold text-900" data-list-info="data-list-info"></p><a className="fw-semi-bold" href="#!" data-list-view="*">View all<span className="fas fa-angle-right ms-1" data-fa-transform="down-1"></span></a><a className="fw-semi-bold d-none" href="#!" data-list-view="less">View Less<span className="fas fa-angle-right ms-1" data-fa-transform="down-1"></span></a>
                    </div>
                    <div className="col-auto d-flex"><button className="page-link" data-list-pagination="prev"><span className="fas fa-chevron-left"></span></button>
                      <ul className="mb-0 pagination"></ul><button className="page-link pe-0" data-list-pagination="next"><span className="fas fa-chevron-right"></span></button>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="mb-4">Autres comptes <span className="text-700 fw-normal">(43)</span><button className="btn btn-primary btn-sm float-end">Ajouter un compte</button></h3>
                <div className="border-top border-bottom border-200" id="customerRatingsTable" data-list='{"valueNames":["product","rating","review","status","date"],"page":5,"pagination":true}'>
                  <div className="table-responsive scrollbar">
                    <table className="table fs--1 mb-0">
                      <thead>
                        <tr>
                          <th className="sort white-space-nowrap align-middle" scope="col" style={{"width":"20%"}} data-sort="product">PRODUCT</th>
                          <th className="sort align-middle" scope="col" data-sort="rating" style={{"width":"10%"}}>RATING</th>
                          <th className="sort align-middle" scope="col" style={{"width":"50%" }}data-sort="review">REVIEW</th>
                          <th className="sort text-end align-middle" scope="col" style={{"width":"10%"}} data-sort="status">STATUS</th>
                          <th className="sort text-end align-middle" scope="col" style={{"width":"10%"}} data-sort="date">DATE</th>
                          <th className="sort text-end pe-0 align-middle" scope="col"></th>
                        </tr>
                      </thead>
                      <tbody className="list" id="customer-rating-table-body">
                        <tr className="hover-actions-trigger btn-reveal-trigger position-static">
                          <td className="align-middle product white-space-nowrap"><a className="fw-semi-bold" href="../landing/product-details.html">2021 Apple 12.9-inch iPad Pro (Wi...</a></td>
                          <td className="align-middle rating white-space-nowrap fs--2"><span className="fa fa-star text-warning"></span><span className="fa fa-star text-warning"></span><span className="fa fa-star text-warning"></span><span className="fa fa-star text-warning"></span><span className="fa fa-star-half-alt star-icon text-warning"></span></td>
                          <td className="align-middle review" style={{"min-width":"350px"}}>
                            <p className="fw-semi-bold text-1000 mb-0">The response time and service I received when contacted the designers were Phenomenal!</p>
                          </td>
                          <td className="align-middle text-end status"><span className="badge badge-phoenix fs--2 badge-phoenix-warning"><span className="badge-label">Pending</span><span className="ms-1" data-feather="alert-octagon" style={{"height":"12.8px","width":"12.8px"}}></span></span></td>
                          <td className="align-middle text-end date white-space-nowrap">
                            <p className="text-700 mb-0">Nov 07, 9:00 PM</p>
                          </td>
                          <td className="align-middle white-space-nowrap text-end pe-0">
                            <div className="font-sans-serif btn-reveal-trigger position-static"><button className="btn btn-sm dropdown-toggle dropdown-caret-none transition-none btn-reveal fs--2" type="button" data-bs-toggle="dropdown" data-boundary="window" aria-haspopup="true" aria-expanded="false" data-bs-reference="parent"><span className="fas fa-ellipsis-h fs--2"></span></button>
                              <div className="dropdown-menu dropdown-menu-end py-2"><a className="dropdown-item" href="#!">View</a><a className="dropdown-item" href="#!">Export</a>
                                <div className="dropdown-divider"></div><a className="dropdown-item text-danger" href="#!">Remove</a>
                              </div>
                            </div>
                          </td>
                        </tr>
                        <tr className="hover-actions-trigger btn-reveal-trigger position-static">
                          <td className="align-middle product white-space-nowrap"><a className="fw-semi-bold" href="../landing/product-details.html">Amazon Basics Matte Black Wired K...</a></td>
                          <td className="align-middle rating white-space-nowrap fs--2"><span className="fa fa-star text-warning"></span><span className="fa fa-star text-warning"></span><span className="fa fa-star text-warning"></span><span className="fa-regular fa-star text-warning-300"></span><span className="fa-regular fa-star text-warning-300"></span></td>
                          <td className="align-middle review" style={{"min-width":"350px"}}>
                            <p className="fw-semi-bold text-1000 mb-0">I chose wisely. The phone is in excellent condition, with no scratches or dents, excellent battery life, and flawless...<a href='#!'>See more</a></p>
                          </td>
                          <td className="align-middle text-end status"><span className="badge badge-phoenix fs--2 badge-phoenix-warning"><span className="badge-label">Pending</span><span className="ms-1" data-feather="alert-octagon" style={{"height":"12.8px","width":"12.8px"}}></span></span></td>
                          <td className="align-middle text-end date white-space-nowrap">
                            <p className="text-700 mb-0">Nov 07, 11:20 AM</p>
                          </td>
                          <td className="align-middle white-space-nowrap text-end pe-0">
                            <div className="font-sans-serif btn-reveal-trigger position-static"><button className="btn btn-sm dropdown-toggle dropdown-caret-none transition-none btn-reveal fs--2" type="button" data-bs-toggle="dropdown" data-boundary="window" aria-haspopup="true" aria-expanded="false" data-bs-reference="parent"><span className="fas fa-ellipsis-h fs--2"></span></button>
                              <div className="dropdown-menu dropdown-menu-end py-2"><a className="dropdown-item" href="#!">View</a><a className="dropdown-item" href="#!">Export</a>
                                <div className="dropdown-divider"></div><a className="dropdown-item text-danger" href="#!">Remove</a>
                              </div>
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div className="row align-items-center justify-content-between py-2 pe-0 fs--1">
                    <div className="col-auto d-flex">
                      <p className="mb-0 d-none d-sm-block me-3 fw-semi-bold text-900" data-list-info="data-list-info"></p><a className="fw-semi-bold" href="#!" data-list-view="*">View all<span className="fas fa-angle-right ms-1" data-fa-transform="down-1"></span></a><a className="fw-semi-bold d-none" href="#!" data-list-view="less">View Less<span className="fas fa-angle-right ms-1" data-fa-transform="down-1"></span></a>
                    </div>
                    <div className="col-auto d-flex"><button className="page-link" data-list-pagination="prev"><span className="fas fa-chevron-left"></span></button>
                      <ul className="mb-0 pagination"></ul><button className="page-link pe-0" data-list-pagination="next"><span className="fas fa-chevron-right"></span></button>
                    </div>
                  </div>
                </div>
              </div> */}
            </div>
          </div>
        </div>



        {/* modal add cooperatives */}

        <div className="modal fade" id="addEventModal" data-bs-backdrop="static" role="dialog" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
          <div className="modal-dialog modal-md">
            <div className="modal-content border">
              <div id="addEventForm" autoComplete="off">
                <div className="modal-header px-card border-0">
                  <div className="w-100 d-flex justify-content-between align-items-start">
                    <div>
                      <h5 className="mb-0 lh-sm text-1000">Création d'une coopérative</h5>
                    </div><button className="btn p-1 fs--2 text-900" type="button" data-bs-dismiss="modal" aria-label="Close">Fermer </button>
                  </div>
                </div>
                <div className="modal-body p-card py-0">
                  <div className="form-floating mb-5">
                    <select className="form-select" id="categorie" name="region" onChange={handleChangeCoop} value={coopData.region}>
                      <option selected="selected" value="">...</option>
                      {regionList.map((region,index)=>
                        <option value={region.id}>{region.libelle}</option>
                      )}
                    </select>
                    {errors.region && <span className="text-danger p-0 m-0">{errors.region}</span>}
                    <label htmlFor="eventLabel" className="pb-2 text-warning">Région</label>
                  </div>
                  
                  <div className="form-floating mb-3">
                    <input className="form-control" id="sigle" type="text" name="nomCoop" onChange={handleChangeCoop} value={coopData.nomCoop} />
                    {errors.nomCoop && <span className="text-danger p-0 m-0">{errors.nomCoop}</span>}
                    {errorNameCoop !="" && <span className="text-danger p-0 m-0">{errorNameCoop}</span>}
                    <label htmlFor="eventTitle" className="pb-2 text-warning">Nom de la coopérative</label>
                  </div>

                  <div className="form-floating mb-3">
                        <input className="form-control" id="sigle" type="text" name="siege" onChange={handleChangeCoop} value={coopData.siege} />
                        {errors.siege && <span className="text-danger p-0 m-0">{errors.siege}</span>}
                        <label htmlFor="eventTitle" className="pb-2 text-warning">Siege de la coopérative (Ville)</label>
                      </div>
                  <div className="form-floating mb-3">
                    <input className="form-control" id="chef" type="text" name="respCoop" onChange={handleChangeCoop} value={coopData.respCoop} />
                    {errors.respCoop && <span className="text-danger p-0 m-0">{errors.respCoop}</span>}
                    <label htmlFor="eventTitle" className="pb-2 text-warning">Nom complet du responsable</label>
                  </div>

                  <div className="form-floating mb-3">
                    <input className="form-control" id="titre" type="text" name="contacts" onChange={handleChangeCoop} value={coopData.contacts} />
                    {errors.contacts && <span className="text-danger p-0 m-0">{errors.contacts}</span>}
                    <label htmlFor="eventTitle" className="pb-2 text-warning">Contact de la coopérative</label>
                  </div>

                  <div className="form-floating mb-3">
                    <input className="form-control" id="titre" type="file" name="logo" onChange={handleFileChangeCoop} />
                    <label htmlFor="eventTitle" className="pb-2 text-warning">Logo de la coopérative (Facultatif)</label>
                  </div>
                  
                  
                  </div>
                  <div className="modal-footer d-flex justify-content-between align-items-center border-0">
                    <button className="btn btn-primary px-4 form-control" type="button" onClick={submitCoop}>Ajouter</button>
                  </div>
              </div>
            </div>
          </div>
        </div>
            </Content>
        </>
    )
}

export default ViewProj;