package com.example.caesar;

import java.util.ArrayList;
import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class CaesarController {

    private final CaesarService service;

    public CaesarController(CaesarService service) {
        this.service = service;
    }

    // Example: /api/encrypt?text=Hello&key=3  ->  Khoor
    @GetMapping("/encrypt")
    public String encrypt(@RequestParam(defaultValue = "") String text,
                          @RequestParam(defaultValue = "3") int key) {
        return service.encrypt(text, key);
    }

    // Example: /api/decrypt?text=Khoor&key=3  ->  Hello
    @GetMapping("/decrypt")
    public String decrypt(@RequestParam(defaultValue = "") String text,
                          @RequestParam(defaultValue = "3") int key) {
        return service.decrypt(text, key);
    }

    // Tries all 25 keys. Index 0 = shift 1, index 24 = shift 25.
    @GetMapping("/bruteforce")
    public List<String> bruteForce(@RequestParam(defaultValue = "") String text) {
        List<String> results = new ArrayList<>();
        for (int k = 1; k <= 25; k++) {
            results.add(service.decrypt(text, k));
        }
        return results;
    }
}
