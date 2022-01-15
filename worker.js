onmessage = function(e) {

    importScripts('orbitSet.js','orbit.js');

    postMessage(OrbitSet.generateOrbitSetsByAttributes(e.data[0], e.data[1]));

}