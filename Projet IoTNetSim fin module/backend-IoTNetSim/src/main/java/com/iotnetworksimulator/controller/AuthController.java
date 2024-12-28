package com.iotnetworksimulator.controller;

import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

import jakarta.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import com.iotnetworksimulator.model.ActualUser;
import com.iotnetworksimulator.model.ERole;
import com.iotnetworksimulator.model.Role;
import com.iotnetworksimulator.model.User;
import com.iotnetworksimulator.payload.request.LoginRequest;
import com.iotnetworksimulator.payload.request.SignupRequest;
import com.iotnetworksimulator.payload.response.AuthResponse;
import com.iotnetworksimulator.payload.response.MessageResponse;
import com.iotnetworksimulator.repository.ActualUserRepository;
import com.iotnetworksimulator.repository.RoleRepository;
import com.iotnetworksimulator.repository.UserRepository;
import com.iotnetworksimulator.security.jwt.JwtUtils;
import com.iotnetworksimulator.security.services.UserDetailsImpl;

import java.util.HashSet;
import java.util.Set;
import java.util.stream.Collectors;



@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/auth")
public class AuthController {
  @Autowired
  AuthenticationManager authenticationManager;

  @Autowired
  UserRepository userRepository;

  @Autowired
  ActualUserRepository actualUserRepository;

  @Autowired
  RoleRepository roleRepository;

  @Autowired
  PasswordEncoder encoder;

  @Autowired
  JwtUtils jwtUtils;

  @PostMapping("/signin")
  public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {

    actualUserRepository.deleteAll();

    Authentication authentication = authenticationManager.authenticate(
        new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword()));

    SecurityContextHolder.getContext().setAuthentication(authentication);
    String jwt = jwtUtils.generateJwtToken(authentication);
    
    UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();    
    Set<Role> roles = userDetails.getAuthorities().stream()
        .map(item -> roleRepository.findByName(ERole.valueOf(item.getAuthority()))
            .orElseThrow(() -> new RuntimeException("Error: Role is not found.")))
        .collect(Collectors.toSet());


    User user = new User(userDetails.getId(), userDetails.getUsername(),
            userDetails.getEmail(), userDetails.getPassword(), roles);

    ActualUser actualUser = new ActualUser(user);
    actualUserRepository.save(actualUser);

    AuthResponse authResponse = new AuthResponse(jwt,user);

    return ResponseEntity.ok(authResponse);
  }



  @GetMapping("/actualuser")
  public ResponseEntity<?> getActualUser() {
    Optional<ActualUser> actualUser = actualUserRepository.findAll()
        .stream()
        .reduce((first, second) -> second); // Retrieve the last actual user
    
    if (actualUser.isPresent()) {
        return ResponseEntity.ok(actualUser.get());
    } else {
        return ResponseEntity.badRequest().body(new MessageResponse("Error: No ActualUser found!"));
    }
  }

  @GetMapping("/actualuser/{id}")
  public ResponseEntity<?> getActualUserById(@PathVariable Long id) {
    Optional<ActualUser> actualUser = actualUserRepository.findById(id); // Retrieve the actual user by id

    if (actualUser.isPresent()) {
      return ResponseEntity.ok(actualUser.get());
    } else {
      return ResponseEntity.badRequest().body(new MessageResponse("Error: No ActualUser found!"));
    }
  }


  @PostMapping("/signup")
  public ResponseEntity<?> registerUser(@Valid @RequestBody SignupRequest signUpRequest) {

    if (userRepository.existsByUsername(signUpRequest.getUsername())) {
      return ResponseEntity
          .badRequest()
          .body(new MessageResponse("Error: Username is already taken!"));
    }

    if (userRepository.existsByEmail(signUpRequest.getEmail())) {
      return ResponseEntity
          .badRequest()
          .body(new MessageResponse("Error: Email is already in use!"));
    }

    // Create new user's account
    User user = new User(signUpRequest.getUsername(), 
               signUpRequest.getEmail(),
               encoder.encode(signUpRequest.getPassword()));

    Set<String> strRoles = signUpRequest.getRole();
    Set<Role> roles = new HashSet<>();

    if (strRoles == null) {
      Role userRole = roleRepository.findByName(ERole.ROLE_USER)
          .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
      roles.add(userRole);
    } else {
      strRoles.forEach(role -> {
        switch (role) {
        case "ROLE_ADMIN":
          Role adminRole = roleRepository.findByName(ERole.ROLE_ADMIN)
              .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
          roles.add(adminRole);

          break;

        default:
          Role userRole = roleRepository.findByName(ERole.ROLE_USER)
              .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
          roles.add(userRole);
        }
      });
    }

    user.setRoles(roles);
    userRepository.save(user);

    return ResponseEntity.ok(new MessageResponse("User registered successfully!"));
  }
}
