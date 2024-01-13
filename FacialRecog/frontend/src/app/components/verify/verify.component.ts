import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-verify',
  standalone: true,
  imports: [],
  templateUrl: './verify.component.html',
  styleUrl: './verify.component.css'
})
export class VerifyComponent {
  constructor(
    private router: Router
  ) {}

  navigateToMenu() {
    this.router.navigate([''])
  }
}
