// Orbit objects carry as much information as can be reasonably found on instantiation
class Orbit {

	// @param:    point            = Point in the orbit (can be any of the points)
	//            rotationalNumber = Fraction that represents rotational number of orbit
	// @assigned: points           = Points in orbit, assigned in order of rotation
	constructor(point, sigma = -1, rotationalNumber = null) {

		// Gets array of all points based on point given
		let points = []

		for (let i = 0; i < point.string.length; i++) {

			let string = point.string.substring(i, point.string.length) + point.string.substring(0, i);
			points.push(Point(string));

		}

		this.points = points;

        // If sigma is given, assign it. Otherwise assume smallest possible given the point
        if (sigma > 1) {

            this.sigma = sigma;

        } else {

            this.sigma = point.getLowestSigma();

        }

    }

}

// Point objects carries minimal information so they can be generated quickly (only String value)
class Point {

	// @param: value            = String or Fraction that represents point
	//		   rotationalNumber = Integer that represents sigma of orbit this point belongs to, required if value is a Fraction
	constructor(value, sigma = -1) {

		if (typeof (value) == String) {

			this.string = value;

		} else {

			this.string = Point.convertFractionToString(value, sigma);

		}

	}

	// Convert Fraction value to String value
	static convertFractionToString(fraction, sigma) {

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

        return "0".repeat(stringLength - convertedToBaseSigma.length) + convertedToBaseSigma;

	}

    // Get Fraction value of this point
    // @param: sigma = sigma for Fraction to be based on
    getFractionValue(sigma) {

        return new Fraction(parseInt(this.string, sigma), (sigma ** this.string.length) - 1);

    }

    // Get lowest possible sigma for this point based on string
    getLowestSigma() {

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

    constructor(numerator, denominator) {

        let gcd = findGcd(numerator, denominator);

        this.numerator = numerator / gcd;
		this.denominator = denominator / gcd;

	}

	// Calculate approximate value of fraction
    calcApproxValue() {
        return this.numerator / this.denominator;
    }

    static findGcd(a, b) {

        if (!b) {
            return a;
        }

        return this.findGcd(b, a % b);

    }

}