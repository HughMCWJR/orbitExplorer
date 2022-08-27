// Orbit set containing any number of orbits
class OrbitSet {

    // @param:    Orbit[] orbits  = orbits in this set
    //            int sigma                 = Sigma of orbit, if not given assume lowest
    //            Fraction rotationalNumber = Fraction that represents rotational number of orbit set,
    //                                        if not given then orbit set checks if it is rotational
    //                                        and finds rotational number if so
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

    // Generate 2d array of digit gaps for this orbit set
    // Each critical length between fixed points is represented by an array in this array
    // Each array is assigned such that [min Fraction in this digit, max Fraction]
    // @return: 2d array
    generateDigitGaps() {

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

        return digitGaps;

    }

    // Checks if orbit set is rotational
    // Requires orbits in set to have point, sigma, and fractions assigned
    // @return: Bool if fraction is rotational
    #checkRotational() {

        // Generate digit gaps for this orbit
        let digitGaps = this.generateDigitGaps();

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
    // @param:  String[] strings = string values of points to be in orbit set
    //          int sigma        = sigma of orbit set
    // @return: OrbitSet orbitSet
    static generateOrbitSetFromStrings(strings, sigma = null) {

        // Find sigma if needed
        if (!sigma) {

            for (let i = 0; i < strings.length; i++) {

                let point = new Point(strings[i]);

                if (point.findLowestSigma() > sigma) {

                    sigma = point.findLowestSigma();

                }

            }

        }

        // Find orbits from points
        let orbits = [];

        for (let i = 0; i < strings.length; i++) {

            orbits.push(new Orbit(new Point(strings[i]), sigma));

        }

        return new OrbitSet(orbits, sigma);

    }

    // Convert orbit set to string
    toString() {
        
        let string = "";

        // For each orbit in set, add it and delimeter comma
        for (let i = 0; i < this.orbits.length; i++) {
            string = string + this.orbits[i].toString() + ","
        }

        return "[" + string.substring(0, string.length - 1) + "]";

    }

    // Add point to this orbit set, deos not modify set
    // @param : Orbit orbit
    // @return: Orbit Set with new orbit added
    addOrbit(orbit) {

        let copyOfOrbits = [...this.orbits, orbit];

        // Give null for rotational number so orbit set checks if it is rotational
        return new OrbitSet(copyOfOrbits, this.sigma);

    }

    // Generate orbit sets with given attributes
    // Uses algorithm where it generates maximal
    // rotational sets by shifting pre-images.
    // Finds non-maximal sets by taking all possible
    // subsets of maximal sets.
    // @param:  int sigma
    //          Fraction rotNumber = rotational number wanted for orbits
    // @return: OrbitSet[] list of orbit sets that have given attributes,
    //                     sets are returned in rotational order
    static generateOrbitSetsByAttributes(sigma, rotNumber) {

        // Rotational sets object with k value as keys and array of string points as values
        let sets = {};
        for (let i = 1; i <= sigma - 1; i++)
            sets[i] = [];

        // Pre-image placements
        // Each index in array represents (i + 1)th pre-image placement in the ith group
        let preImagePlacement = [];

        // Current points for current Pre-image placement
        for (let i = 0; i < sigma - 2; i++)
            preImagePlacement.push(0);

        // Keeps track of iterations done for logging progress
        // let iteration = 0;
        // const totalNumberOfIterations = rotNumber.denominator ** (sigma - 2);

        while (true) {
            
            // Array of booleans representing whether orbit set has orbit at that pre-image interval
            const maxSet = []
            for (let i = 0; i < sigma - 1; i++)
                maxSet.push(true);

            sets[sigma - 1].push(OrbitSet.getArrayOfStringsFromSet(preImagePlacement, maxSet, rotNumber));

            OrbitSet.findLowerSets(sets, preImagePlacement, rotNumber, maxSet, sigma - 1);

            if (!OrbitSet.increasePreImageByIndex(rotNumber.denominator, preImagePlacement, 0))
                break;

            // Logging progress
            // iteration += 1;
            // console.log(iteration / totalNumberOfIterations);

        }

        // TEMP
        // Check for duplicates
        /*
        for (let i = 1; i <= sigma - 1; i++) {

            const stringCopyArray = [];
            for (let j = 0; j < sets[i].length; j++)
                stringCopyArray.push(sets[i][j].toString());

            const duplicates = stringCopyArray.filter((item, index) => stringCopyArray.indexOf(item) !== index);
            for (duplicate of duplicates)
                console.log(duplicate);

        }
        */

        // Orbit sets to return
        let orbitSets = [];

        for (let i = 1; i <= sigma - 1; i++)
            orbitSets = orbitSets.concat(sets[i]);

        return orbitSets;

    }

