export function doubleDigit(n){
    if(n < 10) {
        return '0' + n.toString();
    }
    return n.toString();
}