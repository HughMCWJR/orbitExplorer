// Orbit objects carry as much information as can be reasonably found on instantiation
class Orbit {

	// @param:    Point point               = Point in the orbit (can be any of the points)
    //            int sigma                 = Sigma of orbit, if not given assume lowest
	// @assigned: Point point               = Smallest point in orbit
    //            Point[] fractions         = Fractions for points in orbit, assigned in order of rotation (starts with smallest)
	constructor(point, sigma = null) {

        // If sigma is given, assign it. Otherwise assume smallest possible given the point
        if (!sigma) {

            sigma = point.findLowestSigma();

        }

        // Fraction values for points with smallest fraction first
        let givenFraction = point.getFractionValue(sigma);

        this.fractions = Orbit.findOrbitFractions(givenFraction, sigma);

        // Smallest point in orbit
        this.point = Point.convertFractionToPoint(this.fractions[0], sigma);

    }

    // Reassigns sigma of orbit
    // @param: int sigma = new sigma to be assigned
    reassignSigma(sigma) {

        // Fraction values for points with smallest fraction first
        let givenFraction = this.point.getFractionValue(sigma);

        this.fractions = Orbit.findOrbitFractions(givenFraction, sigma);

    }

    // Find rotational number
    // Requires orbit to have fractions assigned
    // @param:  orbit
    // @returm: Fraction rotational number
    static findRotationalNumber(orbit) {

        // Special cases for rotational number
        if (orbit.fractions.length == 1) {

            return new Fraction(1, 1);

        } else if (orbit.fractions.length == 0) {

            throw "No fractions given for finding rotational number";

        }

        // Numerator for rotational number is how many points are jumped
        // each rotation, found here by seeing how far second point jumped
        // by seeing how many fractions are less than it
        let secondFraction = orbit.fractions[1];

        // We already know first fraction is less because first fraction is smallest fraction
        let numberFractionsLess = 1;

        // Do not need to look at first or second fraction because they are already accounted for
        for (let i = 2; i < orbit.fractions.length; i++) {

            if (orbit.fractions[i].compareTo(secondFraction) < 0) {

                numberFractionsLess++;

            }

        }

        // Assign rotational number such that numerator is number of points jumped + 1
        // and denominator is period (fractions) length of orbit
        return new Fraction(numberFractionsLess, orbit.fractions.length);

    }

