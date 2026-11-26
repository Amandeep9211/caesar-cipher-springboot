package com.example.caesar;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;

class CaesarServiceTest {

    private final CaesarService service = new CaesarService();

    @Test
    void encryptShiftsLettersByKey() {
        assertEquals("def", service.encrypt("abc", 3));
    }

    @Test
    void encryptWrapsAroundAtEndOfAlphabet() {
        assertEquals("abc", service.encrypt("xyz", 3));
    }

    @Test
    void encryptKeepsCaseSpacesAndSymbols() {
        assertEquals("Khoor, Zruog! 123", service.encrypt("Hello, World! 123", 3));
    }

    @Test
    void decryptReversesEncrypt() {
        String original = "Hello, World!";
        String encrypted = service.encrypt(original, 7);
        assertEquals(original, service.decrypt(encrypted, 7));
    }

    @Test
    void keyOf26ReturnsSameText() {
        assertEquals("Hello", service.encrypt("Hello", 26));
    }

    @Test
    void negativeKeyShiftsBackwards() {
        assertEquals("zab", service.encrypt("abc", -1));
    }
}