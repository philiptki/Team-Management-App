import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import Project from '../models/project';
import { ProjectsOverlayComponent } from './projects-overlay/projects-overlay.component';
import { ApiService } from 'src/services/api.service';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css']
})
export class ProjectsComponent {
  isAdmin: boolean = (localStorage.getItem('admin') == "true");
  projects: Project[] = []

  @ViewChild(ProjectsOverlayComponent) overlay!: ProjectsOverlayComponent;
  constructor(private router: Router, private apiService: ApiService) {}

  ngOnInit() {
    this.loadAllProjects()
  }

  loadAllProjects() {
    this.apiService.getCompanyTeamProject(this.getCompanyId(), Number(localStorage.getItem("currTeam")))
      .then(data => {
        if (Array.isArray(data)) {
          data.forEach(item => {
            this.projects.push({
              name: item.name,
              description: item.description,
              active: item.active
            });
          });
        }

      })
      .catch(error => {
        console.log(error)
      });
  }


  goBack() {
    this.router.navigate(["teams"]);
  }

  newProject() {
    this.overlay.open(false, this.projects);
    if (!this.overlay.checkEmptyFields()) {
      console.log(this.overlay.project)
      this.projects.push(this.overlay.project)
      // add project to backend
    }
  }

  editProject(project: Project) {
    this.overlay.open(true,this.projects);
    this.overlay.project = project;
    
  }

  updateProject(project: Project) {
    if (!this.overlay.checkEmptyFields()) {
  
      const updatedProject = this.overlay.project;
      const projectId = updatedProject.id!;
  
      this.apiService.updateProject(6, 11, 30, updatedProject)
        .then(() => {
          let i: number = this.projects.indexOf(project);
          this.projects[i] = updatedProject;
          console.log('Project updated successfully');
        })
        .catch(error => {
          console.log('Error updating project:', error);
        });
    }
  }
  getCompanyId() {
    return JSON.parse(localStorage.getItem("companyId") ?? "-1");
  }

}
