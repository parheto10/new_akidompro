let mapLink= '<a href="http://www.esri.com/">Esri</a>';
let wholink= 'i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community';

export default {
    googleMap: {
        minZoom: 7,
        maxZoom: 25,
        attribution: '@Copyright - AGRO-MAP CI - CARTOGRAPHIE',
        url: 'http://{s}.google.com/vt?lyrs=m&x={x}&y={y}&z={z}',
        subdomains: ['mt0','mt1','mt2','mt3']
    }
}