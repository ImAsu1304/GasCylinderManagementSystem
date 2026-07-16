package com.quickcylinder.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "valid_consumers")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ValidConsumer {
    @Id
    private String consumerNumber;
    private String consumerName;
    private String distributorName;
    private String address;
    private String phone;
}
