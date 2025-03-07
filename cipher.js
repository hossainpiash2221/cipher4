// cipher.js

//========================================================== Caesar Cipher Encryption and Decryption================================
function caesarCipher2(text, shift, decrypt = false) {
    if (decrypt) shift = -shift;
    return text.replace(/[a-z]/gi, char => {
        const start = char <= 'Z' ? 65 : 97;
        return String.fromCharCode(((char.charCodeAt(0) - start + shift) % 26 + 26) % 26 + start);
    });
}

// ==========================================================Vigenère Cipher Encryption and Decryption================================
function vigenereCipher(text, key, decrypt = false) {
    const keyUpper = key.toUpperCase();
    return text.replace(/[a-z]/gi, (char, index) => {
        const isUpper = char <= 'Z';
        const start = isUpper ? 65 : 97;
        const keyShift = keyUpper.charCodeAt(index % key.length) - 65;
        const shift = decrypt ? -keyShift : keyShift;
        return String.fromCharCode(((char.charCodeAt(0) - start + shift) % 26 + 26) % 26 + start);
    });
}

// ==========================================Atbash Cipher (same for encrypt and decrypt)==================================
function atbashCipher(text) {
    return text.replace(/[a-z]/gi, char => {
        const start = char <= 'Z' ? 65 : 97;
        return String.fromCharCode(start + (25 - (char.charCodeAt(0) - start)));
    });
}

//============================================= Main function to encrypt or decrypt based on user input======================
function encryptMessage() {
    processMessage(false);
}

function decryptMessage() {
    processMessage(true);
}

// =======================================================Columnar Transposition Cipher Encryption====================================
function columnarTranspositionEncrypt2(msg, key) {
    let cipher = "";

    // Track key indices
    let k_indx = 0;

    const msg_len = msg.length;
    const msg_lst = Array.from(msg);
    const key_lst = Array.from(key).sort();

    // Calculate column of the matrix
    const col = key.length;

    // Calculate maximum row of the matrix
    const row = Math.ceil(msg_len / col);

    // Add padding character '_' to fill empty cells
    const fill_null = (row * col) - msg_len;
    for (let i = 0; i < fill_null; i++) {
        msg_lst.push('_');
    }

    // Create the matrix and insert message with padding row-wise
    const matrix = [];
    for (let i = 0; i < msg_lst.length; i += col) {
        matrix.push(msg_lst.slice(i, i + col));
    }

    // Read matrix column-wise using sorted key order
    for (let _ = 0; _ < col; _++) {
        const curr_idx = key.indexOf(key_lst[k_indx]);
        for (const row of matrix) {
            cipher += row[curr_idx];
        }
        k_indx++;
    }

    return cipher;
}

// Columnar Transposition Cipher Decryption
function columnarTranspositionDecrypt2(cipher, key) {
    let msg = "";

    // Track key indices
    let k_indx = 0;

    // Track message indices
    let msg_indx = 0;
    const msg_len = cipher.length;
    const msg_lst = Array.from(cipher);

    // Calculate column of the matrix
    const col = key.length;

    // Calculate maximum row of the matrix
    const row = Math.ceil(msg_len / col);

    // Convert key to list and sort alphabetically
    const key_lst = Array.from(key).sort();

    // Create an empty matrix to store decrypted message
    const dec_cipher = [];
    for (let i = 0; i < row; i++) {
        dec_cipher.push(Array(col).fill(null));
    }

    // Arrange the matrix column-wise according to key order
    for (let _ = 0; _ < col; _++) {
        const curr_idx = key.indexOf(key_lst[k_indx]);

        for (let j = 0; j < row; j++) {
            dec_cipher[j][curr_idx] = msg_lst[msg_indx];
            msg_indx++;
        }
        k_indx++;
    }

    // Convert decrypted message matrix into a string
    msg = dec_cipher.flat().join('');

    // Remove padding character '_'
    const null_count = (msg.match(/_/g) || []).length;
    if (null_count > 0) {
        return msg.slice(0, -null_count);
    }

    return msg;
}

