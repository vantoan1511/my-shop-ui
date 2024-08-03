import { Component } from '@angular/core';
import {RouterOutlet} from "@angular/router";
import {AdminHeaderComponent} from "../../shared/component/admin-header/admin-header.component";

@Component({
  selector: 'app-admin-home',
  standalone: true,
    imports: [
        RouterOutlet,
        AdminHeaderComponent
    ],
  templateUrl: './admin-home.component.html',
  styleUrl: './admin-home.component.scss'
})
export class AdminHomeComponent {

}
