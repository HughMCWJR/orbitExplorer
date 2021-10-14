function generateOrbitAttributes() {

    let orbit;

    // Set if sigma is set
    let sigma = document.getElementById("sigma").value.match(/\d+/);

    if (sigma != null) {

        sigma = parseInt(sigma[0]);

    } else {

        sigma = -1;

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
        orbit = new Orbit(Point.convertFractionToPoint(new Fraction(numerator, denominator), sigma), sigma);

    } else {

        // See if point is in orbit
        stringPoint = document.getElementById("orbitInput").value.match(/\d+/)[0];

        // If neither fraction nor point is in orbit alert user and return
        if (stringPoint != null) {

            // Use sigma if able
            if (sigma != null) {

                // Set orbit from point
                orbit = new Orbit(new Point(stringPoint), sigma);

            } else {

                // Set orbit from point
                orbit = new Orbit(new Point(stringPoint));

            }

        } else {

            alert("Value for orbit not given");
            return;

        }

    }

    // Display attributes of orbit
    document.getElementById("smallestPoint").innerHTML = orbit.point.string;
    document.getElementById("smallestFraction").innerHTML = orbit.fractions[0].toString();
    document.getElementById("rotational").innerHTML = orbit.rotational;
    document.getElementById("rotationalNumber").innerHTML = orbit.rotational ? orbit.rotationalNumber : "DNE";

}