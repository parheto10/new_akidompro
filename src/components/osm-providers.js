let mapLink= '<a href="http://www.esri.com/">Esri</a>';
let wholink= 'i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community';

export default {
    maptiler: {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
    },
    googleMap: {
        minZoom: 7,
        maxZoom: 25,
        attribution: '&copy; '+mapLink+', '+ wholink,
        url: 'http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
    },
    googleMapStreet: {
        minZoom: 7,
        maxZoom: 25,
        attribution: '&copy; '+mapLink+', '+ wholink,
        url: 'http://{s}.google.com/vt?lyrs=m&x={x}&y={y}&z={z}',
        subdomains: ['mt0','mt1','mt2','mt3']
    }
}