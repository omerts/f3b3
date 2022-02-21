export default function trimEnd(haystack, needle) {
    var foundIndex = haystack.lastIndexOf(needle);
    if (foundIndex !== -1 && foundIndex === haystack.length - needle.length) {
        return haystack.slice(0, foundIndex);
    }
    return haystack;
}