function columnarTranspositionCipher(message, key, decrypt = false) {
    if (decrypt) {
        return columnarTranspositionDecrypt2(message, key);
    } else {
        return columnarTranspositionEncrypt2(message, key);
    }
}



// =====================================================triple columner===================================================== 

function columnarTranspositionEncrypt(msg, key) {
    let cipher = "";
    const msg_len = msg.length;
    const msg_lst = Array.from(msg);
    const key_lst = Array.from(key);
    const col = key.length;
    const row = Math.ceil(msg_len / col);
    
    // Fill with padding
    const fill_null = (row * col) - msg_len;
    for (let i = 0; i < fill_null; i++) {
        msg_lst.push('_');
    }

    // Generate matrix
    const matrix = [];
    for (let i = 0; i < msg_lst.length; i += col) {
        matrix.push(msg_lst.slice(i, i + col));
    }

    // Sort key indexes
    const key_indices = key_lst
        .map((char, index) => ({char, index}))
        .sort((a, b) => a.char.localeCompare(b.char))
        .map(obj => obj.index);

    // Read columns by sorted key index order
    for (const idx of key_indices) {
        for (const row of matrix) {
            cipher += row[idx];
        }
    }

    return cipher;
}


// Columnar Transposition Cipher Decryption (Single)
function columnarTranspositionDecrypt(cipher, key) {
    let msg = "";
    const msg_len = cipher.length;
    const col = key.length;
    const row = Math.ceil(msg_len / col);
    const cipher_lst = Array.from(cipher);
    const key_lst = Array.from(key);

    // Sort key indexes
    const key_indices = key_lst
        .map((char, index) => ({char, index}))
        .sort((a, b) => a.char.localeCompare(b.char))
        .map(obj => obj.index);

    // Create a matrix to hold decrypted message
    const dec_matrix = Array.from({ length: row }, () => Array(col).fill(null));

    // Fill in decrypted matrix column-wise based on sorted key
    let cipher_idx = 0;
    for (const idx of key_indices) {
        for (let r = 0; r < row; r++) {
            dec_matrix[r][idx] = cipher_lst[cipher_idx];
            cipher_idx++;
        }
    }

    // Flatten and remove padding
    msg = dec_matrix.flat().join('');
    return msg.replace(/_+$/, '');
}

// Triple Columnar Transposition Cipher Encryption with Three Keys
function tripleColumnarTranspositionEncrypt(msg, key1, key2, key3) {
    // Apply encryption three times with three different keys
    let encrypted = columnarTranspositionEncrypt(msg, key1);
    encrypted = columnarTranspositionEncrypt(encrypted, key2);
    encrypted = columnarTranspositionEncrypt(encrypted, key3);
    return encrypted;
}

// Triple Columnar Transposition Cipher Decryption with Three Keys
function tripleColumnarTranspositionDecrypt(cipher, key1, key2, key3) {
    // Apply decryption three times with three different keys (in reverse order)
    let decrypted = columnarTranspositionDecrypt(cipher, key3);
    decrypted = columnarTranspositionDecrypt(decrypted, key2);
    decrypted = columnarTranspositionDecrypt(decrypted, key1);
    return decrypted;
}

// Example function to call encryption/decryption based on action
function tripleColumnarTranspositionCipher(message, key1, key2, key3, decrypt = false) {
    if (decrypt) {
        return tripleColumnarTranspositionDecrypt(message, key1, key2, key3);
    } else {
        return tripleColumnarTranspositionEncrypt(message, key1, key2, key3);
    }
}


// ===========================================================Rail Fence Cipher ==================================================
function railFenceCipher(text, key, decrypt = false) {
    if (decrypt) {
        const rail = Array.from({ length: key }, () => []);
        let direction = -1, row = 0;
        for (let i = 0; i < text.length; i++) {
            rail[row].push(i);
            if (row === 0 || row === key - 1) direction *= -1;
            row += direction;
        }

        const result = Array(text.length);
        let index = 0;
        for (const line of rail) {
            for (const pos of line) {
                result[pos] = text[index++];
            }
        }
        return result.join('');
    } else {
        const rail = Array.from({ length: key }, () => []);
        let direction = -1, row = 0;
        for (const char of text) {
            rail[row].push(char);
            if (row === 0 || row === key - 1) direction *= -1;
            row += direction;
        }
        return rail.flat().join('');
    }
}

