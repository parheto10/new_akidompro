function RecolteActivity(){
    return (
        <>
              <div className="tab-pane fade" id="tab-schedule1" role="tabpanel" aria-labelledby="schedule-tab1">
                                   <div className="border-top border-bottom border-200" id="scheduledEmailsTable" data-list='{"valueNames":["subject","sent","date","source","status"],"page":7,"pagination":true}'>
                                     <div className="table-responsive scrollbar mx-n1 px-1">
                                       <table className="table fs--1 mb-0">
                                         <thead>
                                           <tr>
                                             <th className="white-space-nowrap fs--1 align-middle ps-0" style={{"width":"26px"}}>
                                               <div className="form-check mb-0 fs-0"><input className="form-check-input" type="checkbox" data-bulk-select='{"body":"scheduled-email-table-body"}' /></div>
                                             </th>
                                             <th className="sort white-space-nowrap align-middle pe-3 ps-0 text-uppercase" scope="col" data-sort="subject" style={{"width":"31%", "min-width":"150px"}}>Campagne</th>
                                             <th className="sort align-middle pe-3 text-uppercase" scope="col" data-sort="sent" style={{"width":"15%", "min-width":"130px"}}>saison</th>
                                             <th className="sort align-middle text-start text-uppercase" scope="col" data-sort="date" style={{"min-width":"165px"}}>Date</th>
                                             <th className="sort align-middle pe-0 text-uppercase" scope="col" style={{"width":"15%", "min-width":"100px"}}>Culture</th>
                                             <th className="sort align-middle text-end text-uppercase" scope="col" data-sort="status" style={{"width":"15%", "min-width":"100px"}}>Produits(Kg)</th>
                                           </tr>
                                         </thead>
                                         {/* <tbody className="list" id="scheduled-email-table-body">
                                           <tr className="hover-actions-trigger btn-reveal-trigger position-static">
                                             <td className="fs--1 align-middle px-0 py-3">
                                               <div className="form-check mb-0 fs-0"><input className="form-check-input" type="checkbox" data-bulk-select-row='{"mail":{"subject":"Quary about purchased soccer socks","email":"jackson@mail.com"},"active":true,"sent":"Jackson Pollock","date":"Dec 29, 2021 10:23 am","source":"Call","type_status":{"label":"sent","type":"badge-phoenix-success"}}' /></div>
                                             </td>
                                             <td className="subject order align-middle white-space-nowrap py-2 ps-0 text-"><a className="fw-semi-bold text-primary" href="#!">Quary about purchased soccer socks</a>
                                               <div className="fs--2 d-block">jackson@mail.com</div>
                                             </td>
                                             <td className="sent align-middle white-space-nowrap text-start fw-bold text-700 py-2">Jackson Pollock</td>
                                             <td className="date align-middle white-space-nowrap text-900 py-2">Dec 29, 2021 10:23 am</td>
                                             <td className="align-middle white-space-nowrap ps-3"><span className="fa-solid fa-phone text-primary me-2"></span>Call</td>
                                             <td className="status align-middle fw-semi-bold text-end py-2"><span className="badge badge-phoenix fs--2 badge-phoenix-success">sent</span></td>
                                           </tr>
                                         </tbody> */}
                                       </table>
                                     </div>
                                     {/* <div className="row align-items-center justify-content-between py-2 pe-0 fs--1">
                                       <div className="col-auto d-flex">
                                         <p className="mb-0 d-none d-sm-block me-3 fw-semi-bold text-900" data-list-info="data-list-info"></p><a className="fw-semi-bold" href="#!" data-list-view="*">View all<span className="fas fa-angle-right ms-1" data-fa-transform="down-1"></span></a><a className="fw-semi-bold d-none" href="#!" data-list-view="less">View Less<span className="fas fa-angle-right ms-1" data-fa-transform="down-1"></span></a>
                                       </div>
                                       <div className="col-auto d-flex"><button className="page-link" data-list-pagination="prev"><span className="fas fa-chevron-left"></span></button>
                                         <ul className="mb-0 pagination"></ul><button className="page-link pe-0" data-list-pagination="next"><span className="fas fa-chevron-right"></span></button>
                                       </div>
                                     </div> */}
                                   </div>
                                 </div>
        </>
    )
}
export default RecolteActivity;