import { Component } from '@angular/core';
import {RouterOutlet} from "@angular/router";
import {AdminHeaderComponent} from "../../../core/components/admin-header/admin-header.component";

@Component({
  selector: 'app-home',
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