// =========================================================modified rail fence===============================

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

function modifiedRailfence(message,rail, decrypt = false) {
    
    const { encryptedText, spacePositions } = modifiedRailFenceEncrypt(message, rail);
    if (!decrypt) {
        
        return encryptedText;
    } else {
        const decryptedText = modifiedRailFenceDecrypt(message, rail, spacePositions);
        return decryptedText;
    }

}

//============================================================== playfair===================================== 

// Generate Playfair Key Matrix
function generatePlayfairKeyMatrix(key) {
    const matrix = [];
    const seen = new Set();
    let processedKey = key.toUpperCase().replace(/[^A-Z]/g, '').replace(/J/g, 'I');

    processedKey += 'ABCDEFGHIKLMNOPQRSTUVWXYZ'; // Add the rest of the alphabet (J is combined with I)

    for (const char of processedKey) {
        if (!seen.has(char)) {
            seen.add(char);
            if (matrix.length === 0 || matrix[matrix.length - 1].length === 5) {
                matrix.push([]);
            }
            matrix[matrix.length - 1].push(char);
        }
    }
    return matrix;
}





function playfairCipher(text, key, decrypt = false) {
    const matrix = generatePlayfairKeyMatrix(key);
    const getPos = char => {
        for (let i = 0; i < 5; i++) {
            for (let j = 0; j < 5; j++) {
                if (matrix[i][j] === char) return [i, j];
            }
        }
        return null;
    };

    const formatText = text => {
        let formatted = text.toUpperCase().replace(/[^A-Z]/g, '').replace(/J/g, 'I');
        for (let i = 0; i < formatted.length - 1; i += 2) {
            if (formatted[i] === formatted[i + 1]) {
                formatted = formatted.slice(0, i + 1) + 'X' + formatted.slice(i + 1);
            }
        }
        if (formatted.length % 2 !== 0) formatted += 'X';
        return formatted;
    };

    let processedText = formatText(text);
    let result = '';

    for (let i = 0; i < processedText.length; i += 2) {
        const [x1, y1] = getPos(processedText[i]);
        const [x2, y2] = getPos(processedText[i + 1]);

        if (x1 === x2) {
            result += matrix[x1][(y1 + (decrypt ? -1 : 1) + 5) % 5];
            result += matrix[x2][(y2 + (decrypt ? -1 : 1) + 5) % 5];
        } else if (y1 === y2) {
            result += matrix[(x1 + (decrypt ? -1 : 1) + 5) % 5][y1];
            result += matrix[(x2 + (decrypt ? -1 : 1) + 5) % 5][y2];
        } else {
            result += matrix[x1][y2];
            result += matrix[x2][y1];
        }
    }

    return result;
}
//  =========================================================playfairCipher End===================================================


//=========================================================== rsa modification ================================================
function gcd(a, b) {
    while (b !== 0n) {
        let temp = b;
        b = a % b;
        a = temp;
    }
    return a;
}

function modExp(base, exp, mod) {
    let result = 1n;
    base = base % mod;
    while (exp > 0n) {
        if (exp % 2n === 1n) {
            result = (result * base) % mod;
        }
        exp = exp / 2n;
        base = (base * base) % mod;
    }
    return result;
}

// Generate random prime numbers and key components
const primes = [17n, 19n, 23n, 29n];
function getRandomPrime() {
    const randomIndex = Math.floor(Math.random() * primes.length);
    return primes.splice(randomIndex, 1)[0];
}

// Key generation for simplified MREA
function generateKeys() {
    const p = getRandomPrime();
    const q = getRandomPrime();
    const n = p * q;
    const phi_n = (p - 1n) * (q - 1n);

    let e = 2n;
    while (gcd(e, phi_n) !== 1n) e += 1n;

    let d = 2n;
    while ((d * e) % phi_n !== 1n) d += 1n;

    return { publicKey: { n, e }, privateKey: { d, n } };
}

