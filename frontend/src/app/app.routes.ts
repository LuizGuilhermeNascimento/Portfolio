import { Routes } from '@angular/router';
import { MenuComponent } from './components/menu/menu.component';
import { RegisterComponent } from './components/register/register.component';
import { VerifyComponent } from './components/verify/verify.component';
import { AboutComponent } from './components/about/about.component';

export const routes: Routes = [
    { path: '', redirectTo: '/menu', pathMatch: 'full'},
    { path: 'menu', component: MenuComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'recognizer', component: VerifyComponent },
    { path: 'about', component: AboutComponent }
];
