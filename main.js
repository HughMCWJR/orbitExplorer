let orbitSet;

function generateOrbitAttributes() {

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
        if (sigma == null) {

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

function generateOrbits() {

    // Set if sigma is set
    let sigma = document.getElementById("sigma").value.match(/\d+/);

    if (sigma) {

        sigma = parseInt(sigma[0]);

    } else {

        alert("Sigma not given");
        return;

    }

    // Get rot num
    rotNumber = document.getElementById("orbitRotNum").value.match(/\d+\/\d+/);

    // Sigma is required for creating orbits
    // Is not set alert user and return from function
    if (rotNumber == null) {

        alert("Rotaional number not given");
        return;

    }

    // Find numerator and denominator
    let numerator   = document.getElementById("orbitRotNum").value.match(/\d+\//)[0];
    let denominator = document.getElementById("orbitRotNum").value.match(/\/\d+/)[0];

    // Change numerator and denominator to integers
    numerator   = parseInt(numerator.substring(0, numerator.length - 1));
    denominator = parseInt(denominator.substring(1));

    // Set rotational number
    rotNumber = new Fraction(numerator, denominator);

    // Find orbits
    let orbits = Orbit.generateOrbitsByAttributes(sigma, rotNumber);

    // Convert found orbits to string
    let string = "";

    for (let i = 0; i < orbits.length; i++) {

        string = string + orbits[i].toString() + ", ";

    }

    document.getElementById("orbits").innerHTML = string.substring(0, string.length - 1);

}