    static increasePreImageByIndex(q, currentPreImagePlacement, i) {

        if (i == currentPreImagePlacement.length)
            return false;

        currentPreImagePlacement[i] = currentPreImagePlacement[i] + 1;

        if (currentPreImagePlacement[i] == q) {

            currentPreImagePlacement[i] = 0;
            return OrbitSet.increasePreImageByIndex(q, currentPreImagePlacement, i + 1);

        }

        return true;

    }

    static getArrayOfStringsFromSet(preImagePlacement, set, rotNumber) {

        let currentDigit = 0;

        let orbitStrings = [];

        // Go through each group assigning digit
        for (let i = 0; i < rotNumber.denominator; i++) {

            for (let j = 0; j < set.length; j++) {

                if (i === 0)
                    orbitStrings.push("");

                if (set[j])
                    orbitStrings[j] += currentDigit.toString();

                if (j !== set.length - 1 && preImagePlacement[j] === i)
                    currentDigit += 1;
    
            }

            if (i + 1 === rotNumber.denominator - rotNumber.numerator)
                currentDigit += 1;

        }

        let finalOrbitStrings = [];
        
        // Convert orbitStrings array into string
        for (let i = 0; i < set.length; i++) {

            if (set[i]) {

                let digits = orbitStrings[i].split("");

                let orbitString = "";

                for (let j = 0; j !== rotNumber.denominator - rotNumber.numerator; j = OrbitSet.mod(j + rotNumber.numerator, rotNumber.denominator)) {

                    orbitString += digits[j].toString();

                }

                orbitString += digits[rotNumber.denominator - rotNumber.numerator].toString();

                finalOrbitStrings.push(orbitString);

            }

        }

        return finalOrbitStrings;

    }

    static findLowerSets(sets, preImagePlacement, rotNumber, currentSet, currentK) {

        if (currentK === 1)
            return;

        // Go through and manually do edge cases with first point
        let firstPointIndex = 0;
        while (!currentSet[firstPointIndex])
            firstPointIndex += 1;

        // Wanted to make sure that orbits don't claim two modulos classes at a time so added "currentSet[j + 1]"
        if (preImagePlacement[firstPointIndex] === 0 && currentSet[firstPointIndex + 1]) {

            const newSet = [...currentSet];
            newSet[firstPointIndex] = false;

            sets[currentK - 1].push(OrbitSet.getArrayOfStringsFromSet(preImagePlacement, newSet, rotNumber));

            OrbitSet.findLowerSets(sets, preImagePlacement, rotNumber, newSet, currentK - 1);

        }

        // Go through every point and check if it can be removed
        // If comes across extra pre-image stop to avoid duplicates
        for (let i = 0; i < rotNumber.denominator; i++) {

            for (let j = 0; j < currentSet.length; j++) {

                if (currentSet[j]) {

                    if (j === 0) {
                        continue;

                    } else if (j === currentSet.length - 1) {

                        if (preImagePlacement[preImagePlacement.length - 1] === i) {

                            const newSet = [...currentSet];
                            newSet[j] = false;

                            sets[currentK - 1].push(OrbitSet.getArrayOfStringsFromSet(preImagePlacement, newSet, rotNumber));


                            OrbitSet.findLowerSets(sets, preImagePlacement, rotNumber, newSet, currentK - 1);

                        }

                    } else {

                        if ((preImagePlacement[j - 1] === i && preImagePlacement[j] >= i)) {

                            const newSet = [...currentSet];
                            newSet[j] = false;

                            sets[currentK - 1].push(OrbitSet.getArrayOfStringsFromSet(preImagePlacement, newSet, rotNumber));

                            OrbitSet.findLowerSets(sets, preImagePlacement, rotNumber, newSet, currentK - 1);

                        }

                    }

                } else if (j === 0) {

                    if (preImagePlacement[j] === i)
                        return;

                } else if (j === currentSet.length - 1) {

                    if (preImagePlacement[j - 1] === i)
                        return;

                } else if ((preImagePlacement[j - 1] === i && preImagePlacement[j] >= i) ||
                           (preImagePlacement[j - 1] >= i  && preImagePlacement[j] === i))
                    return;

            }

        }

    }

    static mod(n, m) {
        return ((n % m) + m) % m;
    }

