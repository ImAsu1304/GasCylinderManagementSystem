package com.quickcylinder.config;

import com.quickcylinder.entity.User;
import com.quickcylinder.entity.User.Role;
import com.quickcylinder.entity.ValidConsumer;
import com.quickcylinder.repository.UserRepository;
import com.quickcylinder.repository.ValidConsumerRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.Arrays;

@Component
public class DatabaseSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final ValidConsumerRepository validConsumerRepository;
    private final PasswordEncoder passwordEncoder;

    public DatabaseSeeder(UserRepository userRepository, ValidConsumerRepository validConsumerRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.validConsumerRepository = validConsumerRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) throws Exception {
        // Seed Admin
        if (!userRepository.findByEmail("admin@quickcylinder.com").isPresent()) {
            User admin = User.builder()
                    .email("admin@quickcylinder.com")
                    .password(passwordEncoder.encode("admin123"))
                    .fullName("System Admin")
                    .phone("0000000000")
                    .role(Role.ADMIN)
                    .build();
            userRepository.save(admin);
        }

        // Seed 10 valid consumers (17 digits)
        if (validConsumerRepository.count() == 0) {
            validConsumerRepository.saveAll(Arrays.asList(
                    new ValidConsumer("10000000000000001", "John Doe", "Indane Agency", "123 Main St", "9876543210"),
                    new ValidConsumer("10000000000000002", "Jane Smith", "HP Gas Distributor", "456 Oak St", "9876543211"),
                    new ValidConsumer("10000000000000003", "Robert Johnson", "Bharat Gas Agency", "789 Pine St", "9876543212"),
                    new ValidConsumer("10000000000000004", "Emily Davis", "Indane Agency", "321 Cedar St", "9876543213"),
                    new ValidConsumer("10000000000000005", "Michael Brown", "HP Gas Distributor", "654 Birch St", "9876543214"),
                    new ValidConsumer("10000000000000006", "Sarah Miller", "Bharat Gas Agency", "987 Walnut St", "9876543215"),
                    new ValidConsumer("10000000000000007", "David Wilson", "Indane Agency", "159 Cherry St", "9876543216"),
                    new ValidConsumer("10000000000000008", "Laura Moore", "HP Gas Distributor", "753 Maple St", "9876543217"),
                    new ValidConsumer("10000000000000009", "James Taylor", "Bharat Gas Agency", "852 Elm St", "9876543218"),
                    new ValidConsumer("10000000000000010", "Linda Anderson", "Indane Agency", "951 Ash St", "9876543219")
            ));
        }
    }
}