    // Generate orbits with given attributes
    // Uses algorithm where cursor is moved along a "seed" orbit point
    // generating rotational orbit points with same attributes
    // Cursor is moved by a jump value, jump value is the
    // numerator of the rotational number for the first "seed"
    // Then use new generated points to make more orbit points
    // @param:  int sigma
    //          Fraction rotNumber = rotational number wanted for orbits
    // @return: Orbit[] list of orbits that have given attributes
    static generateOrbitsByAttributes(sigma, rotNumber) {

        // Points of orbits to be returned
        let orbitPoints = [];

        // Digits of original seed point to make more seeds
        // Needs to be reordered to be rotational
        let digits = "0".repeat(rotNumber.denominator - rotNumber.numerator) + "1".repeat(rotNumber.denominator);

        // Cursor to be moved along original seed orbit
        // to find more orbits
        let cursor = 0;

        // Check if rotational number's numerator
        // and denominator are relatively prime
        // If not throw error
        if (rotNumber.numerator != 1 && !rotNumber.isSimplified()) {
            throw "Rotational number is not simplified for finding orbits";
        }

        // Generate first seed orbit point
        let firstOrbitPointString = "";

        for (let i = 0; i < rotNumber.denominator; i++) {

            firstOrbitPointString = firstOrbitPointString + digits.substring(cursor, cursor + 1);

            cursor += rotNumber.numerator;

            // Check if cursor is out of bounds, fix it if so
            if (cursor >= rotNumber.denominator) {
                cursor -= rotNumber.denominator;
            }

        }

        orbitPoints.push(new Point(firstOrbitPointString));

        // Find jump value that creates new orbits
        let jump = null;

        for (let i = 0; i < rotNumber.denominator; i++) {

            if (orbitPoints[0].string.substring(i, i + 1) == "1") {

                let newOrbitPoint = new Point(orbitPoints[0].string);
                
                newOrbitPoint.increaseDigit(i);

                // Check if generated orbit is rotational
                // If so, jump and has been found
                if (OrbitSet.generateOrbitSetFromStrings([newOrbitPoint.string], sigma).rotational) {

                    jump = i;
                    break;

                }

            }

        }

        // If jump is not found throw error
        if (!jump){
            throw "Jump not found for finding orbits";
        }

        // If requested sigma is 2 then done
        if (sigma == 2) {

            return [new Orbit(orbitPoints[0])];

        } else {

            // Organize points in 2d list of groups
            // Groups are made to avoid repeat generation
            // of orbit points
            // In each group, you iterate with jump
            // (period - i) times where i is the index
            // of the point in the current group
            // 2d array so loop knows which groups
            // were made in last iteration (avoids repeats)
            let lastGroups = [[]];

            // Create starter seed based on period (rotational number denominator)
            let point = new Point(orbitPoints[0].string);
            cursor = jump;
            
            for (let i = 0; i < rotNumber.denominator; i++) {

                point.increaseDigit(cursor);

                // Move cursor
                cursor += jump;
                if (cursor >= rotNumber.denominator) {
                    cursor -= rotNumber.denominator;
                }

                lastGroups[0].push(new Point(point.string));
                orbitPoints.push(new Point(point.string));

            }

            // Seed orbit is made to be sigma 3, so iterate until at sigma
            for (let i = 3; i < sigma; i++) {

                let newGroups = [];

                // For each last group made, make set of new groups
                for (let j = 0; j < lastGroups.length; j++) {

                    // Go through each point in the group
                    // Each points creates a new group
                    for (let k = lastGroups[j].length - 1; k >= 0; k--) {

                        newGroups.push([]);

                        let point = new Point(lastGroups[j][k].string);
                        cursor = jump;

                        // Iterate (period - k) time to create new points in their group
                        for (let l = 0; l < k + 1; l++) {

                            point.increaseDigit(cursor);

                            // Move cursor
                            cursor += jump;
                            if (cursor >= rotNumber.denominator) {
                                cursor -= rotNumber.denominator;
                            }

                            newGroups[newGroups.length - 1].push(new Point(point.string));

                        }

                    }

                }

                // Assign all new points found to 
                // Make new groups made here the last groups for the next iteration
                lastGroups = [];

                for (let i = 0; i < newGroups.length; i++) {

                    lastGroups.push([]);

                    for (let j = 0; j < newGroups[i].length; j++) {

                        lastGroups[i].push(newGroups[i][j]);
                        orbitPoints.push(newGroups[i][j]);

                    }
                }

            }

            // Create new list of orbits, assigning each point found
            // to an orbit
            let orbits = []

            for (let i = 0; i < orbitPoints.length; i++) {

                orbits.push(new Orbit(orbitPoints[i], sigma));

            }

            return orbits;

        }

    }

    // Convert orbit to string be returning smallest point's string
    toString() {
        return "_" + this.point.string;
    }

    // Find other fractions in an orbit with the given fraction
    // @param:  Fraction fraction
    //          Int sigma    
    // @return: Fraction[] fractions that orbit with given fraction, 
    //                     in order of rotation with smallest fraction first
    static findOrbitFractions(fraction, sigma) {

        let smallestFractionIndex = 0;
        let foundFractions = [fraction, fraction.nextFraction(sigma)];

        while (foundFractions[0].compareTo(foundFractions[foundFractions.length - 1]) != 0) {

            if (foundFractions[foundFractions.length - 1].compareTo(foundFractions[smallestFractionIndex]) < 0) {

                smallestFractionIndex = foundFractions.length - 1;

            }

            foundFractions.push(foundFractions[foundFractions.length - 1].nextFraction(sigma));

        }

        foundFractions.splice(foundFractions.length - 1, 1);

        return foundFractions.slice(smallestFractionIndex).concat(foundFractions.slice(0, smallestFractionIndex));

    }

}

// Point objects carries minimal information so they can be generated quickly (only String value)
class Point {

	// @param: String string = String that represents point
	constructor(string) {

		this.string = string;

	}