    // OLD SLOWER ALGORITHM
    // Generate orbit sets with given attributes
    // Uses algorithm where it checks orbits in "wiggle"
    // intervals between two points
    // This implementation will use arbitrary wiggle
    // interval between first two digit gaps
    // and find the wiggle inteval between them
    // This process will continue making larger orbit sets
    // until maximal orbit sets generated
    // @param:  int sigma
    //          Fraction rotNumber = rotational number wanted for orbits
    // @return: OrbitSet[] list of orbit sets that have given attributes,
    //                     sets are returned in rotational order
    static oldGenerateOrbitSetsByAttributes(sigma, rotNumber) {

        // Denominator for all fractions in orbits given these attributes
        const denominator = (sigma ** rotNumber.denominator) - 1;

        // Basis orbits for orbit sets
        let orbits = Orbit.generateOrbitsByAttributes(sigma, rotNumber);

        // Orbit sets to return
        let orbitSets = [];

        // Orbit sets to build off of in next iteration
        let newOrbitSets = [];

        // Assign starting orbit sets from orbits
        for (let i = 0; i < orbits.length; i++) {
            
            let orbitSet = new OrbitSet([orbits[i]], sigma, rotNumber);
            
            orbitSets.push(orbitSet);
            newOrbitSets.push(orbitSet);

        }

        // Critical length
        const criticalLength = new Fraction(denominator / sigma, denominator);

        // Index of second point by ascending value
        // Needed for finding gap between largest orbit and smallest
        let secondIndexByOrder = Orbit.findIndexOfSecondPoint(rotNumber);

        // While finding new orbit sets, build larger orbit sets based off of current orbit sets
        while (newOrbitSets.length != 0) {

            let  foundOrbitSets = [];

            // For each current orbit set, try and build bigger ones
            for (let i = 0; i < newOrbitSets.length; i++) {

                // Have to go through gaps in between each adjacent orbit
                // because new orbits can be in between any two lower orbits
                for (let j = 0; j < newOrbitSets[i].orbits.length; j++) {

                    let gapMinimum;
                    let gapMaximum;

                    // Find two adjacent fractions defining a gap
                    // If last orbit in set then it is adjacent with next group
                    if (j == newOrbitSets[i].orbits.length - 1) {

                        gapMinimum = newOrbitSets[i].orbits[j].fractions[0];
                        gapMaximum = newOrbitSets[i].orbits[0].fractions[secondIndexByOrder];

                    } else {

                        gapMinimum = newOrbitSets[i].orbits[j].fractions[0];
                        gapMaximum = newOrbitSets[i].orbits[j + 1].fractions[0];

                    }

                    // Find length to see how many critical lengths there are
                    // Leftover length after subtracting critical lengths is wiggle length
                    let length = gapMaximum.compareTo(gapMinimum);

                    let numCriticalLengths = 0;

                    while (length > criticalLength.numerator) {
                        numCriticalLengths++;
                        length -= criticalLength.numerator;
                    }

                    // Place wiggle length in between every critical length
                    // and on each opposite end
                    // Add possible orbits from these wiggle lengths
                    let possibleOrbitFractions = [];

                    for (let k = 0; k <= numCriticalLengths; k++) {

                        // Find bounds for possible fractions, non-inclusive
                        let lowerNumerator = gapMinimum.numerator + Math.floor(criticalLength.numerator * k);
                        let upperNumerator = gapMaximum.numerator - Math.floor(criticalLength.numerator * (numCriticalLengths - k));

                        // Add all possible orbit fractions
                        for (let l = lowerNumerator + 1; l < upperNumerator; l++) {

                            possibleOrbitFractions.push(new Fraction(l, denominator));

                        }

                    }

                    // Check to see if each fraction is rotational with this orbit set
                    // If so, add to new orbit sets found
                    for (let k = 0; k < possibleOrbitFractions.length; k++) {

                        // First check that next fraction is larger then largest in this set
                        // This allows sets to be in rotational/ascending order and does not allow duplicates
                        if (Orbit.findOrbitFractions(possibleOrbitFractions[k], sigma)[0].compareTo(newOrbitSets[i].orbits[newOrbitSets[i].orbits.length - 1].fractions[0]) > 0) {

                            let point = Point.convertFractionToPoint(possibleOrbitFractions[k], sigma);
        
                            let possibleOrbitSet = newOrbitSets[i].addOrbit(new Orbit(point, sigma));
        
                            if (possibleOrbitSet.rotational) {
        
                                foundOrbitSets.push(possibleOrbitSet);
        
                            }

                        }

                    }

                }

            }

            // Add found orbit sets
            newOrbitSets = [];

            for (let i = 0; i < foundOrbitSets.length; i++) {

                newOrbitSets.push(foundOrbitSets[i]);
                orbitSets.push(foundOrbitSets[i]);

            }

        }

        return orbitSets;

    }

}