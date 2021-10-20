function generateOrbitAttributes() {

    let orbitSet;

    // Set if sigma is set
    let sigma = document.getElementById("sigma").value.match(/\d+/);

    if (sigma) {

        sigma = parseInt(sigma[0]);

    }

    // See if fraction is in input
    fractionPoint = document.getElementById("orbitInput").value.match(/\d+\/\d+/);

    if (fractionPoint != null) {

        // Sigma is required for creating an orbit with a function
        // Is not set alert user and return from function
        if (sigma == -1) {

            alert("Sigma not given");
            return;

        }

        // Find numerator and denominator
        let numerator   = document.getElementById("orbitInput").value.match(/\d+\//)[0];
        let denominator = document.getElementById("orbitInput").value.match(/\/\d+/)[0];

        // Change numerator and denominator to integers
        numerator   = parseInt(numerator.substring(0, numerator.length - 1));
        denominator = parseInt(denominator.substring(1));

        // Set orbit from fraction
        orbitSet = OrbitSet.generateOrbitSet([Point.convertFractionToPoint(new Fraction(numerator, denominator).string, sigma)], sigma);

    } else {

        // See if point is in orbit
        stringPoint = document.getElementById("orbitInput").value.match(/\d+/)[0];

        // If neither fraction nor point is in orbit alert user and return
        if (stringPoint != null) {

            // Set orbit from point
            orbitSet = OrbitSet.generateOrbitSet([stringPoint], sigma);

        } else {

            alert("Value for orbit not given");
            return;

        }

    }

    document.getElementById("smallestPoint").innerHTML = orbitSet.orbits[0].point.string;
    document.getElementById("smallestFraction").innerHTML = orbitSet.orbits[0].fractions[0].toString();
    document.getElementById("rotational").innerHTML = orbitSet.rotational;
    document.getElementById("rotationalNumber").innerHTML = orbitSet.rotational ? orbitSet.rotationalNumber : "DNE";

}