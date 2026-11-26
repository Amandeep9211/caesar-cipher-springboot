package com.example.caesar;

import org.springframework.stereotype.Service;

@Service
public class CaesarService {

    public String encrypt(String text, int key) {
        return shift(text, key);
    }

    public String decrypt(String text, int key) {
        return shift(text, -key);
    }

    // Shifts every letter by 'key'. Spaces, numbers and symbols stay the same.
    private String shift(String text, int key) {
        int k = Math.floorMod(key, 26);
        StringBuilder result = new StringBuilder();
        for (char ch : text.toCharArray()) {
            if (ch >= 'A' && ch <= 'Z') {
                result.append((char) ('A' + (ch - 'A' + k) % 26));
            } else if (ch >= 'a' && ch <= 'z') {
                result.append((char) ('a' + (ch - 'a' + k) % 26));
            } else {
                result.append(ch);
            }
        }
        return result.toString();
    }
}
