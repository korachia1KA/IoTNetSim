package com.iotnetworksimulator.service;

import com.iotnetworksimulator.model.ActualUser;
import com.iotnetworksimulator.model.Project;
import com.iotnetworksimulator.model.User;
import com.iotnetworksimulator.payload.ProjectRequest;
import com.iotnetworksimulator.repository.ActualUserRepository;
import com.iotnetworksimulator.repository.ProjectRepository;
import com.iotnetworksimulator.repository.UserRepository;
import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ProjectService {

    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;  // Add this to fetch users from the repository if necessary.
    private final ActualUserRepository actualUserRepository;

    private User getCurrentUser() {

        ActualUser actualUser = actualUserRepository.findTopByOrderByIdDesc();
        return new User(actualUser.getUsername(), actualUser.getEmail(), actualUser.getPassword());
    }

    public List<Project> getUserProjects() {
        User currentUser = getCurrentUser();
        return projectRepository.findByOwnerOrderByUpdatedAtDesc(currentUser);
    }

    public Project createProject(ProjectRequest request) {
        User currentUser = getCurrentUser();

        Project project = new Project();
        project.setName(request.getName());
        project.setDescription(request.getDescription());
        project.setOwner(currentUser);

        return projectRepository.save(project);
    }

    public Project updateProject(String id, ProjectRequest request) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Project not found"));

        project.setName(request.getName());
        project.setDescription(request.getDescription());
        project.setUpdatedAt(Instant.now());

        return projectRepository.save(project);
    }

    public void deleteProject(String id) {
        projectRepository.deleteById(id);
    }
}
