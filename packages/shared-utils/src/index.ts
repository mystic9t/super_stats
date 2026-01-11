export * from './zodiac/calculator';
export * from './storage';
export * from './numerology-data';

// Basic Numerology Utils
export const calculateLifePathNumber = (date: Date): number => {
    const d = date.getDate();
    const m = date.getMonth() + 1; // 0-indexed
    const y = date.getFullYear();

    const reduce = (n: number): number => {
        while (n > 9 && n !== 11 && n !== 22 && n !== 33) { // Master numbers usually preserved, but for simplicity we might reduce or keep. Let's strictly reduce for now unless specifically asked for Master calculation. Standard reduction:
            let sum = 0;
            while (n > 0) { sum += n % 10; n = Math.floor(n / 10); }
            n = sum;
        }
        return n;
    };

    // Method: Reduce each unit (Day, Month, Year) then sum and reduce again.
    return reduce(reduce(d) + reduce(m) + reduce(y));
};

export const calculateDestinyNumber = (name: string): number => {
    const map: Record<string, number> = {
        a: 1, j: 1, s: 1,
        b: 2, k: 2, t: 2,
        c: 3, l: 3, u: 3,
        d: 4, m: 4, v: 4,
        e: 5, n: 5, w: 5,
        f: 6, o: 6, x: 6,
        g: 7, p: 7, y: 7,
        h: 8, q: 8, z: 8
    };

    const clean = name.toLowerCase().replace(/[^a-z]/g, '');
    let sum = 0;
    for (const char of clean) {
        sum += map[char] || 0;
    }

    const reduce = (n: number): number => {
        while (n > 9) {
            let s = 0;
            while (n > 0) { s += n % 10; n = Math.floor(n / 10); }
            n = s;
        }
        return n;
    }
    return reduce(sum);
};

