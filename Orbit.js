// Orbit objects carry as much information as can be reasonably found on instantiation
class Orbit {

	// @param:    point            = Point in the orbit (can be any of the points)
	//            rotationalNumber = Fraction that represents rotational number of orbit
	// @assigned: points           = Points in orbit, assigned in order of rotation
	constructor(point, sigma = -1, rotationalNumber = null) {

		// Gets array of all points based on point given
		const points = []

		for (let i = 0; i < point.string.length; i++) {

			let string = point.string.substring(i, point.string.length) + point.string.substring(0, i);
			points.push(Point(string));

		}

		this.points = points;

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

			this.string = this.convertFractionToString(value, sigma);

		}

	}

	// Convert Fraction value to String value
	convertFractionToString(fraction, sigma) {

		if (sigma < 1) {

			throw "Sigma not valid for converting Fraction to String";

		}



	}

	get string() {
		return this.string;
	}

}

class Fraction {

    constructor(numerator, denominator) {
        this.numerator = numerator;
		this.denominator = denominator;
	}

	// Calculate approximate value of fraction
    calcApproxValue() {
        return this.numerator / this.denominator;
    }

    get numerator() {
        return this.numerator;
    }

    get denominator() {
        return this.denominator;
    }

}
