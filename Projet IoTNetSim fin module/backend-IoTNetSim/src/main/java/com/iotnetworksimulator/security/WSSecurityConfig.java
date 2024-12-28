package com.iotnetworksimulator.security;

import com.iotnetworksimulator.security.jwt.AuthEntryPointJwt;
import com.iotnetworksimulator.security.jwt.AuthTokenFilter;
import com.iotnetworksimulator.security.services.UserDetailsServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;


@Configuration
public class WSSecurityConfig {

  @Bean
  public SecurityFilterChain wsSecurityFilterChain(HttpSecurity http) throws Exception {
    http
            .authorizeHttpRequests(authorize -> authorize
                    .requestMatchers("/traffic-updates/**").permitAll() // Allow unauthenticated access to WebSocket endpoint
                    .anyRequest().authenticated() // Require authentication for other endpoints
            )
            .csrf(csrf -> csrf.disable()); // Disable CSRF for WebSocket connections if needed

    return http.build();
  }
}