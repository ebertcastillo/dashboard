import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './components/navbar/navbar.component';
import { FinancialDashboardComponent } from './components/financial-dashboard/financial-dashboard.component';
import { TeamMembersComponent } from './components/team-members/team-members.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    NavbarComponent,
    FinancialDashboardComponent,
    TeamMembersComponent
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  readonly currentYear = new Date().getFullYear();
}
