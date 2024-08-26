export default function Validation(values){
    const errors = {}
    const pattern_email = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$/;

    if(values.email === ""){
        errors.email = "Champs email est obligatoire";
    }else if(!pattern_email.test(values.email)){
        errors.email = "Email saisir est incorrect";
    }

    if(values.nomProjet === ""){
        errors.nomProjet = "Nom projet est obligatoire";
    }

    if(values.countrie === ""){
        errors.countrie = "Le pays est obligatoire";
    }

    if(values.description === ""){
        errors.description = "Champs obligatoire";
    }

    if(values.dateDebut === ""){
        errors.dateDebut = "ce champs est obligatoire";
    }

    if(values.dateFin === ""){
        errors.dateFin = "ce champs est obligatoire";
    }

    if(values.objectif === ""){
        errors.objectif = "ce champs est obligatoire";
    }

    /* if(values.duree_campagne === ""){
        errors.duree_campagne = "La durée est obligatoire";
    } */

    if(values.dateDebutc === ""){
        errors.dateDebutc = "Debut campagne est obligatoire";
    }

    if(values.DateFinc === ""){
        errors.DateFinc = "Fin de campagne est obligatoire";
    }

    if(values.region === ""){
        errors.region = "La region est obligatoire";
    }

    if(values.respCoop === ""){
        errors.respCoop = "Ce champs est obligatoire";
    }

    if(values.nomCoop === ""){
        errors.nomCoop = "Ce champs est obligatoire";
    }

    if(values.siege === ""){
        errors.siege = "Ce champs est obligatoire";
    }

    if(values.contacts === ""){
        errors.contacts = "Le contact est obligatoire";
    }

    if(values.section === ""){
        errors.section = "La section est obligatoire";
    }

    if(values.nomComplet === ""){
        errors.nomComplet = "Ce champs est obligatoire";
    }

    if(values.libelle === ""){
        errors.libelle = "Le libelle est obligatoire";
    }

    if(values.groupe === ""){
        errors.groupe = "Choisir un groupe";
    }

    if(values.latitude === ""){
        errors.latitude = "Latitude est obligatoire";
    }

    if(values.longitude === ""){
        errors.longitude = "Longitude est obligatoire";
    }

    if(values.superficie === "0"){
        errors.superficie = "Superficie est obligatoire";
    }

    if(values.culture === ""){
        errors.culture = "Selectionnez une culture.";
    }

    if(values.acquisition === ""){
        errors.acquisition = "Selectionnez une culture.";
    }

    if(values.projet === ""){
        errors.projet = "Choisissez un projet.";
    }

    if(values.prix_unitaire_culture === ""){
        errors.prix_unitaire_culture = "Ce champs est obligatoire.";
    }

    if(values.saison === ""){
        errors.saison = "Ce champs est obligatoire.";
    }

    if(values.code === ""){
        errors.code = "Ce champs est obligatoire.";
    }
return errors;
}