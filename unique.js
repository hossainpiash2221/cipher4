// Encryption function
function uniqueCipherSwap(text) {
    let asciiArray = [];

    for (let i = 0; i < text.length; i++) {
        // Convert character to ASCII value
        let asciiValue = text.charCodeAt(i).toString();

        // Apply transformation rules
        if (asciiValue.length === 1) {
            // If it's a single-digit ASCII value, append '0' at the end
            asciiValue += "0";
        } else if (asciiValue.length === 2) {
            // If it's a two-digit ASCII value, swap the digits
            asciiValue = asciiValue[1] + asciiValue[0];
        } else if (asciiValue.length === 3) {
            // If it's a three-digit ASCII value, swap the first and last digits
            asciiValue = asciiValue[2] + asciiValue[1] + asciiValue[0];
        }

        // Add the modified ASCII value to the array
        asciiArray.push(asciiValue);
    }

    // Return the array as a string to represent the final encrypted text
    return asciiArray.join(" ");
}

// Decryption function
function uniqueDecipherSwap(encryptedText) {
    // Split the encrypted text by spaces to get the transformed ASCII values
    let asciiArray = encryptedText.split(" ");
    let decryptedText = "";

    for (let asciiValue of asciiArray) {
        // Reverse transformation based on the length of ASCII value string
        if (asciiValue.length === 2) {
            // If it's a two-digit value (originally one digit with '0' appended), remove the '0' at the end
            if (asciiValue[1] === '0') {
                asciiValue = asciiValue[0];
            } else {
                // If it's a two-digit ASCII value, swap the digits back
                asciiValue = asciiValue[1] + asciiValue[0];
            }
        } else if (asciiValue.length === 3) {
            // If it's a three-digit ASCII value, swap the first and last digits back
            asciiValue = asciiValue[2] + asciiValue[1] + asciiValue[0];
        }

        // Convert the ASCII value back to a character
        decryptedText += String.fromCharCode(parseInt(asciiValue, 10));
    }

    return decryptedText;
}

// Example usage
let plaintext = "abcdefghijklmnopqrstuvwxyz ";
let encryptedText = uniqueCipher(plaintext);
console.log("Encrypted Text:", encryptedText);

let decryptedText = uniqueDecipher(encryptedText);
console.log("Decrypted Text:", decryptedText);