	// Convert Fraction value to Point
	static convertFractionToPoint(fraction, sigma) {

		if (sigma < 1) {

			throw "Sigma not valid for converting Fraction to String";

		}

        // Find length of String value
        // Do this by finding a stringLength and fraction such that 
        // an equivalent of fraction has the property
        // fraction.denominator == (sigma ** stringLength) - 1
        let stringLength = 1;

        while (((sigma ** stringLength) - 1) % fraction.denominator != 0) {

            stringLength++;

        }

        // String value
        let string = "";

        // Number to multiply by numerator and denominator to get equivalent fraction
        // That satisfies above property
        let equivalentFractionMultiplier = ((sigma ** stringLength) - 1) / fraction.denominator;

        // Numerator to be subtracted from to find String value
        let numerator = fraction.numerator * equivalentFractionMultiplier;

        // Generate String value by converting numerator
        // to base sigma then adding zeroes on the front
        // to get desired string length
        let convertedToBaseSigma = numerator.toString(sigma);

        return new Point("0".repeat(stringLength - convertedToBaseSigma.length) + convertedToBaseSigma);

	}

    // Get Fraction value of this point
    // @param: int sigma = sigma for Fraction to be based on
    getFractionValue(sigma) {
        return new Fraction(parseInt(this.string, sigma), (sigma ** this.string.length) - 1);
    }

    // Get lowest possible sigma for this point based on string
    findLowestSigma() {

        let sigma = 0;

        for (let i = 0; i < this.string.length; i++) {

            let digitValue = parseInt(this.string.substring(i, i + 1));

            if (sigma < digitValue) {

                sigma = digitValue;

            }

        }

        return sigma + 1;

    }

    // Increase specified index in string by 1
    // @param:  int index = index of digit to increase
    // @return: this point
    increaseDigit(index) {

        let string = this.string;

        string = this.string.substring(0, index);
        string = string + (parseInt(this.string.substring(index, index + 1)) + 1).toString();
                
        if (index != this.string.length - 1) {
            string = string + this.string.substring(index + 1);
        }

        this.string = string;

        return this;

    }

}

class Fraction {

    // Maintain numerator and denominator in standard form such that denominator is 1 less than (sigma ** period)
    constructor(numerator, denominator) {

        this.numerator = numerator;
		this.denominator = denominator;

	}

	// Calculate approximate value of fraction
    calcApproxValue() {
        return this.numerator / this.denominator;
    }

    // Get next fraction in an orbit of a given sigma
    nextFraction(sigma) {
        return Fraction.mod(new Fraction(this.numerator * sigma, this.denominator));
    }

    // Mod fraction by 1
    // @return: fraction
    static mod(fraction) {
        
        while (fraction.numerator >= fraction.denominator) {

            fraction.numerator -= fraction.denominator;

        }

        while (fraction.numerator < 0) {

            fraction.numerator += fraction.denominator;

        }

        return fraction;

    }

    // Multiply fraction by integer and return the result
    // @param:  Fraction fraction = fraction to multiply
    //          int number        = number to be multiplied by
    // @return: new Fraction made
    static multiply(fraction, number) {
        return Fraction.mod(new Fraction(fraction.numerator * number, fraction.denominator));
    }

    // Compare two fractions
    // Only works if they are in standard form
    // @param:  Fraction otherFraction = other fraction to compare to
    // @return: returns difference between numerators
    compareTo(otherFraction) {

        if (this.denominator != otherFraction.denominator) {

            console.log(this.toString() + " and " + otherFraction.toString());
            throw "Comparing fractions in different standard form";

        }

        return this.numerator - otherFraction.numerator;

    }

    // Finds the distance between two fractions, going from the first to the second
    // Only works if they are in standard form
    // @param:  Fraction otherFraction = other fraction
    // @return: returns Fraction that is the difference, fixed to be not negative
    distanceTo(otherFraction) {

        if (this.denominator != otherFraction.denominator) {

            throw "Comparing fractions in different standard form";

        }

        let distance = new Fraction(otherFraction.numerator - this.numerator, this.denominator);

        return Fraction.mod(distance);

    }

    toString() {
        return this.numerator.toString() + "/" + this.denominator.toString();
    }

    // Checks if fraction is simplified
    isSimplified() {
        return this.denominator % this.numerator != 0;
    }
    
}