// Encryption with simplified MREA (adding a random salt)
function encrypt(message, publicKey) {
    const { n, e } = publicKey;
    const salt = BigInt(Math.floor(Math.random() * 100) + 1); // Small random salt
    const saltedMessage = BigInt(message) + salt;
    const encrypted = modExp(saltedMessage, e, n);
    return { encrypted, salt }; // Returning salt to use during decryption
}

// Decryption with simplified MREA
function decrypt(encryptedObj, privateKey) {
    const { d, n } = privateKey;
    const { encrypted, salt } = encryptedObj;
    const decrypted = modExp(encrypted, d, n);
    return decrypted - salt; // Remove the salt to get original message
}

// Encoding and decoding functions
function encodeMessage(message, publicKey) {
    return message.split('').map(char => {
        const { encrypted, salt } = encrypt(char.charCodeAt(0), publicKey);
        return { encrypted: encrypted.toString(), salt: salt.toString() }; // Convert BigInt to strings
    });
}

function decodeMessage(encryptedArray, privateKey) {
    return encryptedArray
        .map(obj => String.fromCharCode(Number(decrypt({
            encrypted: BigInt(obj.encrypted),
            salt: BigInt(obj.salt)
        }, privateKey))))
        .join('');
}

// Testing the simplified MREA encryption and decryption
// function rsaModi(){
//     console.log("1");
//     const { publicKey, privateKey } = generateKeys();

// const message = "hello";
// console.log("Original message:", message);

// // Encrypt the message
// const encryptedMessage = encodeMessage(message, publicKey);
// return encryptedMessage;
// // console.log("Encrypted message:", encryptedMessage);

// // // Decrypt the message
// // const decryptedMessage = decodeMessage(encryptedMessage, privateKey);
// // console.log("Decrypted message:", decryptedMessage);
// }

function modificationRsa(message, decrypt = false) {
    // console.log("1");
    const { publicKey, privateKey } = generateKeys();
    const emsg = encodeMessage(message, publicKey);
    if (!decrypt) {

        return encodeMessage(message, publicKey);
    } else {
        return decodeMessage(emsg, privateKey);
    }

}

//============================================ RSa modification end =========================================================================


// ===========================================Affine Modification  ===========================================================================

console.log("");
// Define character set
const charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789   abcdefghijklmnopqrstuvwxyz";                       //a =7 & b=10
const m = charset.length; // Modulus 36 for letters and numbers

// Find modular inverse of 'a' with respect to m
function modInverse(a, m) {
    for (let x = 1; x < m; x++) {
        if ((a * x) % m === 1) return x;
    }
    return 1; // Return 1 if no modular inverse exists
}

// Encryption function
function encryptModifiedAffine(message, a, b) {
    console.log(message)
    let encryptedText = "";
    for (let char of message) {
        let x = charset.indexOf(char);
        if (x === -1) continue; // Skip if character is not in charset
        let encryptedChar = (a * x + b) % m;
        encryptedText += charset[encryptedChar];
    }
    // console.log(encryptedText)
    return encryptedText;
}

// Decryption function
function decryptModifiedAffine(message, a, b) {
    let decryptedText = "";
    let a_inv = modInverse(a, m); // Calculate a's modular inverse
    for (let char of message) {
        let y = charset.indexOf(char);
        if (y === -1) continue; // Skip if character is not in charset
        let decryptedChar = (a_inv * (y - b + m)) % m;
        decryptedText += charset[decryptedChar];
    }
    return decryptedText;
}
function modifiedAffine(message, decrypt = false) {
    const a = 7; // Should be coprime with 36
    const b = 10;
    console.log(message)
    if (!decrypt) {
        console.log('1')
        return encryptModifiedAffine(message, a, b);
    } else {
        return decryptModifiedAffine(message, a, b);
    }
}
// =======================================================modifiedAffine end ======================================================================


//======================================================== modified ceaser and vegenere =========================================================

