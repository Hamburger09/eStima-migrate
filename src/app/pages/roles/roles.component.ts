// Description: This component handles the roles management, including adding, updating, and deleting roles.
// It uses the RoleService to interact with the backend API and manage the roles data. The component also includes a modal for adding and editing roles, and a delete confirmation modal.

import { Component, OnInit, signal, ViewChild } from '@angular/core';
import { RoleService } from 'src/app/services/role.service';
import { FormBuilder } from '@angular/forms';
import { Role } from '../../interfaces/TypesABase.interface';
import { TranslateService } from '@ngx-translate/core';
import { TableColumn } from '../../interfaces/column.interface';
import { SharedModule } from 'src/app/shared/shared.module';
import { TableComponent } from 'src/app/components/library/table/table.component';

@Component({
  selector: 'app-roles',
  imports: [SharedModule, TableComponent],
  templateUrl: './roles.component.html',
  styleUrl: './roles.component.scss',
})
export class RolesComponent implements OnInit {
  roleForm: any;
  // Signals to hold roles data
  roles = signal<Role[]>([]);
  role: Role | null = null; // Store the selected role for deletion
  editMode: boolean = false;
  // Define columns for the table
  roleColumns: TableColumn[] = [
    {
      label: 'COMMON.NAME',
      key: 'name',
      editable: true,
      required: true,
    },
    {
      label: 'USERS.STATUS',
      key: 'id_status',
      required: true,
      dataType: 'boolean', // Important for dxSwitch
      editorType: 'dxSwitch',
      calculateCellValue: (row) => row.id_status === 1, // number -> boolean
      width: 120,
      setCellValue: (rowData, value) => {
        rowData.id_status = value ? 1 : 0; // boolean -> number
      },
      calculateDisplayValue: (row) =>
        row.id_status === 1
          ? this.translate.instant('COMMON.ACTIVE')
          : this.translate.instant('COMMON.INACTIVE'),
    },
    {
      label: 'COMMON.DESCRIPTION',
      key: 'description',
      editable: true,
      required: true,
    },
  ];
  constructor(
    private roleService: RoleService,
    private fb: FormBuilder,
    private translate: TranslateService
  ) {
    this.roleForm = this.fb.group({
      roleName: [''],
      roleIdStatus: [false],
      roleDescription: [''],
    });
  }

  // Fetch all roles
  getAllRoles(): void {
    this.roleService.getRoles().subscribe((roles: Role[]) => {
      console.log('Roles fetched:', roles);
      this.roles.set(roles);
    });
  }

  onRoleInserted(e: any) {
    const newRole: Role = e.data;
    this.roleService.addRole(newRole).subscribe((role: Role) => {
      this.getAllRoles();
      e.done();
    });
  }

  onRoleUpdated(e: any) {
    const updatedRole: Role = e.data;
    this.roleService.updateRole(updatedRole).subscribe(() => {
      this.roles.update((roles) => {
        const index = roles.findIndex((r) => r.id === updatedRole.id);
        if (index !== -1) {
          roles[index] = updatedRole;
        }
        return roles;
      });
      e.done();
    });
  }

  onRoleRemoved(e: any) {
    const removedRole: Role = e.data;
    this.roleService.deleteRole(removedRole.id!).subscribe(() => {
      this.roles.update((roles) =>
        roles.filter((r) => r.id !== removedRole.id)
      );
      e.done();
    });
  }

  // Fetch all roles
  ngOnInit(): void {
    this.getAllRoles();
  }
}
