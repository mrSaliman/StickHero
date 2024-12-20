export default class RandUtil {
    /**
     * Generates a random number in the given range [min, max].
     * @param min - The minimum value (inclusive).
     * @param max - The maximum value (exclusive).
     * @returns A random number in the range [min, max].
     */
    static getRandomNumber(min: number, max: number): number {
        return Math.random() * (max - min) + min;
    }

    /**
     * Generates a random integer in the given range [min, max].
     * @param min - The minimum value (inclusive).
     * @param max - The maximum value (inclusive).
     * @returns A random integer in the range [min, max].
     */
    static getRandomInteger(min: number, max: number): number {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    static distributeRandomNumbers(
        n: number,
        min: number,
        max: number,
        minDistance: number
    ): number[] {
    const range = max - min;
    
    if ((n - 1) * minDistance > range) {
        throw new Error("The range is too small for placing numbers with a given minimum distance.");
    }
    
    
    const positions: number[] = [];
    for (let i = min; i <= max; i += minDistance) {
        positions.push(i);
    }
    
    const result: number[] = [];
    for (let i = 0; i < n; i++) {
        const randomIndex = Math.floor(Math.random() * positions.length);
        result.push(positions[randomIndex]);
        positions.splice(randomIndex, 1); 
    }
    
    return result; 
    }
}