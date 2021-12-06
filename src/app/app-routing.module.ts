import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { SignupComponent } from './signup/signup.component';
import { AuthGuardService } from './_services/auth-guard.service';
import { LoginComponent } from './_onboard/login/login.component';
import { ForgetPasswordComponent } from './_onboard/forget-password/forget-password.component';
import { ChatComponent } from './chat/chat.component';

const routes: Routes = [
  { path: '', component:HomeComponent,canActivate:[AuthGuardService]},
  { path: 'signup', component: SignupComponent },
  { path: 'login', component: LoginComponent }, 
  { path: 'chatpage', component: ChatComponent }, 
  { path: 'forget-password', component: ForgetPasswordComponent },
  { path: 'ticket', loadChildren :'./ticket.module#TicketModule' ,canActivate:[AuthGuardService] },
  { path: 'onboard', loadChildren :'./onboard.module#OnboardModule' ,canActivate:[AuthGuardService] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
