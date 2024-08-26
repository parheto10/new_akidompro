import { useEffect } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";

export default function Shapefile({ data }) {
  const map = useMap();

  useEffect(() => {
    if (!data || !map) return;

    const geo = L.geoJson(
      { features: [] },
      {
        onEachFeature: function popUp(f, l) {
          var out = [];
          if (f.properties) {
            for (var key in f.properties) {
              out.push(key + ": " + f.properties[key]);
            }
            l.bindPopup(out.join("<br />"));
          }
        }
      }
    ).addTo(map);

    //geo.addData(data);
  }, [map, data]);

  return null;
}
