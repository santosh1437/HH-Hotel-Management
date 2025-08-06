import { Component, ElementRef, InjectionToken, OnInit, TemplateRef, viewChild, ViewChild } from '@angular/core';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import { CommonModule, DatePipe, NgClass } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatOptionModule, MatRippleModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule, MatMenuTrigger } from '@angular/material/menu';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { SelectionModel } from '@angular/cdk/collections';
import { Subject, take } from 'rxjs';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { TableExportUtil } from '@shared';
import { LocksService } from 'app/service/locks.service';
import { MatDialog } from '@angular/material/dialog';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NotificationService } from 'app/service/notification.service';
import { FeatherIconsComponent } from '@shared/components/feather-icons/feather-icons.component';
import { NgSelectModule } from '@ng-select/ng-select';

@Component({
  selector: 'app-staff',
  imports: [
    BreadcrumbComponent,
    FeatherIconsComponent,
    CommonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatSelectModule,
    ReactiveFormsModule,
    FormsModule,
    MatOptionModule,
    MatCheckboxModule,
    MatTableModule,
    MatSortModule,
    NgClass,
    NgSelectModule,
    MatRippleModule,
    MatMenuModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './staff.component.html',
  styleUrl: './staff.component.scss'
})
export class StaffComponent implements OnInit{

    columnDefinitions = [
    { def: 'id', label: 'ID', type: 'text', visible: false },
    { def: 'fullName', label: 'Name', type: 'text', visible: true },
    { def: 'email', label: 'Email', type: 'email', visible: true },
    { def: 'phoneNumber', label: 'Phone', type: 'text', visible: true },
    { def: 'roles', label: 'Roles', type: 'text', visible: true },
    { def: 'createdAt', label: 'Created', type: 'text', visible: true },
    { def: 'status', label: 'Status', type: 'text', visible: true },
    { def: 'actions', label: 'Actions', type: 'actionBtn', visible: true },

  ];


  dataSource = new MatTableDataSource<any>([]);
  selection = new SelectionModel<any>(true, []);
  contextMenuPosition = { x: '0px', y: '0px' };
  isLoading = true;
  private destroy$ = new Subject<void>();

  staffForm:any =  FormGroup;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('filter') filter!: ElementRef;
  @ViewChild(MatMenuTrigger) contextMenu?: MatMenuTrigger;

  @ViewChild('UserModal', {static:true}) UserModal!: TemplateRef<any>
  openedModal: any;
  allUsersList: any;
  fileData:any;
  clientDocumentUploadResponse: any;
  uploadedClientDocument: any;
  clientDocumentFileError: any;
  selectedStaff: any;
  

  constructor(
    private lockService: LocksService,
    public dialog: MatDialog,
    public snackBar: MatSnackBar,
    private modal: NgbModal,
    private notification: NotificationService
  ){
   this.staffForm = new FormGroup({
    fullName: new FormControl('',[Validators.required]),
    email: new FormControl('',[Validators.required, Validators.email]),
    phoneNumber: new FormControl('',[Validators.required, Validators.pattern(/^[0-9]{10}$/)]),
    roles: new FormControl(''),
    status: new FormControl(''),
    department: new FormControl(''),
    designation: new FormControl('')
   })
  }

  breadscrums = [
    {
      title: 'Digital Locks',
      items: [],
      active: 'Staff',
    },
  ]
  ngOnInit(): void {
    this.getUsers();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  refresh() {
    this.getUsers();
  }

  getDisplayedColumns(): string[] {
    return this.columnDefinitions
      .filter((cd) => cd.visible)
      .map((cd) => cd.def);
  }

  private refreshTable() {
    this.paginator.pageIndex = 0;
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value
      .trim()
      .toLowerCase();
    this.dataSource.filter = filterValue;
  }
  addNew(){ 
    this.selectedStaff = {}
    this.staffForm.reset();
    this.openedModal = this.modal.open(this.UserModal, {size:'md'});
  }

  getUsers(){
    this.lockService.getStaff().pipe(take(1)).subscribe({
      next:(res:any)=>{
        this.dataSource.data = res;
        this.allUsersList = res;
        this.isLoading = false;
        this.refreshTable();
      }
    })
  }


  saveUser(){
    let add = {
      ...this.staffForm.value,
      // employeeCode: '1001'
    } 
    let edit = {
      ...this.staffForm.value,
      id: this.selectedStaff.id
    }

    const payload = this.selectedStaff.id ? edit : add;
    this.lockService.saveStaff(payload).pipe(take(1)).subscribe({
      next:(res)=>{
        const action = this.selectedStaff.id ? 'Updated' : 'Added';
        this.notification.show(
          `User '${this.staffForm.value.fullName}' is ${action} successfully`,
          'success'
        );
        this.openedModal.close();
        this.getUsers();
      },
      error:(err)=>console.log(err)
    })
  }

  editUser(data:any){
    this.staffForm.patchValue(data);
    this.selectedStaff = data;
    console.log("this.selectedStaff", this.selectedStaff);
    this.openedModal = this.modal.open(this.UserModal,{size:'md'});
  }

  clientDocumentFile:any;
 selectDocuments(event:any){
  const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.clientDocumentFile = input.files[0];  // Corrected 'files
        console.log("this.clientDocumentFile :: ", this.clientDocumentFile)
        const formData = new FormData();
        formData.append("file", this.clientDocumentFile);
        this.lockService.upload(formData).subscribe(
          (res) => {
            this.clientDocumentUploadResponse = res;
            if (res.file) {
              this.uploadedClientDocument = res;
            }
          },
          (err) => (this.clientDocumentFileError = err)
        );
      
    }


 }


  showNotification(
    colorName: string,
    text: string,
    placementFrom: MatSnackBarVerticalPosition,
    placementAlign: MatSnackBarHorizontalPosition
  ) {
    this.snackBar.open(text, '', {
      duration: 2000,
      verticalPosition: placementFrom,
      horizontalPosition: placementAlign,
      panelClass: colorName,
    });
  }

  exportExcel() {
    const exportData = this.dataSource.filteredData.map((x) => ({
      LockId: x.lockId,
      LockName: x.lockName,
      LockAlias: x.lockAlias,
    }));

    TableExportUtil.exportToExcel(exportData, 'Lock-Devices');
  }

  isAllSelected() {
    return this.selection.selected.length === this.dataSource.data.length;
  }

  masterToggle() {
    this.isAllSelected()
      ? this.selection.clear()
      : this.dataSource.data.forEach((row) => this.selection.select(row));
  }

  removeSelectedRows() {
    const totalSelect = this.selection.selected.length;
    this.dataSource.data = this.dataSource.data.filter(
      (item) => !this.selection.selected.includes(item)
    );
    this.selection.clear();
    this.showNotification(
      'snackbar-danger',
      `${totalSelect} Record(s) Deleted Successfully...!!!`,
      'bottom',
      'center'
    );
  }
  onContextMenu(event: MouseEvent, item: any) {
    event.preventDefault();
    this.contextMenuPosition = {
      x: `${event.clientX}px`,
      y: `${event.clientY}px`,
    };
    if (this.contextMenu) {
      this.contextMenu.menuData = { item };
      this.contextMenu.menu?.focusFirstItem('mouse');
      this.contextMenu.openMenu();
    }
  }
}
