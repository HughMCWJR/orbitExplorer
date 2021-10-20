// Orbit set containing any number of orbits
class OrbitSet {

    // @param:    Orbit[] orbits  = orbits in this set
    //            int sigma                 = Sigma of orbit, if not given assume lowest
    //            Fraction rotationalNumber = Fraction that represents rotational number of orbit set
    // @assigned: ...
    //            bool rotational = if this set is rotational
    constructor(orbits, sigma = null, rotationalNumber = null) {

        if (!orbits || orbits.length == 0) {

            throw "Invalid orbits given for orbit set";

        }
         
        this.orbits = orbits

        // If sigma is given, assign it. Otherwise assume largest sigma of orbits
        if (sigma) {

            this.sigma = sigma;

        } else {

            let largestSigma = orbits[0].point.findLowestSigma();

            for (let i = 1; i < orbits.length; i++) {

                let nextSigma = orbits[i].point.findLowestSigma();
                largestSigma = nextSigma > largestSigma ? nextSigma : largestSigma;

            }

            this.sigma = largestSigma;

            // Make sure each orbit matches the sigma of the set, otherwise make sure it does
            for (let i = 0; i < orbits.length; i++) {
    
                if (orbits[i].point.findLowestSigma != this.sigma) {
                    orbits[i].reassignSigma(this.sigma);
                }
    
            }

        }

        // If given rotational number, assume orbit set is rotational
        // If not test if rotational then assign rotational number
        // based on first orbit
        if (rotationalNumber) {
            
            this.rotational = true;
            this.rotationalNumber = rotationalNumber;

        } else {

            this.rotational = this.#checkRotational();
            this.rotationalNumber = this.rotational ? Orbit.findRotationalNumber(orbits[0]) : null;

        }

    }

    // Checks if orbit set is rotational
    // Requires orbits in set to have point, sigma, and fractions assigned
    // @returm: Bool if fraction is rotational
    #checkRotational() {

        // Each critical length between fixed points is represented by an array in this array
        // Each array is assigned such that [min Fraction in this digit, max Fraction]
        let digitGaps = [];

        for (let i = 0; i < this.sigma; i++) {

            digitGaps.push([]);

        }

        // Go through each fraction in each orbit and see if it 
        // changes range of points in each digit gap
        for (let i = 0; i < this.orbits.length; i++) {

            for (let j = 0; j < this.orbits[i].fractions.length; j++) {
    
                // Digit gap this fraction lies in
                let digit = parseInt(this.orbits[i].point.string.slice(j, j + 1));
    
                // If digit gap has no points so far, just put point in as max and min of range
                // Otherwise check if new point changes min or max of range
                let thisFraction = this.orbits[i].fractions[j];

                if (digitGaps[digit].length == 0) {
    
                    digitGaps[digit].push(thisFraction);
                    digitGaps[digit].push(thisFraction);
    
                } else {
    
                    if (thisFraction.compareTo(digitGaps[digit][0]) < 0) {
    
                        digitGaps[digit][0] = thisFraction;
    
                    } else if (thisFraction.compareTo(digitGaps[digit][1]) > 0) {
    
                        digitGaps[digit][1] = thisFraction;
    
                    }
    
                }
    
            }

        }

        // Critical length
        const criticalLength = new Fraction(this.orbits[0].fractions[0].denominator / this.sigma, this.orbits[0].fractions[0].denominator);

        // Number of empty critical lengths counted
        let criticalLengths = 0;

        // Counts number of skipped digits so they can remove from difference calculations
        let skippedDigits = 0;

        // Last fraction seen in a non-empty digit for finding distance and checking
        // if greater than critical length
        let lastFraction = null;

        // Finds last non-empty digit to assign last fraction for finding distance from that to first fraction
        for (let i = 0; i < digitGaps.length; i++) {

            if (digitGaps[digitGaps.length - 1 - i].length != 0) {

                lastFraction = digitGaps[digitGaps.length - 1 - i][1];
                break;

            } else {

                skippedDigits++;

            }

        }

        // Counts number of empty critical lengths
        for (let i = 0; i < digitGaps.length; i++) {

            if (digitGaps[i].length == 0) {

                criticalLengths++;
                skippedDigits++;

            } else {

                // Found critical length if distance between min of this digit and 
                // max of last found is greater than critical length
                if (Fraction.multiply(criticalLength, skippedDigits).distanceTo(lastFraction.distanceTo(digitGaps[i][0])).compareTo(criticalLength) >= 0) {

                    criticalLengths++;

                }

                lastFraction = digitGaps[i][1];

                skippedDigits = 0;

            }

        }

        return criticalLengths >= this.sigma - 1 ? true : false;

    }

    // Generates an orbit set and returns it
    // @param:  String[] points = string values of points to be in orbit set
    //          int sigma       = sigma of orbit set
    // @return: OrbitSet orbitSet
    static generateOrbitSet(points, sigma = null) {

        // Find sigma if needed
        if (!sigma) {

            for (let i = 0; i < points.length; i++) {

                let point = new Point(points[i]);

                if (point.findLowestSigma() > sigma) {

                    sigma = point.findLowestSigma();

                }

            }

        }

        // Find orbits from points
        let orbits = [];

        for (let i = 0; i < points.length; i++) {

            orbits.push(new Orbit(new Point(points[i]), sigma));

        }

        return new OrbitSet(orbits, sigma);

    }

}