//====================================================== Vigenère Caesar Combined =============================================
function encryptVigenereCaesar(text, key, uKey) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ ';
    const kLen = key.length;
    let cipherText = '';

    for (let i = 0; i < text.length; i++) {
        const tIndex = chars.indexOf(text[i].toUpperCase());
        const kIndex = chars.indexOf(key[i % kLen].toUpperCase());
        const cIndex = (tIndex + kIndex + uKey) % chars.length;
        cipherText += chars[cIndex];
    }

    return cipherText;
}

function decryptVigenereCaesar(text, key, uKey) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ ';
    const kLen = key.length;
    let plainText = '';

    for (let i = 0; i < text.length; i++) {
        const cIndex = chars.indexOf(text[i].toUpperCase());
        const kIndex = chars.indexOf(key[i % kLen].toUpperCase());
        const pIndex = (cIndex - kIndex - uKey + chars.length) % chars.length;
        plainText += chars[pIndex];
    }

    return plainText;
}

function modifiedVigenereCaesar(message, key, uKey, decrypt = false) {
    if (!decrypt) {
        return decryptVigenereCaesar(message, key, uKey);
    } else {
        return encryptVigenereCaesar(message, key, uKey);
    }
}

// ==============================================combinedCeaserAndVeginer end =================================================================


// =======================================================modified autoKey =============================================================================

// Function to encrypt the plaintext using the modified Auto Key Cipher
function autoKeyEncrypt(plaintext, key) {
    let ciphertext = '';
    let extendedKey = key;

    for (let i = 0; i < plaintext.length; i++) {
        // Extend key with plaintext characters as needed
        if (i >= key.length) {
            extendedKey += plaintext[i - key.length];
        }

        // Get ASCII values of plaintext and keytext
        const p = plaintext.charCodeAt(i);
        const k = extendedKey.charCodeAt(i);

        // Apply the modified encryption formula
        const c = ((p + k) % 126) + 33;

        // Convert to character and append to ciphertext
        ciphertext += String.fromCharCode(c);
    }

    return ciphertext;
}

// Function to decrypt the ciphertext using the modified Auto Key Cipher
function autoKeyDecrypt(ciphertext, key) {
    let plaintext = '';
    let extendedKey = key;

    for (let i = 0; i < ciphertext.length; i++) {
        // Get ASCII values of ciphertext and keytext
        const c = ciphertext.charCodeAt(i);
        const k = extendedKey.charCodeAt(i);

        // Apply the modified decryption formula
        const p = ((c - 33 - k + 126) % 126);

        // Convert to character and append to plaintext
        plaintext += String.fromCharCode(p);

        // Extend key with decrypted character as needed
        extendedKey += String.fromCharCode(p);
    }

    return plaintext;
}

function modifiedAutokey(message,key, decrypt = false) {
    if (!decrypt) {
        return autoKeyEncrypt(message, key);
    } else {
        return autoKeyDecrypt(message, key);
    }

}


// modified auto key end ===============================================================

// ===================================================================================uniqueCipher================
// Encryption function with modulo operation
function uniqueCipher(plainText) {
    // Step 1: Convert each character to ASCII value and store it in an array
    let asciiValues = [];
    for (let i = 0; i < plainText.length; i++) {
        let ascii = plainText.charCodeAt(i);
        asciiValues.push(ascii);
    }

    // Step 2: Modify each ASCII value based on a simple transformation (shifting values by a constant)
    const shiftValue = 5; // Choose an arbitrary constant for shifting ASCII values
    const maxAsciiValue = 255; // Max valid ASCII value for a byte
    for (let i = 0; i < asciiValues.length; i++) {
        asciiValues[i] = (asciiValues[i] + shiftValue) % (maxAsciiValue + 1); // Modulo to keep within the ASCII range
    }

    // Step 3: Find the second highest and highest values in the array
    let sortedArray = [...asciiValues].sort((a, b) => b - a);
    let highest = sortedArray[0];
    let secondHighest = sortedArray[1];
    let difference = highest - secondHighest;

    // Step 4: Subtract the difference from each element of the array and apply modulo
    for (let i = 0; i < asciiValues.length; i++) {
        asciiValues[i] = (asciiValues[i] - difference + (maxAsciiValue + 1)) % (maxAsciiValue + 1); // Ensures values remain within range
    }

    // Convert the ASCII values back to characters and return the ciphered text
    return asciiValues.map(value => String.fromCharCode(value)).join('');
}

