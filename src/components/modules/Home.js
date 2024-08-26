import Content from "../Content";
import UserContext from "../context/useContext";
import Sidebar from "./Sidebar";

function Home(){
    const auth  = UserContext();


    return (
        <Content>
                    
        <div className="pb-5">
          <div className="row g-4">
            <div className="col-12 col-xxl-6">
              <div className="mb-8">
                <h2 className="mb-2">PAGE D'ACCUEIL</h2>
              </div>
              <div className="row align-items-center g-4">
                <div className="col-12 col-md-auto card p-2 mx-1">
                  <div className="d-flex align-items-center"><span className="fa-stack" style={{"min-height": "46px","min-width": "46px"}}><span className="fa-solid fa-square fa-stack-2x text-success-300" data-fa-transform="down-4 rotate--10 left-4"></span><span className="fa-solid fa-circle fa-stack-2x stack-circle text-success-100" data-fa-transform="up-4 right-3 grow-2"></span><span className="fa-stack-1x fa-solid fa-star text-success " data-fa-transform="shrink-2 up-8 right-6"></span></span>
                    <div className="ms-3">
                      <h4 className="mb-0">57 Producteurs</h4>
                    </div>
                  </div>
                </div>
                <div className="col-12 col-md-auto card p-2 mx-1">
                  <div className="d-flex align-items-center"><span className="fa-stack" style={{"min-height": "46px","min-width": "46px"}}><span className="fa-solid fa-square fa-stack-2x text-warning-300" data-fa-transform="down-4 rotate--10 left-4"></span><span className="fa-solid fa-circle fa-stack-2x stack-circle text-warning-100" data-fa-transform="up-4 right-3 grow-2"></span><span className="fa-stack-1x fa-solid fa-pause text-warning " data-fa-transform="shrink-2 up-8 right-6"></span></span>
                    <div className="ms-3">
                      <h4 className="mb-0">5 Parcelles</h4>
                    </div>
                  </div>
                </div>
                <div className="col-12 col-md-auto card p-2 mx-1">
                  <div className="d-flex align-items-center"><span className="fa-stack" style={{"min-height": "46px","min-width": "46px"}}><span className="fa-solid fa-square fa-stack-2x text-danger-300" data-fa-transform="down-4 rotate--10 left-4"></span><span className="fa-solid fa-circle fa-stack-2x stack-circle text-danger-100" data-fa-transform="up-4 right-3 grow-2"></span><span className="fa-stack-1x fa-solid fa-xmark text-danger " data-fa-transform="shrink-2 up-8 right-6"></span></span>
                    <div className="ms-3">
                      <h4 className="mb-0">150 Coopératives</h4>
                    </div>
                  </div>
                </div>
               
              </div>
              <hr className="bg-200 mb-6 mt-4" />
              <div className="row flex-between-center mb-4 g-3">
                <div className="col-auto">
                  <h3>Evolution plants Plantés</h3>
                  <p className="text-700 lh-sm mb-0">Campagne 2022-2023</p>
                </div>
                <div className="col-8 col-sm-4"><select className="form-select form-select-sm mt-2" id="select-gross-revenue-month">
                    <option>Mar 1 - 31, 2022</option>
                    <option>April 1 - 30, 2022</option>
                    <option>May 1 - 31, 2022</option>
                  </select></div>
              </div>
              <div className="echart-total-sales-chart" style={{"min-height":"320px","width":"100%"}}></div>
            </div>
            <div className="col-12 col-xxl-6">
              <div className="row g-3">
                <div className="col-12 col-md-6">
                  <div className="card h-100">
                    <div className="card-body">
                      <div className="d-flex justify-content-between">
                        <div>
                          <h5 className="mb-1">Superficies Total (Ha)</h5>
                          <h6 className="text-700">Campagne 2022-2023</h6>
                        </div>
                        <h4>1600,247</h4>
                      </div>
                      <div className="d-flex justify-content-center px-4 py-6">
                        <div className="echart-total-orders" style={{"height":"85px","width":"115px"}}></div>
                      </div>
                      <div className="mt-2">
                        <div className="d-flex align-items-center mb-2">
                          <div className="bullet-item bg-primary me-2"></div>
                          <h6 className="text-900 fw-semi-bold flex-1 mb-0">Parcelles Hommes</h6>
                          <h6 className="text-900 fw-semi-bold mb-0">52%</h6>
                        </div>
                        <div className="d-flex align-items-center">
                          <div className="bullet-item bg-primary-100 me-2"></div>
                          <h6 className="text-900 fw-semi-bold flex-1 mb-0">Parcelles Femmes</h6>
                          <h6 className="text-900 fw-semi-bold mb-0">48%</h6>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-12 col-md-6">
                  <div className="card h-100">
                    <div className="card-body">
                      <div className="d-flex justify-content-between">
                        <div>
                          <h5 className="mb-1">Evolution carbone<span className="badge badge-phoenix badge-phoenix-warning rounded-pill fs--1 ms-2"> <span className="badge-label">+26.5%</span></span></h5>
                          <h6 className="text-700">Campagne 2022-2023</h6>
                        </div>
                        <h4>356</h4>
                      </div>
                      <div className="pb-0 pt-4">
                        <div className="echarts-new-customers" style={{"height":"180px","width":"100%"}}></div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-12 col-md-6">
                  <div className="card h-100">
                    <div className="card-body">
                      <div className="d-flex justify-content-between">
                        <div>
                          <h5 className="mb-2">Especes Plantées</h5>
                          <h6 className="text-700">Campagne 2022-2023</h6>
                        </div>
                      </div>
                      <div className="pb-4 pt-3">
                        <div className="echart-top-coupons" style={{"height":"115px","width":"100%"}}></div>
                      </div>
                      <div>
                        <div className="d-flex align-items-center mb-2">
                          <div className="bullet-item bg-primary me-2"></div>
                          <h6 className="text-900 fw-semi-bold flex-1 mb-0">Acajou</h6>
                          <h6 className="text-900 fw-semi-bold mb-0">72%</h6>
                        </div>
                        <div className="d-flex align-items-center mb-2">
                          <div className="bullet-item bg-primary-200 me-2"></div>
                          <h6 className="text-900 fw-semi-bold flex-1 mb-0">Cedrela</h6>
                          <h6 className="text-900 fw-semi-bold mb-0">18%</h6>
                        </div>
                        <div className="d-flex align-items-center">
                          <div className="bullet-item bg-info-500 me-2"></div>
                          <h6 className="text-900 fw-semi-bold flex-1 mb-0">Akpi</h6>
                          <h6 className="text-900 fw-semi-bold mb-0">10%</h6>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-12 col-md-6">
                  <div className="card h-100">
                    <div className="card-body d-flex flex-column">
                      <div className="d-flex justify-content-between">
                        <div>
                          <h5 className="mb-2">Progression planting </h5>
                          <h6 className="text-700">2022-2023</h6>
                        </div>
                      </div>
                      <div className="d-flex justify-content-center pt-3 flex-1">
                        <div className="echarts-paying-customer-chart" style={{"height":"100%","width":"100%"}}></div>
                      </div>
                      <div className="mt-3">
                        <div className="d-flex align-items-center mb-2">
                          <div className="bullet-item bg-primary me-2"></div>
                          <h6 className="text-900 fw-semi-bold flex-1 mb-0">Complet</h6>
                          <h6 className="text-900 fw-semi-bold mb-0">30%</h6>
                        </div>
                        <div className="d-flex align-items-center">
                          <div className="bullet-item bg-primary-100 me-2"></div>
                          <h6 className="text-900 fw-semi-bold flex-1 mb-0">Incomplet</h6>
                          <h6 className="text-900 fw-semi-bold mb-0">70%</h6>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="mx-n4 px-4 mx-lg-n6 px-lg-6 bg-white pt-6 pb-9 border-top border-300">
          <div className="row g-6">
            <div className="col-12 col-xl-6">
              <div className="me-xl-4">
                <div>
                  <h3>Productions</h3>
                  <p className="mb-1 text-700">Campagne 2022-2023</p>
                </div>
                <div className="echart-projection-actual" style={{"height":"300px", "width":"100%"}}></div>
              </div>
            </div>
            <div className="col-12 col-xl-6">
              <div>
                <h3>Production par zone</h3>
                <p className="mb-1 text-700">Campagne 2022-2023</p>
              </div>
              <div className="echart-returning-customer" style={{"height":"300px"}}></div>
            </div>
          </div>
        </div> 
       
        </Content>
    )
}

export default Home;