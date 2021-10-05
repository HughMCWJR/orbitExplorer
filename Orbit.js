class Orbit {

    constructor(numerator) {

    }

}

class Fraction {

    constructor(numerator, denominator) {
        this.numerator = numerator;
        this.denominator = denominator;
    }

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
