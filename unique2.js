// Encryption function
function cipher(plainText) {
    // Step 1: Convert each character to ASCII value and store it in an array
    let asciiValues = [];
    for (let i = 0; i < plainText.length; i++) {
        let ascii = plainText.charCodeAt(i);
        asciiValues.push(ascii);
    }

    // Step 2: Modify each ASCII value based on a simple transformation (shifting values by a constant)
    const shiftValue = 5; // Choose an arbitrary constant for shifting ASCII values
    for (let i = 0; i < asciiValues.length; i++) {
        asciiValues[i] += shiftValue;
    }

    // Step 3: Find the second highest and highest values in the array
    let sortedArray = [...asciiValues].sort((a, b) => b - a);
    let highest = sortedArray[0];
    let secondHighest = sortedArray[1];
    let difference = highest - secondHighest;

    // Step 4: Subtract the difference from each element of the array
    for (let i = 0; i < asciiValues.length; i++) {
        asciiValues[i] -= difference;
    }

    return asciiValues;
}

// Decryption function
function decrypt(cipherText) {
    // Step 1: Find the highest and second-highest values
    let sortedArray = [...cipherText].sort((a, b) => b - a);
    let highest = sortedArray[0];
    let secondHighest = sortedArray[1];
    let difference = highest - secondHighest;

    // Step 2: Add the difference to each element to reverse the subtraction
    let asciiValues = cipherText.map(value => value + difference);

    // Step 3: Reverse the simple transformation (shifting back by the same constant)
    const shiftValue = 5; // Same constant used in encryption
    for (let i = 0; i < asciiValues.length; i++) {
        asciiValues[i] -= shiftValue;
    }

    // Step 4: Convert ASCII values back to characters
    let decryptedText = asciiValues.map(value => String.fromCharCode(value)).join('');
    return decryptedText;
}

// Example usage:

// Original text
let plainText = "abcd efghijklmnopqrstuvwxyz !@#$#%$% ";  // Test with a mix of characters, including space and special ones

// Encrypt the plainText
let cipherText = cipher(plainText);
console.log("Encrypted Text (Ciphered ASCII values):", cipherText);

// Decrypt the cipherText back to the original
let decryptedText = decrypt(cipherText);
console.log("Decrypted Text:", decryptedText);
