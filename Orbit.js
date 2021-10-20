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
        this.fractions = this.#findFractions(point, sigma);

        // Smallest point in orbit
        this.point = Point.convertFractionToPoint(this.fractions[0], sigma);

    }

    // Reassigns sigma of orbit
    // @param: int sigma = new sigma to be assigned
    reassignSigma(sigma) {

        // Fraction values for points with smallest fraction first
        this.fractions = this.#findFractions(this.point, sigma);

    }

    // Finds fraction values for points in orbit
    // @param:  Point point = any given point in an orbit
    //          int sigma   = sigma of orbit
    // @return: Fraction[] fractions with smallest fraction first, in rotational order
    #findFractions(point, sigma) {

        let smallestFractionIndex = 0;
        let fraction = point.getFractionValue(sigma);
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

}

// Point objects carries minimal information so they can be generated quickly (only String value)
class Point {

	// @param: String string            = String that represents point
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

            console.log(this.toString() + "and" + otherFraction.toString());
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
    
}