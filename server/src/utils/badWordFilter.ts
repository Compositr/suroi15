/* eslint-disable no-multi-spaces */
const badWordRegexes: RegExp[] = [
    /n[i1l!]+[g693]+[e3]*[ra@]*/i,    // nigger
    /f[a@4]+[g9]+[s$5z2]+[o0]+[t+]*/i, // faggot
    /c[h]+[i1l!]+[n]+[k]*/i, // chink
];

export function hasBadWords(text: string): boolean {
    for (const badWordRegex of badWordRegexes) {
        if (badWordRegex.test(text)) return true;
    }
    return false;
}
