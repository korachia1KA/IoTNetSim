package com.iotnetworksimulator.controller;


import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import com.iotnetworksimulator.service.ProjectService;
import com.iotnetworksimulator.model.Project;
import com.iotnetworksimulator.payload.ProjectRequest;

@RestController
@RequestMapping("/api/projects")
@CrossOrigin(origins = "*", allowedHeaders = "*")
@RequiredArgsConstructor
public class ProjectController {
    private final ProjectService projectService;

    @GetMapping
    public ResponseEntity<List<Project>> getUserProjects() {
        return ResponseEntity.ok(projectService.getUserProjects());
    }

    @PostMapping
    public ResponseEntity<Project> createProject(@RequestBody ProjectRequest request) {
        return ResponseEntity.ok(projectService.createProject(request));
    }

    @PatchMapping("/{id}")
    public ResponseEntity<Project> updateProject(
            @PathVariable String id,
            @RequestBody ProjectRequest request) {
        return ResponseEntity.ok(projectService.updateProject(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProject(@PathVariable String id) {
        projectService.deleteProject(id);
        return ResponseEntity.ok().build();
    }
}