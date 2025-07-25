import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MatDialog } from '@angular/material/dialog';
import { CommonModule, DatePipe, NgClass } from '@angular/common';
import { Component, ElementRef, InjectionToken, OnInit, TemplateRef, viewChild, ViewChild } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
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
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import { FeatherIconsComponent } from '@shared/components/feather-icons/feather-icons.component';
import { Devices } from 'app/model/device.model';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatMenuModule, MatMenuTrigger } from '@angular/material/menu';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { SelectionModel } from '@angular/cdk/collections';
import { Subject, take } from 'rxjs';
import { LocksService } from 'app/service/locks.service';



import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
import { NotificationService } from 'app/service/notification.service';
import { TableExportUtil } from '@shared';
import { LoaderComponent } from '@shared/additional/loader/loader.component';
import { SnackbarComponent } from '@shared/additional/snackbar/snackbar.component';

type Direction = 'ltr' | 'rtl';


@Component({
  selector: 'app-devices',
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
        MatRippleModule,
        MatProgressSpinnerModule,
        MatMenuModule,
        MatPaginatorModule,
        DatePipe,
        // SnackbarComponent
        LoaderComponent
        // NgbModal
  ],
  templateUrl: './devices.component.html',
  styleUrl: './devices.component.scss'
})
export class DevicesComponent implements OnInit{

  columnDefinitions = [
    { def: 'select', label: 'Checkbox', type: 'check', visible: true },
    { def: 'id', label: 'ID', type: 'text', visible: false },
    { def: 'lockId', label: 'Lock Id', type: 'text', visible: true },
    { def: 'lockName', label: 'Device Name', type: 'text', visible: true },
    { def: 'lockAlias', label: 'Alias', type: 'email', visible: true },
    { def: 'actions', label: 'Actions', type: 'actionBtn', visible: true },
  ];

  dataSource = new MatTableDataSource<Devices>([]);
  selection = new SelectionModel<Devices>(true, []);
  contextMenuPosition = { x: '0px', y: '0px' };
  isLoading = true;
  private destroy$ = new Subject<void>();

  passwordCreateForm: any = FormGroup;

  loading:boolean = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('filter') filter!: ElementRef;
  @ViewChild(MatMenuTrigger) contextMenu?: MatMenuTrigger;
  @ViewChild('DeviceLogsModal', { static: true }) DeviceLogsModal!: TemplateRef<any>;
  @ViewChild('DevicePasswordListModal', { static: true }) DevicePasswordListModal!: TemplateRef<any>;
  @ViewChild('DeviceCreatePasswordModal',{ static: true }) DeviceCreatePasswordModal!: TemplateRef<any>;


  allPasswordList: any;
  allPasswordData: any;
  selectedDeviceLockId: any;
  allDeviceLogsData: any;

  selectedStartDate: any;
  selectedEndDate: any;
  openedModal: any;
  selectedDeviceLockID: any;

  constructor(
    private lockService: LocksService,
    public dialog: MatDialog,
    public snackBar: MatSnackBar,
    private modal: NgbModal,
    private notification: NotificationService
  ){

  }

    breadscrums = [
    {
      title: 'Device Locks',
      items: ['Devices'],
      active: 'Device Locks',
    },
  ];

   ngOnInit() {
    this.loadData();
    this.passwordCreateForm = new FormGroup({
      keyboardPwdName: new FormControl(''),
      keyboardPwd: new FormControl(''),
      startDate: new FormControl(''),
      endDate: new FormControl(''),
    })
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  refresh() {
    this.loadData();
  }

  getDisplayedColumns(): string[] {
    return this.columnDefinitions
      .filter((cd) => cd.visible)
      .map((cd) => cd.def);
  }

  loadData() {
    this.lockService.locks().subscribe({
      next: (data:any) => {
        this.dataSource.data = data['list'];
        console.log("log Devices::", this.dataSource.data);
        this.isLoading = false;
        this.refreshTable();
        this.dataSource.filterPredicate = (data: Devices, filter: string) =>
          Object.values(data).some((value) =>
            value.toString().toLowerCase().includes(filter)
          );
      },
      error: (err) => console.error(err),
    });
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

  addNew() {
    // this.openDialog('add');
  }

  getDeviceUnlockRecords(){
    const paylodVal ={
      lockId:this.selectedDeviceLockId, 
    }
    this.lockService.getUnlockRecords(paylodVal).pipe(take(1)).subscribe({
      next:(res:any)=>{
        this.allDeviceLogsData = res['list'];
        console.log("this.allDeviceLogsData:: ", this.allDeviceLogsData);
      },
      error:(err)=>console.log(err)
    }
    )
  }

  openDeviceLogs(row: Devices) {
    this.selectedDeviceLockId = row.lockId;
    this.getDeviceUnlockRecords();
    // this.openDialog('edit', row);
    if (this.DeviceLogsModal) {
      this.modal.open(this.DeviceLogsModal, { size: 'lg' });
    }

  }

  openDevicePasswordModal(rows: any){
    this.lockService.lockPasswordList({lockId:rows.lockId}).subscribe({
      next:(res:any)=>{
        this.allPasswordData = res['list']
      },
      error:(err)=> console.log(err)
    })

    if (this.DevicePasswordListModal) {
      this.modal.open(this.DevicePasswordListModal, { size: 'md' });
    }
  }

  openDevicePasswordCteateModal(rows: any){
    this.selectedDeviceLockID = rows.lockId;
    if (this.DeviceCreatePasswordModal) {
     this.openedModal =  this.modal.open(this.DeviceCreatePasswordModal, { size: 'md' });
    }
  }

  async deletePasscode(data:any, modal:any){
    modal.close();

   const confirmed:any = await this.notification.confirm(
      'Confirm Delete',
      `Are you sure want to delete '${data.keyboardPwdName}'?`
    )

    if(confirmed) {
      this.loading = true;
      const payload = {
      lockId: data.lockId,
      keyboardPwdId: Number(data.keyboardPwdId),
    };
    await this.lockService.deletePasscode(payload).pipe(take(1)).subscribe({
      next:(res:any)=>{
        this.notification.show('Item Deleted successfully!', 'info');
        // this.openDevicePasswordModal({ lockId: data.lockId });
        this.loading=false;
      },
      error:(err)=> console.log(err)
    })
  }

  }

  saveDevicePassword(){
    const startDate = new Date(this.selectedStartDate).getTime();
     const endDate =new Date(this.selectedEndDate).getTime();
    const payload = {
      ...this.passwordCreateForm.value,
      startDate: Number(startDate),
      endDate: Number(endDate),
      lockId: this.selectedDeviceLockID
    } 

    console.log("add passcode value::", payload);
      
    this.loading = true;

    this.lockService.addPasscode(payload).pipe(take(1)).subscribe({
      next:(res:any)=>{
        const val = res.data;
        console.log(val);
        if (val.errmsg) {
        this.openedModal.close();
        // Show error message returned from API
        this.notification.show(val.errmsg || 'Something went wrong', 'error');
      } else {
        // Show success message
        this.notification.show(
          "User '" + this.passwordCreateForm.value.keyboardPwdName + "' is added successfully",
          'success'
        );
        this.openedModal.close();
      }
				this.loading = false;
        // this.openedModal.close();
      },
      error:(err)=>console.log(err)
    })
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
  onContextMenu(event: MouseEvent, item: Devices) {
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
