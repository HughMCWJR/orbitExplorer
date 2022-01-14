onmessage = function(e) {

    postMessage(OrbitSet.generateOrbitSetsByAttributes(e.data[0], e.data[1]));

}