import {Routes as Switch, Route} from 'react-router-dom';
import { useEffect, useState } from 'react';
import Connexion from './auth/Connexion';
import Login from './auth/Login';
import Home from './modules/Home';
import SimulationCarbon from './modules/carbone/Simulation';
import CreateProjet from './parametres/projets/Create';
import DashCoop from './modules/cooperatives/DashCoop';
import ListeProj from './parametres/projets/Liste';
import ViewProj from './parametres/projets/Views';
import ViewsCoop from './modules/cooperatives/coop/Views';
import ViewsProd from './modules/cooperatives/producteur/Views';
import ProducteurList from './modules/cooperatives/producteur/Liste';
import ListCoop from './modules/cooperatives/coop/Liste';
import CampagneList from './parametres/campagnes/Liste';
import RecolteProdList from './modules/cooperatives/producteur/RecolteList';
import HistoriqueCoopList from './modules/cooperatives/coop/HistoriqueCoopList';
import ProdCoopList from './modules/cooperatives/coop/ProdList';
import ParcList from './modules/cooperatives/coop/ParcList';
import CarteProjet from './modules/cooperatives/Carte';
import CarteCoop from './modules/cooperatives/CarteCoop';
import CarteProducteur from './modules/cooperatives/producteur/CarteProd';
import Analyse from "./modules/rdue/Analyses";
import RapideGrah from "./modules/rdue/RapidGrah";
import HautDodo from "./modules/rdue/HtDodo";
import Scio from "./modules/rdue/Scio";
import ParcListInf4ha from "./modules/cooperatives/coop/ParcList_inf_4ha";
import ParcListSup4ha from "./modules/cooperatives/coop/ParcList_sup_4ha";
import RapportAnalyseAgrial from "./modules/cooperatives/coop/RapportAnalyseAgrial";
import RapportAnalyseCoopaahs from "./modules/cooperatives/coop/RapportAnalyseCOOPAAHS";
import CarteParcelle from "./modules/cooperatives/CarteParcelles";
import ParcListModere from "./modules/cooperatives/coop/ParcListModere";
import ParcListSup4haNonMapper from './modules/cooperatives/coop/ParcList_sup_4ha_non_mapper';
import ProductionList from './modules/cooperatives/coop/ProductionList';
import NewConnexion from './auth/NewLogin';

import Points from './modules/cooperatives/Points';

function Main(){
    return (
        <div>
             <Switch>
                <Route path="/dashboard/" element={<Home />} />
                <Route path="/" element={<NewConnexion />} />
                {/* <Route path="/" element={<Connexion />} /> */}
                <Route path="/login/" element={<Login />} />
                <Route path="/simulation-carbon/" element={<SimulationCarbon />} />

                {/* cooperatives */}
                <Route path="/dash-coop/" element={<DashCoop />} />
                <Route path="/carte-coops/" element={<CarteCoop />} />
                <Route path="/carte-parcelles/" element={<CarteParcelle />} />
                <Route path="/producteur-recoltes-views/:prodCode/" element={<RecolteProdList /> } />
                <Route path="/views-coop/:coopID/" element={<ViewsCoop />} />
                <Route path="/views-producteur/:prodID/" element={<ViewsProd />} />
                <Route path="/list-producteur/" element={<ProducteurList />} />
                <Route path="/list-coop/" element={<ListCoop />} />
                <Route path="/historiques-synchronisation-list/" element={<HistoriqueCoopList />} />
                <Route path="/coops/producteur-list/:coopID/" element={<ProdCoopList />} />
                <Route path="/coops/parcelles-list/:coopID/" element={<ParcList />} />

                <Route path="/carte-producteur-parcelle/:prodCode/" element={<CarteProducteur />} />
                <Route path="/analyseAGRIAL/" element={<RapportAnalyseAgrial />} />
                <Route path="/decret-rapide-grah/" element={<RapideGrah />} />
                <Route path="/decret-haut-dodo" element={<HautDodo />} />
                <Route path="/decret-scio" element={<Scio />} />
                <Route path="/analyseCOOPAAHS/" element={<RapportAnalyseCoopaahs />} />

                {/* Paramètres */}
                <Route path="/create-projets/" element={<CreateProjet />} />
                <Route path="/list-projets/" element={<ListeProj />} />
                <Route path="/views-projet/:projetID/" element={<ViewProj />} />
                <Route path="/list-campagnes/" element={<CampagneList />} />

                 {/*ANALYSE RDUE*/}
                <Route path="/analyses/" element={<Analyse />} />
                <Route path="/coops/parcelles-list-inf-4ha/:coopID/" element={<ParcListInf4ha />} />
                <Route path="/coops/parcelles-list-sup-4ha/:coopID/" element={<ParcListSup4ha />} />
                <Route path="/coops/parcelles-list-sup-4ha-non-mapper/:coopID/" element={<ParcListSup4haNonMapper />} />
                <Route path="/coops/parcelles-list-modere/:coopID/" element={<ParcListModere />} />
                <Route path="/coops/productions-list/:coopID/" element={<ProductionList />} />

                <Route path="/points" element={<Points />} />
            </Switch>
        </div>
    )
}

export default Main;