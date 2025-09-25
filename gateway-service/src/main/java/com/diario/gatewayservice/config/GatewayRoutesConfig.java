package com.diario.gatewayservice.config;

import org.springframework.cloud.client.discovery.ReactiveDiscoveryClient;
import org.springframework.cloud.gateway.discovery.DiscoveryClientRouteDefinitionLocator;
import org.springframework.cloud.gateway.discovery.DiscoveryLocatorProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class GatewayRoutesConfig {

    @Bean
    public DiscoveryClientRouteDefinitionLocator discoveryRoutes(
            ReactiveDiscoveryClient discoveryClient,
            DiscoveryLocatorProperties properties) {
        properties.setLowerCaseServiceId(true);
        return new DiscoveryClientRouteDefinitionLocator(discoveryClient, properties);
    }
}
