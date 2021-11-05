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
        orbitSet = OrbitSet.generateOrbitSetFromStrings([Point.convertFractionToPoint(new Fraction(numerator, denominator), sigma).string], sigma);

    } else {

        // See if points of orbit written
        stringPoints = document.getElementById("orbitInput").value.match(/\d+/g);

        // If neither fraction nor point is in orbit alert user and return
        if (stringPoints != null) {

            // Generate orbits
            let givenOrbits = []

            for (let i = 0; i < stringPoints.length; i++) {

                givenOrbits.push(new Orbit(new Point(stringPoints[i]), sigma));

            }

            // Set orbit from point
            orbitSet = new OrbitSet(givenOrbits, sigma);

        } else {

            alert("Value for orbit not given");
            return;

        }

    }

    document.getElementById("smallestPoint").innerHTML = orbitSet.orbits[0].point.string;
    document.getElementById("smallestFraction").innerHTML = orbitSet.orbits[0].fractions[0].toString();
    document.getElementById("rotational").innerHTML = orbitSet.rotational;
    document.getElementById("rotationalNumber").innerHTML = orbitSet.rotational ? orbitSet.rotationalNumber : "DNE";
    document.getElementById("cardinality").innerHTML = orbitSet.orbits.length;

}

function generateOrbits() {

    // See if sigma is set
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

function generateOrbitSets() {

    // See if sigma is set
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

    // Find orbit sets
    let orbitSets = OrbitSet.generateOrbitSetsByAttributes(sigma, rotNumber);

    // Convert found orbits to string
    let string = "";

    for (let i = 0; i < orbitSets.length; i++) {

        string = string + orbitSets[i].toString() + ", ";

    }

    document.getElementById("orbitSets").innerHTML = string.substring(0, string.length - 1);

    // Print how many orbits there are of each length
    numOrbitEachLength = [];

    for (let i = 0; i < orbitSets.length; i++) {

        if (numOrbitEachLength.length < orbitSets[i].orbits.length) {

            numOrbitEachLength.push(0);

        }

        numOrbitEachLength[orbitSets[i].orbits.length - 1] += 1;

    }

    string = "";

    for (let i = 0; i < numOrbitEachLength.length; i++) {

        string = string + "Orbit Sets of cardinality " + (i + 1).toString() + ": " + numOrbitEachLength[i].toString() + "<br>";

    }

    document.getElementById("orbitSetsByCardinality").innerHTML = string;

}