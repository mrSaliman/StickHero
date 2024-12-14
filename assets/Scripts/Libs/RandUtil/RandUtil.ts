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
}