// Rail Fence Cipher Encryption
function railFenceEncrypt(text, rail) {
    const railArray = Array.from({ length: rail }, () => []);
    let direction = -1, row = 0;

    for (const char of text) {
        railArray[row].push(char);
        if (row === 0 || row === rail - 1) direction *= -1;
        row += direction;
    }

    // Flatten the rails into a single string
    return railArray.flat().join('');
}

// Rail Fence Cipher Decryption
function railFenceDecrypt(text, rail) {
    const railArray = Array.from({ length: rail }, () => []);
    let direction = -1, row = 0;

    // Step 1: Mark the positions on each rail
    const positions = Array(text.length).fill(0);
    for (let i = 0; i < text.length; i++) {
        railArray[row].push(i);
        positions[i] = row;
        if (row === 0 || row === rail - 1) direction *= -1;
        row += direction;
    }

    // Step 2: Populate the positions with text characters
    let index = 0;
    for (let r = 0; r < rail; r++) {
        for (let j = 0; j < text.length; j++) {
            if (positions[j] === r) {
                railArray[r][railArray[r].indexOf(j)] = text[index++];
            }
        }
    }

    // Step 3: Read characters in the original zigzag order
    let result = '';
    row = 0;
    direction = -1;
    for (let i = 0; i < text.length; i++) {
        result += railArray[row].shift();
        if (row === 0 || row === rail - 1) direction *= -1;
        row += direction;
    }

    return result;
}

// Caesar Cipher with shift as rail value
function caesarCipher(text, shift, decrypt = false) {
    shift = decrypt ? -shift : shift;
    return text
        .split('')
        .map(char => {
            if (char.match(/[A-Z]/)) {
                const code = ((char.charCodeAt(0) - 65 + shift) % 26 + 26) % 26 + 65;
                return String.fromCharCode(code);
            }
            return char;
        })
        .join('');
}

// Modified Rail Fence Algorithm: Apply Rail Fence, then Caesar Cipher
function modifiedRailFenceEncrypt(plaintext, rail) {
    // Step 1: Remove spaces and convert to uppercase, record space positions
    const spacePositions = [];
    const cleanText = plaintext.split('').map((char, i) => {
        if (char === ' ') {
            spacePositions.push(i);
            return '';
        }
        return char.toUpperCase();
    }).join('');

    // Step 2: Apply Rail Fence Cipher
    const railEncrypted = railFenceEncrypt(cleanText, rail);

    // Step 3: Apply Caesar Cipher with rail value as the shift
    const caesarEncrypted = caesarCipher(railEncrypted, rail);

    // Return encrypted text along with space positions
    return { encryptedText: caesarEncrypted, spacePositions };
}

// Modified Rail Fence Decryption: Reverse Caesar Cipher, then Rail Fence Cipher
function modifiedRailFenceDecrypt(ciphertext, rail, spacePositions) {
    // Step 1: Reverse Caesar Cipher with rail value as the shift
    const caesarDecrypted = caesarCipher(ciphertext, rail, true);

    // Step 2: Reverse Rail Fence Cipher
    let railDecrypted = railFenceDecrypt(caesarDecrypted, rail);

    // Step 3: Reinsert spaces at their original positions
    spacePositions.forEach(pos => {
        railDecrypted = railDecrypted.slice(0, pos) + ' ' + railDecrypted.slice(pos);
    });

    return railDecrypted;
}

// Example usage
const rail = 3;
const plaintext = "this is Sk";

const { encryptedText, spacePositions } = modifiedRailFenceEncrypt(plaintext, rail);
console.log("Encrypted Text:", encryptedText);

const decryptedText = modifiedRailFenceDecrypt(encryptedText, rail, spacePositions);
console.log("Decrypted Text:", decryptedText);