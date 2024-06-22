import {Routes} from '@angular/router';
import {UserListComponent} from "./user-list/user-list.component";
import {HomeComponent} from "./home/home.component";

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'users',
    component: UserListComponent,
  }
];
