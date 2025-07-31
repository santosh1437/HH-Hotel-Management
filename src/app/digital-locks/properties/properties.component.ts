import { SelectionModel } from '@angular/cdk/collections';
import { CommonModule, NgClass } from '@angular/common';
import { Component, ElementRef, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatOptionModule, MatRippleModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule, MatMenuTrigger } from '@angular/material/menu';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TableExportUtil } from '@shared';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import { FeatherIconsComponent } from '@shared/components/feather-icons/feather-icons.component';
import { Bookings } from 'app/model/bookings.model';
import { LocksService } from 'app/service/locks.service';
import { Subject, take } from 'rxjs';

@Component({
  selector: 'app-properties',
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
  ],
  templateUrl: './properties.component.html',
  styleUrl: './properties.component.scss'
})
export class PropertiesComponent implements OnInit{

  columnDefinitions = [
  { def: 'select', label: 'Checkbox', type: 'check', visible: true },
  { def: 'roomId', label: 'Room Id', type: 'text', visible: true,  },
  { def: 'packageImageLink', label: 'Image', type: 'image', visible: true, },
  { def: 'roomTypeName', label: 'Room Type', type: 'text', visible: true, width:300  },
  { def: 'fullRate', label: 'Rate', type: 'text', visible: true,  },
  { def: 'maxGuest', label: 'Max Guest', type: 'email', visible: true,   },
  { def: 'actions', label: 'Actions', type: 'actionBtn', visible: true, },
];


  dataSource = new MatTableDataSource<Bookings>([]);
  selection = new SelectionModel<Bookings>(true, []);
  contextMenuPosition = { x: '0px', y: '0px' };
  isLoading = true;
  private destroy$ = new Subject<void>();

  stdForm:any = FormGroup;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('filter') filter!: ElementRef;
  @ViewChild(MatMenuTrigger) contextMenu?: MatMenuTrigger;
  @ViewChild('BookingsModal',{ static: true }) BookingsModal!: TemplateRef<any>;
  @ViewChild('dislapyImageModal', {static: true}) dislapyImageModal!: TemplateRef<any>;

  breadscrums = [
    {
      title: 'Home',
      items: [],
      active: 'Properites',
    },
  ]
  // contextMenu: any;
  openedModal: any;
  selectedImg: any;

  constructor(
    private fb: FormBuilder,
    private modal: NgbModal,
    private lockService: LocksService
  ){
    this.stdForm = this.fb.group({
      rollNo:['',[Validators.required]],
      name:['', [Validators.required]]
    })
  }

  ngOnInit(): void {
    this.getProperties();
  }
  
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  refresh(){
    this.getProperties();
  }

  decodeValue(value: string): string {
  try {
    return decodeURIComponent(value.replace(/\+/g, ' '));
  } catch {
    return value; // fallback
  }
}


  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value
      .trim()
      .toLowerCase();
    this.dataSource.filter = filterValue;
  }

  getDisplayedColumns(): string[] {
    return this.columnDefinitions
      .filter((cd) => cd.visible)
      .map((cd) => cd.def);
  }

  addNew(){
    if (this.BookingsModal) {
     this.openedModal =  this.modal.open(this.BookingsModal, { size: 'md'});
    }
  }

  getProperties(){
    this.isLoading = true;
    this.lockService.getProperties().pipe(take(1)).subscribe({
      next:(res:any)=>{
        console.log("allProperties::", res);
        this.dataSource.data = res;
        this.isLoading = false;
        this.refreshTable();
        this.dataSource.filterPredicate = (data: any, filter: string) =>
                  Object.values(data).some((value:any) =>
                    (value ?? '').toString().toLowerCase().includes(filter)
                  );
      },
      error:(err)=>console.log(err)
    })
  }

   private refreshTable() {
    this.paginator.pageIndex = 0;
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }


  submit(){

  }


  openImagePopup(imgUrl:any){
    this.selectedImg = imgUrl;
    if(this.dislapyImageModal){
      this.openedModal = this.modal.open(this.dislapyImageModal, {size:'md'});
    }
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

    onContextMenu(event: MouseEvent, item: Bookings) {
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