// Decryption function with modulo operation
function uniqueDecipher(cipherText) {
    // Step 1: Convert cipher text into ASCII values
    let asciiValues = [];
    for (let i = 0; i < cipherText.length; i++) {
        asciiValues.push(cipherText.charCodeAt(i));
    }

    // Step 2: Find the highest and second-highest values
    let sortedArray = [...asciiValues].sort((a, b) => b - a);
    let highest = sortedArray[0];
    let secondHighest = sortedArray[1];
    let difference = highest - secondHighest;

    // Step 3: Add the difference to each element to reverse the subtraction and apply modulo
    const maxAsciiValue = 255; // Max valid ASCII value for a byte
    for (let i = 0; i < asciiValues.length; i++) {
        asciiValues[i] = (asciiValues[i] + difference) % (maxAsciiValue + 1); // Modulo to keep within ASCII range
    }

    // Step 4: Reverse the simple transformation (shifting back by the same constant) and apply modulo
    const shiftValue = 5; // Same constant used in encryption
    for (let i = 0; i < asciiValues.length; i++) {
        asciiValues[i] = (asciiValues[i] - shiftValue + (maxAsciiValue + 1)) % (maxAsciiValue + 1); // Modulo for shift operation
    }

    // Convert ASCII values back to characters and return the decrypted text
    return asciiValues.map(value => String.fromCharCode(value)).join('');
}


function unique(message, decrypt = false) {
    if (!decrypt) {
        return uniqueCipher(message);
    } else {
        return uniqueDecipher(message);
    }

}

// ========================================================unique swap cipher======================================
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


function uniqueSwapCipher(message, decrypt = false) {
    if (!decrypt) {
        return uniqueCipherSwap(message);
    } else {
        return uniqueDecipherSwap(message);
    }
}


function processMessage(decrypt) {
    const cipher = document.getElementById('cipher').value;
    const key = document.getElementById('key').value;
    const key1 = document.getElementById('key1').value;
    const key2 = document.getElementById('key2').value;
    const key3 = document.getElementById('key3').value;
    const message = document.getElementById('message').value;
    const ukey = document.getElementById('uKey').value;
    let result = '';

    switch (cipher) {
        case 'caesar':
            result = caesarCipher2(message, parseInt(key), decrypt);
            break;
        case 'vigenere':
            result = vigenereCipher(message, key, decrypt);
            break;
        case 'atbash':
            result = atbashCipher(message);
            break;
        case 'playfair':
            result = playfairCipher(message, key, decrypt);
            break;
        case 'railfence':
            result = railFenceCipher(message, parseInt(key), decrypt);
            break;
        case 'double-columnar':
            result = columnarTranspositionCipher(message, key, decrypt);
            break;

        case 'triple-columnar':
            // console.log("1")
            result = tripleColumnarTranspositionCipher(message, key1, key2, key3, decrypt);
            // console.log(result);
            break;

        case 'rsaModification':
            result = modificationRsa(message, decrypt);
            break;

        case 'AffineModification':
            result = modifiedAffine(message,decrypt);
            break;

        case 'modifiedceaser_veginere':
            result = modifiedVigenereCaesar(message,key,parseInt(ukey),decrypt);
            break;

        case 'Modified-AutoKey' :
            result = modifiedAutokey(message,key,decrypt);
            break;

        case 'Modified-railFence':
            
            result = modifiedRailfence(message,parseInt(key), decrypt)
            break;

        case 'unique':

            result = unique(message,decrypt);
            break;

        case 'uniqueSwapCipher':
        result = uniqueSwapCipher(message,decrypt);
            break;


    }

    document.getElementById('ciphertext').innerText = result;
}

